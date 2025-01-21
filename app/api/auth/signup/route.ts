import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"

export async function POST(request: NextRequest) {
  const { email, username, password } = await request.json()
  const hashedPass = await hash(password, 10)
  // e.g. await createUser({ username, email, hashed_password: hashedPass })
  return NextResponse.json({ success: true })
}