'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface LadderSnakeProps {
  question: {
    text: string
    options?: string[]
    correctAnswer: string
  }
  onAnswer: (correct: boolean) => void
}

const LadderSnake = ({ question, onAnswer }: LadderSnakeProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleAnswer = (option: string) => {
    setSelectedOption(option)
    onAnswer(option === question.correctAnswer)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
      <div className="grid grid-cols-2 gap-4">
        {question.options?.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(option)}
            className={`p-4 rounded-lg transition-colors duration-300 ${
              selectedOption === option
                ? option === question.correctAnswer
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default LadderSnake 