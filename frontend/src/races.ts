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
        name: 'Copper Mountain, CO',
        imagePath: '/images/usa.png',
        date: new Date('2026-11-27T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131697',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2026-12-02T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131702',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2026-12-03T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131703',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2026-12-04T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131704',
    },
    {
        name: 'Val Gardena-Groeden Südtirol',
        imagePath: '/images/italy.png',
        date: new Date('2026-12-17T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131711',
    },
    {
        name: 'Val Gardena-Groeden Südtirol',
        imagePath: '/images/italy.png',
        date: new Date('2026-12-18T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131712',
    },
    {
        name: 'Bormio',
        imagePath: '/images/italy.png',
        date: new Date('2026-12-27T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131838',
    },
    {
        name: 'Bormio',
        imagePath: '/images/italy.png',
        date: new Date('2026-12-28T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131839',
    },
    {
        name: 'Wengen',
        imagePath: '/images/switzerland.png',
        date: new Date('2027-01-14T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131723',
    },
    {
        name: 'Wengen',
        imagePath: '/images/switzerland.png',
        date: new Date('2027-01-15T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131724',
    },
    {
        name: 'Kitzbuehel',
        imagePath: '/images/austria.png',
        date: new Date('2027-01-21T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131729',
    },
    {
        name: 'Kitzbuehel',
        imagePath: '/images/austria.png',
        date: new Date('2027-01-22T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131730',
    },
    {
        name: 'Crans Montana',
        imagePath: '/images/switzerland.png',
        date: new Date('2027-02-04T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131847',
    },
    {
        name: 'Crans Montana',
        imagePath: '/images/switzerland.png',
        date: new Date('2027-02-06T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131850',
    },
    {
        name: 'Garmisch-Partenkirchen',
        imagePath: '/images/germany.png',
        date: new Date('2027-02-19T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131737',
    },
    {
        name: 'Garmisch-Partenkirchen',
        imagePath: '/images/germany.png',
        date: new Date('2027-02-20T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131738',
    },
    {
        name: 'Saalbach',
        imagePath: '/images/austria.png',
        date: new Date('2027-02-26T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131741',
    },
    {
        name: 'Saalbach',
        imagePath: '/images/austria.png',
        date: new Date('2027-02-27T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131742',
    },
    {
        name: 'Kvitfjell',
        imagePath: '/images/norway.png',
        date: new Date('2027-03-05T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131746',
    },
    {
        name: 'Kvitfjell',
        imagePath: '/images/norway.png',
        date: new Date('2027-03-06T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131747',
    },
    {
        name: 'Sun Valley',
        imagePath: '/images/usa.png',
        date: new Date('2027-03-19T23:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131690',
    },
    {
        name: 'Sun Valley',
        imagePath: '/images/usa.png',
        date: new Date('2027-03-20T23:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131692',
    }
];
