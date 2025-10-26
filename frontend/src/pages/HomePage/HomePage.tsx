import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import React, { useEffect, useState } from 'react';
import "./HomePage.css";
// import TextBlock from './TextBlock.tsx';
import {type Race, races} from "../../races.ts";

const HomePage: React.FC = () => {
  const [countdown, setCountdown] = useState("");
  const [nextRace, setNextRace] = useState<Race>({name: "Kitzbühel", imagePath: '/images/austria.png', date: new Date('2026-01-24T00:00:00')});


  useEffect(() => {
    const filteredRaces = races
        .filter((r) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return r.date.getTime() >= today.getTime();
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime())
    setNextRace(filteredRaces[0]);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = nextRace?.date.getTime() - now;

      if (distance < 0) {
        setCountdown("Race Day 🏔️🔥");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextRace]);


  return (

    <main className='min-h-screen'>
      <Parallax pages={2} style={{ top: '0', left: '0' }} className="animation">
        {/* Bakgrunn */}
        <ParallaxLayer offset={0} speed={0.36}>
          <div className="animation_layer parallax" id="artback"></div>
        </ParallaxLayer>

        {/* Underlag */}
        <ParallaxLayer offset={0} speed={0.35}>
          <div className="animation_layer parallax" id="underlag"></div>
        </ParallaxLayer>

        {/* Port */}
        <ParallaxLayer offset={0} speed={0.25}>
          <div className="animation_layer parallax" id="port"></div>
        </ParallaxLayer>

        {/* Fredrik */}
        <ParallaxLayer offset={0} speed={0.2}>
          <div className="animation_layer parallax" id="fredrik"></div>
        </ParallaxLayer>

        {/* Title med nedtelling */}
        <ParallaxLayer offset={0} speed={0.25}>
          <div className="animation_layer parallax" id="title">
            <h1>Møller fanclub<br/> Next race: {nextRace?.name}</h1>
            <div id="countdown">{countdown}</div>
          </div>
        </ParallaxLayer>

        {/* Tekstblokk */}
        {/* <ParallaxLayer offset={1} speed={0.1}>
          <TextBlock />
        </ParallaxLayer> */}
      </Parallax>
    </main>

  );
};

export default HomePage;
