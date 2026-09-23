import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * FIS season codes are named after the year the season ends, and a new season starts July 1st.
 * E.g. the 2026/2027 season has seasoncode 2027 and starts in July 2026.
 * Can be overridden with the SEASON env variable (e.g. SEASON=2027).
 */
function getSeasonCode(now: Date = new Date()): number {
    const year = now.getUTCFullYear();
    return now.getUTCMonth() >= 6 ? year + 1 : year;
}

// WC = World Cup, WSC = World Championships, OWG = Olympic Winter Games
const categories = ['WC', 'WSC', 'OWG'];

function getIcsUrl(seasonCode: number, category: string): string {
    return `https://www.fis-ski.com/DB/services/public/icalendar-feed-fis-events.html?seasoncode=${seasonCode}&sectorcode=AL&categorycode=${category}&gendercode=M`;
}

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

async function fetchText(url: string): Promise<string> {
    // axios follows redirects (FIS moved the feeds from data.fis-ski.com to www.fis-ski.com)
    const response = await axios.get<string>(url, { responseType: 'text', timeout: 30000 });
    return response.data;
}

/**
 * Fetches an ICS feed. FIS answers 404 for seasons that are over or not published yet,
 * which we treat as an empty calendar.
 */
async function fetchICS(url: string): Promise<string> {
    try {
        return await fetchText(url);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return '';
        }
        throw error;
    }
}

/**
 * Maps a FIS discipline name (e.g. "Men's Super G", "World Cup Giant Slalom") to our abbreviation
 */
function mapDiscipline(text: string): string {
    const upper = text.toUpperCase();
    // Check for Giant Slalom BEFORE just Slalom to avoid false matches
    if (upper.includes('GIANT SLALOM')) return 'GS';
    if (upper.includes('DOWNHILL')) return 'DH';
    if (upper.includes('SUPER-G') || upper.includes('SUPER G')) return 'SG';
    if (upper.includes('COMBINED')) return 'AC';
    if (upper.includes('SLALOM')) return 'SL';
    if (upper.includes('PARALLEL')) return 'PAR';
    return 'Unknown';
}

/**
 * Returns the offset (in ms) between UTC and the given IANA timezone at the given instant.
 * Uses Intl so daylight saving time and any timezone are handled.
 */
function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).formatToParts(date);
    const get = (type: string) => Number(parts.find(p => p.type === type)?.value);
    const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
    return asUtc - date.getTime();
}

/**
 * Converts a local wall-clock time in the given timezone to a UTC Date
 */
function zonedTimeToUtc(year: number, month: number, day: number, hours: number, minutes: number, timeZone: string): Date {
    const utcGuess = Date.UTC(year, month - 1, day, hours, minutes);
    const offset = getTimeZoneOffsetMs(new Date(utcGuess), timeZone);
    return new Date(utcGuess - offset);
}

async function fetchRaceDetails(resultLink: string): Promise<{ discipline: string; date?: string; time?: string; timezone?: string }> {
    try {
        const html = await fetchText(resultLink);
        const $ = cheerio.load(html);

        // Extract discipline from event-header__kind div
        const eventHeaderKind = $('.event-header__kind').text().trim();
        const discipline = eventHeaderKind ? mapDiscipline(eventHeaderKind) : 'Unknown';

        // Extract timezone info from timezone-time div (only present once FIS has published start times)
        const timezoneDiv = $('.timezone-time');
        const date = timezoneDiv.attr('data-date');
        const time = timezoneDiv.attr('data-time');
        const timezone = timezoneDiv.attr('data-timezone');

        return {
            discipline,
            date: date || undefined,
            time: time || undefined,
            timezone: timezone || undefined
        };
    } catch (error) {
        console.error(`❌ Error fetching result page ${resultLink}: ${error}`);
        return { discipline: 'Unknown' };
    }
}

/**
 * Reads a property from an ICS event, ignoring parameters (e.g. "DTSTART;VALUE=DATE:20261128")
 */
function getIcsField(event: string, name: string): { value: string; params: string } | null {
    const match = event.match(new RegExp(`^${name}((?:;[^:\\n]*)?):(.*)$`, 'm'));
    if (!match) return null;
    return { params: match[1], value: match[2].trim() };
}

/**
 * Parses DTSTART values like "20261128", "20261128T170000Z" or "20261128T170000" (with TZID param)
 */
function parseIcsDate(value: string, params: string): Date | null {
    const match = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
    if (!match) return null;

    const [, year, month, day, hours, minutes, , isUtc] = match;
    if (!hours) {
        // All-day event - the exact start time is filled in from the result page when FIS publishes it
        return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    }

    const tzid = params.match(/TZID=([^;:]+)/)?.[1];
    if (!isUtc && tzid) {
        try {
            return zonedTimeToUtc(Number(year), Number(month), Number(day), Number(hours), Number(minutes), tzid);
        } catch {
            console.log(`⚠️  Unknown timezone ${tzid}, treating time as UTC`);
        }
    }
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes)));
}

function parseICS(icsContent: string): ParsedRace[] {
    const races: ParsedRace[] = [];
    // Normalize line endings and unfold long lines (RFC 5545: continuation lines start with a space/tab)
    const unfolded = icsContent.replace(/\r\n?/g, '\n').replace(/\n[ \t]/g, '');
    const events = unfolded.split('BEGIN:VEVENT').slice(1).map(e => e.split('END:VEVENT')[0]);

    for (const event of events) {
        const summary = getIcsField(event, 'SUMMARY')?.value;
        const location = getIcsField(event, 'LOCATION')?.value;
        const dtStart = getIcsField(event, 'DTSTART');
        const description = getIcsField(event, 'DESCRIPTION')?.value || '';

        if (!summary || !location || !dtStart) {
            console.log('⚠️  Skipping event with missing fields:', summary || location || '(unknown)');
            continue;
        }

        const date = parseIcsDate(dtStart.value, dtStart.params);
        if (!date) {
            console.log(`⚠️  Could not parse date "${dtStart.value}" for:`, summary);
            continue;
        }

        const resultLinkMatch = description.match(/Result\/Startlist:\s+(https?:\/\/[^\s\\]+)/);
        if (!resultLinkMatch) {
            console.log('⚠️  No result link found for:', location);
            continue;
        }

        // Get clean location name (remove country code in parentheses)
        const cleanLocation = location.replace(/\s*\(.*?\)\s*$/, '').trim();

        races.push({
            name: cleanLocation,
            date,
            // Summary looks like "Copper Mountain, CO (USA) - Alpine Skiing World Cup Super G"
            discipline: mapDiscipline(summary),
            resultLink: resultLinkMatch[1],
            summary,
        });
    }

    return races;
}

function isWantedRace(race: ParsedRace): boolean {
    if (race.discipline === 'Unknown') {
        return false;
    }

    // Keep if it's DH, SG, or explicitly included
    const isDhOrSg = race.discipline === 'DH' || race.discipline === 'SG';
    const isIncluded = includedRaces.some(r =>
        r.location === race.name && r.discipline === race.discipline
    );
    if (!isDhOrSg && !isIncluded) {
        return false;
    }

    // Check excluded list
    if (excludedRaces.find(r => r.location === race.name && r.discipline === race.discipline)) {
        console.log('⚠️  Excluding race:', race.name, race.discipline);
        return false;
    }

    return true;
}

/**
 * Filters to the races we care about and fetches exact start times from the result pages
 */
async function selectAndEnrichRaces(races: ParsedRace[]): Promise<ParsedRace[]> {
    for (const race of races) {
        // Check includedRaces as fallback when the summary didn't tell us the discipline
        if (race.discipline === 'Unknown') {
            const includedRace = includedRaces.find(r => r.location === race.name);
            if (includedRace) {
                race.discipline = includedRace.discipline;
            }
        }
    }

    const candidates = races.filter(race => race.discipline === 'Unknown' || isWantedRace(race));

    console.log(`Fetching details for ${candidates.length} races...`);
    for (const race of candidates) {
        const details = await fetchRaceDetails(race.resultLink);
        if (race.discipline === 'Unknown') {
            race.discipline = details.discipline;
        }

        // If we got more precise time/date info from the result page, use it
        if (details.date && details.time && details.timezone) {
            const [year, month, day] = details.date.split('-').map(Number);
            const [hours, minutes] = details.time.split(':').map(Number);
            try {
                race.date = zonedTimeToUtc(year, month, day, hours, minutes, details.timezone);
                race.timezone = details.timezone;
            } catch {
                console.log(`⚠️  Unknown timezone ${details.timezone} for ${race.name}, keeping calendar date`);
            }
        }
    }

    const validRaces = candidates.filter(race => {
        if (race.discipline === 'Unknown') {
            console.log('⚠️  Skipping race with unknown discipline:', race.name);
            return false;
        }
        return isWantedRace(race);
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

    // Extract country code from summary string (e.g., "Copper Mountain, CO (USA) - ...")
    const countryMatch = summary.match(/\(([A-Z]{3})\)/);
    if (countryMatch) {
        const countryCode = countryMatch[1];
        if (!countryMap[countryCode]) {
            console.log(`⚠️  No image for country ${countryCode} (${summary}), add one to countryMap`);
        }
        return countryMap[countryCode] || '/images/default.png';
    }

    return '/images/default.png';
}

// Escapes a value for a single-quoted TS string (e.g. "Val d'Isere")
function toTsString(value: string): string {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function generateRacesArray(races: ParsedRace[]): string {
    return races.map((race) => {
        // Format date - use toISOString to preserve UTC time
        const isoString = race.date.toISOString();
        const imagePath = getCountryImagePath(race.summary);

        const timezoneComment = race.timezone ? ` // ${race.timezone} local time` : '';

        return `    {
        name: ${toTsString(race.name)},
        imagePath: ${toTsString(imagePath)},
        date: new Date('${isoString}'),${timezoneComment}
        discipline: ${toTsString(race.discipline)},
        resultLink: ${toTsString(race.resultLink)},
    }`;
    }).join(',\n');
}

/**
 * Fetches and parses all calendars for a season. Returns null if FIS has no events for it.
 */
async function fetchSeasonRaces(seasonCode: number): Promise<ParsedRace[] | null> {
    console.log(`Fetching FIS calendars for season ${seasonCode - 1}/${seasonCode} (seasoncode ${seasonCode})...`);

    // Fetch all ICS calendars in parallel
    const icsContents = await Promise.all(categories.map(category => fetchICS(getIcsUrl(seasonCode, category))));

    // Parse all calendars and merge races
    let allRaces: ParsedRace[] = [];
    let totalEvents = 0;

    for (let index = 0; index < icsContents.length; index++) {
        const icsContent = icsContents[index];
        const eventCount = icsContent.split('BEGIN:VEVENT').length - 1;
        totalEvents += eventCount;
        const races = parseICS(icsContent);
        console.log(`  - ${categories[index]}: ${races.length}/${eventCount} events parsed`);
        allRaces = allRaces.concat(races);
    }

    if (totalEvents === 0) {
        return null;
    }

    if (allRaces.length === 0) {
        // The feed has events but we couldn't read any of them - FIS probably changed the format
        throw new Error(`Calendars contain ${totalEvents} events but none could be parsed. Has the ICS format changed?`);
    }

    return allRaces;
}

async function main() {
    try {
        // Try the current season first, then the next one (e.g. in May/June when the
        // finished season's feed is gone but next season's calendar may already be out)
        const seasonCandidates = process.env.SEASON
            ? [Number(process.env.SEASON)]
            : [getSeasonCode(), getSeasonCode() + 1];

        let allRaces: ParsedRace[] | null = null;
        for (const seasonCode of seasonCandidates) {
            allRaces = await fetchSeasonRaces(seasonCode);
            if (allRaces) break;
            console.log(`ℹ️  No calendar published for seasoncode ${seasonCode}`);
        }

        if (!allRaces) {
            // Never wipe the calendar - keep showing last season until the next one is published
            console.log('ℹ️  No calendar found, leaving races.ts untouched');
            return;
        }

        const validRaces = await selectAndEnrichRaces(allRaces);

        // Remove duplicates (same location and discipline on same date)
        const uniqueRaces = validRaces.filter((race, index, self) =>
            index === self.findIndex((r) => (
                r.name === race.name &&
                r.discipline === race.discipline &&
                r.date.getTime() === race.date.getTime()
            ))
        );

        console.log(`Found ${uniqueRaces.length} unique races (removed ${validRaces.length - uniqueRaces.length} duplicates)`);

        if (uniqueRaces.length === 0) {
            // Never wipe the calendar - e.g. early summer before FIS has published the next season
            console.log('ℹ️  No DH/SG races in the calendar, leaving races.ts untouched');
            return;
        }

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
