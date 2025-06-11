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
  currency?: string // Currency code (USD, EUR, etc.)
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
