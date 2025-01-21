import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  
  try {
    // Call your Python FastAPI endpoint
    const response = await fetch(`${process.env.BACKEND_URL}/users/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (!data || !data.user) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      role: data.user.role
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(null)
  }
}
