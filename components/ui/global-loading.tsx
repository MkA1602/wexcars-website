"use client"

import { useLoading } from '@/contexts/loading-context'
import RacingLoader from './racing-loader'

export default function GlobalLoading() {
  const { isLoading, loadingText } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">WEXCars</h3>
        </div>

        {/* Racing Loader */}
        <div className="mb-6">
          <RacingLoader size="lg" showText={true} text={loadingText} />
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-primary-light to-primary-dark h-2 rounded-full loading-progress"></div>
        </div>

        {/* Subtitle */}
        <p className="text-center text-gray-500 text-sm">
          Please wait while we load your luxury cars...
        </p>
      </div>

      <style jsx>{`
        .loading-progress {
          animation: loadingProgress 2s ease-in-out infinite;
        }
        
        @keyframes loadingProgress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
