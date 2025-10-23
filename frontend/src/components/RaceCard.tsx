import React from 'react';

interface Race {
    name: string;
    imagePath: string;
    date: Date;
}

interface RaceCardProps {
    race: Race;
}

const RaceCard: React.FC<RaceCardProps> = ({ race }) => {
    // Normalize time
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const raceMidnight = new Date(race.date.getFullYear(), race.date.getMonth(), race.date.getDate());

    // Calculate days difference
    const timeDiff = raceMidnight.getTime() - todayMidnight.getTime();
    const daysUntil = Math.round(timeDiff / (1000 * 3600 * 24));

    return (
        <div className="mx-auto flex w-full max-w-sm items-center overflow-hidden rounded-lg bg-white shadow-md">
            <img
                src={race.imagePath}
                alt={`${race.name} flag`}
                className="m-4 h-16 w-24 border border-gray-300 object-cover"
            />
            <div className="flex-1 p-4">
                <h2 className="text-lg font-semibold text-gray-800">{race.name}</h2>
                <p className="text-sm text-gray-600">
                    {daysUntil > 0
                        ? `Om ${daysUntil} dag${daysUntil !== 1 ? 'er' : ''}`
                        : daysUntil === 0
                            ? 'I dag'
                            : `${Math.abs(daysUntil)} dag${Math.abs(daysUntil) !== 1 ? 'er' : ''} siden`}
                </p>
            </div>
        </div>
    );
};

export default RaceCard;