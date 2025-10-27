import * as cheerio from 'cheerio';
import axios from 'axios';

export interface RaceData {
    date: string;
    place: string;
    discipline: string;
    country: string;
    category: string;
    position: string;
    fisPoints: string;
    link: string;
    season?: string; // e.g., "2024/2025" or "2025/2026"
    rawDate?: string; // Internal use for filtering
}

const BASE_FIS_URL = 'https://www.fis-ski.com/DB/general/athlete-biography.html?sectorcode=AL&competitorid=213729&type=result&limit=500';

/**
 * Parses a single race row from the FIS results table
 */
function parseRaceRow($: cheerio.CheerioAPI, raceElement: any): RaceData | null {
    const $race = $(raceElement);
    
    // Extract data from the anchor tag
    const href = $race.attr('href') || '';
    
    // Parse the data from the anchor's content
    const date = $race.find('.g-xs-4, .g-sm-4, .g-md-4, .g-lg-4').first().text().trim();
    
    // Get place - could be in multiple locations depending on screen size
    let place = $race.find('.g-md.g-lg.justify-left.hidden-sm-down').text().trim();
    if (!place) {
        place = $race.find('.g-xs-10.g-sm-8.hidden-md-up.clip-xs').first().text().trim();
    }
    
    // Get discipline
    let discipline = $race.find('.g-md-3.g-lg-3.justify-left.hidden-sm-down').text().trim();
    if (!discipline) {
        discipline = $race.find('.g-xs-24.justify-left.clip-xs.gray').text().trim();
    }
    
    // Get country code
    const country = $race.find('.country__name-short').text().trim();
    
    // Get category
    let category = $race.find('.g-md-5.g-lg-5.justify-left.hidden-sm-down').text().trim();
    if (!category) {
        category = $race.find('.g-sm-3.g-md-5.g-lg-5.justify-left.hidden-xs.hidden-md-up').text().trim();
        if (!category) {
            category = $race.find('.g-xs-24.justify-left.hidden-sm-up').text().trim();
        }
    }
    
    // Get position (could be in multiple places)
    const positionElement = $race.find('.g-xs-24.g-sm.g-md.g-lg.justify-right').first();
    const position = positionElement.text().trim();
    
    // FIS Points - looking for the value in the second justify-right div
    const fisPointsElement = $race.find('.g-xs-24.g-sm-8.g-md-8.g-lg-8.justify-right');
    let fisPoints = '';
    
    // There are multiple divs with this class, we want the one that's not empty and doesn't match position
    fisPointsElement.each((_i, elem) => {
        const text = $(elem).text().trim();
        if (text && text !== position && text !== '') {
            fisPoints = text;
        }
    });
    
    // Determine the season for this race
    const season = determineSeason(date);
    
    return {
        date,
        place,
        discipline,
        country,
        category,
        position,
        fisPoints,
        link: href,
        season: season || undefined,
        rawDate: date
    };
}

/**
 * Determines which season a race belongs to based on its date
 * Seasons run from October to the following summer/spring
 * Returns season as "YYYY/YYYY" format (e.g., "2024/2025")
 */
function determineSeason(date: string): string | null {
    // Parse date format: "DD-MM-YYYY"
    const parts = date.split('-');
    if (parts.length !== 3) return null;
    
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    
    // Seasons start around October and go to the following spring/summer
    // If month is Oct, Nov, Dec, it's the current season (e.g., Oct 2024 = 2024/2025)
    // If month is Jan-Sep, it's the previous season (e.g., Jan 2025 = 2024/2025)
    
    if (month >= 10) {
        // Oct-Dec: current season
        return `${year}/${year + 1}`;
    } else {
        // Jan-Sep: previous season
        return `${year - 1}/${year}`;
    }
}

/**
 * Determines if a race belongs to a specific season
 * For season 2024/2025: races from late 2024 (Oct+) to early 2025
 * For season 2025/2026: races from late 2025 (Oct+) onward
 */
function isRaceInSeason(date: string, season: string): boolean {
    const raceSeason = determineSeason(date);
    
    // Map season parameter to expected format
    const expectedSeason = season === '2024' ? '2024/2025' : season === '2025' ? '2025/2026' : null;
    
    return raceSeason === expectedSeason;
}

/**
 * Fetches and parses the latest race data from FIS website for a specific season
 * @param season - Season filter (e.g., '2025', '2024')
 * Returns the latest race result for that season
 */
export async function fetchLatestRace(season?: string): Promise<RaceData | null> {
    try {
        // Fetch the HTML page (always get all races, we'll filter locally)
        const response = await axios.get(BASE_FIS_URL);
        
        const $ = cheerio.load(response.data);
        
        // Find the results-body div
        const resultsBody = $('#results-body');
        
        if (!resultsBody.length) {
            console.log('❌ Could not find results-body div');
            return null;
        }
        
        // Find all race rows
        const raceRows = resultsBody.find('a.table-row');
        
        if (!raceRows.length) {
            console.log('❌ Could not find any race rows');
            return null;
        }
        
        console.log(`Found ${raceRows.length} race rows`);
        
        // Parse all races
        const races: RaceData[] = [];
        raceRows.each((_i, elem) => {
            const race = parseRaceRow($, elem);
            if (race) {
                races.push(race);
            }
        });
        
        // Filter by season if specified
        let filteredRaces = races;
        if (season) {
            filteredRaces = races.filter(race => 
                race.rawDate && isRaceInSeason(race.rawDate, season)
            );
            console.log(`Filtered to ${filteredRaces.length} races for season ${season}`);
        }
        
        // Return the most recent race (first in the list after filtering)
        if (filteredRaces.length > 0) {
            // Remove rawDate from response
            const { rawDate, ...raceData } = filteredRaces[0];
            return raceData;
        }
        
        console.log('❌ No races found for the specified season');
        return null;
        
    } catch (error) {
        console.error('❌ Error fetching race data:', error);
        return null;
    }
}

/**
 * Fetches ALL races from the FIS website with their seasons
 * Returns all races sorted by date (most recent first)
 */
export async function fetchAllRaces(): Promise<RaceData[]> {
    try {
        // Fetch the HTML page
        const response = await axios.get(BASE_FIS_URL);
        
        const $ = cheerio.load(response.data);
        
        // Find the results-body div
        const resultsBody = $('#results-body');
        
        if (!resultsBody.length) {
            console.log('❌ Could not find results-body div');
            return [];
        }
        
        // Find all race rows
        const raceRows = resultsBody.find('a.table-row');
        
        if (!raceRows.length) {
            console.log('❌ Could not find any race rows');
            return [];
        }
        
        console.log(`Found ${raceRows.length} race rows`);
        
        // Parse all races
        const races: RaceData[] = [];
        raceRows.each((_i, elem) => {
            const race = parseRaceRow($, elem);
            if (race) {
                races.push(race);
            }
        });
        
        // Return all races without filtering, but exclude rawDate from response
        return races.map(({ rawDate, ...race }) => race);
        
    } catch (error) {
        console.error('❌ Error fetching race data:', error);
        return [];
    }
}

/**
 * Test function to fetch and log the latest race data
 */
export async function testFisScraper(): Promise<void> {
    console.log('🔍 Fetching latest race data from FIS...');
    const raceData = await fetchLatestRace();
    
    if (raceData) {
        console.log('✅ Successfully fetched race data:');
        console.log(JSON.stringify(raceData, null, 2));
    } else {
        console.log('❌ Failed to fetch race data');
    }
}

