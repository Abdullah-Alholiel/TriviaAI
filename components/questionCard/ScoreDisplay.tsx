import { Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  totalQuestions: number;
  timeLeft?: number;
}

export const ScoreDisplay = ({ score, totalQuestions, timeLeft }: ScoreDisplayProps) => {
  const percentage = (score / totalQuestions) * 100;
  
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 backdrop-blur-sm border border-purple-200 shadow-xl animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Trophy className="h-12 w-12 text-yellow-500 animate-bounce" />
            <div className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-scale">
              {score}
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-purple-900">Current Score</h3>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-purple-700">
                Question {Math.min(score + 1, totalQuestions)} of {totalQuestions}
              </span>
            </div>
          </div>
        </div>
        
        <div className="relative h-16 w-16">
          <svg className="transform -rotate-90 h-16 w-16">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-purple-100"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={175.93}
              strokeDashoffset={175.93 - (percentage / 100) * 175.93}
              className="text-purple-500 transition-all duration-700 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-purple-700">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};