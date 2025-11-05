"use client";

import { useState, useEffect } from "react";

export default function CountDown({ targetDate }) {
  const calculateTimeLeft = () => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      expired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const format = (n) => n.toString().padStart(2, "0");

  if (timeLeft.expired) {
    return (
      <div className="bg-gradient-to-b from-zinc-900 to-black px-8 py-4 rounded-md border border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.4)] font-sans">
        <span className="text-red-500 font-bold text-2xl uppercase tracking-widest">
          MATCH STARTED!
        </span>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Protest+Guerrilla&display=swap"
        rel="stylesheet"
      />

      <div className="bg-gradient-to-b from-zinc-900 to-black px-8 py-20 my-20 rounded-md border border-white shadow-[0_0_20px_rgba(255, 255, 255, 1)] font-sans">
        <div className="flex items-center gap-6 text-white font-bold uppercase tracking-widest text-sm justify-center">
          {/* NEXT MATCH : */}
          <span className="text-4xl whitespace-nowrap font-[Pridi]">
            NEXT MATCH :
          </span>

          {/* Countdown */}
          <div className="flex gap-15 text-white">
            {/* DAYS */}
            <div className="text-center">
              <div
                className="text-7xl font-bold"
                style={{
                  fontFamily: '"Protest Guerrilla", sans-serif',
                  textShadow: "0 0 10px rgba(255, 255, 255, 1)",
                }}
              >
                {format(timeLeft.days)}
              </div>
              <div className="text-5xl text-gray-500 mt-1 tracking-wider">
                DAYS
              </div>
            </div>
            <p className="my-auto text-8xl">:</p>
            {/* HOURS */}
            <div className="text-center">
              <div
                className="text-7xl font-bold"
                style={{
                  fontFamily: '"Protest Guerrilla", sans-serif',
                  textShadow: "0 0 10px rgba(255, 255, 255, 1)",
                }}
              >
                {format(timeLeft.hours)}
              </div>
              <div className="text-4xl text-gray-500 mt-1 tracking-wider">
                HOURS
              </div>
            </div>
            <p className="my-auto text-8xl">:</p>
            {/* MINUTES */}
            <div className="text-center">
              <div
                className="text-7xl font-bold"
                style={{
                  fontFamily: '"Protest Guerrilla", sans-serif',
                  textShadow: "0 0 10px rgba(255, 255, 255, 1)",
                }}
              >
                {format(timeLeft.minutes)}
              </div>
              <div className="text-4xl text-gray-500 mt-1 tracking-wider">
                MINS
              </div>
            </div>
            <p className="my-auto text-8xl">:</p>

            {/* SECONDS */}
            <div className="text-center">
              <div
                className="text-7xl font-bold"
                style={{
                  fontFamily: '"Protest Guerrilla", sans-serif',
                  textShadow: "0 0 10px rgba(255, 255, 255, 1)",
                }}
              >
                {format(timeLeft.seconds)}
              </div>
              <div className="text-4xl text-gray-500 mt-1 tracking-wider">
                SECS
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
