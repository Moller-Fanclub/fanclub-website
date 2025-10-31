import nodemailer from 'nodemailer';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { products } from './data/products.js';
import { shopConfig } from './config/shopConfig.js';
import { fetchLatestRace } from './services/fisScraper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/products', (_req: Request, res: Response) => {
    res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Shop configuration - just return the dates
app.get('/api/shop/config', (_req: Request, res: Response) => {
    res.json(shopConfig);
});

// Get latest race data for a specific season
app.get('/api/fis/latest', async (req: Request, res: Response) => {
    try {
        const season = req.query.season as string | undefined;
        const raceData = await fetchLatestRace(season);
        if (raceData) {
            console.log(`✅ FIS Race Data for season ${season || 'current'}:`, raceData);
            res.json(raceData);
        } else {
            res.status(500).json({ message: 'Failed to fetch race data' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all races from all seasons (from JSON file)
app.get('/api/fis/all', async (_req: Request, res: Response) => {
    try {
        const racesPath = path.join(process.cwd(), 'races.json');
        const racesData = fs.readFileSync(racesPath, 'utf-8');
        const allRaces = JSON.parse(racesData);
        console.log(`✅ Serving ${allRaces.length} races from races.json`);
        res.json(allRaces);
    } catch (error) {
        console.error('Error reading races.json:', error);
        res.status(500).json({ message: 'Failed to read races data' });
    }
});

// Legacy endpoint for backward compatibility
app.get('/api/fis/test', async (_req: Request, res: Response) => {
    try {
        const raceData = await fetchLatestRace();
        if (raceData) {
            console.log('✅ FIS Race Data:', raceData);
            res.json(raceData);
        } else {
            res.status(500).json({ message: 'Failed to fetch race data' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Order confirmation email endpoint
app.post('/api/send-order-confirmation', async (req: Request, res: Response) => {
    const { name, email } = req.body;

    return res.json({ success: true, message: 'Order confirmation email sent successfully' });

    // Validation
    if (!name || !email) {
        return res.status(400).json({
            error: 'Missing required fields: name and email are required'
        });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Hardcoded order details (for now)
    const orderDetails = {
        orderNumber: `MF-${Date.now().toString().slice(-6)}`,
        product: 'Møller Fanclub Hoodie',
        size: 'L',
        color: 'Navy Blue',
        quantity: 1,
        price: '599 kr',
        shippingPrice: '79 kr',
        totalPrice: '678 kr',
        estimatedDelivery: '3-5 virkedager',
        productImage: 'https://mollerfan.club/merch/tour-hoodie-back.png'
    };

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Ordrebekreftelse #${orderDetails.orderNumber} - Møller Fanclub`,
            text: `
Hei ${name}!

Takk for din bestilling hos Møller Fanclub!

Ordrenummer: ${orderDetails.orderNumber}
Produkt: ${orderDetails.product}
Størrelse: ${orderDetails.size}
Farge: ${orderDetails.color}
Pris: ${orderDetails.totalPrice}

Din ordre er nå på vei og vil bli levert innen ${orderDetails.estimatedDelivery}.

Med vennlig hilsen,
Møller Fanclub
            `.trim(),
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordrebekreftelse - Møller Fanclub</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                                ⛷️ Møller Fanclub
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Success Badge -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center;">
                            <div style="display: inline-block; padding: 12px 24px; background-color: #10b981; border-radius: 50px; margin-bottom: 16px;">
                                <span style="color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">
                                    ✓ ORDRE BEKREFTET
                                </span>
                            </div>
                            <h2 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 600;">
                                Takk for din bestilling, ${name}!
                            </h2>
                            <p style="margin: 12px 0 0 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                                Din ordre er nå på vei. Du vil motta en ny e-post med sporingsinformasjon når pakken er sendt.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Order Number -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px; text-align: center;">
                            <div style="display: inline-block; padding: 16px 32px; background-color: #f1f5f9; border-radius: 8px; border: 2px dashed #cbd5e1;">
                                <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                    Ordrenummer
                                </p>
                                <p style="margin: 4px 0 0 0; color: #0f172a; font-size: 20px; font-weight: 700; letter-spacing: 1px;">
                                    ${orderDetails.orderNumber}
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Product Details -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                                
                                <!-- Product Image and Info -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="width: 140px; padding: 20px; vertical-align: top;">
                                            <img src="${orderDetails.productImage}" alt="${orderDetails.product}" style="width: 100%; height: auto; border-radius: 6px; display: block;">
                                        </td>
                                        <td style="padding: 20px; vertical-align: top;">
                                            <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px; font-weight: 600;">
                                                ${orderDetails.product}
                                            </h3>
                                            <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                                                <strong>Størrelse:</strong> ${orderDetails.size}<br>
                                                <strong>Farge:</strong> ${orderDetails.color}<br>
                                                <strong>Antall:</strong> ${orderDetails.quantity}
                                            </p>
                                            <p style="margin: 16px 0 0 0; color: #0f172a; font-size: 20px; font-weight: 700;">
                                                ${orderDetails.price}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Price Breakdown -->
                                <table role="presentation" style="width: 100%; border-collapse: collapse; border-top: 1px solid #e2e8f0; background-color: #f8fafc;">
                                    <tr>
                                        <td style="padding: 16px 20px;">
                                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                <tr>
                                                    <td style="padding: 4px 0; color: #64748b; font-size: 14px;">
                                                        Delsum
                                                    </td>
                                                    <td style="padding: 4px 0; text-align: right; color: #0f172a; font-size: 14px;">
                                                        ${orderDetails.price}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 4px 0; color: #64748b; font-size: 14px;">
                                                        Frakt
                                                    </td>
                                                    <td style="padding: 4px 0; text-align: right; color: #0f172a; font-size: 14px;">
                                                        ${orderDetails.shippingPrice}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600; border-top: 1px solid #cbd5e1;">
                                                        Total
                                                    </td>
                                                    <td style="padding: 12px 0 0 0; text-align: right; color: #0f172a; font-size: 18px; font-weight: 700; border-top: 1px solid #cbd5e1;">
                                                        ${orderDetails.totalPrice}
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Shipping Info -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 6px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                                    📦 Leveringsinformasjon
                                </p>
                                <p style="margin: 8px 0 0 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                                    Forventet levering: <strong>${orderDetails.estimatedDelivery}</strong><br>
                                    Du vil motta sporingsinformasjon på e-post når pakken er sendt.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px; text-align: center;">
                            <a href="https://mollerfan.club/orders/${orderDetails.orderNumber}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                                Spor din ordre
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.6; text-align: center;">
                                Har du spørsmål om din ordre?<br>
                                Kontakt oss på <a href="mailto:${process.env.EMAIL_USER}" style="color: #3b82f6; text-decoration: none;">${process.env.EMAIL_USER}</a>
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Møller Fanclub • <a href="https://mollerfan.club" style="color: #3b82f6; text-decoration: none;">mollerfan.club</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
            attachments: [{
                filename: 'tour-hoodie-back.png',
                path: '../../frontend/public/merch/tour-hoodie-back.png',
                cid: 'hoodie@mollerfan.club' // reference this in src="cid:..."
            }]
        });

        console.log(`✅ Order confirmation sent to ${name} (${email})`);
        return res.json({ success: true, message: 'Order confirmation sent successfully' });
    } catch (error) {
        console.error('❌ Email error:', error);
        return res.status(500).json({
            error: 'Failed to send order confirmation',
            details: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📦 API endpoints:`);
    console.log(`   - GET http://localhost:${PORT}/api/products`);
    console.log(`   - GET http://localhost:${PORT}/api/products/:id`);
    console.log(`   - GET http://localhost:${PORT}/api/shop/config`);
    console.log(`   - GET http://localhost:${PORT}/api/health`);
    console.log(`   - GET http://localhost:${PORT}/api/fis/latest?season=2025`);
    console.log(`   - GET http://localhost:${PORT}/api/fis/all (from races.json)`);
    console.log(`   - GET http://localhost:${PORT}/api/fis/test`);
    console.log(`   - POST http://localhost:${PORT}/api/send-order-confirmation`);
});
