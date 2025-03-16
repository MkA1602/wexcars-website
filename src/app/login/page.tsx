'use client'

import React, { useState } from 'react'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement login logic
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/porsche-background.jpg"
          alt="Porsche Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 animate-fade-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Login</h1>
            <p className="text-gray-200 mt-2">
              Please sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-gray-200/20 rounded-xl focus:outline-none focus:border-white/40 text-white placeholder-gray-300 transition-colors"
                  placeholder="Email address"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-white/10 border border-gray-200/20 rounded-xl focus:outline-none focus:border-white/40 text-white placeholder-gray-300 transition-colors"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary bg-white/10" />
                <span className="text-gray-200">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-gray-200 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign in</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-200">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-white hover:text-gray-200 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage 