import React from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import RaceCard from "../../components/RaceCard.tsx";
import { races } from "../../races.ts";

const RacePage: React.FC = () => {
    return (
        <div className="min-h-screen flex justify-center bg-gray-100 py-8">
            <NavigationBar />
            <div className="mx-auto max-w-5xl px-4">
                <h1 className="mt-20 mb-8 text-center text-3xl font-bold text-gray-800">Kommende Løp</h1>
                <div className="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
                    {races.sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map((race, index) => (
                        <RaceCard key={index} race={race} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RacePage;
