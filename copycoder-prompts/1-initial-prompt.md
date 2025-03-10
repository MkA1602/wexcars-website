Initialize Next.js in current directory:
```bash
mkdir temp; cd temp; npx create-next-app@latest . -y --typescript --tailwind --eslint --app --use-npm --src-dir --import-alias "@/*" -no --turbo
```

Now let's move back to the parent directory and move all files except prompt.md.

For Windows (PowerShell):
```powershell
cd ..; Move-Item -Path "temp*" -Destination . -Force; Remove-Item -Path "temp" -Recurse -Force
```

For Mac/Linux (bash):
```bash
cd .. && mv temp/* temp/.* . 2>/dev/null || true && rm -rf temp
```

Set up the frontend according to the following prompt:
<frontend-prompt>
Create detailed components with these requirements:
1. Use 'use client' directive for client-side components
2. Make sure to concatenate strings correctly using backslash
3. Style with Tailwind CSS utility classes for responsive design
4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
7. Create root layout.tsx page that wraps necessary navigation items to all pages
8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
9. Accurately implement necessary grid layouts
10. Follow proper import practices:
   - Use @/ path aliases
   - Keep component imports organized
   - Update current src/app/page.tsx with new comprehensive code
   - Don't forget root route (page.tsx) handling
   - You MUST complete the entire prompt before stopping

<summary_title>
Modern Vehicle Marketplace Platform with Search and Auction Features
</summary_title>

<image_analysis>

1. Navigation Elements:
- Top header with: Used Cars, Auctions, New Cars, Sell Cars, Local Dealers, Support, Sign Up
- Left sidebar with: Dashboard, Auction, Portfolio, Active Bids, Search, Listings, Book Service, Help Center
- Brand navigation bar featuring car manufacturer logos


2. Layout Components:
- Hero section: 100% width with purple gradient background
- Search container: 960px max-width centered
- Card grid: 4-column layout for trending vehicles
- Vehicle detail page: 2-column layout with 65%/35% split
- Auction page: Left sidebar (250px) with main content area


3. Content Sections:
- Hero search section
- Featured vehicles carousel
- Trending vehicles grid
- Vehicle detail sections with images, specs, and pricing
- Active bids listing with vehicle cards
- Manufacturer logo showcase


4. Interactive Controls:
- Search bar with dropdown filters
- "Search" button with purple background
- "View Local Inventory" CTA buttons
- Image galleries with thumbnail navigation
- Bid placement interface
- Filter checkboxes in sidebar


5. Colors:
- Primary Purple: #6B4BFF
- Secondary Purple: #8970FF
- White: #FFFFFF
- Light Gray: #F5F5F5
- Text Dark: #333333
- Border Gray: #E5E5E5


6. Grid/Layout Structure:
- 12-column grid system
- 24px grid gap
- 1440px max container width
- 16px base padding
- Responsive breakpoints at 1200px, 992px, 768px, 576px
</image_analysis>

<development_planning>

1. Project Structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── Header
│   │   ├── Sidebar
│   │   └── Footer
│   ├── features/
│   │   ├── Search
│   │   ├── VehicleCard
│   │   ├── VehicleDetail
│   │   └── AuctionBidding
│   └── shared/
├── assets/
├── styles/
├── hooks/
└── utils/
```


2. Key Features:
- Advanced vehicle search with filters
- Real-time auction bidding system
- Vehicle detail pages with galleries
- Saved searches and favorites
- Dealer integration
- User authentication


3. State Management:
```typescript
interface AppState {
├── auth: {
│   ├── user: User
│   ├── isAuthenticated: boolean
├── }
├── vehicles: {
│   ├── searchResults: Vehicle[]
│   ├── filters: SearchFilters
│   ├── favorites: string[]
├── }
├── auctions: {
│   ├── activeBids: Bid[]
│   ├── watchlist: string[]
│   └── bidHistory: BidHistory[]
└── }
}
```


4. Routes:
```typescript
const routes = [
├── '/',
├── '/vehicles/*',
├── '/auctions/*',
├── '/dealers/*',
├── '/account/*',
└── '/search/*'
]
```


5. Component Architecture:
- Shared components for vehicle cards and forms
- HOC for authentication protection
- Context providers for theme and user data
- Reusable layout components
- Custom hooks for search and filtering


6. Responsive Breakpoints:
```scss
$breakpoints: (
├── 'xs': 576px,
├── 'sm': 768px,
├── 'md': 992px,
├── 'lg': 1200px,
└── 'xl': 1440px
);
```
</development_planning>
</frontend-prompt>

IMPORTANT: Please ensure that (1) all KEY COMPONENTS and (2) the LAYOUT STRUCTURE are fully implemented as specified in the requirements. Ensure that the color hex code specified in image_analysis are fully implemented as specified in the requirements.