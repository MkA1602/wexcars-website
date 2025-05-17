import type { Metadata } from "next"
import SignInClientPage from "./SignInClientPage"

export const metadata: Metadata = {
  title: "Sign In | AutoWex",
  description: "Sign in to your AutoWex account to access your dashboard, saved vehicles, and more.",
}

export default function SignInPage() {
  return <SignInClientPage />
}
