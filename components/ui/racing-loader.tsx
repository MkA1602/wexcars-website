"use client"

import React from 'react'

interface RacingLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  text?: string
  className?: string
}

export default function RacingLoader({ 
  size = 'md', 
  showText = true, 
  text = 'Loading...', 
  className = '' 
}: RacingLoaderProps) {
  const sizeClasses = {
    sm: 'w-48 h-16',
    md: 'w-64 h-20',
    lg: 'w-80 h-24'
  }

  const carSizes = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
    lg: 'w-12 h-6'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Racing Track */}
      <div className={`relative bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        {/* Track lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-0.5 bg-white/50 relative">
            <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
          </div>
        </div>
        
        {/* Progress fill */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light/20 to-primary-dark/20 rounded-full animate-pulse"></div>
        
        {/* Racing Car */}
        <div className={`absolute top-1/2 transform -translate-y-1/2 ${carSizes[size]} racing-car`}>
          <svg
            viewBox="0 0 100 50"
            className="w-full h-full text-primary-light drop-shadow-lg"
            fill="currentColor"
          >
            {/* Car body */}
            <path d="M10 30 L15 20 L25 18 L65 18 L75 20 L85 25 L90 30 L85 35 L10 35 Z" className="fill-current" />
            
            {/* Car windows */}
            <path d="M20 25 L25 20 L60 20 L65 25 L60 30 L25 30 Z" className="fill-white/80" />
            
            {/* Wheels */}
            <circle cx="25" cy="35" r="6" className="fill-gray-800" />
            <circle cx="75" cy="35" r="6" className="fill-gray-800" />
            <circle cx="25" cy="35" r="3" className="fill-gray-400" />
            <circle cx="75" cy="35" r="3" className="fill-gray-400" />
            
            {/* Front bumper highlight */}
            <path d="M85 25 L88 27 L88 33 L85 35" className="fill-white/60" />
            
            {/* Racing stripes */}
            <rect x="30" y="22" width="2" height="6" className="fill-white/70" />
            <rect x="35" y="22" width="2" height="6" className="fill-white/70" />
            <rect x="40" y="22" width="2" height="6" className="fill-white/70" />
          </svg>
        </div>
        
        {/* Speed lines behind car */}
        <div className="speed-lines">
          <div className="absolute top-1/2 transform -translate-y-1/2 left-0 w-full h-px">
            <div className="speed-line-1"></div>
            <div className="speed-line-2"></div>
            <div className="speed-line-3"></div>
          </div>
        </div>
      </div>
      
      {/* Loading text */}
      {showText && (
        <div className="text-center">
          <p className="text-gray-600 font-medium animate-pulse">{text}</p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .racing-car {
          animation: racing 2s ease-in-out infinite;
        }
        
        .speed-lines div {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(66, 165, 245, 0.6), transparent);
          border-radius: 1px;
        }
        
        .speed-line-1 {
          width: 20px;
          top: -3px;
          animation: speedLine 1.5s linear infinite;
        }
        
        .speed-line-2 {
          width: 15px;
          top: 0px;
          animation: speedLine 1.2s linear infinite;
          animation-delay: 0.3s;
        }
        
        .speed-line-3 {
          width: 10px;
          top: 3px;
          animation: speedLine 1.8s linear infinite;
          animation-delay: 0.6s;
        }
        
        @keyframes racing {
          0% { left: -10%; }
          50% { left: 50%; transform: translateY(-50%) scale(1.1); }
          100% { left: 110%; }
        }
        
        @keyframes speedLine {
          0% { 
            left: -10%; 
            opacity: 0; 
            transform: translateX(0);
          }
          20% { 
            opacity: 1; 
          }
          80% { 
            opacity: 1; 
          }
          100% { 
            left: 110%; 
            opacity: 0; 
            transform: translateX(-50px);
          }
        }
        
        @media (max-width: 640px) {
          .racing-car {
            animation-duration: 1.5s;
          }
        }
      `}</style>
    </div>
  )
}
