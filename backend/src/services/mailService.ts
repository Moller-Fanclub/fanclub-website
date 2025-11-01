import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface OrderEmailData {
    name: string;
    email: string;
    orderNumber: string;
    product: string;
    size: string;
    color: string;
    quantity: number;
    price: string;
    shippingPrice: string;
    totalPrice: string;
    estimatedDelivery: string;
    productImage: string;
}

/**
 * Internal mail service - NOT exposed as a public route
 * This service should only be called by backend order processing logic
 */
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    /**
     * Send order confirmation email
     * Should only be called internally after order is created and validated
     */
    async sendOrderConfirmation(orderData: OrderEmailData): Promise<void> {
        await this.transporter.sendMail({
            from: `"Møller Fanclub Shop" <${process.env.EMAIL_FROM_SHOP}>`,
            to: orderData.email,
            subject: `Ordrebekreftelse #${orderData.orderNumber} - Møller Fanclub`,
            text: `
Hei ${orderData.name}!

Takk for din bestilling hos Møller Fanclub!

Ordrenummer: ${orderData.orderNumber}
Produkt: ${orderData.product}
Størrelse: ${orderData.size}
Farge: ${orderData.color}
Pris: ${orderData.totalPrice}

Din ordre er nå på vei og vil bli levert innen ${orderData.estimatedDelivery}.

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
                                Takk for din bestilling, ${orderData.name}!
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
                                    ${orderData.orderNumber}
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
                                            <img src="${orderData.productImage}" alt="${orderData.product}" style="width: 100%; height: auto; border-radius: 6px; display: block;">
                                        </td>
                                        <td style="padding: 20px; vertical-align: top;">
                                            <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px; font-weight: 600;">
                                                ${orderData.product}
                                            </h3>
                                            <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                                                <strong>Størrelse:</strong> ${orderData.size}<br>
                                                <strong>Farge:</strong> ${orderData.color}<br>
                                                <strong>Antall:</strong> ${orderData.quantity}
                                            </p>
                                            <p style="margin: 16px 0 0 0; color: #0f172a; font-size: 20px; font-weight: 700;">
                                                ${orderData.price}
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
                                                        ${orderData.price}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 4px 0; color: #64748b; font-size: 14px;">
                                                        Frakt
                                                    </td>
                                                    <td style="padding: 4px 0; text-align: right; color: #0f172a; font-size: 14px;">
                                                        ${orderData.shippingPrice}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600; border-top: 1px solid #cbd5e1;">
                                                        Total
                                                    </td>
                                                    <td style="padding: 12px 0 0 0; text-align: right; color: #0f172a; font-size: 18px; font-weight: 700; border-top: 1px solid #cbd5e1;">
                                                        ${orderData.totalPrice}
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
                                    Forventet levering: <strong>${orderData.estimatedDelivery}</strong><br>
                                    Du vil motta sporingsinformasjon på e-post når pakken er sendt.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px; text-align: center;">
                            <a href="https://mollerfan.club/orders/${orderData.orderNumber}" style="display: inline-block; padding: 14px 36px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
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
                path: path.resolve(process.cwd(), '../frontend/public/merch/tour-hoodie-back.png'),
                cid: 'hoodie@mollerfan.club'
            }]
        });

        console.log(`✅ Order confirmation sent to ${orderData.name} (${orderData.email})`);
    }
}

export const mailService = new MailService();
