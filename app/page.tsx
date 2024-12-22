'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Brain, Gamepad, Upload, Dice1Icon as Dice, ArrowRight } from 'lucide-react'
//import AnimatedBackground from '../components/animated-background'
import { QuestionCard } from '../components/questionCard/QuestionCard'
import QuestionCardex from '../components/question-card'
import GameModeButton from '../components/game-mode-button'
import RetroGrid from '../components/ui/retro-grid'
import ShinyButton from '../components/ui/shiny-button'
import CustomTriviaCard from '../components/custom-trivia-card'
import { Question } from '../components/types/questions'
import TriviaGame from '../components/questionCard/pages/Index'
import SnakesAndLadders from '../components/SnakesAndLadders'
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button'
import { useLoading } from '@/components/ui/LoadingContext'
import { useTheme } from '@/components/ui/ThemeContext'
import Switch from '@/components/ui/LightandDark';
import { ThemeProvider } from '@/components/ui/ThemeContext'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameMode, setGameMode] = useState<'classic' | 'snakes' | null>(null);
  const { setIsLoading } = useLoading();
  const { isDarkMode, toggleTheme } = useTheme();

  // Handle initial page load
  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true);
      try {
        // Simulate loading resources
        await new Promise(resolve => setTimeout(resolve, 1000));
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [setIsLoading]);

  const handleStartGame = async () => {
    if (selectedMode) {
      setIsLoading(true);
      try {
        // Map selected mode to game mode
        const mode = selectedMode === 'classic' ? 'classic' : 
                    selectedMode === 'snakes' ? 'snakes' : null;
        
        if (mode) {
          console.log(`Starting ${mode} game mode`);
          // Load game resources
          await new Promise(resolve => setTimeout(resolve, 1500));
          setGameMode(mode);
          setGameStarted(true);
          setSelectedMode(null); // Close the modal
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExitGame = async () => {
    setIsLoading(true);
    try {
      // Cleanup and transition animation
      await new Promise(resolve => setTimeout(resolve, 800));
      setGameMode(null);
      setGameStarted(false);
      setSelectedMode(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderGameMode = () => {
    switch (gameMode) {
      case 'classic':
        return <TriviaGame onExit={handleExitGame} />;
      case 'snakes':
        return <SnakesAndLadders onExit={handleExitGame} />;
      default:
        return (
          <div className="min-h-screen relative">
            {/* Background layers */}
            <div className="fixed inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300" />
              <RetroGrid className="absolute inset-0" />
              {/*<AnimatedBackground />*/}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative z-30"
                >
                  <ShinyButton
                    onClick={() => setSelectedMode('classic')}
                    className="w-full h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 dark:from-indigo-600/20 dark:to-purple-600/20 dark:border-indigo-400/30 transition-colors duration-300"
                  >
                    <div className="flex flex-col items-center">
                      <Brain className="w-8 h-8 text-indigo-500 dark:text-indigo-400 transition-colors duration-300" />
                      <span className="font-orbitron text-lg text-gray-800 dark:text-gray-200 transition-colors duration-300">Classic Mode</span>
                    </div>
                  </ShinyButton>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative z-30"
                >
                  <ShinyButton
                    onClick={() => setSelectedMode('snakes')}
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
                onStart={() => setSelectedMode('custom')}
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
      
            <AnimatePresence>
              {selectedMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => setSelectedMode(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 text-gray-900 dark:text-white transition-colors duration-300"
                    onClick={e => e.stopPropagation()}
                  >
                    <h2 className="text-2xl font-bold mb-4">
                      {selectedMode === 'classic' ? 'Classic Mode' : 
                       selectedMode === 'snakes' ? 'Snakes & Ladders' : 
                       'Create Custom Trivia'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
                      Get ready for an AI-powered trivia experience!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg p-4 font-medium transition-all duration-300"
                      onClick={handleStartGame}
                    >
                      Start Game
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Toggle Switch */}
            <div className="fixed top-4 right-4 z-50">
              <label className="cursor-pointer">
                <Switch checked={!isDarkMode} onChange={toggleTheme} />
              </label>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      {renderGameMode()}
    </ThemeProvider>
  );
}