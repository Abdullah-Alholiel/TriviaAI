'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TimerProps {
  duration: number
  onTimeUp: () => void
  isActive?: boolean
}

export function Timer({ duration, onTimeUp, isActive = true }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [duration, onTimeUp, isActive])

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  const progress = (timeLeft / duration) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative h-12 w-12"
    >
      <svg className="transform -rotate-90 h-12 w-12">
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={125.66}
          strokeDashoffset={125.66 - (progress / 100) * 125.66}
          className={`transition-all duration-1000 ${
            timeLeft > duration * 0.5
              ? 'text-green-500'
              : timeLeft > duration * 0.25
              ? 'text-yellow-500'
              : 'text-red-500'
          }`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
          {timeLeft}s
        </span>
      </div>
    </motion.div>
  )
}