'use client'

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "../QuestionCard";
import { ScoreDisplay } from "../ScoreDisplay";
import { GameOver } from "../GameOver";
import { Trophy, Brain, ArrowLeftCircle } from "lucide-react"; // Changed imports
import { Question } from "../../types/questions";

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "1",
    type: "multiple-choice",
    question: "Which country won the FIFA World Cup 2022?",
    options: [
      { id: "a", text: "France" },
      { id: "b", text: "Argentina" },
      { id: "c", text: "Brazil" },
      { id: "d", text: "Germany" },
    ],
    correctAnswer: "b",
    explanation: "Argentina won their third World Cup title in 2022, led by Lionel Messi.",
  },
  {
    id: "2",
    type: "true-false",
    question: "The FIFA World Cup trophy is made of solid gold.",
    correctAnswer: false,
    explanation: "The FIFA World Cup trophy is actually made of solid silver with gold plating.",
  },
  {
    id: "3",
    type: "text-input",
    question: "Which player is known as 'CR7'?",
    correctAnswer: "Cristiano Ronaldo",
    acceptableAnswers: ["ronaldo", "cr7"],
    explanation: "Cristiano Ronaldo wears the number 7 and is commonly known as CR7.",
  }
];

interface TriviaGameProps {
  onExit: () => void
}

const TriviaGame = ({ onExit }: TriviaGameProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleAnswer = (isCorrect: boolean) => {
    console.log("Answer handled:", isCorrect, "Current index:", currentQuestionIndex);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setGameOver(true);
      }
    }, 2000);
  };

  const startGame = () => {
    console.log("Starting new game");
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  const goToMainMenu = () => {
    setGameStarted(false);
    setGameOver(false);
  };

  const getCurrentQuestion = () => {
    return gameStarted && !gameOver ? SAMPLE_QUESTIONS[currentQuestionIndex] : undefined;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with improved exit button */}
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-md">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Classic Trivia
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

        {/* Main game content */}
        <div className="space-y-8">
          {!gameStarted ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-xl animate-fade-in border-2 border-purple-200">
              <h2 className="text-3xl font-semibold mb-6 text-center text-purple-900">Ready to Play?</h2>
              <Button 
                onClick={startGame}
                className="w-full p-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300"
              >
                Start Game
              </Button>
            </div>
          ) : gameOver ? (
            <GameOver
              score={score}
              totalQuestions={SAMPLE_QUESTIONS.length}
              onRestart={startGame}
              onMainMenu={onExit}
            />
          ) : (
            <div className="space-y-8 animate-fade-in">
              <ScoreDisplay
                score={score}
                totalQuestions={SAMPLE_QUESTIONS.length}
              />
              <QuestionCard
                question={getCurrentQuestion()}
                onAnswer={handleAnswer}
                isLastQuestion={currentQuestionIndex === SAMPLE_QUESTIONS.length - 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriviaGame;
