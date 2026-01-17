/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization
    return html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }
  
  // Client-side: use DOMPurify if available, otherwise basic sanitization
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Sanitize user input for display
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Validate and sanitize redirect URL to prevent open redirects
 */
export function validateRedirectUrl(url: string | null, allowedDomains: string[] = []): string {
  if (!url) return '/dashboard'
  
  // Remove any protocol
  const cleanUrl = url.replace(/^https?:\/\//i, '')
  
  // Check if it's a relative path (starts with /)
  if (url.startsWith('/')) {
    // Validate it's not trying to redirect to external sites
    if (url.startsWith('//')) {
      return '/dashboard' // Block protocol-relative URLs
    }
    
    // Block dangerous paths
    const dangerousPaths = ['javascript:', 'data:', 'vbscript:', 'file:']
    if (dangerousPaths.some(path => url.toLowerCase().includes(path))) {
      return '/dashboard'
    }
    
    // Ensure it's a valid internal path
    if (/^\/[a-zA-Z0-9\/\-_?=&]*$/.test(url)) {
      return url
    }
    
    return '/dashboard'
  }
  
  // For absolute URLs, check against allowed domains
  if (allowedDomains.length > 0) {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${cleanUrl}`)
    if (allowedDomains.includes(urlObj.hostname)) {
      return url
    }
  }
  
  // Default to dashboard for any external or invalid URLs
  return '/dashboard'
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate file type for uploads
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1))
    }
    return file.type === type
  })
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/^\./, '_')
    .substring(0, 255)
}

/**
 * Generate CSRF token (for forms that need it)
 */
export function generateCSRFToken(): string {
  if (typeof window === 'undefined') {
    // Server-side: use crypto
    const crypto = require('crypto')
    return crypto.randomBytes(32).toString('hex')
  }
  
  // Client-side: use crypto API
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false
  return token === storedToken
}

/**
 * Rate limiting helper (client-side check)
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  if (typeof window === 'undefined') return true
  
  const storageKey = `rate_limit_${key}`
  const now = Date.now()
  const stored = localStorage.getItem(storageKey)
  
  if (!stored) {
    localStorage.setItem(storageKey, JSON.stringify({
      count: 1,
      resetAt: now + windowMs
    }))
    return true
  }
  
  const data = JSON.parse(stored)
  
  if (now > data.resetAt) {
    localStorage.setItem(storageKey, JSON.stringify({
      count: 1,
      resetAt: now + windowMs
    }))
    return true
  }
  
  if (data.count >= maxRequests) {
    return false
  }
  
  data.count++
  localStorage.setItem(storageKey, JSON.stringify(data))
  return true
}
