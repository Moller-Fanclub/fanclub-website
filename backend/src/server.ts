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
});
