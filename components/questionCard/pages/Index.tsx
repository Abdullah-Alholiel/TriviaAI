'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuestionCard } from '../QuestionCard'
import { ScoreDisplay } from '../ScoreDisplay'
import { GameConfigModal } from '@/components/game-config-modal'
import { TriviaGame as TriviaGameType, GameConfig, TriviaQuestion } from '@/lib/types/trivia'
import { useLoading } from '@/components/ui/LoadingContext'
import { GameOver } from '../GameOver'
import { Timer } from '../timer'
import { GameNotification } from '../GameNotification'
import Background from '@/components/background'
import { Brain } from 'lucide-react'

// Static questions bank for classic mode
const STATIC_QUESTIONS: TriviaQuestion[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'Which country won the FIFA World Cup 2022?',
    options: [
      { id: 'a', text: 'France' },
      { id: 'b', text: 'Argentina' },
      { id: 'c', text: 'Brazil' },
      { id: 'd', text: 'Germany' },
    ],
    correctAnswer: 'b',
    explanation: 'Argentina won their third World Cup title in 2022, led by Lionel Messi.',
  },
  {
    id: '2',
    type: 'true-false',
    question: 'The FIFA World Cup trophy is made of solid gold.',
    correctAnswer: false,
    explanation: 'The FIFA World Cup trophy is actually made of solid silver with gold plating.',
  },
  {
    id: '3',
    type: 'text-input',
    question: 'Which player is known as "CR7"?',
    correctAnswer: 'Cristiano Ronaldo',
    acceptableAnswers: ['ronaldo', 'cr7'],
    explanation: 'Cristiano Ronaldo wears the number 7 and is commonly known as CR7.',
  },
  // Add more static questions here
]

interface TriviaGameProps {
  onExit: () => void
  mode?: 'classic' | 'ai'
}

export default function TriviaGame({ onExit, mode = 'classic' }: TriviaGameProps) {
  const [gameState, setGameState] = useState<'config' | 'playing' | 'finished'>('config')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [game, setGame] = useState<TriviaGameType | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState<'timeWarning' | 'timeUp' | 'correct' | 'incorrect'>('timeUp')
  const { setIsLoading } = useLoading()

  const questions = game?.questions || STATIC_QUESTIONS

  const handleGameStart = async (config: GameConfig) => {
    setIsLoading(true)
    try {
      if (mode === 'ai') {
        const response = await fetch('/api/trivia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        })

        if (!response.ok) {
          throw new Error('Failed to generate game')
        }

        const gameData = await response.json()
        setGame(gameData)
      }
      setGameState('playing')
    } catch (error) {
      console.error('Error starting game:', error)
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1)
      setNotificationType('correct')
    } else {
      setNotificationType('incorrect')
    }
    setShowNotification(true)

    setTimeout(() => {
      setShowNotification(false)
      if (currentQuestionIndex + 1 >= questions.length) {
        setGameState('finished')
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    }, 1500)
  }

  const handleTimeUp = () => {
    setNotificationType('timeUp')
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
      if (currentQuestionIndex + 1 >= questions.length) {
        setGameState('finished')
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    }, 1500)
  }

  const renderContent = () => {
    if (gameState === 'config' && mode === 'ai') {
      return <GameConfigModal onStart={handleGameStart} onCancel={onExit} />
    }

    if (gameState === 'config' && mode === 'classic') {
      handleGameStart({ topic: 'Classic', difficulty: 'medium', numQuestions: STATIC_QUESTIONS.length })
      return null
    }

    if (gameState === 'finished') {
      return (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <GameOver
            score={score}
            totalQuestions={questions.length}
            onRestart={() => {
              setScore(0)
              setCurrentQuestionIndex(0)
              setGameState('config')
            }}
            onMainMenu={onExit}
          />
        </div>
      )
    }

    const currentQuestion = questions[currentQuestionIndex]

    return (
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-xl">
                <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {mode === 'classic' ? 'Classic Trivia' : 'AI Trivia'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <ScoreDisplay
                score={score}
                totalQuestions={questions.length}
                className="w-48"
              />
              <Timer
                duration={30}
                onTimeUp={handleTimeUp}
                isActive={gameState === 'playing'}
              />
              <button
                onClick={onExit}
                className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Exit Game
              </button>
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
              />
            </motion.div>
          </AnimatePresence>

          {/* Notification */}
          <GameNotification
            type={notificationType}
            message={
              notificationType === 'timeUp'
                ? "Time's up! Moving to next question..."
                : notificationType === 'correct'
                ? 'Correct! Well done!'
                : notificationType === 'incorrect'
                ? 'Incorrect! Keep trying!'
                : 'Time is running out!'
            }
            isVisible={showNotification}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <Background />
      {renderContent()}
    </div>
  )
}
