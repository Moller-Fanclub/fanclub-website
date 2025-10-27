import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IncomingMessage } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currentSeason= 2026;
const categories = ['WC', 'OWG'];

const ICS_URLS = categories.map(category => 
    `https://data.fis-ski.com/services/public/icalendar-feed-fis-events.html?seasoncode=${currentSeason}&sectorcode=AL&categorycode=${category}&gendercode=M`
);


interface ExtraRace {
    location: string;
    discipline: string;
}

interface ExcludedRace {
    location: string;
    discipline: string;
}

// GS RACES NEEDS TO BE ADDED HERE
const extraRaces: ExtraRace[] = [
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

function parseICS(icsContent: string): ParsedRace[] {
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
            
            // Parse date from DTSTART (format: 20251128T170000Z)
            const dateStr = dtStartMatch[1];
            const year = parseInt(dateStr.substring(0, 4));
            const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-indexed
            const day = parseInt(dateStr.substring(6, 8));
            const date = new Date(year, month, day);
            
            // Extract discipline from summary (e.g., "Copper Mt. (USA) AL WC M DH")
            const disciplineMatch = summary.match(/\s(DH|SG)\s*$/);
            let discipline = disciplineMatch ? disciplineMatch[1] : 'Unknown';

            if (!disciplineMatch) {
                //skip events without valid discipline
                //check if in extraRaces
                const extraRace = extraRaces.find(r => r.location === location);
                if (extraRace) {
                    discipline = extraRace.discipline;
                } else {
                    continue;
                }
            }
            
            if (excludedRaces.find(r => r.location === location && r.discipline === discipline)) {
                continue; // skip excluded
            }
            // Extract result link from description
            let resultLink = '';
            if (descriptionMatch) {
                const description = descriptionMatch[1];
                const resultLinkMatch = description.match(/Result\/Startlist:\s+(https?:\/\/[^\s\\]+)/);
                if (resultLinkMatch) {
                    resultLink = resultLinkMatch[1].replace(/\\n/g, '');
                }
            }
            
            // Get clean location name (remove country code in parentheses)
            const cleanLocation = location.replace(/\s*\(.*?\)\s*$/, '').trim();
            
            races.push({
                name: cleanLocation,
                date,
                discipline,
                resultLink,
                summary,
            });
        }
    }
    
    // Sort by date
    races.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return races;
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

function generateRacesTS(races: ParsedRace[]): string {
    const racesCode = races.map((race) => {
        const dateStr = race.date.toISOString().split('T')[0] + 'T00:00:00';
        const imagePath = getCountryImagePath(race.summary);
        
        return `    {
        name: '${race.name}',
        imagePath: '${imagePath}',
        date: new Date('${dateStr}'),
        discipline: '${race.discipline}',
        resultLink: '${race.resultLink}',
    }`;
    }).join(',\n');
    
    return `export interface RaceResult {
    position: number;
    time?: string;
    behind?: string;
}

export interface Race {
    name: string;
    imagePath: string;
    date: Date;
    discipline: string;
    fisBioLink: string;
    resultLink: string;
    result?: RaceResult;
}

export const races: Race[] = [
${racesCode}
];
`;
}

async function main() {
    try {
        console.log('Fetching FIS calendars...');
        
        // Fetch all ICS calendars in parallel
        const icsPromises = ICS_URLS.map(url => fetchICS(url));
        const icsContents = await Promise.all(icsPromises);
        
        console.log(`Fetched ${icsContents.length} calendars (${categories.join(', ')})`);
        
        // Parse all calendars and merge races
        console.log('Parsing calendars...');
        let allRaces: ParsedRace[] = [];
        
        icsContents.forEach((icsContent, index) => {
            const races = parseICS(icsContent);
            console.log(`  - ${categories[index]}: ${races.length} races`);
            allRaces = allRaces.concat(races);
        });
        
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
        
        console.log('Generating races.ts...');
        const racesTS = generateRacesTS(uniqueRaces);
        
        const outputPath = path.join(__dirname, '../../frontend/src/races.ts');
        fs.writeFileSync(outputPath, racesTS, 'utf-8');
        
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
