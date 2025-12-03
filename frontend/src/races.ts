export interface RaceResult {
    position: string;
    fisPoints?: string;
    date?: string;
    place?: string;
    discipline?: string;
    country?: string;
    category?: string;
    link?: string;
    season?: string;
}

export interface Race {
    name: string;
    imagePath: string;
    date: Date;
    discipline: string;
    resultLink: string;
    result?: RaceResult;
}

export const races: Race[] = [
    {
        name: 'Soelden',
        imagePath: '/images/austria.png',
        date: new Date('2025-10-26T00:00:00'),
        discipline: 'GS',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127332',
    }
];
