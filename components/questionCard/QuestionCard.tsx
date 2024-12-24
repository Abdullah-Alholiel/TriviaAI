import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Star, X, Check, ThumbsUp, ThumbsDown, Brain, Loader2 } from "lucide-react";
import { Question } from "../types/questions";
import { cn } from "@/lib/utils";
import { Timer } from "./timer";
import { GameNotification } from "./GameNotification";

interface QuestionCardProps {
  question: Question | undefined;
  onAnswer: (isCorrect: boolean) => void;
  isLastQuestion?: boolean;
}

export const QuestionCard = ({ question, onAnswer, isLastQuestion }: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"timeWarning" | "timeUp" | "correct" | "incorrect">("timeUp");
  const { toast } = useToast();

  useEffect(() => {
    setSelectedAnswer(null);
    setTextInput("");
    setIsAnswered(false);
    setIsAnimating(false);
    setIsCorrect(null);
    setShowNotification(false);
  }, [question]);

  // If no question is provided, show loading state
  if (!question) {
    return (
      <Card className="w-full max-w-2xl mx-auto p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-500" />
          <p className="text-purple-600">Loading question...</p>
        </div>
      </Card>
    );
  }

  const handleTimeUp = () => {
    if (!isAnswered) {
      console.log("Time up for question:", question.id);
      setShowNotification(true);
      setNotificationType("timeUp");
      
      setTimeout(() => {
        setShowNotification(false);
        onAnswer(false);
      }, 2000);
    }
  };

  const checkAnswer = (answer: string | boolean) => {
    if (isAnswered || isAnimating) return;
    
    console.log("Checking answer for question:", question.id, "Answer:", answer);
    setIsAnimating(true);
    setIsAnswered(true);
    
    let correct = false;
    
    switch (question.type) {
      case 'multiple-choice':
        correct = answer === question.correctAnswer;
        break;
      case 'true-false':
        correct = answer === question.correctAnswer;
        break;
      case 'text-input':
        const userAnswer = answer.toString().toLowerCase().trim();
        const correctAnswer = question.correctAnswer.toLowerCase().trim();
        const acceptableAnswers = question.acceptableAnswers?.map(a => a.toLowerCase().trim()) || [];
        correct = userAnswer === correctAnswer || acceptableAnswers.includes(userAnswer);
        break;
    }
    
    console.log("Answer is:", correct ? "correct" : "incorrect");
    setIsCorrect(correct);
    setShowNotification(true);
    setNotificationType(correct ? "correct" : "incorrect");
    
    setTimeout(() => {
      setShowNotification(false);
      onAnswer(correct);
      setIsAnimating(false);
    }, 2000);
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            {question.options.map((option) => (
              <Button
                key={option.id}
                onClick={() => checkAnswer(option.id)}
                className={cn(
                  "w-full p-4 text-left",
                  selectedAnswer === option.id && "bg-purple-200",
                  isAnswered && option.id === question.correctAnswer && "bg-green-200",
                  isAnswered && option.id !== question.correctAnswer && "bg-red-200"
                )}
                disabled={isAnswered}
              >
                {option.text}
              </Button>
            ))}
          </div>
        );
      case 'true-false':
        return (
          <div className="space-y-4">
            <Button
              onClick={() => checkAnswer(true)}
              className={cn(
                "w-full p-4",
                selectedAnswer === true && "bg-purple-200",
                isAnswered && question.correctAnswer === true && "bg-green-200",
                isAnswered && question.correctAnswer !== true && "bg-red-200"
              )}
              disabled={isAnswered}
            >
              True
            </Button>
            <Button
              onClick={() => checkAnswer(false)}
              className={cn(
                "w-full p-4",
                selectedAnswer === false && "bg-purple-200",
                isAnswered && question.correctAnswer === false && "bg-green-200",
                isAnswered && question.correctAnswer !== false && "bg-red-200"
              )}
              disabled={isAnswered}
            >
              False
            </Button>
          </div>
        );
      case 'text-input':
        return (
          <div className="space-y-4">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isAnswered}
            />
            <Button
              onClick={() => checkAnswer(textInput)}
              className="w-full p-4"
              disabled={isAnswered}
            >
              Submit
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      "w-full max-w-2xl mx-auto p-8 relative",
      "animate-fade-in transition-all duration-300 backdrop-blur-sm",
      "bg-white/90 shadow-xl border-2",
      isAnimating && "opacity-50 scale-95",
      isAnswered && isCorrect === true && "border-green-500",
      isAnswered && isCorrect === false && "border-red-500"
    )}>
      <GameNotification
        type={notificationType}
        message={
          notificationType === "timeUp" 
            ? "Time's up! Moving to next question..." 
            : notificationType === "correct"
            ? "Correct! Well done!"
            : notificationType === "incorrect"
            ? "Incorrect! Keep trying!"
            : "Time is running out!"
        }
        isVisible={showNotification}
      />
      
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-2xl font-semibold leading-tight text-purple-900">
              {question.question}
            </h3>
          </div>
          <Timer
            duration={15}
            onTimeUp={handleTimeUp}
            isActive={!isAnswered && !isAnimating}
          />
        </div>
        {renderQuestionContent()}
      </div>
    </Card>
  );
};
