import { authClient } from "~/src/lib/auth-client";
import SignIn from "./signin";
import SignUp from "./signup";
import SignInG from "./signingoogle";
import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { data, isPending, error } = authClient.useSession()
  const logOut = async () => { await authClient.signOut() }
  const [issignin, setissignin] = useState(true)
  const navigate = useNavigate()
  
  
  useEffect(()=>{if (!isPending && data) {
   navigate("/burns")}}
   ,[data])

    return <div className="w-full h-screen flex flex-col justify-evenly items-center text-amber-50 bg-black">
      <div className="text-6xl text-gray-300 font-mono ">
        Documentary Now!
      </div>
      <p className="text-gray-400 text-3xl font-mono">AI generated, human centered</p>
      {(issignin) ?
          <><div className="border-2 rounded-xl">
          <SignIn />
          <SignInG />
          <div className="flex justify-self-center w-3/4 m-4 place-content-center" onClick={() => setissignin(false)}>No login. Sign up</div>
        </div>
        </>:
          <div className='border-2 rounded-xl'>
            <SignUp />
            <div className="flex justify-self-center w-3/4 m-4 place-content-center" onClick={() => setissignin(true)}>Already have a login. Sign in.</div>
          </div> }
        </div>
  
}