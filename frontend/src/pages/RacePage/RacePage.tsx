import React from "react";
import NavigationBar from "../../components/NavigationBar.tsx";
import RaceCard from "../../components/RaceCard.tsx";
import "./RacePage.css";
import {races} from "../../races.ts";

const RacePage: React.FC = () => {
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
