import type { Metadata } from "next"
import ClientWrapper from "@/components/client-wrapper"
import { DynamicForgotPasswordForm } from "@/components/auth/dynamic-auth-components"

export const metadata: Metadata = {
  title: "Forgot Password | WexCars",
  description: "Reset your WexCars account password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <ClientWrapper>
          <DynamicForgotPasswordForm />
        </ClientWrapper>
      </div>
    </div>
  )
}
