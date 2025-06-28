export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export interface Car {
  id: string
  name: string
  brand: string
  category: string
  year: number
  price: number
  price_excl_vat?: number // Price excluding VAT
  vat_rate?: number // VAT rate percentage (e.g., 5.00 for 5%)
  vat_amount?: number // Calculated VAT amount
  currency?: string // Currency code (USD, EUR, AED, etc.)
  priceWithVat: number
  discountPrice?: number
  discountPriceWithVat?: number
  image: string
  images?: string // JSON string of additional images
  rating: number
  transmission: string
  color: string
  featured: boolean
  description: string
  features?: string // JSON string of car features array
  specifications: {
    engine: string
    power: string
    acceleration: string
    topSpeed: string
    transmission: string
    drivetrain: string
    fuelEconomy: string
    seating: string
  }
  // Database fields for Supabase integration
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface FilterOptions {
  brands: string[]
  categories: string[]
  priceRange: {
    min: number
    max: number
  }
  years: string[]
  colors: string[]
  gearboxes?: string[]
  fuels?: string[]
  mileageRange?: {
    min: number
    max: number
  }
  models?: string[]
}
