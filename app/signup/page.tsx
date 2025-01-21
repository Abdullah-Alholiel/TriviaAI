"use client"
import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"
import axios from "axios"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // Send credentials to server route for user creation
    await axios.post("/api/auth/signup", { email, username, password })
    // Then auto sign in
    await signIn("credentials", { email, password, callbackUrl: "/" })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-80 p-4 rounded shadow bg-white">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border p-2 mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-2 mb-4"
        />
        <button className="bg-indigo-500 hover:bg-indigo-600 w-full py-2 text-white">Sign Up</button>
      </form>
    </div>
  )
}