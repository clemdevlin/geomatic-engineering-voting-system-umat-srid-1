import { useEffect, useState } from "react";
import {Clock} from "lucide-react";

// Countdown Timer Component
export const CountdownTimer = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        onComplete && onComplete();
        return 'Time expired';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  return (
    <div className="flex items-center gap-2 text-lg font-mono bg-slate-300 shadow-inner inset-5 p-4 rounded-md border ">
      <Clock className="h-5 w-5" />
      <span>{timeLeft}</span>
    </div>
  );
};