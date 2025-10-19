import React from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import RaceCard from "../../components/RaceCard.tsx";
import "./RacePage.css";

interface Race {
    name: string,
    imagePath: string,
    date: Date,
}

const RacePage: React.FC = () => {
    const races: Race[] = [
        {
            name: 'Kitzbühel',
            imagePath: '/images/austria.png',
            date: new Date('2026-01-24T11:30:00'),
        },
    ];

    return (
        <div className="race-page">
            <NavigationBar />
            <div className="container">
                <h1 className="page-title">Kommende Løp</h1>
                <div className="race-grid">
                    {races.map((race, index) => (
                        <RaceCard key={index} race={race} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RacePage;
