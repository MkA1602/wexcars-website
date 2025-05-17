import type { Metadata } from "next"
import SignUpClientPage from "./SignUpClientPage"

export const metadata: Metadata = {
  title: "Sign Up | AutoWex",
  description: "Create an account with AutoWex to save your favorite vehicles, receive updates, and more.",
}

export default function SignUpPage() {
  return <SignUpClientPage />
}
