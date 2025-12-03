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
        date: new Date('2025-10-26T09:00:00.000Z'), // Europe/Vienna local time
        discipline: 'GS',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127332',
    },
    {
        name: 'Copper Mountain, CO',
        imagePath: '/images/usa.png',
        date: new Date('2025-11-27T18:00:00.000Z'), // America/Denver local time
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127440',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2025-12-04T18:00:00.000Z'), // America/Denver local time
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127339',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2025-12-05T18:15:00.000Z'), // America/Denver local time
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127340',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2025-12-06T17:30:00.000Z'), // America/Denver local time
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127341',
    },
    {
        name: 'Val Gardena Südtirol',
        imagePath: '/images/italy.png',
        date: new Date('2025-12-19T10:45:00.000Z'), // Europe/Rome local time
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127357',
    },
    {
        name: 'Val Gardena Südtirol',
        imagePath: '/images/italy.png',
        date: new Date('2025-12-20T10:45:00.000Z'), // Europe/Rome local time
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127356',
    },
    {
        name: 'Livigno',
        imagePath: '/images/italy.png',
        date: new Date('2025-12-27T10:30:00.000Z'), // Europe/Rome local time
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127364',
    },
    {
        name: 'Wengen',
        imagePath: '/images/switzerland.png',
        date: new Date('2026-01-16T11:30:00.000Z'), // Europe/Zurich local time
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127380',
    },
    {
        name: 'Wengen',
        imagePath: '/images/switzerland.png',
        date: new Date('2026-01-17T11:30:00.000Z'), // Europe/Zurich local time
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127381',
    },
    {
        name: 'Kitzbuehel',
        imagePath: '/images/austria.png',
        date: new Date('2026-01-23T10:30:00.000Z'), // Europe/Vienna local time
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127391',
    },
    {
        name: 'Kitzbuehel',
        imagePath: '/images/austria.png',
        date: new Date('2026-01-24T10:30:00.000Z'), // Europe/Vienna local time
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127392',
    },
    {
        name: 'Crans Montana',
        imagePath: '/images/switzerland.png',
        date: new Date('2026-02-01T10:00:00.000Z'), // Europe/Zurich local time
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127404',
    },
    {
        name: 'Milano-Cortina',
        imagePath: '/images/italy.png',
        date: new Date('2026-02-07T10:30:00.000Z'), // Europe/Rome local time
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127541',
    },
    {
        name: 'Milano-Cortina',
        imagePath: '/images/italy.png',
        date: new Date('2026-02-11T10:30:00.000Z'), // Europe/Rome local time
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127543',
    },
    {
        name: 'Garmisch Partenkirchen',
        imagePath: '/images/germany.png',
        date: new Date('2026-02-28T10:45:00.000Z'), // Europe/Berlin local time
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127407',
    },
    {
        name: 'Garmisch Partenkirchen',
        imagePath: '/images/germany.png',
        date: new Date('2026-03-01T10:45:00.000Z'), // Europe/Berlin local time
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127408',
    },
    {
        name: 'Courchevel',
        imagePath: '/images/france.png',
        date: new Date('2026-03-14T10:00:00.000Z'), // Europe/Paris local time
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127424',
    },
    {
        name: 'Courchevel',
        imagePath: '/images/france.png',
        date: new Date('2026-03-15T09:45:00.000Z'), // Europe/Paris local time
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127425',
    },
    {
        name: 'Lillehammer',
        imagePath: '/images/norway.png',
        date: new Date('2026-03-21T09:45:00.000Z'), // Europe/Oslo local time
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127433',
    },
    {
        name: 'Lillehammer',
        imagePath: '/images/norway.png',
        date: new Date('2026-03-22T11:30:00.000Z'), // Europe/Oslo local time
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&raceid=127435',
    }
];
