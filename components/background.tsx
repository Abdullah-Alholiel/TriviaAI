import RetroGrid from './ui/retro-grid'
import AnimatedBackground from './animated-background'

export default function Background() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950" />
      
      {/* Grid container with proper sizing */}
      <div className="absolute inset-0 w-full h-full">
        <RetroGrid className="opacity-30" />
      </div>
      
      {/* Animated shapes */}
      <div className="absolute inset-0">
        <AnimatedBackground />
      </div>
    </div>
  )
}


