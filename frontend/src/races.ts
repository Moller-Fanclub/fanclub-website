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
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127332',
    },
    {
        name: 'Copper Mt.',
        imagePath: '/images/usa.png',
        date: new Date('2025-11-27T00:00:00'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127440',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2025-12-04T00:00:00'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127339',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2025-12-05T00:00:00'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127340',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2025-12-06T00:00:00'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127341',
    },
    {
        name: 'Val Gardena / Groeden',
        imagePath: '/images/italy.png',
        date: new Date('2025-12-19T00:00:00'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127357',
    },
    {
        name: 'Val Gardena / Groeden',
        imagePath: '/images/italy.png',
        date: new Date('2025-12-20T00:00:00'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127356',
    },
    {
        name: 'Livigno',
        imagePath: '/images/italy.png',
        date: new Date('2025-12-27T00:00:00'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127364',
    },
    {
        name: 'Wengen',
        imagePath: '/images/switzerland.png',
        date: new Date('2026-01-16T00:00:00'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127380',
    },
    {
        name: 'Wengen',
        imagePath: '/images/switzerland.png',
        date: new Date('2026-01-17T00:00:00'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127381',
    },
    {
        name: 'Kitzbuehel',
        imagePath: '/images/austria.png',
        date: new Date('2026-01-23T00:00:00'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127391',
    },
    {
        name: 'Kitzbuehel',
        imagePath: '/images/austria.png',
        date: new Date('2026-01-24T00:00:00'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127392',
    },
    {
        name: 'Crans Montana',
        imagePath: '/images/switzerland.png',
        date: new Date('2026-02-01T00:00:00'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127404',
    },
    {
        name: 'Milano-Cortina',
        imagePath: '/images/italy.png',
        date: new Date('2026-02-07T00:00:00'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127541',
    },
    {
        name: 'Milano-Cortina',
        imagePath: '/images/italy.png',
        date: new Date('2026-02-11T00:00:00'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127543',
    },
    {
        name: 'Garmisch Partenkirchen',
        imagePath: '/images/germany.png',
        date: new Date('2026-02-28T00:00:00'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127407',
    },
    {
        name: 'Garmisch Partenkirchen',
        imagePath: '/images/germany.png',
        date: new Date('2026-03-01T00:00:00'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127408',
    },
    {
        name: 'Courchevel',
        imagePath: '/images/france.png',
        date: new Date('2026-03-14T00:00:00'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127424',
    },
    {
        name: 'Courchevel',
        imagePath: '/images/france.png',
        date: new Date('2026-03-15T00:00:00'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127425',
    },
    {
        name: 'Lillehammer',
        imagePath: '/images/norway.png',
        date: new Date('2026-03-21T00:00:00'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127433',
    },
    {
        name: 'Lillehammer',
        imagePath: '/images/norway.png',
        date: new Date('2026-03-22T00:00:00'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2026&sectorcode=AL&sector=AL&raceid=127435',
    }
];
