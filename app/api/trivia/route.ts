import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { join } from 'path'
import { existsSync } from 'fs'
import { QuestionType } from '@/lib/types/trivia'
import { TriviaQuestion } from '@/lib/types/trivia'

interface TriviaGameResponse {
  error?: string
  topic?: string
  categories?: Array<{
    name: string
    description: string
    subcategories: string[]
  }>
  questions?: Array<{
    id: string
    type: string
    question: string
    correctAnswer: string | boolean
    explanation: string
    options?: Array<{ id: string, text: string }>
    acceptableAnswers?: string[]
  }>
  total_questions?: number
  difficulty_distribution?: Record<string, number>
}

// Helper function to find Python executable
function findPythonExecutable() {
  const possiblePaths = ['python3', 'python', '/usr/bin/python3', '/usr/local/bin/python3']
  for (const path of possiblePaths) {
    try {
      const result = spawn(path, ['--version'])
      if (result.pid) {
        return path
      }
    } catch (e) {
      continue
    }
  }
  throw new Error('Python executable not found')
}

// Helper function to format questions from Python output
function formatQuestions(questions: any[]): TriviaQuestion[] {
  return questions.map(q => ({
    id: q.id,
    type: q.type as QuestionType,
    question: q.question,
    correctAnswer: q.type === 'true-false' ? Boolean(q.correctAnswer) : String(q.correctAnswer),
    explanation: q.explanation,
    options: q.type === 'multiple-choice' ? q.options : undefined,
    acceptableAnswers: q.type === 'text-input' ? q.acceptableAnswers : undefined
  }))
}

// Helper function to run Python script with better error handling
async function runPythonScript(topic: string, difficulty: string, numQuestions: number): Promise<TriviaGameResponse> {
  return new Promise((resolve, reject) => {
    const scriptPath = join(process.cwd(), '/ai/scripts', 'generate_trivia.py')
    console.log('Script path:', scriptPath)
    
    const pythonProcess = spawn('python3', [
      scriptPath,
      topic,
      difficulty,
      numQuestions.toString()
    ], {
      env: {
        ...process.env,
        PYTHONPATH: join(process.cwd(), 'ai'),
        PYTHONUNBUFFERED: '1',
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
        LANCEDB_URI: join(process.cwd(), 'data', 'lancedb'),
        PHI_LOGS_ENABLED: 'true',
      }
    })

    let result = ''
    let error = ''

    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString()
      console.log('Python stdout:', output)
      result += output
    })

    pythonProcess.stderr.on('data', (data) => {
      const output = data.toString()
      console.error('Python stderr:', output)
      error += output
    })

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process failed:', { code, error, result })
        reject(new Error(`Python process failed with code ${code}: ${error}`))
        return
      }

      try {
        // Find the last valid JSON object in the output
        const jsonMatch = result.match(/\{[\s\S]*\}/g)?.pop()
        if (!jsonMatch) {
          reject(new Error('No valid JSON found in Python output'))
          return
        }

        const data = JSON.parse(jsonMatch)
        if (!data.game) {
          reject(new Error('Invalid game data structure'))
          return
        }

        // Format the game data to match frontend expectations
        const gameData: TriviaGameResponse = {
          topic: data.game.topic,
          categories: data.game.categories,
          questions: formatQuestions(data.game.questions),
          total_questions: data.game.total_questions,
          difficulty_distribution: data.game.difficulty_distribution
        }

        resolve(gameData)
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${e}\nOutput was: ${result}`))
      }
    })

    pythonProcess.on('error', (err) => {
      console.error('Python process spawn error:', err)
      reject(new Error(`Failed to start Python process: ${err.message}`))
    })
  })
}

export async function POST(req: Request) {
  try {
    const { topic, difficulty = 'medium', numQuestions = 5 } = await req.json()
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Validate inputs
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      )
    }

    if (numQuestions < 1 || numQuestions > 20) {
      return NextResponse.json(
        { error: 'Number of questions must be between 1 and 20' },
        { status: 400 }
      )
    }

    console.log('Generating trivia game for:', { topic, difficulty, numQuestions })
    const gameData = await runPythonScript(topic, difficulty, numQuestions)

    // Validate the game data before sending to frontend
    if (!gameData.questions || gameData.questions.length === 0) {
      throw new Error('No questions generated')
    }

    return NextResponse.json(gameData)
  } catch (error) {
    console.error('Error generating trivia game:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate trivia game' },
      { status: 500 }
    )
  }
} 