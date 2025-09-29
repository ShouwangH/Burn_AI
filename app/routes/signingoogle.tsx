import { authClient } from "~/src/lib/auth-client"

export default function SignInG() {
    const signIn = async () =>{
    const data = await authClient.signIn.social({
            provider: 'google'
        })
    }
}