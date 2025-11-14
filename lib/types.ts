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
  video_url?: string | null // Primary video URL (optional)
  videos?: string | null // JSON string of additional video URLs
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
  seller_type?: string // 'individual' or 'dealership'
  dealership_name?: string | null // Name of dealership if seller_type is 'dealership'
  created_at?: string
  updated_at?: string
  // New fields added to database
  mileage?: number | null
  fuel_type?: string | null
  horsepower?: number | null
  gearbox?: string | null
  car_type?: string | null
  engine_size?: string | null
  drivetrain?: string | null
  availability?: string | null
  availability_days?: number | null
  availability_date?: string | null
  chassis_number?: string | null // Chassis number (VIN) of the car
  location?: string | null // Country location of the car
  seats?: string | null // Number of seats (1-7)
  certificate_of_conformity?: string | null // Certificate of Conformity (Yes/No)
  service_book?: string | null // Service book availability (Yes/No)
  ref_no?: string | null // Reference number
  emission_class?: string | null // Emission class (Euro 1-6)
  first_registration?: string | null // First registration date of the car
  crash_history?: string | null // Crash/accident history of the car
  is_sold?: boolean // Indicates if the car has been sold
  sold_at?: string | null // Timestamp when the car was marked as sold
  // New pricing and admin features
  is_netto_price?: boolean // If true, price is netto (excluding VAT) and no service fee calculation needed
  is_new_car?: boolean // If true, car is new (no mileage required)
  admin_fee_waived?: boolean // If true, admin has waived the service fee requirement
  fee_paid?: boolean // If true, service fee has been paid
  service_fee_amount?: number // Amount of service fee charged
  service_fee_currency?: string // Currency of service fee
  fee_model?: string // Fee model used for calculation
  is_published?: boolean // If true, car ad is published and visible to public
  published_at?: string | null // Timestamp when car was published
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
