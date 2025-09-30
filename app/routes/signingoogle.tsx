import { Form, redirect } from "react-router"
import { authClient } from "~/src/lib/auth-client"


export default function SignInG() {
    const signIn = async () => {
        const data = await authClient.signIn.social({
            provider: 'google'
        },      {
        onRequest: (ctx) => {
          // show loading state
        },
        onSuccess: (ctx) => {
          redirect("chat")
        },
        onError: (ctx) => {
          alert(ctx.error)
        },
      }
    )
    }

    return (
        <div className="">
            <button className="flex justify-self-center rounded-lg w-3/4 p-3 border-2 m-4 place-content-center"
            onClick={signIn}><img src='./public/Google__G__logo.svg'/>Sign in with Google</button>
                
        </div>
    )
}