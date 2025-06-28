"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

interface AuthErrorHandlerProps {
  error?: string | null
  success?: string | null
  loading?: boolean
}

export default function AuthErrorHandler({ error, success, loading }: AuthErrorHandlerProps) {
  if (loading) {
    return (
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Processing your request...
        </AlertDescription>
      </Alert>
    )
  }

  if (error) {
    let userFriendlyMessage = error

    // Convert technical Supabase errors to user-friendly messages
    switch (error) {
      case "Invalid login credentials":
        userFriendlyMessage = "Invalid email or password. Please check your credentials and try again."
        break
      case "Email not confirmed":
        userFriendlyMessage = "Please check your email and click the confirmation link before signing in."
        break
      case "User already registered":
        userFriendlyMessage = "An account with this email already exists. Try signing in instead."
        break
      case "Password should be at least 6 characters":
        userFriendlyMessage = "Password must be at least 6 characters long."
        break
      case "Unable to validate email address: invalid format":
        userFriendlyMessage = "Please enter a valid email address."
        break
      case "Signup is disabled":
        userFriendlyMessage = "New account registration is currently disabled. Please contact support."
        break
      case "Only an email address or phone number should be provided on signup":
        userFriendlyMessage = "Please provide only an email address for registration."
        break
      case "auth_callback_error":
        userFriendlyMessage = "Authentication callback failed. Please try signing in again."
        break
      default:
        if (error.includes("fetch")) {
          userFriendlyMessage = "Network error. Please check your internet connection and try again."
        } else if (error.includes("timeout")) {
          userFriendlyMessage = "Request timed out. Please try again."
        }
        break
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{userFriendlyMessage}</AlertDescription>
      </Alert>
    )
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">{success}</AlertDescription>
      </Alert>
    )
  }

  return null
}

// Helper function to get user-friendly error messages
export function getAuthErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    "Invalid login credentials": "Email atau password salah. Periksa kembali dan coba lagi. / Incorrect email or password. Please check and try again.",
    "Email not confirmed": "Silakan periksa email Anda dan klik tautan konfirmasi sebelum masuk. / Please check your email and click the confirmation link before signing in.",
    "User already registered": "Akun dengan email ini sudah ada. Coba masuk sebagai gantinya. / An account with this email already exists. Try signing in instead.",
    "Password should be at least 6 characters": "Password harus minimal 6 karakter. / Password must be at least 6 characters long.",
    "Unable to validate email address: invalid format": "Silakan masukkan alamat email yang valid. / Please enter a valid email address.",
    "Signup is disabled": "Pendaftaran akun baru saat ini dinonaktifkan. Silakan hubungi dukungan. / New account registration is currently disabled. Please contact support.",
    "auth_callback_error": "Callback autentikasi gagal. Silakan coba masuk lagi. / Authentication callback failed. Please try signing in again.",
  }

  return errorMessages[error] || error
} 