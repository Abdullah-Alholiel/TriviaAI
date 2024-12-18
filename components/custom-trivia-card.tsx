import { Upload, ArrowRight, ScanHeart  } from 'lucide-react'
import { motion } from 'framer-motion'
import ShinyButton from './ui/shiny-button'


interface CustomTriviaCardProps {
  topic: string
  onTopicChange: (value: string) => void
  onStart: () => void
}

export default function CustomTriviaCard({ topic, onTopicChange, onStart }: CustomTriviaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-30 mb-16"
    >
      <div className="w-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-xl backdrop-blur-sm">
        <div className="w-full p-8">
          <div className="flex flex-col items-center mb-6">
            <ScanHeart className="w-8 h-8 text-indigo-500 mb-2" />
            <h2 className="font-orbitron text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Create Custom Trivia
            </h2>
          </div>
          
          <div className="max-w-xl mx-auto space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter a topic (e.g., football, Egypt)"
                value={topic}
                onChange={(e) => onTopicChange(e.target.value)}
                className="w-full p-4 rounded-lg bg-white/5 border border-indigo-300/20 text-gray-800 dark:text-white/90 placeholder-gray-500 dark:placeholder-white/50 backdrop-blur-sm focus:border-indigo-500/30 transition-colors"
              />
            </div>

            <div className="border-2 border-dashed border-indigo-300/20 rounded-lg p-8 text-center backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
              <Upload className="w-12 h-12 mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
              <p className="text-gray-800 dark:text-white/90 mb-1 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500 dark:text-white/50">
                PDF, DOC, TXT (MAX. 10MB)
              </p>
            </div>

            <ShinyButton
              onClick={onStart}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2 py-2">
                <span className="font-medium">Start Trivia</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </ShinyButton>
          </div>
        </div>
      </div>
    </motion.div>
  )
}