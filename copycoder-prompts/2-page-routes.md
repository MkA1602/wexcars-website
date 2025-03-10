Set up the page structure according to the following prompt:
   
<page-structure-prompt>
Next.js route structure based on navigation menu items (excluding main route). Make sure to wrap all routes with the component:

Routes:
- /used-cars
- /auctions
- /new-cars
- /sell-cars
- /local-dealers
- /support
- /sign-up
- /dashboard
- /auction
- /portfolio
- /active-bids
- /search
- /listings
- /book-service
- /help-center

Page Implementations:
/used-cars:
Core Purpose: Browse and filter used car inventory
Key Components
- SearchFilters (price, make, model, year)
- CarGrid with pagination
- ComparisonTool
Layout Structure
- Filters sidebar (collapsible on mobile)
- Main content area with grid

/auctions:
Core Purpose: View active and upcoming car auctions
Key Components
- AuctionTimer
- LiveBiddingInterface
- AuctionGrid with sorting
Layout Structure
- Featured auctions carousel
- Grid of active auctions
- Upcoming auctions section

/new-cars:
Core Purpose: Explore new car models and configurations
Key Components
- ModelSelector
- ConfigurationBuilder
- PriceCalculator
Layout Structure
- Brand selection header
- Model showcase area
- Specification comparison table

/sell-cars:
Core Purpose: List vehicles for sale or auction
Key Components
- CarDetailsForm
- PhotoUploader
- PricingSuggestion
Layout Structure
- Step-by-step form wizard
- Preview panel
- Pricing guidance sidebar

/local-dealers:
Core Purpose: Find and connect with nearby dealerships
Key Components
- LocationMap
- DealershipList
- ContactForm
Layout Structure
- Map view with dealer pins
- Scrollable dealer list
- Dealer details modal

/support:
Core Purpose: Customer service and help resources
Key Components
- FAQAccordion
- ChatSupport
- TicketSystem
Layout Structure
- Category navigation
- Main content area
- Contact options footer

/sign-up:
Core Purpose: User registration and account creation
Key Components
- RegistrationForm
- SocialAuth
- VerificationStep
Layout Structure
- Centered form container
- Progress indicator
- Success confirmation

/dashboard:
Core Purpose: User account management and overview
Key Components
- ActivityFeed
- QuickActions
- StatisticsPanel
Layout Structure
- Sidebar navigation
- Main content area
- Notification center

Layouts:
MainLayout:
- Applicable routes: /, /used-cars, /new-cars, /auctions
- Core components: Navigation, Footer, SearchBar
- Responsive behavior: Collapsible menu, adaptive grid

AuthLayout
- Applicable routes: /sign-up, /dashboard, /portfolio
- Core components: UserMenu, Sidebar, Notifications
- Responsive behavior: Drawer navigation on mobile

MarketplaceLayout
- Applicable routes: /listings, /auction, /sell-cars
- Core components: FilterBar, SortOptions, ResultsGrid
- Responsive behavior: Filter overlay on mobile

SupportLayout
- Applicable routes: /support, /help-center, /book-service
- Core components: CategoryNav, SearchBar, ContactOptions
- Responsive behavior: Sticky header, expandable sections

Each layout includes
- Responsive navigation
- Error boundary
- Loading states
- SEO optimization
- Analytics integration
- Accessibility features
</page-structure-prompt>