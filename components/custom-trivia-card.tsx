import { Upload, ArrowRight, ScanHeart  } from 'lucide-react'
import { motion } from 'framer-motion'
import ShinyButton from './ui/shiny-button'
import { useState, useCallback } from 'react'
import { useToast } from "@/hooks/use-toast"


interface CustomTriviaCardProps {
  topic: string
  onTopicChange: (value: string) => void
  onStart: () => void
  onFileUpload?: (file: File) => Promise<void>
}

export default function CustomTriviaCard({ topic, onTopicChange, onStart, onFileUpload }: CustomTriviaCardProps) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    await processFiles(files)
  }

  const processFiles = async (files: File[]) => {
    const validTypes = ['application/pdf', 'text/plain', 'application/msword', 
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF, DOC, or TXT files only",
          variant: "destructive"
        })
        return
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive"
        })
        return
      }

      try {
        await onFileUpload?.(file)
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been processed`,
        })
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "There was an error processing your file",
          variant: "destructive"
        })
      }
    }
  }

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

            <div
              onClick={() => document.getElementById('file-upload')?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed ${
                isDragging ? 'border-indigo-500' : 'border-indigo-300/20'
              } rounded-lg p-8 text-center backdrop-blur-sm hover:border-indigo-500/30 transition-colors relative cursor-pointer`}
            >
              <input
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
                accept="*/*"
                className="hidden"
                multiple
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
              <p className="text-gray-800 dark:text-white/90 mb-1 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500 dark:text-white/50">
                Any file type supported
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