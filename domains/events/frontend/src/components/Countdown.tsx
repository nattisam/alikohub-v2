import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const TARGET_DATE = new Date("2026-06-20T09:00:00"); // change if needed

export function Countdown() {
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = TARGET_DATE.getTime() - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-6 mt-8 justify-center">
      {items.map((item) => (
        <div
          key={item.label}
          className="w-20 h-20 rounded-full border border-gray-600
                     flex flex-col items-center justify-center
                     bg-gray-900/40 backdrop-blur
                     animate-pulse transition-all"
        >
          <span className="text-xl font-bold tabular-nums">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-xs text-gray-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
