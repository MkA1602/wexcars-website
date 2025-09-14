import type { Metadata } from "next"
import Link from "next/link"
import ClientWrapper from "@/components/client-wrapper"
import { DynamicRegisterForm } from "@/components/auth/dynamic-auth-components"
import { SignUpPageWrapper } from "@/components/auth/sign-up-page-wrapper"

export const metadata: Metadata = {
  title: "Sign Up | WexCars",
  description: "Create a new WexCars account",
}

export default function SignUpPage() {
  return (
    <SignUpPageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create a new account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link href="/sign-in" className="font-medium text-primary-light hover:text-primary-dark">
                sign in to your existing account
              </Link>
            </p>
          </div>
          <ClientWrapper>
            <DynamicRegisterForm />
          </ClientWrapper>
        </div>
      </div>
    </SignUpPageWrapper>
  )
}
