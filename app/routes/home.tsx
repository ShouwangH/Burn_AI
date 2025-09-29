import { authClient } from "~/src/lib/auth-client";
import SignIn from "./signin";
import SignUp from "./signup";
import SignInG from "./signingoogle";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { data, isPending, error } = authClient.useSession()
  const logOut  = async () =>{ await authClient.signOut()}
  const [issignin, setissignin] = useState(true)
  if (data) {
    return (<>
    <div>Hello, {data.user.email}!</div> 
    <button onClick={logOut}>Log out</button>
    </>
    )
  } else {
    return <div className="flex justify-evenly items-center">
      <div className="text-9xl  ">
        AAAAHHHH
      </div>
      <div className="">
      {(issignin) ? 
      <div>
      <SignIn />
      <SignInG />
      </div> :
      <div>
      <SignUp />
      </div> }
      <button></button>
    </div>
    </div>
  }
}