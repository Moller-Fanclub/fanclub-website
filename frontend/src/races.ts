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
        date: new Date('2026-10-25T00:00:00.000Z'),
        discipline: 'GS',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131578',
    },
    {
        name: 'Copper Mountain, CO',
        imagePath: '/images/usa.png',
        date: new Date('2026-11-28T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131697',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2026-12-03T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131702',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2026-12-04T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131703',
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2026-12-05T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131704',
    },
    {
        name: 'Val Gardena-Groeden Südtirol',
        imagePath: '/images/italy.png',
        date: new Date('2026-12-18T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131711',
    },
    {
        name: 'Val Gardena-Groeden Südtirol',
        imagePath: '/images/italy.png',
        date: new Date('2026-12-19T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131712',
    },
    {
        name: 'Bormio',
        imagePath: '/images/italy.png',
        date: new Date('2026-12-28T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131838',
    },
    {
        name: 'Bormio',
        imagePath: '/images/italy.png',
        date: new Date('2026-12-29T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131839',
    },
    {
        name: 'Wengen',
        imagePath: '/images/switzerland.png',
        date: new Date('2027-01-15T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131723',
    },
    {
        name: 'Wengen',
        imagePath: '/images/switzerland.png',
        date: new Date('2027-01-16T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131724',
    },
    {
        name: 'Kitzbuehel',
        imagePath: '/images/austria.png',
        date: new Date('2027-01-22T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131729',
    },
    {
        name: 'Kitzbuehel',
        imagePath: '/images/austria.png',
        date: new Date('2027-01-23T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131730',
    },
    {
        name: 'Crans Montana',
        imagePath: '/images/switzerland.png',
        date: new Date('2027-02-05T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131847',
    },
    {
        name: 'Crans Montana',
        imagePath: '/images/switzerland.png',
        date: new Date('2027-02-07T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131850',
    },
    {
        name: 'Garmisch-Partenkirchen',
        imagePath: '/images/germany.png',
        date: new Date('2027-02-20T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131737',
    },
    {
        name: 'Garmisch-Partenkirchen',
        imagePath: '/images/germany.png',
        date: new Date('2027-02-21T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131738',
    },
    {
        name: 'Saalbach',
        imagePath: '/images/austria.png',
        date: new Date('2027-02-27T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131741',
    },
    {
        name: 'Saalbach',
        imagePath: '/images/austria.png',
        date: new Date('2027-02-28T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131742',
    },
    {
        name: 'Kvitfjell',
        imagePath: '/images/norway.png',
        date: new Date('2027-03-06T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131746',
    },
    {
        name: 'Kvitfjell',
        imagePath: '/images/norway.png',
        date: new Date('2027-03-07T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131747',
    },
    {
        name: 'Sun Valley',
        imagePath: '/images/usa.png',
        date: new Date('2027-03-20T00:00:00.000Z'),
        discipline: 'DH',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131690',
    },
    {
        name: 'Sun Valley',
        imagePath: '/images/usa.png',
        date: new Date('2027-03-21T00:00:00.000Z'),
        discipline: 'SG',
        resultLink: 'https://www.fis-ski.com/DB/general/results.html?seasoncode=2027&sectorcode=AL&raceid=131692',
    }
];
