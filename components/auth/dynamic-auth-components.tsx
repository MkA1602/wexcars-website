"use client"

import dynamic from "next/dynamic"

// Dynamically import auth components with client-side only rendering and ssr: false to prevent chunk load errors
export const DynamicLoginForm = dynamic(() => import("@/components/auth/login-form"), {
  loading: () => (
    <div className="w-full p-8 bg-white rounded-lg shadow-md animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-6"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  ),
  ssr: false,
})

export const DynamicRegisterForm = dynamic(() => import("@/components/auth/register-form"), {
  loading: () => (
    <div className="w-full p-8 bg-white rounded-lg shadow-md animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-3"></div>
      <div className="h-10 bg-gray-200 rounded mb-3"></div>
      <div className="h-10 bg-gray-200 rounded mb-6"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  ),
  ssr: false,
})

export const DynamicForgotPasswordForm = dynamic(() => import("@/components/auth/forgot-password-form"), {
  loading: () => (
    <div className="w-full p-8 bg-white rounded-lg shadow-md animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-6"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  ),
  ssr: false,
})

export const DynamicResetPasswordForm = dynamic(() => import("@/components/auth/reset-password-form"), {
  loading: () => (
    <div className="w-full p-8 bg-white rounded-lg shadow-md animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded mb-3"></div>
      <div className="h-10 bg-gray-200 rounded mb-6"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  ),
  ssr: false,
})
