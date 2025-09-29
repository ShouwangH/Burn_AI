import { Form } from "react-router"
import { useState } from "react"
import { authClient } from "../src/lib/auth-client"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
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
      <Form onSubmit={signIn}>
        <div className="flex flex-col p-2">
        <input
          className="border-1 p-1 m-4 text-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border-1 p-1 m-4 text-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="flex rounded-lg justify-self-center w-3/4 p-3 border-2 m-4 place-content-center"
          type="submit"
        >
          Sign In
        </button>
        </div>
      </Form>
  )
}