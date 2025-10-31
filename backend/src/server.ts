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
});
