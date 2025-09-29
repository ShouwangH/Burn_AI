import { Form } from "react-router"
import { authClient } from "~/src/lib/auth-client"


export default function SignInG() {
    const signIn = async () => {
        const data = await authClient.signIn.social({
            provider: 'google'
        })
    }

    return (
        <div className="">
            <button className="flex justify-self-center rounded-lg w-3/4 p-3 border-2 m-4 place-content-center"
            onClick={signIn}><img src='./public/Google__G__logo.svg'/>Sign in with Google</button>
                
        </div>
    )
}