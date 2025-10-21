export interface Race {
    name: string,
    imagePath: string,
    date: Date,
}

export const races: Race[] = [
    {
        name: 'Kitzbühel',
        imagePath: '/images/austria.png',
        date: new Date('2026-01-24T00:00:00'),
    },
];