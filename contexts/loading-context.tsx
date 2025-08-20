"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface LoadingContextType {
  isLoading: boolean
  loadingText: string
  showLoading: (text?: string) => void
  hideLoading: () => void
  setLoadingText: (text: string) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Loading...')

  const showLoading = (text = 'Loading...') => {
    setLoadingText(text)
    setIsLoading(true)
  }

  const hideLoading = () => {
    setIsLoading(false)
  }

  const updateLoadingText = (text: string) => {
    setLoadingText(text)
  }

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        loadingText, 
        showLoading, 
        hideLoading, 
        setLoadingText: updateLoadingText 
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}
