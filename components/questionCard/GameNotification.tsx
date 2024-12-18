//src/components/GameNotification.tsx
import { cn } from "@/lib/utils";
import { AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";

interface GameNotificationProps {
  type: "timeWarning" | "timeUp" | "correct" | "incorrect";
  message: string;
  isVisible: boolean;
}

export const GameNotification = ({ type, message, isVisible }: GameNotificationProps) => {
  if (!isVisible) return null;

  const icons = {
    timeWarning: Clock,
    timeUp: AlertCircle,
    correct: CheckCircle2,
    incorrect: XCircle,
  };

  const Icon = icons[type];

  const styles = {
    timeWarning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    timeUp: "bg-red-50 border-red-500 text-red-800",
    correct: "bg-green-50 border-green-500 text-green-800",
    incorrect: "bg-red-50 border-red-500 text-red-800",
  };

  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center z-50 animate-fade-in",
      "backdrop-blur-sm bg-black/20"
    )}>
      <div className={cn(
        "p-6 rounded-lg shadow-xl border-2",
        "transform transition-all duration-300",
        "animate-scale",
        styles[type]
      )}>
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 animate-bounce" />
          <p className="text-lg font-semibold">{message}</p>
        </div>
      </div>
    </div>
  );
};