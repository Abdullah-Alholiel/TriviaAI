import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { join } from 'path'

// Helper function to run Python script
async function runPythonScript(topic: string, difficulty: string, numQuestions: number) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      join(process.cwd(), 'scripts', 'generate_trivia.py'),
      topic,
      difficulty,
      numQuestions.toString()
    ])

    let result = ''
    let error = ''

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${error}`))
      } else {
        try {
          const gameData = JSON.parse(result)
          resolve(gameData)
        } catch (e) {
          reject(new Error(`Failed to parse Python output: ${e}`))
        }
      }
    })
  })
}

export async function POST(req: Request) {
  try {
    const { topic, difficulty = 'medium', numQuestions = 10 } = await req.json()
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const gameData = await runPythonScript(topic, difficulty, numQuestions)

    return NextResponse.json(gameData)
  } catch (error) {
    console.error('Error generating trivia game:', error)
    return NextResponse.json(
      { error: 'Failed to generate trivia game' },
      { status: 500 }
    )
  }
} 