'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TriviaQuestion } from '@/lib/types/trivia'

interface QuestionCardProps {
  question: TriviaQuestion
  onAnswer: (isCorrect: boolean) => void
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [textInput, setTextInput] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)

  const handleAnswer = (answer: string | boolean) => {
    if (showFeedback) return

    const answerStr = answer.toString().toLowerCase()
    let isCorrect = false

    if (question.type === 'multiple-choice') {
      isCorrect = answerStr === question.correctAnswer.toString()
    } else if (question.type === 'true-false') {
      isCorrect = answer === question.correctAnswer
    } else if (question.type === 'text-input') {
      const userAnswer = answerStr.trim()
      const correctAnswer = question.correctAnswer.toString().toLowerCase().trim()
      const acceptableAnswers = question.acceptableAnswers?.map(a => a.toLowerCase().trim()) || []
      isCorrect = userAnswer === correctAnswer || acceptableAnswers.includes(userAnswer)
    }

    setSelectedAnswer(answerStr)
    setShowFeedback(true)

    setTimeout(() => {
      onAnswer(isCorrect)
      setSelectedAnswer(null)
      setTextInput('')
      setShowFeedback(false)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {question.question}
      </h2>

      <div className="space-y-4">
        {question.type === 'multiple-choice' && question.options?.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(option.id)}
            disabled={showFeedback}
            className={`w-full p-4 rounded-lg transition-colors duration-300 ${
              selectedAnswer === option.id
                ? option.id === question.correctAnswer
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {option.text}
          </motion.button>
        ))}

        {question.type === 'true-false' && (
          <div className="grid grid-cols-2 gap-4">
            {['True', 'False'].map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option === 'True')}
                disabled={showFeedback}
                className={`p-4 rounded-lg transition-colors duration-300 ${
                  selectedAnswer === option.toLowerCase()
                    ? (option === 'True') === question.correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        )}

        {question.type === 'text-input' && (
          <div className="space-y-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={showFeedback}
              className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(textInput)}
              disabled={showFeedback || !textInput.trim()}
              className="w-full p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Submit Answer
            </motion.button>
          </div>
        )}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700"
        >
          <p className="text-gray-900 dark:text-white">{question.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
