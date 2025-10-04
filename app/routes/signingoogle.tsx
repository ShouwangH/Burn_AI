import { Form, redirect } from "react-router"
import { authClient } from "~/src/lib/auth-client"
import { useNavigate } from "react-router"


export default function SignInG() {
  const navigate = useNavigate()
    const signIn = async (e) => {
        e.preventDefault()
        const data = await authClient.signIn.social({
            provider: 'google'
        },      {
        onRequest: (ctx) => {
          // show loading state
        },
        onSuccess: (ctx) => {
          navigate("/burns")
        },
        onError: (ctx) => {
          alert(ctx.error)
        },
      }
    )
    }

    return (
        <div className="">
            <button className="flex justify-self-center rounded-lg max-w-full p-3 border-2 m-4 place-content-center"
            onClick={signIn}><img className="pr-2"src='./public/Google__G__logo.svg'/> Sign in with Google</button>
                
        </div>
    )
}