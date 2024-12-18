//src/components/Timer.tsx
import { useEffect, useState, useCallback } from "react";
import { Circle } from "lucide-react";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export const Timer = ({ duration, onTimeUp, isActive }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const circumference = 2 * Math.PI * 24; // radius = 24
  const strokeDashoffset = ((duration - timeLeft) / duration) * circumference;

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, handleTimeUp]);

  return (
    <div className="relative w-16 h-16 transition-all duration-300">
      <svg className="transform -rotate-90 w-16 h-16">
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-purple-100"
        />
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`text-purple-500 transition-all duration-1000 ease-linear ${
            timeLeft <= 5 ? "text-red-500 animate-pulse" : ""
          }`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-lg font-bold ${
          timeLeft <= 5 ? "text-red-600 animate-bounce" : "text-purple-700"
        }`}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
};