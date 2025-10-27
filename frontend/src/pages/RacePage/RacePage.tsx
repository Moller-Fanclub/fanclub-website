import React from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import RaceCard from "../../components/RaceCard.tsx";
import { races } from "../../races.ts";

const RacePage: React.FC = () => {
    // Helper function to normalize date to midnight
    const getDateAtMidnight = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Get today's date at midnight for comparison
    const today = new Date();
    const todayMidnight = getDateAtMidnight(today);

    // Separate races into past and upcoming
    const pastRaces = races
        .filter(race => getDateAtMidnight(race.date).getTime() < todayMidnight.getTime())
        .sort((a, b) => b.date.getTime() - a.date.getTime()); // Most recent first

    const upcomingRaces = races
        .filter(race => getDateAtMidnight(race.date).getTime() >= todayMidnight.getTime())
        .sort((a, b) => a.date.getTime() - b.date.getTime()); // Soonest first

    return (
        <div className="min-h-screen flex justify-center bg-[#FFFAF0] py-8">
            <NavigationBar />
            <div className="mx-auto max-w-5xl px-4">
                <h1 className="mt-20 mb-8 text-center text-3xl font-bold text-gray-800">Kommende Løp</h1>
                <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingRaces.map((race) => (
                        <RaceCard key={race.name} race={race} />
                    ))}
                </div>

                {pastRaces.length > 0 && (
                    <>
                        <h2 className="mt-16 mb-8 text-center text-3xl font-bold text-gray-800">Tidligere Løp</h2>
                        <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
                            {pastRaces.map((race) => (
                                <RaceCard key={race.name} race={race} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RacePage;
