'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'

type GameModeButtonProps = {
  icon: LucideIcon
  title: string
  onClick: () => void
  className?: string
}

export default function GameModeButton({ icon: Icon, title, onClick, className }: GameModeButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full p-6 rounded-xl border border-gray-200 dark:border-gray-700",
        "bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
        "shadow-lg hover:shadow-xl transition-all",
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      <Icon className="w-12 h-12 text-teal-500" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
    </motion.button>
  )
}

