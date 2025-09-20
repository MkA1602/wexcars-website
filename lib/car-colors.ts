/**
 * Comprehensive list of car colors for filtering and selection
 * Organized by color families for better user experience
 */
export const CAR_COLORS = [
  // Basic Colors
  "Black", "White", "Silver", "Gray", "Grey",
  
  // Red Family
  "Red", "Crimson", "Burgundy", "Maroon", "Cherry Red", "Ruby Red", "Scarlet", 
  "Brick Red", "Dark Red", "Bright Red", "Fire Red", "Candy Red", "Metallic Red",
  
  // Blue Family
  "Blue", "Navy Blue", "Royal Blue", "Sky Blue", "Electric Blue", "Midnight Blue", 
  "Steel Blue", "Powder Blue", "Cobalt Blue", "Sapphire Blue", "Ocean Blue", "Arctic Blue",
  
  // Green Family
  "Green", "Forest Green", "Emerald Green", "Lime Green", "Olive Green", "Mint Green", 
  "Teal", "Turquoise", "Jade Green", "British Racing Green", "Racing Green", "Hunter Green",
  
  // Yellow/Orange Family
  "Yellow", "Gold", "Champagne", "Orange", "Burnt Orange", "Copper", "Bronze", 
  "Amber", "Sunset Orange", "Papaya Orange", "Tangerine", "Mustard Yellow", "Canary Yellow",
  
  // Purple/Violet Family
  "Purple", "Violet", "Lavender", "Plum", "Magenta", "Indigo", "Mauve", 
  "Lilac", "Deep Purple", "Royal Purple", "Grape", "Eggplant",
  
  // Brown/Tan Family
  "Brown", "Tan", "Beige", "Cream", "Champagne", "Cognac", "Coffee", 
  "Mocha", "Camel", "Saddle Brown", "Chocolate", "Caramel", "Hazelnut",
  
  // Special Colors
  "Pearl White", "Metallic Silver", "Chrome", "Gunmetal", "Charcoal", "Titanium", 
  "Platinum", "Rose Gold", "Brushed Aluminum", "Polished Aluminum",
  
  // Matte Colors
  "Matte Black", "Matte White", "Matte Gray", "Matte Red", "Matte Blue", "Matte Green",
  "Matte Silver", "Matte Gold", "Matte Orange", "Matte Purple",
  
  // Two-Tone/Special
  "Two-Tone", "Custom", "Wrap", "Carbon Fiber", "Brushed Steel", "Satin",
  "Gloss", "Semi-Gloss", "Flat", "Suede", "Velvet"
] as const

export type CarColor = typeof CAR_COLORS[number]

/**
 * Get colors organized by family for better UI display
 */
export const getColorsByFamily = () => {
  return {
    basic: ["Black", "White", "Silver", "Gray", "Grey"],
    red: ["Red", "Crimson", "Burgundy", "Maroon", "Cherry Red", "Ruby Red", "Scarlet", "Brick Red", "Dark Red", "Bright Red", "Fire Red", "Candy Red", "Metallic Red"],
    blue: ["Blue", "Navy Blue", "Royal Blue", "Sky Blue", "Electric Blue", "Midnight Blue", "Steel Blue", "Powder Blue", "Cobalt Blue", "Sapphire Blue", "Ocean Blue", "Arctic Blue"],
    green: ["Green", "Forest Green", "Emerald Green", "Lime Green", "Olive Green", "Mint Green", "Teal", "Turquoise", "Jade Green", "British Racing Green", "Racing Green", "Hunter Green"],
    yellowOrange: ["Yellow", "Gold", "Champagne", "Orange", "Burnt Orange", "Copper", "Bronze", "Amber", "Sunset Orange", "Papaya Orange", "Tangerine", "Mustard Yellow", "Canary Yellow"],
    purple: ["Purple", "Violet", "Lavender", "Plum", "Magenta", "Indigo", "Mauve", "Lilac", "Deep Purple", "Royal Purple", "Grape", "Eggplant"],
    brown: ["Brown", "Tan", "Beige", "Cream", "Champagne", "Cognac", "Coffee", "Mocha", "Camel", "Saddle Brown", "Chocolate", "Caramel", "Hazelnut"],
    special: ["Pearl White", "Metallic Silver", "Chrome", "Gunmetal", "Charcoal", "Titanium", "Platinum", "Rose Gold", "Brushed Aluminum", "Polished Aluminum"],
    matte: ["Matte Black", "Matte White", "Matte Gray", "Matte Red", "Matte Blue", "Matte Green", "Matte Silver", "Matte Gold", "Matte Orange", "Matte Purple"],
    custom: ["Two-Tone", "Custom", "Wrap", "Carbon Fiber", "Brushed Steel", "Satin", "Gloss", "Semi-Gloss", "Flat", "Suede", "Velvet"]
  }
}

/**
 * Search colors by query string
 */
export const searchColors = (query: string): string[] => {
  if (!query.trim()) return CAR_COLORS
  
  const lowercaseQuery = query.toLowerCase()
  return CAR_COLORS.filter(color => 
    color.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * Get popular car colors (most commonly used)
 */
export const getPopularColors = (): string[] => {
  return [
    "Black", "White", "Silver", "Gray", "Red", "Blue", "Green", 
    "Gold", "Champagne", "Pearl White", "Metallic Silver"
  ]
}
