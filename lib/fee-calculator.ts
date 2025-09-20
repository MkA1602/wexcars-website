export interface FeeCalculationInput {
  carPrice: number
  vatRate: number
  currency: string
  feeModel: FeeModel
}

export interface FeeCalculationResult {
  carPrice: number
  vatRate: number
  currency: string
  feeModel: FeeModel
  netFee: number
  vatOnFee: number
  totalCustomerPays: number
  businessKeeps: number
  feeModelDescription: string
}

export type FeeModel = 'vat_on_top' | 'higher_vat_included' | 'flat_minimum' | 'tiered'

export const FEE_MODELS = {
  vat_on_top: {
    id: 'vat_on_top' as const,
    name: 'Add VAT on Top',
    description: '1% of car price + VAT',
    icon: '📊'
  },
  higher_vat_included: {
    id: 'higher_vat_included' as const,
    name: 'Higher % VAT-Included',
    description: '1.25% if VAT ≤25%, 1.50% if VAT >25%',
    icon: '📈'
  },
  flat_minimum: {
    id: 'flat_minimum' as const,
    name: 'Flat Minimum',
    description: '1% of price, minimum €30,000',
    icon: '💰'
  },
  tiered: {
    id: 'tiered' as const,
    name: 'Tiered System',
    description: '1.5% for <1M, 1.25% for 1–3M, 1% for >3M',
    icon: '🎯'
  }
} as const

export const EU_COUNTRIES = [
  { code: 'SE', name: 'Sweden', vatRate: 25 },
  { code: 'DE', name: 'Germany', vatRate: 19 },
  { code: 'FR', name: 'France', vatRate: 20 },
  { code: 'IT', name: 'Italy', vatRate: 22 },
  { code: 'ES', name: 'Spain', vatRate: 21 },
  { code: 'NL', name: 'Netherlands', vatRate: 21 },
  { code: 'BE', name: 'Belgium', vatRate: 21 },
  { code: 'AT', name: 'Austria', vatRate: 20 },
  { code: 'DK', name: 'Denmark', vatRate: 25 },
  { code: 'FI', name: 'Finland', vatRate: 24 },
  { code: 'NO', name: 'Norway', vatRate: 25 },
  { code: 'CH', name: 'Switzerland', vatRate: 7.7 },
  { code: 'PL', name: 'Poland', vatRate: 23 },
  { code: 'CZ', name: 'Czech Republic', vatRate: 21 },
  { code: 'HU', name: 'Hungary', vatRate: 27 },
  { code: 'RO', name: 'Romania', vatRate: 19 },
  { code: 'BG', name: 'Bulgaria', vatRate: 20 },
  { code: 'HR', name: 'Croatia', vatRate: 25 },
  { code: 'SI', name: 'Slovenia', vatRate: 22 },
  { code: 'SK', name: 'Slovakia', vatRate: 20 },
  { code: 'LT', name: 'Lithuania', vatRate: 21 },
  { code: 'LV', name: 'Latvia', vatRate: 21 },
  { code: 'EE', name: 'Estonia', vatRate: 20 },
  { code: 'IE', name: 'Ireland', vatRate: 23 },
  { code: 'PT', name: 'Portugal', vatRate: 23 },
  { code: 'GR', name: 'Greece', vatRate: 24 },
  { code: 'CY', name: 'Cyprus', vatRate: 19 },
  { code: 'MT', name: 'Malta', vatRate: 18 },
  { code: 'LU', name: 'Luxembourg', vatRate: 17 }
] as const

export function calculateServiceFee(input: FeeCalculationInput): FeeCalculationResult {
  const { carPrice, vatRate, currency, feeModel } = input

  let netFee: number
  let feeModelDescription: string

  switch (feeModel) {
    case 'vat_on_top':
      // 1% of car price + VAT
      netFee = carPrice * 0.01
      feeModelDescription = '1% of car price + VAT'
      break

    case 'higher_vat_included':
      // 1.25% if VAT ≤25%, 1.50% if VAT >25%
      const feeRate = vatRate <= 25 ? 0.0125 : 0.015
      netFee = carPrice * feeRate
      feeModelDescription = `${(feeRate * 100).toFixed(2)}% of car price (VAT ${vatRate <= 25 ? '≤' : '>'}25%)`
      break

    case 'flat_minimum':
      // 1% of price, but minimum €30,000
      const calculatedFee = carPrice * 0.01
      netFee = Math.max(calculatedFee, 30000)
      feeModelDescription = '1% of price, minimum €30,000'
      break

    case 'tiered':
      // 1.5% for <1M, 1.25% for 1–3M, 1% for >3M
      let tieredRate: number
      if (carPrice < 1000000) {
        tieredRate = 0.015
      } else if (carPrice <= 3000000) {
        tieredRate = 0.0125
      } else {
        tieredRate = 0.01
      }
      netFee = carPrice * tieredRate
      feeModelDescription = `${(tieredRate * 100).toFixed(2)}% (${carPrice < 1000000 ? '<1M' : carPrice <= 3000000 ? '1-3M' : '>3M'})`
      break

    default:
      netFee = 0
      feeModelDescription = 'Unknown model'
  }

  // Calculate VAT on the fee
  const vatOnFee = netFee * (vatRate / 100)
  
  // Total customer pays (net fee + VAT on fee)
  const totalCustomerPays = netFee + vatOnFee
  
  // Business keeps (net fee)
  const businessKeeps = netFee

  return {
    carPrice,
    vatRate,
    currency,
    feeModel,
    netFee,
    vatOnFee,
    totalCustomerPays,
    businessKeeps,
    feeModelDescription
  }
}

export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return formatter.format(amount)
}

export function validateFeeInput(input: Partial<FeeCalculationInput>): string[] {
  const errors: string[] = []

  if (!input.carPrice || input.carPrice <= 0) {
    errors.push('Car price must be greater than 0')
  }

  if (!input.vatRate || input.vatRate < 0 || input.vatRate > 100) {
    errors.push('VAT rate must be between 0 and 100')
  }

  if (!input.currency || input.currency.length !== 3) {
    errors.push('Currency must be a valid 3-letter code')
  }

  if (!input.feeModel || !Object.keys(FEE_MODELS).includes(input.feeModel)) {
    errors.push('Please select a valid fee model')
  }

  return errors
}
