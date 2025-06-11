import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price with currency symbol
 * @param price - The price amount
 * @param currency - The currency code (USD, EUR, GBP, JPY, AED)
 * @returns Formatted price string with currency symbol
 */
export function formatCurrency(price: number | null | undefined, currency: string = "USD"): string {
  if (!price) return "Price on request"
  
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AED: "د.إ"
  }
  
  const symbol = currencySymbols[currency as keyof typeof currencySymbols] || "$"
  
  // For Japanese Yen, don't show decimal places as it's typically not used
  if (currency === "JPY") {
    return `${symbol}${Math.round(price).toLocaleString()}`
  }
  
  return `${symbol}${price.toLocaleString()}`
}

/**
 * Get currency symbol only
 * @param currency - The currency code (USD, EUR, GBP, JPY, AED)
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: string = "USD"): string {
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AED: "د.إ"
  }
  
  return currencySymbols[currency as keyof typeof currencySymbols] || "$"
}

export function safeLocalStorage() {
  const isClient = typeof window !== "undefined"

  const getItem = (key: string): string | null => {
    if (!isClient) return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error)
      return null
    }
  }

  const setItem = (key: string, value: string): boolean => {
    if (!isClient) return false
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error)
      return false
    }
  }

  const removeItem = (key: string): boolean => {
    if (!isClient) return false
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error)
      return false
    }
  }

  return { getItem, setItem, removeItem }
}
