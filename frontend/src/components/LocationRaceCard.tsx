import React from 'react';
import FadeInnAnimation from './FadeInnAnimation';

interface Race {
    name: string;
    imagePath: string;
    date: Date;
    discipline: string;
    resultLink: string;
}

interface LocationRaceCardProps {
    location: string;
    imagePath: string;
    races: Race[];
    isPast?: boolean;
}

const LocationRaceCard: React.FC<LocationRaceCardProps> = ({ location, imagePath, races, isPast = false }) => {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
    };

    const handleRaceClick = (resultLink: string) => {
        window.open(resultLink, '_blank', 'noopener,noreferrer');
    };

    // Calculate countdown to first race
    const getDateAtMidnight = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const today = new Date();
    const todayMidnight = getDateAtMidnight(today);
    const firstRaceDate = races.length > 0 ? races[0].date : today;
    const raceMidnight = getDateAtMidnight(firstRaceDate);
    const timeDiff = raceMidnight.getTime() - todayMidnight.getTime();
    const daysUntil = Math.round(timeDiff / (1000 * 3600 * 24));

    return (
        <FadeInnAnimation className="w-full overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Header with flag and location */}
            <div className="relative flex items-center gap-2 sm:gap-4 bg-linear-to-br from-gray-50 to-gray-100 p-3 sm:p-4 border-b border-gray-200">
                <div className="relative h-12 w-16 sm:h-16 sm:w-24 shrink-0 overflow-hidden rounded-lg shadow-md border-2 border-white">
                    <img
                        src={imagePath}
                        alt={`${location} flag`}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg sm:text-xl truncate">{location}</h3>
                    {!isPast && daysUntil >= 0 && (
                        <p className="text-xs sm:text-sm text-blue-600 font-medium mt-1">
                            {daysUntil === 0 ? '🏁 I dag!' : `⏱️ Om ${daysUntil} dag${daysUntil !== 1 ? 'er' : ''}`}
                        </p>
                    )}
                </div>
            </div>

            {/* Races - responsive flex layout */}
            <div className="p-3 sm:p-4 bg-white">
                <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 ${
                    races.length === 1 ? 'sm:justify-center' : 
                    races.length === 2 ? 'sm:justify-around' : 
                    'sm:justify-between'
                }`}>
                    {races.map((race, index) => (
                        <button
                            key={`${race.discipline}-${index}`}
                            onClick={() => handleRaceClick(race.resultLink)}
                            className={`flex flex-row sm:flex-col items-center justify-between sm:justify-center rounded-xl border-2 border-gray-200 bg-linear-to-b from-white to-gray-50 p-3 sm:p-4 hover:border-blue-400 hover:shadow-md transition-all duration-200 active:scale-95 sm:hover:scale-105 ${
                                races.length === 1 ? 'sm:w-48' : 'sm:flex-1 sm:min-w-0'
                            }`}
                        >
                            {/* Discipline Badge */}
                            <span className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 sm:py-2 text-sm font-bold sm:mb-2 shadow-sm ${
                                race.discipline === 'DH' 
                                    ? 'bg-linear-to-br from-red-500 to-red-600 text-white' 
                                    : race.discipline === 'SG'
                                    ? 'bg-linear-to-br from-blue-500 to-blue-600 text-white'
                                    : 'bg-linear-to-br from-green-500 to-green-600 text-white'
                            }`}>
                                {race.discipline}
                            </span>
                            
                            {/* Date */}
                            <span className="text-sm font-medium text-gray-700">
                                {formatDate(race.date)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </FadeInnAnimation>
    );
};

export default LocationRaceCard;
