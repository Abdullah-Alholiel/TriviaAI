'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Trophy, Gamepad, Star, Book, Music, Film } from 'lucide-react'

const iconComponents = [Brain, Trophy, Gamepad, Star, Book, Music, Film]

type FloatingIconProps = {
  icon: typeof iconComponents[number]
  size: number
  duration: number
  delay: number
  initialX: number
  initialY: number
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon: Icon, size, duration, delay, initialX, initialY }) => {
  const [isVisible, setIsVisible] = useState(true)
  const iconRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={iconRef}
          initial={{ opacity: 0, x: initialX, y: initialY }}
          animate={{ opacity: 0.2, y: '-100%' }}  // Reduced opacity here
          exit={{ opacity: 0 }}
          transition={{ duration: duration / 1000, delay: delay / 1000, ease: 'linear' }}
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            zIndex: -1, // Ensure icons are behind other content
          }}
        >
          <Icon size={size} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function AnimatedBackground() {
  const [floatingIcons, setFloatingIcons] = useState<React.ReactNode[]>([])

  useEffect(() => {
    const createIcon = () => {
      const IconComponent = iconComponents[Math.floor(Math.random() * iconComponents.length)]
      const size = Math.random() * 24 + 16
      const duration = Math.random() * 5000 + 8000
      const delay = Math.random() * 2000
      const initialX = Math.random() * 100 + '%'
      const initialY = '100%' // Start from the bottom of the screen

      setFloatingIcons(prevIcons => [
        ...prevIcons,
        <FloatingIcon
          key={Date.now()}
          icon={IconComponent}
          size={size}
          duration={duration}
          delay={delay}
          initialX={Math.floor(Math.random() * window.innerWidth)}
          initialY={Math.floor(Math.random() * window.innerHeight)}
        />
      ])
    }

    // Create a grid pattern of icons
    const createGridPattern = () => {
      const gridSpacing = 100; // Adjust spacing as needed
      const numIconsPerRow = Math.ceil(window.innerWidth / gridSpacing);
      const numIconsPerCol = Math.ceil(window.innerHeight / gridSpacing);

      for (let row = 0; row < numIconsPerRow; row++) {
        for (let col = 0; col < numIconsPerCol; col++) {
          const IconComponent = iconComponents[Math.floor(Math.random() * iconComponents.length)]
          const size = Math.random() * 24 + 16
          const duration = Math.random() * 5000 + 8000
          const delay = Math.random() * 2000
          const initialX = `${row * gridSpacing + Math.random() * gridSpacing}px`
          const initialY = `${col * gridSpacing + Math.random() * gridSpacing}px`

          setFloatingIcons(prevIcons => [
            ...prevIcons,
            <FloatingIcon
              key={Date.now() + row + col}
              icon={IconComponent}
              size={size}
              duration={duration}
              delay={delay}
              initialX={Math.floor(Math.random() * window.innerWidth)}
          initialY={Math.floor(Math.random() * window.innerHeight)}
            />
          ])
        }
      }
    }

    // Initial grid pattern
    createGridPattern()

    // Interval to create new icons
    const intervalId = setInterval(createIcon, 2000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {floatingIcons}
    </div>
  )
}