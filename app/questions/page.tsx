'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import LadderSnake from '../components/ladder-snake'

type Question = {
  id: number
  text: string
  type: 'multiple-choice' | 'yes-no' | 'ladder-snake'
  options?: string[]
  correctAnswer: string
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const searchParams = useSearchParams()
  const topic = searchParams.get('topic')

  useEffect(() => {
    // Simulating API call to fetch questions
    const fetchQuestions = async () => {
      // In a real application, you would fetch questions from your backend
      const dummyQuestions: Question[] = [
        {
          id: 1,
          text: 'What is the capital of France?',
          type: 'multiple-choice',
          options: ['London', 'Berlin', 'Paris', 'Madrid'],
          correctAnswer: 'Paris'
        },
        {
          id: 2,
          text: 'Is the Earth flat?',
          type: 'yes-no',
          correctAnswer: 'No'
        },
        {
          id: 3,
          text: 'Which planet is known as the Red Planet?',
          type: 'ladder-snake',
          options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
          correctAnswer: 'Mars'
        },
        // Add more dummy questions here
      ]
      setQuestions(dummyQuestions)
    }

    fetchQuestions()
  }, [topic])

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowFeedback(true)

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }, 2000)
  }

  if (questions.length === 0) {
    return <div className="text-center text-white text-2xl mt-10">Loading questions...</div>
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">Game Over!</h2>
          <p className="text-xl mb-4">Your final score: {score} / {questions.length}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Play Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Question {currentQuestionIndex + 1}</h2>
        {currentQuestion.type === 'ladder-snake' ? (
          <LadderSnake
            question={currentQuestion}
            onAnswer={(correct) => {
              handleAnswer(correct ? currentQuestion.correctAnswer : '')
            }}
          />
        ) : (
          <>
            <p className="text-lg mb-6">{currentQuestion.text}</p>
            <div className="space-y-4">
              <AnimatePresence>
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, index) => (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleAnswer(option)}
                    className={`w-full py-2 px-4 rounded-md transition duration-300 ${
                      selectedAnswer === option
                        ? option === currentQuestion.correctAnswer
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-200 hover:bg-indigo-100'
                    }`}
                    disabled={showFeedback}
                  >
                    {option}
                  </motion.button>
                ))}
                {currentQuestion.type === 'yes-no' && (
                  <>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleAnswer('Yes')}
                      className={`w-full py-2 px-4 rounded-md transition duration-300 ${
                        selectedAnswer === 'Yes'
                          ? 'Yes' === currentQuestion.correctAnswer
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-gray-200 hover:bg-indigo-100'
                      }`}
                      disabled={showFeedback}
                    >
                      Yes
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      onClick={() => handleAnswer('No')}
                      className={`w-full py-2 px-4 rounded-md transition duration-300 ${
                        selectedAnswer === 'No'
                          ? 'No' === currentQuestion.correctAnswer
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-gray-200 hover:bg-indigo-100'
                      }`}
                      disabled={showFeedback}
                    >
                      No
                    </motion.button>
                  </>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 text-white text-xl font-bold"
      >
        Score: {score} / {currentQuestionIndex + 1}
      </motion.div>
    </div>
  )
}

