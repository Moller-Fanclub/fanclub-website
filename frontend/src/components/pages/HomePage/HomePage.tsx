import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import React, { useEffect, useState } from 'react';
import "./HomePage.css";
import TextBlock from './textBlock';

const HomePage: React.FC = () => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const raceDate = new Date("Jan 24, 2026 11:30:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = raceDate - now;

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
  }, []);

  return (
    <div className="App">
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
            <h1>Møller fanclub<br/>Kitzbühel 2026</h1>
            <div id="countdown">{countdown}</div>
          </div>
        </ParallaxLayer>

        {/* Tekstblokk */}
        <ParallaxLayer offset={1} speed={0.1}>
          <TextBlock />
        </ParallaxLayer>

      </Parallax>
    </div>
  );
};

export default HomePage;
