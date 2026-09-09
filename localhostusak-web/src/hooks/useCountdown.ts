import { useState, useEffect } from 'react';

interface CountdownResult {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export function useCountdown(targetDate: Date | string): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<CountdownResult>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isExpired: false,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculateTime = () => {
      const current = new Date().getTime();
      const diff = target - current;

      if (diff <= 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => String(n).padStart(2, '0');

      setTimeLeft({
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
        isExpired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}
