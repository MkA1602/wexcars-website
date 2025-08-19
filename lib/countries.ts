export interface Country {
  name: string
  code: string
  flag: string
}

export const COUNTRIES: Country[] = [
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Italy", code: "IT", flag: "🇮🇹" },
  { name: "Spain", code: "ES", flag: "🇪🇸" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱" },
  { name: "Belgium", code: "BE", flag: "🇧🇪" },
  { name: "Switzerland", code: "CH", flag: "🇨🇭" },
  { name: "Austria", code: "AT", flag: "🇦🇹" },
  { name: "Sweden", code: "SE", flag: "🇸🇪" },
  { name: "Norway", code: "NO", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", flag: "🇩🇰" },
  { name: "Finland", code: "FI", flag: "🇫🇮" },
  { name: "Poland", code: "PL", flag: "🇵🇱" },
  { name: "Czech Republic", code: "CZ", flag: "🇨🇿" },
  { name: "Slovakia", code: "SK", flag: "🇸🇰" },
  { name: "Hungary", code: "HU", flag: "🇭🇺" },
  { name: "Romania", code: "RO", flag: "🇷🇴" },
  { name: "Bulgaria", code: "BG", flag: "🇧🇬" },
  { name: "Greece", code: "GR", flag: "🇬🇷" },
  { name: "Portugal", code: "PT", flag: "🇵🇹" },
  { name: "Ireland", code: "IE", flag: "🇮🇪" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", flag: "🇰🇷" },
  { name: "China", code: "CN", flag: "🇨🇳" },
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "Brazil", code: "BR", flag: "🇧🇷" },
  { name: "Argentina", code: "AR", flag: "🇦🇷" },
  { name: "Mexico", code: "MX", flag: "🇲🇽" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦" },
  { name: "Egypt", code: "EG", flag: "🇪🇬" },
  { name: "Morocco", code: "MA", flag: "🇲🇦" },
  { name: "Turkey", code: "TR", flag: "🇹🇷" },
  { name: "Israel", code: "IL", flag: "🇮🇱" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
  { name: "Qatar", code: "QA", flag: "🇶🇦" },
  { name: "Kuwait", code: "KW", flag: "🇰🇼" },
  { name: "Bahrain", code: "BH", flag: "🇧🇭" },
  { name: "Oman", code: "OM", flag: "🇴🇲" },
  { name: "Jordan", code: "JO", flag: "🇯🇴" },
  { name: "Lebanon", code: "LB", flag: "🇱🇧" },
  { name: "Cyprus", code: "CY", flag: "🇨🇾" },
  { name: "Malta", code: "MT", flag: "🇲🇹" },
  { name: "Iceland", code: "IS", flag: "🇮🇸" },
  { name: "Luxembourg", code: "LU", flag: "🇱🇺" },
  { name: "Monaco", code: "MC", flag: "🇲🇨" },
  { name: "Liechtenstein", code: "LI", flag: "🇱🇮" },
  { name: "Andorra", code: "AD", flag: "🇦🇩" },
  { name: "San Marino", code: "SM", flag: "🇸🇲" },
  { name: "Vatican City", code: "VA", flag: "🇻🇦" }
]

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(country => country.code === code)
}

export const getCountryByName = (name: string): Country | undefined => {
  return COUNTRIES.find(country => country.name === name)
}
