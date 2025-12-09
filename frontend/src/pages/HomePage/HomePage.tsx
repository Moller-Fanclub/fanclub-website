import React, { useEffect, useState } from 'react';
import "./HomePage.css";
import {type Race, races} from "../../races.ts";
import {InstagramEmbed} from "react-social-media-embed";
import FadeInnAnimation from '../../components/FadeInnAnimation.tsx';
import { PublicPaths } from '@/lib/routes';
import { Link } from 'react-router-dom';
import { BlogSection } from './BlogSection/BlogSection.tsx';
import GoToTop from '@/components/GoToTop.tsx';
import Snowfall from "react-snowfall";
import Lottie from "lottie-react";




export const Typewriter: React.FC<{
  text: string;
  delay?: number;      // ⏱ hvor lenge å vente før start (ms)
  speed?: number;      // ⌨️ ms per tegn
  className?: string;
}> = ({ text, delay = 0, speed = 20, className }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    // starter først etter delay
    timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length && intervalId) {
          clearInterval(intervalId);
        }
      }, Math.max(1, speed));
    }, Math.max(0, delay));

    // opprydding
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay]);

  return <span className={className}>{displayed}</span>;
};

const HomePage: React.FC = () => {
  const [countdown, setCountdown] = useState("60d 0h 0m");
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextRace, setNextRace] = useState<Race>({
    name: "Kitzbühel", 
    imagePath: '/images/austria.png', 
    date: new Date('2026-01-24T00:00:00'),
    discipline: 'DH',
    resultLink: ''
  });

  const [santaAnimation, setSantaAnimation] = useState<any>(null);

  useEffect(() => {
    fetch("/animations/santa-fly.json")
      .then((res) => res.json())
      .then((data) => setSantaAnimation(data));
  }, []);



  useEffect(() => {
    const filteredRaces = races
        .filter((r) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return r.date.getTime() >= today.getTime();
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime())
    
    if (filteredRaces[0]) {
      setNextRace(filteredRaces[0]);
      
      // Calculate the actual countdown
      const now = new Date().getTime();
      const distance = filteredRaces[0].date.getTime() - now;
      const targetDays = Math.floor(distance / (1000 * 60 * 60 * 24));
      const targetHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const targetMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      // Animate from 60 days down to actual time over 2 seconds
      setIsAnimating(true);
      const startTime = Date.now();
      const duration = 2000; // 2 seconds
      const startDays = 60;
      if (distance < 0) {
        setCountdown("Race Day 🏔️🔥");
        setIsAnimating(false);
        return;
      }
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1); // 0 to 1
        
        // Ease out effect for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentDays = Math.floor(startDays - (startDays - targetDays) * easeOut);
        const currentHours = Math.floor(targetHours * easeOut);
        const currentMinutes = Math.floor(targetMinutes * easeOut);
        
        setCountdown(`${currentDays}d ${currentHours}h ${currentMinutes}m`);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCountdown(`${targetDays}d ${targetHours}h ${targetMinutes}m`);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, []);


  useEffect(() => {
    if (isAnimating) return; // Don't update during animation
    
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

      setCountdown(`${days}d ${hours}h ${minutes}m`);
    }, 60000); // Update every minute instead of every second

    return () => clearInterval(interval);
  }, [nextRace, isAnimating]);

  

  return (
    <div className="relative flex-1 bg-linear-to-br from-gray-900 via-slate-800 to-gray-900">

      {/* Hero Section with Full Background Image */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/bakgrunn.jpg)',
          }}
        >
          <Snowfall snowflakeCount={100} /> 
          { santaAnimation && (
            <Lottie 
              animationData={santaAnimation}
              loop={true}
              className="animate-santa"
            />
          )}

          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/30 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="mb-6 sm:text-6xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
              Følg Fredrik Møller
            </h1>
            <p className="mb-8 text-white/95 drop-shadow-lg">
              {/* <span className="text-3xl sm:text-3xl">Ånei!</span>{' '} */}
               <Typewriter text={"Ånei! "} speed={28} delay={1000} className='text-3xl sm:text-3xl' />
              <span className="text-xl sm:text-2xl font-medium">Neste renn: {nextRace.name}</span>
            </p>
            
            {/* Countdown */}
            <div className="mb-8 inline-block rounded-2xl bg-white/10 backdrop-blur-md px-8 py-4 border border-white/20 shadow-2xl">
              <div className="text-sm text-white/80 font-semibold uppercase tracking-wider mb-1">Neste renn</div>
              <div className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                {countdown}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to={PublicPaths.calender}
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-8 py-4 text-lg font-bold text-gray-900 shadow-2xl transition-all duration-300 hover:bg-yellow-300 hover:scale-105 hover:shadow-yellow-400/50"
              >
                Se Kalender
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                to={PublicPaths.comingSoon}
                className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-8 py-4 text-lg font-bold text-white border-2 border-white/40 shadow-2xl transition-all duration-300 hover:bg-white/30 hover:scale-105"
              >
                Kjøp Merch
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white/80 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Additional Content Section - Glassmorphism Effect */}
      <section className="relative min-h-screen py-20 px-6 overflow-hidden">
        {/* Dark blurred background */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-slate-800 to-gray-900"></div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Content with glass effect */}
        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Title with glass background */}
          <div className="mb-12 text-center">
            <FadeInnAnimation>
                <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                  Følg Møller og Fanclubben på Instagram
                </h2>
            </FadeInnAnimation>  
          </div>
          
          {/* Instagram embeds with glass containers */}
          <div className="insta-feeds-container">
            <div className="insta-feed">
                <FadeInnAnimation>
                  <InstagramEmbed
                      url="https://www.instagram.com/fredrikmoeller/"
                      width="100%"
                  />
                </FadeInnAnimation>
            </div>
            <div className="insta-feed">
              <FadeInnAnimation>
                <InstagramEmbed
                    url="https://www.instagram.com/mollerfan.club/"
                    width="100%"
                />
              </FadeInnAnimation>
            </div>
          </div>
          <BlogSection />
        </div>
      </section>
      <GoToTop/>
    </div>
  );
};

export default HomePage;
