import { fetchAllRaces } from '../src/services/fisScraper.js';
import fs from 'fs';
import path from 'path';

/**
 * Script to fetch all races from FIS and update the races.json file
 */
async function updateRaces() {
  console.log('🚀 Starting race update...');
  
  try {
    // Fetch all races
    const races = await fetchAllRaces();
    
    if (races.length === 0) {
      console.log('❌ No races fetched');
      process.exit(1);
    }
    
    console.log(`✅ Fetched ${races.length} races`);
    
    // Read existing races.json if it exists
    const racesPath = path.join(process.cwd(), 'races.json');
    let existingRaces: any[] = [];
    
    if (fs.existsSync(racesPath)) {
      const existingData = fs.readFileSync(racesPath, 'utf-8');
      existingRaces = JSON.parse(existingData);
      console.log(`📖 Existing file has ${existingRaces.length} races`);
    }
    
    // Check if races have changed
    const racesChanged = JSON.stringify(races) !== JSON.stringify(existingRaces);
    
    if (racesChanged) {
      // Write new races to file
      fs.writeFileSync(racesPath, JSON.stringify(races, null, 2));
      console.log(`✅ Updated races.json with ${races.length} races`);
      
      // Find new races (first race in new data that's not in old data)
      if (existingRaces.length > 0 && races.length > 0) {
        const existingDate = existingRaces[0]?.date;
        const newDate = races[0]?.date;
        
        if (newDate && newDate !== existingDate) {
          console.log(`🎉 New race detected: ${races[0].date} - ${races[0].place}`);
          console.log(`New race details:`, races[0]);
        }
      }
      
      // Exit with code 0 on success with changes
      process.exit(0);
    } else {
      console.log('ℹ️ No changes detected - races are up to date');
      // Exit with code 0 for no changes (not an error)
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Error updating races:', error);
    process.exit(1);
  }
}

updateRaces();

