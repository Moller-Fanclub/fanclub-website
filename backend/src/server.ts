import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { products } from './data/products.js';
import { shopConfig } from './config/shopConfig.js';
import { fetchLatestRace } from './services/fisScraper.js';
import { mailService } from './services/mailService.js';
import vippsRoutes from './routes/vippsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Interface for FIS race results
interface FisRaceResult {
    date: string;
    place: string;
    discipline: string;
    country: string;
    category: string;
    position: string;
    fisPoints: string;
    link: string;
    season?: string;
    raceId?: string;
}

// Load races.json into memory on startup
let raceResultsCache: Map<string, FisRaceResult> = new Map();

function loadRaceResults() {
    try {
        const racesPath = path.join(process.cwd(), 'races.json');
        if (fs.existsSync(racesPath)) {
            const racesData = fs.readFileSync(racesPath, 'utf-8');
            const races: FisRaceResult[] = JSON.parse(racesData);
            
            // Build a map indexed by race id for fast lookup
            raceResultsCache = new Map();
            races.forEach(race => {
                if (race.raceId) {
                    raceResultsCache.set(race.raceId, race);
                }
            });
            
            console.log(`✅ Loaded ${raceResultsCache.size} race results into memory`);
        } else {
            console.log('⚠️  races.json not found, starting with empty cache');
        }
    } catch (error) {
        console.error('❌ Error loading races.json:', error);
    }
}

// Load race results on startup
loadRaceResults();

// Middleware
app.use(cors());
app.use(express.json());

// Vipps Checkout API routes
app.use('/api/vipps', vippsRoutes);

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

// this is fucking appalling, WHY NOT USE RACES.JSON?!
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

// Get all races from all seasons (from in-memory cache)
app.get('/api/fis/all', (_req: Request, res: Response) => {
    try {
        // Convert Map to array
        const allRaces = Array.from(raceResultsCache.values());
        console.log(`✅ Serving ${allRaces.length} races from memory`);
        return res.json(allRaces);
    } catch (error) {
        console.error('Error serving races:', error);
        return res.status(500).json({ message: 'Failed to read races data' });
    }
});

// Get race result by id (from in-memory cache)
app.get('/api/fis/result', (_req: Request, res: Response) => {
    try {
        const raceId = _req.query.id as string | undefined;
        if (!raceId) {
            return res.status(400).json({ message: 'Missing race id parameter' });
        }

        // Look up result from cache
        const result = raceResultsCache.get(raceId);
        
        if (result) {
            console.log(`✅ Found result for ${raceId}: Position ${result.position}`);
            return res.json(result);
        } else {
            console.log(`⚠️  No result found for ${raceId}`);
            return res.status(404).json({ message: 'Race result not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
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

// Create order endpoint - TEMPORARILY DISABLED
// This endpoint is deactivated until payment processing and database storage are implemented
app.post('/api/orders', async (_req: Request, res: Response) => {
    console.log('⚠️ Order endpoint called but is temporarily disabled');
    
    return res.status(503).json({
        error: 'Order processing is temporarily disabled',
        message: 'This feature is currently under development. Please check back later.'
    });

    /* 
    // TODO: Enable when ready for production
    const { customer, items, total } = _req.body;

    // Validation
    if (!customer || !customer.name || !customer.email || !items || items.length === 0) {
        return res.status(400).json({
            error: 'Missing required fields: customer info and items are required'
        });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate order number
    const orderNumber = `MF-${Date.now().toString().slice(-6)}`;

    // TODO: In production, you would:
    // 1. Validate the cart items against actual product data
    // 2. Calculate the total on the server (never trust client-side totals)
    // 3. Store the order in a database
    // 4. Process payment
    // 5. Only send email after successful payment

    try {
        // For now, we'll just send the confirmation email
        // Using the first item from the cart for simplicity
        const firstItem = items[0];
        
        await mailService.sendOrderConfirmation({
            name: customer.name,
            email: customer.email,
            orderNumber,
            product: firstItem.name || 'Møller Fanclub Product',
            size: firstItem.size || 'N/A',
            color: firstItem.color || 'N/A',
            quantity: firstItem.quantity || 1,
            price: `${firstItem.price || 0} kr`,
            shippingPrice: '79 kr',
            totalPrice: `${total} kr`,
            estimatedDelivery: '3-5 virkedager',
            productImage: firstItem.image || 'https://mollerfan.club/merch/tour-hoodie-back.png'
        });

        console.log(`✅ Order ${orderNumber} created for ${customer.name} (${customer.email})`);
        return res.json({ 
            success: true, 
            orderNumber,
            message: 'Order created and confirmation email sent' 
        });
    } catch (error) {
        console.error('❌ Order creation error:', error);
        return res.status(500).json({
            error: 'Failed to create order',
            details: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
    */
});

// Email preview endpoint (development only)
if (process.env.NODE_ENV !== 'production') {
    app.get('/api/email/preview', (_req: Request, res: Response) => {
        // Sample order data for preview
        const sampleOrderData = {
            name: 'Ola Nordmann',
            email: 'test@example.com',
            orderNumber: 'MF-123456',
            product: 'Tour Hoodie',
            size: 'M',
            color: 'Blue',
            quantity: 1,
            price: '599 kr',
            shippingPrice: '79 kr',
            totalPrice: '678 kr',
            estimatedDelivery: '3-5 virkedager',
            productImage: 'https://mollerfan.club/merch/tour-hoodie-front.png'
        };

        const html = mailService.generateOrderConfirmationHTML(sampleOrderData);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    });

    app.post('/api/email/preview', (req: Request, res: Response) => {
        // Allow custom order data via POST
        const orderData = {
            name: req.body.name || 'Ola Nordmann',
            email: req.body.email || 'test@example.com',
            orderNumber: req.body.orderNumber || 'MF-123456',
            product: req.body.product || 'Tour Hoodie',
            size: req.body.size || 'M',
            color: req.body.color || 'Blue',
            quantity: req.body.quantity || 1,
            price: req.body.price || '599 kr',
            shippingPrice: req.body.shippingPrice || '79 kr',
            totalPrice: req.body.totalPrice || '678 kr',
            estimatedDelivery: req.body.estimatedDelivery || '3-5 virkedager',
            productImage: req.body.productImage || 'https://mollerfan.club/merch/tour-hoodie-front.png'
        };

        const html = mailService.generateOrderConfirmationHTML(orderData);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    });
}

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📦 API endpoints:`);
    console.log(`   - GET http://localhost:${PORT}/api/products`);
    console.log(`   - GET http://localhost:${PORT}/api/products/:id`);
    console.log(`   - GET http://localhost:${PORT}/api/shop/config`);
    console.log(`   - GET http://localhost:${PORT}/api/health`);
    console.log(`   - GET http://localhost:${PORT}/api/fis/result?link=<race-url>`);
    console.log(`   - POST http://localhost:${PORT}/api/fis/reload`);
    console.log(`   - GET http://localhost:${PORT}/api/fis/latest?season=2025`);
    console.log(`   - GET http://localhost:${PORT}/api/fis/all (from races.json)`);
    console.log(`   - GET http://localhost:${PORT}/api/fis/test`);
    console.log(`   - POST http://localhost:${PORT}/api/orders`);
    console.log(`\n💳 Vipps Checkout API endpoints:`);
    console.log(`   - POST http://localhost:${PORT}/api/vipps/checkout/session`);
    console.log(`   - GET http://localhost:${PORT}/api/vipps/checkout/session/:reference`);
    console.log(`   - PATCH http://localhost:${PORT}/api/vipps/checkout/session/:reference`);
    console.log(`   - POST http://localhost:${PORT}/api/vipps/checkout/session/:reference/expire`);
    console.log(`   - POST http://localhost:${PORT}/api/vipps/callback`);
    console.log(`   - GET http://localhost:${PORT}/api/vipps/payment/:reference`);
    console.log(`   - POST http://localhost:${PORT}/api/vipps/payment/:reference/capture`);
    console.log(`   - POST http://localhost:${PORT}/api/vipps/payment/:reference/cancel`);
    console.log(`   - POST http://localhost:${PORT}/api/vipps/payment/:reference/refund`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`   - GET http://localhost:${PORT}/api/email/preview (dev only)`);
        console.log(`   - POST http://localhost:${PORT}/api/email/preview (dev only)`);
    }
});
