import React from 'react';
import './styles/RaceCard.css'

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
        <div className="race-card">
            <img
                src={race.imagePath}
                alt={`${race.name} flag`}
                className="race-image"
            />
            <div className="race-content">
                <h2 className="race-name">{race.name}</h2>
                <p className="race-date">
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