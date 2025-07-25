import type { Metadata } from "next"
import ClientWrapper from "@/components/client-wrapper"
import { DynamicLoginForm } from "@/components/auth/dynamic-auth-components"

export const metadata: Metadata = {
  title: "Sign In | WexCars",
  description: "Sign in to your WexCars account",
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <a href="/sign-up" className="font-medium text-primary-light hover:text-primary-dark">
              create a new account
            </a>
          </p>
        </div>
        <ClientWrapper>
          <DynamicLoginForm />
        </ClientWrapper>
      </div>
    </div>
  )
}
