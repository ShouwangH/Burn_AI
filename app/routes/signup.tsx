import { Form } from "react-router"
import { useState } from "react"
import { authClient } from "../src/lib/auth-client"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const signUp = async () => {
    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: (ctx) => {
          // show loading state
        },
        onSuccess: (ctx) => {
          // redirect to home
        },
        onError: (ctx) => {
          alert(ctx.error)
        },
      },
    )
  }

  return (
    <div>
      <Form

        onSubmit={signUp}
      >
        <div className="flex flex-col p-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border-1 p-1 m-4 text-white"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border-1  p-1 m-4 text-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-1 p-1 m-4 text-white"
        />
        <button
          type="submit"
          className="flex rounded-lg justify-self-center w-3/4 p-3 border-2 m-4 place-content-center"
        >
          Sign Up
        </button>
        </div>
      </Form>
    </div>
  )
}