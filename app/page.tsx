'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Dice1Icon as Dice, BookOpen } from 'lucide-react'
import QuestionCardex from '../components/question-card'
import RetroGrid from '../components/ui/retro-grid'
import ShinyButton from '../components/ui/shiny-button'
import CustomTriviaCard from '../components/custom-trivia-card'
import TriviaGame from '../components/questionCard/pages/Index'
import SnakesAndLadders from '../components/SnakesAndLadders'
import { useLoading } from '@/components/ui/LoadingContext'
import { useTheme } from '@/components/ui/ThemeContext'
import Switch from '@/components/ui/LightandDark'
import { ThemeProvider } from '@/components/ui/ThemeContext'

type GameMode = 'none' | 'classic' | 'ai' | 'snakes'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [gameMode, setGameMode] = useState<GameMode>('none')
  const { setIsLoading } = useLoading()
  const { isDarkMode, toggleTheme } = useTheme()

  // Handle initial page load
  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
      } finally {
        setIsLoading(false)
      }
    }

    initializePage()
  }, [setIsLoading])

  const handleExitGame = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      setGameMode('none')
    } finally {
      setIsLoading(false)
    }
  }

  if (gameMode === 'classic' || gameMode === 'ai') {
    return <TriviaGame onExit={handleExitGame} mode={gameMode} />
  }

  if (gameMode === 'snakes') {
    return <SnakesAndLadders onExit={handleExitGame} />
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen relative">
        {/* Background layers */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300" />
          <RetroGrid className="absolute inset-0" />
        </div>
        
        {/* Main content */}
        <div className="relative z-20 container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-orbitron text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4 transition-colors duration-300">
              BrainWave Trivia
            </h1>
            <p className="font-exo2 text-2xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto transition-colors duration-300">
              Challenge Your Mind, Expand Your Knowledge
            </p>
          </motion.div>

          {/* Game Mode Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative z-30"
            >
              <ShinyButton
                onClick={() => setGameMode('classic')}
                className="w-full h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 dark:from-indigo-600/20 dark:to-purple-600/20 dark:border-indigo-400/30 transition-colors duration-300"
              >
                <div className="flex flex-col items-center">
                  <BookOpen className="w-8 h-8 text-indigo-500 dark:text-indigo-400 transition-colors duration-300" />
                  <span className="font-orbitron text-lg text-gray-800 dark:text-gray-200 transition-colors duration-300">Classic Mode</span>
                </div>
              </ShinyButton>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-30"
            >
              <ShinyButton
                onClick={() => setGameMode('ai')}
                className="w-full h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 dark:from-emerald-600/20 dark:to-teal-600/20 dark:border-emerald-400/30 transition-colors duration-300"
              >
                <div className="flex flex-col items-center">
                  <Brain className="w-8 h-8 text-emerald-500 dark:text-emerald-400 transition-colors duration-300" />
                  <span className="font-orbitron text-lg text-gray-800 dark:text-gray-200 transition-colors duration-300">AI Mode</span>
                </div>
              </ShinyButton>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative z-30"
            >
              <ShinyButton
                onClick={() => setGameMode('snakes')}
                className="w-full h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 dark:from-purple-600/20 dark:to-pink-600/20 dark:border-purple-400/30 transition-colors duration-300"
              >
                <div className="flex flex-col items-center">
                  <Dice className="w-8 h-8 text-purple-500 dark:text-purple-400 transition-colors duration-300" />
                  <span className="font-orbitron text-lg text-gray-800 dark:text-gray-200 transition-colors duration-300">Snakes & Ladders</span>
                </div>
              </ShinyButton>
            </motion.div>
          </div>

          {/* Custom Trivia Section */}
          <CustomTriviaCard 
            topic={topic}
            onTopicChange={setTopic}
            onStart={() => setGameMode('ai')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuestionCardex
              question={{ text: "What year did the last world cup take place?" }}
              className="md:col-span-2"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-gray-900 dark:text-white transition-colors duration-300"
            >
              <h3 className="text-lg font-medium mb-2">Topic</h3>
              <p className="text-2xl font-bold">90s Music</p>
            </motion.div>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <div className="fixed top-4 right-4 z-50">
          <label className="cursor-pointer">
            <Switch checked={!isDarkMode} onChange={toggleTheme} />
          </label>
        </div>
      </div>
    </ThemeProvider>
  )
}