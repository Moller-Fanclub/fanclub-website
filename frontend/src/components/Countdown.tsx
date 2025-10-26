import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
  label: string;
  type: 'opening' | 'closing';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete, label, type }) => {
  const calculateTimeLeft = React.useCallback((): TimeLeft => {
    const difference = targetDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Check if countdown is complete
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete, calculateTimeLeft]);

  const isOpening = type === 'opening';
  const bgColor = isOpening ? 'bg-blue-600' : 'bg-orange-600';

  return (
    <div className={`mx-auto max-w-2xl mb-8 rounded-lg ${bgColor} p-6 shadow-lg`}>
      <div className="text-center">
        {/* Label */}
        <h2 className="text-xl font-semibold text-white mb-4">
          {label}
        </h2>

        {/* Countdown Timer */}
        <div className="flex justify-center gap-3 text-white">
          {/* Days */}
          {timeLeft.days > 0 && (
            <>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold">
                  {timeLeft.days}
                </div>
                <div className="text-sm opacity-90">
                  {timeLeft.days === 1 ? 'dag' : 'dager'}
                </div>
              </div>
              <div className="text-3xl font-bold self-start">:</div>
            </>
          )}

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-sm opacity-90">
              timer
            </div>
          </div>

          <div className="text-3xl font-bold self-start">:</div>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-sm opacity-90">
              min
            </div>
          </div>

          <div className="text-3xl font-bold self-start">:</div>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-sm opacity-90">
              sek
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
