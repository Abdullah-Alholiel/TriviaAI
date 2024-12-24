'use client'

import { motion } from 'framer-motion'

interface ScoreDisplayProps {
  score: number
  totalQuestions: number
  className?: string
}

export function ScoreDisplay({ score, totalQuestions, className = '' }: ScoreDisplayProps) {
  const percentage = Math.round((score / totalQuestions) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg ${className}`}
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your Score
        </h3>
        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
          {score} / {totalQuestions}
        </div>
        <div className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          {percentage}%
        </div>
      </div>
    </motion.div>
  )
}