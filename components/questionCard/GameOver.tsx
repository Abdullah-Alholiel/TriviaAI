//src/components/GameOver.tsx
import { Button } from "../ui/button";
import { Trophy, Home, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameOverProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOver = ({ score, totalQuestions, onRestart, onMainMenu }: GameOverProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white/90 rounded-lg shadow-xl border-2 border-purple-200 backdrop-blur-sm animate-fade-in">
      <div className="space-y-8 text-center">
        <Trophy className={cn(
          "w-20 h-20 mx-auto",
          percentage >= 80 ? "text-yellow-500" : 
          percentage >= 60 ? "text-purple-500" : 
          "text-gray-500",
          "animate-bounce"
        )} />
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-purple-900">Game Over!</h2>
          <p className="text-xl text-purple-700">
            You scored {score} out of {totalQuestions}
          </p>
          <div className={cn(
            "text-2xl font-bold",
            percentage >= 80 ? "text-yellow-600" : 
            percentage >= 60 ? "text-purple-600" : 
            "text-gray-600"
          )}>
            {percentage}%
          </div>
          <p className="text-lg text-purple-600">
            {percentage >= 80 ? "Outstanding! 🌟" : 
             percentage >= 60 ? "Well done! 👏" : 
             "Keep practicing! 💪"}
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onMainMenu}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 animate-fade-in"
          >
            <Home className="w-4 h-4" />
            Main Menu
          </Button>
          <Button
            onClick={onRestart}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 animate-fade-in"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};