export interface Race {
    name: string,
    imagePath: string,
    date: Date,
}

export const races: Race[] = [
    {
        name: 'Sölden',
        imagePath: '/images/austria.png',
        date: new Date('2025-10-26T00:00:00'),
    },
    {
        name: 'Copper Mt.',
        imagePath: '/images/usa.png',
        date: new Date('2025-11-27T00:00:00'),
    },
    {
        name: 'Beaver Creek',
        imagePath: '/images/usa.png',
        date: new Date('2025-12-04T00:00:00'),
    },
    {
        name: 'Val Gardena',
        imagePath: '/images/italy.png',
        date: new Date('2025-12-19T00:00:00'),
    },
    {
        name: 'Livigno',
        imagePath: '/images/italy.png',
        date: new Date('2025-12-27T00:00:00'),
    },
    {
        name: 'Wengen',
        imagePath: '/images/switzerland.png',
        date: new Date('2026-01-16T00:00:00'),
    },
    {
        name: 'Kitzbühel',
        imagePath: '/images/austria.png',
        date: new Date('2026-01-24T00:00:00'),
    },
    {
        name: 'Crans Montana',
        imagePath: '/images/switzerland.png',
        date: new Date('2026-02-01T00:00:00'),
    },
    {
        name: 'Garmisch Partenkirchen',
        imagePath: '/images/germany.png',
        date: new Date('2026-02-28T00:00:00'),
    },
    {
        name: 'Courchevel',
        imagePath: '/images/france.png',
        date: new Date('2026-03-14T00:00:00'),
    },
    {
        name: 'Lillehammer',
        imagePath: '/images/norway.png',
        date: new Date('2026-03-21T00:00:00'),
    },
];