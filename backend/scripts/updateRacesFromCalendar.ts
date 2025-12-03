import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IncomingMessage } from 'http';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currentSeason= 2026;
const categories = ['WC', 'OWG'];

const ICS_URLS = categories.map(category => 
    `https://data.fis-ski.com/services/public/icalendar-feed-fis-events.html?seasoncode=${currentSeason}&sectorcode=AL&categorycode=${category}&gendercode=M`
);

// Timezone offset map (hours from UTC during winter season)
const TIMEZONE_OFFSETS: { [key: string]: number } = {
    'America/Denver': -7,
    'America/New_York': -5,
    'Europe/Paris': 1,
    'Europe/Zurich': 1,
    'Europe/Vienna': 1,
    'Europe/Rome': 1,
    'Europe/Oslo': 1,
    'Europe/Berlin': 1,
};



interface IncludedRace {
    location: string;
    discipline: string;
}

interface ExcludedRace {
    location: string;
    discipline: string;
}

// Races that are NOT DH/SG but should be included (e.g., specific GS/SL races)
const includedRaces: IncludedRace[] = [
    {
        location: 'Soelden',
        discipline: 'GS',
    },
];


// SG AND DH RACES TO BE EXCLUDED HERE
const excludedRaces: ExcludedRace[] = [
    //{ location: 'Alta Badia', discipline: 'GS' }
];

//THIS SHOULD BE MOVED SOMEWHERE ELSE NATURALLY, FUTURE PROBLEM
// MO MONEY MO PROBLEMS

interface ParsedRace {
    name: string;
    date: Date;
    discipline: string;
    resultLink: string;
    summary: string;
    timezone?: string;
}

function fetchICS(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, (res: IncomingMessage) => {
            let data = '';
            
            res.on('data', (chunk: Buffer) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err: Error) => {
            reject(err);
        });
    });
}

async function fetchDisciplineFromResultLink(resultLink: string): Promise<{ discipline: string; date?: string; time?: string; timezone?: string }> {
    // Extract race ID from result link
    const raceIdMatch = resultLink.match(/raceid=(\d+)/);
    if (!raceIdMatch) {
        return { discipline: 'Unknown' };
    }
    

    
    // Fetch the result page and scrape discipline and time info
    return new Promise((resolve) => {
        https.get(resultLink, (res: IncomingMessage) => {
            let html = '';
            
            res.on('data', (chunk: Buffer) => {
                html += chunk;
            });
            
            res.on('end', () => {
                try {
                    const $ = cheerio.load(html);
                    
                    // Extract discipline from event-header__kind div
                    const eventHeaderKind = $('.event-header__kind').text().trim().toUpperCase();
                    
                    if (!eventHeaderKind) {
                        console.log(`⚠️  No event-header__kind found for ${resultLink}`);
                        resolve({ discipline: 'Unknown' });
                        return;
                    }
                    
                    // Map discipline names to abbreviations
                    let discipline = 'Unknown';
                    // Check for Giant Slalom BEFORE just Slalom to avoid false matches
                    if (eventHeaderKind.includes('GIANT SLALOM')) {
                        discipline = 'GS';
                    } else if (eventHeaderKind.includes('DOWNHILL')) {
                        discipline = 'DH';
                    } else if (eventHeaderKind.includes('SUPER-G') || eventHeaderKind.includes('SUPER G')) {
                        discipline = 'SG';
                    } else if (eventHeaderKind.includes('SLALOM')) {
                        discipline = 'SL';
                    } else if (eventHeaderKind.includes('PARALLEL')) {
                        discipline = 'PAR';
                    } else {
                        console.log(`⚠️  Could not determine discipline from: "${eventHeaderKind}"`);
                    }
                    
                    // Extract timezone info from timezone-time div
                    const timezoneDiv = $('.timezone-time');
                    const date = timezoneDiv.attr('data-date');
                    const time = timezoneDiv.attr('data-time');
                    const timezone = timezoneDiv.attr('data-timezone');
                    
                    resolve({ 
                        discipline, 
                        date: date || undefined, 
                        time: time || undefined, 
                        timezone: timezone || undefined 
                    });
                } catch (error) {
                    console.error(`❌ Error parsing result page: ${error}`);
                    resolve({ discipline: 'Unknown' });
                }
            });
        }).on('error', (err: Error) => {
            console.error(`❌ Error fetching result page: ${err}`);
            resolve({ discipline: 'Unknown' });
        });
    });
}

async function parseICS(icsContent: string): Promise<ParsedRace[]> {
    const races: ParsedRace[] = [];
    const events = icsContent.split('BEGIN:VEVENT');
    
    for (let i = 1; i < events.length; i++) {
        const event = events[i];
        
        // Extract fields
        const summaryMatch = event.match(/SUMMARY:(.+)/);
        const dtStartMatch = event.match(/DTSTART:(\d{8}T\d{6}Z)/);
        const locationMatch = event.match(/LOCATION:(.+)/);
        const descriptionMatch = event.match(/DESCRIPTION:(.+?)(?=\nSUMMARY|\nLOCATION|\nCATEGORIES)/s);
        if (summaryMatch && dtStartMatch && locationMatch) {
            const summary = summaryMatch[1].trim();
            const location = locationMatch[1].trim();
            const description = descriptionMatch ? descriptionMatch[1] : '';
            
            // Parse date from DTSTART (format: 20251128T170000Z)
            const dateStr = dtStartMatch[1];
            const year = parseInt(dateStr.substring(0, 4));
            const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-indexed
            const day = parseInt(dateStr.substring(6, 8));
            
            // Extract Run 1 time from description if available (format: "Run 1 loc: 09:30")
            let hours = 0;
            let minutes = 0;
            const run1TimeMatch = description.match(/Run 1 loc: (\d{2}):(\d{2})/);
            if (run1TimeMatch) {
                hours = parseInt(run1TimeMatch[1]);
                minutes = parseInt(run1TimeMatch[2]);
            }
            
            const date = new Date(year, month, day, hours, minutes);
            
            // Extract result link from description first (we need it to fetch discipline) first (we need it to fetch discipline)
            let resultLink = '';
            const resultLinkMatch = description.match(/Result\/Startlist:\s+(https?:\/\/[^\s\\]+)/);
            if (resultLinkMatch) {
                resultLink = resultLinkMatch[1].replace(/\\n/g, '');
            }
            
            if (!resultLink) {
                console.log('⚠️  No result link found for:', location);
                continue;
            }
            
            // Get clean location name (remove country code in parentheses)
            const cleanLocation = location.replace(/\s*\(.*?\)\s*$/, '').trim();
            
            // Store temporarily with Unknown discipline - we'll fetch it later
            races.push({
                name: cleanLocation,
                date,
                discipline: 'Unknown',
                resultLink,
                summary,
            });
        }
    }
    
    // Fetch disciplines for all races
    console.log(`Fetching discipline info for ${races.length} races...`);
    for (const race of races) {
        const result = await fetchDisciplineFromResultLink(race.resultLink);
        race.discipline = result.discipline;
        
        // If we got more precise time/date info from the result page, use it
        if (result.date && result.time && result.timezone) {
            const [year, month, day] = result.date.split('-').map(Number);
            const [hours, minutes] = result.time.split(':').map(Number);
            
            // Get timezone offset
            const tzOffset = TIMEZONE_OFFSETS[result.timezone] || 0;
            
            // Create date in UTC by adjusting for timezone offset
            const utcDate = new Date(Date.UTC(year, month - 1, day, hours - tzOffset, minutes));
            race.date = utcDate;
            race.timezone = result.timezone;
        }
        
        // Check includedRaces as fallback
        if (race.discipline === 'Unknown') {
            const includedRace = includedRaces.find(r => r.location === race.name);
            if (includedRace) {
                race.discipline = includedRace.discipline;
            }
        }
    }
    
    // Filter: include DH, SG, and races in includedRaces list
    const validRaces = races.filter(race => {
        if (race.discipline === 'Unknown') {
            console.log('⚠️  Skipping race with unknown discipline:', race.name);
            return false;
        }
        
        // Check if it's DH or SG
        const isDhOrSg = race.discipline === 'DH' || race.discipline === 'SG';
        
        // Check if it's in the included races list
        const isIncluded = includedRaces.some(r => 
            r.location === race.name && r.discipline === race.discipline
        );
        
        // Keep if it's DH, SG, or explicitly included
        if (!isDhOrSg && !isIncluded) {
            return false;
        }
        
        // Check excluded list
        if (excludedRaces.find(r => r.location === race.name && r.discipline === race.discipline)) {
            console.log('⚠️  Excluding race:', race.name, race.discipline);
            return false;
        }
        
        return true;
    });
    
    // Sort by date
    validRaces.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return validRaces;
}

function getCountryImagePath(summary: string): string {
    const countryMap: { [key: string]: string } = {
        'USA': '/images/usa.png',
        'ITA': '/images/italy.png',
        'SUI': '/images/switzerland.png',
        'AUT': '/images/austria.png',
        'GER': '/images/germany.png',
        'FRA': '/images/france.png',
        'NOR': '/images/norway.png',
    };
    
    // Extract country code from location string (e.g., "Copper Mt. (USA)")
    const countryMatch = summary.match(/\(([A-Z]{3})\)/);
    if (countryMatch) {
        const countryCode = countryMatch[1];
        return countryMap[countryCode] || '/images/default.png';
    }
    
    return '/images/default.png';
}

function generateRacesArray(races: ParsedRace[]): string {
    return races.map((race) => {
        // Format date - use toISOString to preserve UTC time
        const isoString = race.date.toISOString();
        const imagePath = getCountryImagePath(race.summary);
        
        const timezoneComment = race.timezone ? ` // ${race.timezone} local time` : '';
        
        return `    {
        name: '${race.name}',
        imagePath: '${imagePath}',
        date: new Date('${isoString}'),${timezoneComment}
        discipline: '${race.discipline}',
        resultLink: '${race.resultLink}',
    }`;
    }).join(',\n');
}

async function main() {
    try {
        console.log('Fetching FIS calendars...');
        
        // Fetch all ICS calendars in parallel
        const icsPromises = ICS_URLS.map(url => fetchICS(url));
        const icsContents = await Promise.all(icsPromises);
        
        console.log(`Fetched ${icsContents.length} calendars (${categories.join(', ')})`);
        
        // Load existing race disciplines from races.json
        
        // Parse all calendars and merge races
        console.log('Parsing calendars...');
        let allRaces: ParsedRace[] = [];
        
        for (let index = 0; index < icsContents.length; index++) {
            const icsContent = icsContents[index];
            console.log(`\nProcessing ${categories[index]} calendar...`);
            const races = await parseICS(icsContent);
            console.log(`  - ${categories[index]}: ${races.length} races`);
            allRaces = allRaces.concat(races);
        }
        
        // Remove duplicates (same location and discipline on same date)
        const uniqueRaces = allRaces.filter((race, index, self) =>
            index === self.findIndex((r) => (
                r.name === race.name && 
                r.discipline === race.discipline && 
                r.date.getTime() === race.date.getTime()
            ))
        );
        
        // Sort by date
        uniqueRaces.sort((a, b) => a.date.getTime() - b.date.getTime());
        
        console.log(`Found ${uniqueRaces.length} unique races (removed ${allRaces.length - uniqueRaces.length} duplicates)`);
        
        console.log('Updating races.ts...');
        const racesArrayCode = generateRacesArray(uniqueRaces);
        
        const outputPath = path.join(__dirname, '../../frontend/src/races.ts');
        
        // Read existing file
        const existingContent = fs.readFileSync(outputPath, 'utf-8');
        
        // Replace only the races array content
        const updatedContent = existingContent.replace(
            /export const races: Race\[\] = \[[^\]]*\];/s,
            `export const races: Race[] = [\n${racesArrayCode}\n];`
        );
        
        fs.writeFileSync(outputPath, updatedContent, 'utf-8');
        
        console.log(`Successfully updated ${outputPath}`);
        console.log('\nRaces added:');
        uniqueRaces.forEach(race => {
            console.log(`  - ${race.name} (${race.discipline}) - ${race.date.toLocaleDateString('no-NO')}`);
        });
    } catch (error) {
        console.error('Error updating races:', error);
        process.exit(1);
    }
}

main();
