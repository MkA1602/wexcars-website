"use client"

import { CheckCircle, Mail, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EmailConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <div className="text-center">
            {/* Email Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            
            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              تحقق من بريدك الإلكتروني
            </h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Check Your Email
            </h2>
            
            {/* Message */}
            <div className="space-y-4 text-gray-600">
              <p className="text-base">
                لقد أرسلنا رابط التفعيل إلى بريدك الإلكتروني
              </p>
              <p className="text-base">
                We've sent an activation link to your email address
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="mb-1">اضغط على الرابط في البريد لتفعيل حسابك</p>
                    <p>Click the link in the email to activate your account</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <div className="text-sm text-yellow-800">
                  <p className="mb-1">لم تستلم البريد؟ تحقق من مجلد الرسائل المهملة</p>
                  <p>Didn't receive the email? Check your spam folder</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>إعادة إرسال البريد / Resend Email</span>
              </Button>
              
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  العودة لتسجيل الدخول / Back to Login
                </Button>
              </Link>
            </div>
            
            {/* Help Text */}
            <div className="mt-6 text-sm text-gray-500">
              <p className="mb-1">تحتاج مساعدة؟</p>
              <p className="mb-2">Need help?</p>
              <Link href="/contact" className="text-blue-600 hover:text-blue-500">
                تواصل معنا / Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          WexCars - Premium Luxury Vehicle Platform
        </p>
      </div>
    </div>
  )
} 