"use client"

import { Badge } from './badge'
import { cn } from '@/lib/utils'

interface CarStatusBadgeProps {
  status?: 'available' | 'sold' | 'reserved' | null
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CarStatusBadge({ status, className, size = 'sm' }: CarStatusBadgeProps) {
  if (!status || status === 'available') {
    return null // Don't show badge for available cars
  }

  const getStatusConfig = (status: 'sold' | 'reserved') => {
    switch (status) {
      case 'sold':
        return {
          label: 'SOLD',
          className: 'bg-red-600 text-white border-red-600 shadow-lg',
          icon: '✓'
        }
      case 'reserved':
        return {
          label: 'RESERVED',
          className: 'bg-yellow-500 text-white border-yellow-500 shadow-lg',
          icon: '⏳'
        }
      default:
        return {
          label: 'UNKNOWN',
          className: 'bg-gray-500 text-white border-gray-500',
          icon: '?'
        }
    }
  }

  const config = getStatusConfig(status)
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <Badge
      className={cn(
        'font-bold uppercase tracking-wide backdrop-blur-sm',
        'hover:scale-105 transition-transform duration-200',
        config.className,
        sizeClasses[size],
        className
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  )
}
