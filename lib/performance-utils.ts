// Performance utilities for optimizing data fetching and rendering

import { Car } from './types'

// Cache for car data to avoid repeated fetching
const carCache = new Map<string, { data: Car[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

// Lightweight car interface for initial load (only essential fields)
export interface LightweightCar {
  id: string
  name: string
  brand: string
  category: string
  year: number
  price: number
  currency: string
  image: string
  created_at: string
  location?: string | null
  status?: 'available' | 'sold' | 'reserved' | null
  mileage?: number | null
  fuel_type?: string | null
}

// Fast transformer for lightweight car data
export const transformToLightweightCar = (dbCar: any): LightweightCar => ({
  id: dbCar.id,
  name: dbCar.name,
  brand: dbCar.brand,
  category: dbCar.category,
  year: dbCar.year,
  price: dbCar.price,
  currency: dbCar.currency || 'AED',
  image: dbCar.image,
  created_at: dbCar.created_at,
  location: dbCar.location,
  status: dbCar.status,
  mileage: dbCar.mileage,
  fuel_type: dbCar.fuel_type
})

// Optimized transformer - only transform what's needed for display
export const transformToFullCar = (dbCar: any): Car => ({
  id: dbCar.id,
  name: dbCar.name,
  brand: dbCar.brand,
  category: dbCar.category,
  year: dbCar.year,
  price: dbCar.price,
  price_excl_vat: dbCar.price_excl_vat,
  vat_rate: dbCar.vat_rate,
  vat_amount: dbCar.vat_amount,
  currency: dbCar.currency || 'AED',
  priceWithVat: dbCar.price,
  image: dbCar.image,
  images: dbCar.images,
  rating: 4.5, // Default since not used in listing
  transmission: dbCar.transmission || 'Automatic',
  color: dbCar.color || 'Black',
  featured: false, // Default since calculated separately
  description: dbCar.description,
  features: dbCar.features,
  specifications: {
    engine: 'Not specified',
    power: 'Not specified',
    acceleration: 'Not specified',
    topSpeed: 'Not specified',
    transmission: dbCar.transmission || 'Automatic',
    drivetrain: 'Not specified',
    fuelEconomy: 'Not specified',
    seating: 'Not specified'
  },
  user_id: dbCar.user_id,
  seller_type: dbCar.seller_type || 'individual',
  dealership_name: dbCar.dealership_name,
  created_at: dbCar.created_at,
  updated_at: dbCar.updated_at,
  mileage: dbCar.mileage,
  fuel_type: dbCar.fuel_type,
  horsepower: dbCar.horsepower,
  gearbox: dbCar.gearbox,
  car_type: dbCar.car_type,
  engine_size: dbCar.engine_size,
  drivetrain: dbCar.drivetrain,
  availability: dbCar.availability,
  availability_days: dbCar.availability_days,
  availability_date: dbCar.availability_date,
  chassis_number: dbCar.chassis_number,
  location: dbCar.location,
  status: dbCar.status
})

// Cache management
export const getCachedCars = (cacheKey: string): Car[] | null => {
  const cached = carCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

export const setCachedCars = (cacheKey: string, data: Car[]): void => {
  carCache.set(cacheKey, { data, timestamp: Date.now() })
}

export const clearCarCache = (): void => {
  carCache.clear()
}

// Batch processing for large datasets
export const batchProcess = <T, R>(
  items: T[],
  processor: (item: T) => R,
  batchSize: number = 10
): R[] => {
  const results: R[] = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    results.push(...batch.map(processor))
  }
  return results
}

// Debounced function for search/filter operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
