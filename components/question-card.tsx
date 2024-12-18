'use client'

import { motion } from 'framer-motion'

type QuestionCardexProps = {
  question: { text: string }

  tag?: string

  className?: string

}

export default function QuestionCardex({ question, tag = 'Trivia', className = '' }: QuestionCardexProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl p-6 shadow-lg ${className}`}
    >
      <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
        {tag}
      </div>
      <h3 className="text-xl font-medium text-gray-900">{question.text}</h3>
    </motion.div>
  )
}

