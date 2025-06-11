import type { Metadata } from "next"
import ClientWrapper from "@/components/client-wrapper"
import { DynamicResetPasswordForm } from "@/components/auth/dynamic-auth-components"

export const metadata: Metadata = {
  title: "Reset Password | WexCars",
  description: "Set a new password for your WexCars account",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">Create a new password for your account</p>
        </div>
        <ClientWrapper>
          <DynamicResetPasswordForm />
        </ClientWrapper>
      </div>
    </div>
  )
}
