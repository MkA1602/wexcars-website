// Auth utility functions

interface SignUpData {
  name: string
  email: string
  phone: string
  password: string
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAuthenticated') === 'true'
}

export const login = (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true')
      resolve(true)
    }, 1000)
  })
}

export const signup = (data: SignUpData): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      // Store user data
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userName', data.name)
      localStorage.setItem('userEmail', data.email)
      localStorage.setItem('userPhone', data.phone)
      resolve(true)
    }, 1000)
  })
}

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userPhone')
}

export const checkAuthStatus = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }
    
    const status = localStorage.getItem('isAuthenticated') === 'true'
    resolve(status)
  })
}

export const getUserData = () => {
  if (typeof window === 'undefined') return null
  
  return {
    name: localStorage.getItem('userName'),
    email: localStorage.getItem('userEmail'),
    phone: localStorage.getItem('userPhone')
  }
} 