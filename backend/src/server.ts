import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { products } from './data/products.js';
import { shopConfig } from './config/shopConfig.js';
import { fetchLatestRace } from './services/fisScraper.js';
// mailService is available for when orders endpoint is re-enabled
// import { mailService } from './services/mailService.js';

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
    console.log(`   - POST http://localhost:${PORT}/api/orders`);
});
