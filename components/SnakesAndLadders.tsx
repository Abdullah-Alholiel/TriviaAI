'use client'

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";

interface SnakesAndLaddersProps {
  onExit: () => void
}

const SnakesAndLadders = ({ onExit }: SnakesAndLaddersProps) => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartSnakesGame = () => {
    setGameStarted(true);
    // Additional game initialization logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-md">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
            Snakes & Ladders Trivia
          </h1>
          <Button
            variant="outline"
            onClick={onExit}
            className="flex items-center gap-2 text-gray-900 border-2 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-300 font-semibold px-6 py-2"
          >
            <ArrowLeftCircle className="w-5 h-5" />
            Exit Game
          </Button>
        </div>

        {/* Game Content */}
        <Card className="p-6 text-center bg-white/80 backdrop-blur-sm shadow-xl">
          {!gameStarted ? (
            // Start Screen
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold mb-4 text-green-800">Welcome to Snakes & Ladders Trivia!</h2>
              <p className="text-gray-600 mb-4 text-lg">
                Roll the dice, answer trivia questions, climb the ladders, and watch out for those sneaky snakes!
              </p>
              <Button
                onClick={handleStartSnakesGame}
                className="w-full p-6 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white transition-all duration-300"
              >
                Start Adventure
              </Button>
            </div>
          ) : (
            // Game Board (placeholder for now)
            <div className="space-y-6">
              <div className="w-full aspect-square max-w-lg mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border-2 border-green-300 shadow-inner">
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-600 text-lg font-medium">
                    Game Board Coming Soon!
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SnakesAndLadders;
