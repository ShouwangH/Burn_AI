import { authClient } from "~/src/lib/auth-client";
import SignIn from "./signin";
import SignUp from "./signup";
import SignInG from "./signingoogle";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { data, isPending, error } = authClient.useSession()
  if (data) {
    return <div>Hello, {data.user.email}!</div>
  } else {
    return <div>
      <SignIn />
      <SignInG />
      <SignUp />
    </div>
  }
}