# Service Fee Payment Feature

## Overview

This feature adds a mandatory service fee payment system to the car ad publication process. Users must pay a service fee before they can publish their car advertisements.

## Features

### 🧮 Fee Calculation Models

The system supports 4 different fee calculation models:

1. **Add VAT on Top** 📊
   - 1% of car price + VAT
   - Simple percentage-based calculation

2. **Higher % VAT-Included** 📈
   - 1.25% if VAT ≤25%
   - 1.50% if VAT >25%
   - Adjusts based on VAT rate

3. **Flat Minimum** 💰
   - 1% of price, minimum €30,000
   - Ensures minimum revenue per listing

4. **Tiered System** 🎯
   - 1.5% for <1M
   - 1.25% for 1–3M
   - 1% for >3M
   - Volume-based pricing

### 🌍 Multi-Currency & VAT Support

- Support for EUR, USD, GBP, AED currencies
- 30+ EU countries with pre-configured VAT rates
- Custom VAT rate input
- Real-time currency formatting

### 💳 Payment Integration

- Payment simulation (ready for Stripe/Klarna integration)
- Visual payment status indicators
- Form validation integration
- Payment reset on price/model changes

## Implementation

### Files Created/Modified

#### New Files:
- `lib/fee-calculator.ts` - Core fee calculation logic
- `components/dashboard/service-fee-calculator.tsx` - Main calculator component
- `app/service-fee-demo/page.tsx` - Demo page for testing
- `SERVICE_FEE_FEATURE_README.md` - This documentation

#### Modified Files:
- `components/dashboard/add-car-form.tsx` - Integrated fee calculator
- `components/dashboard/dashboard-content.tsx` - Added demo link

### Component Structure

```
ServiceFeeCalculator
├── Input Section
│   ├── Car Price (with currency selector)
│   ├── Country/VAT Rate selection
│   ├── Custom VAT rate input
│   └── Fee model selection
├── Calculation Results
│   ├── Fee summary display
│   ├── Detailed breakdown
│   └── Payment section
└── Payment Status
    ├── Payment simulation
    ├── Success indicators
    └── Reset functionality
```

## Usage

### In Add Car Form

The service fee calculator is integrated into the add car form:

1. User fills out car details including price
2. Service fee section appears with calculator
3. User selects fee model and calculates fee
4. User must complete payment before publishing
5. Publish button is disabled until payment is complete

### Standalone Usage

```tsx
import ServiceFeeCalculator from '@/components/dashboard/service-fee-calculator'

<ServiceFeeCalculator
  onFeePaid={(isPaid) => setPaymentStatus(isPaid)}
  onFeeCalculated={(fee) => setFeeData(fee)}
  initialPrice={250000}
  initialCurrency="EUR"
  initialVatRate={25}
/>
```

## API Reference

### FeeCalculationInput

```typescript
interface FeeCalculationInput {
  carPrice: number
  vatRate: number
  currency: string
  feeModel: FeeModel
}
```

### FeeCalculationResult

```typescript
interface FeeCalculationResult {
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
```

### Functions

- `calculateServiceFee(input: FeeCalculationInput): FeeCalculationResult`
- `formatCurrency(amount: number, currency: string): string`
- `validateFeeInput(input: Partial<FeeCalculationInput>): string[]`

## Configuration

### Supported Currencies

- EUR (Euro)
- USD (US Dollar)
- GBP (British Pound)
- AED (UAE Dirham)

### Supported Countries

30+ EU countries with pre-configured VAT rates, including:
- Sweden (25%)
- Germany (19%)
- France (20%)
- Italy (22%)
- Spain (21%)
- And more...

## Payment Integration

### Current Implementation

The current implementation includes a payment simulation that:
- Shows a 2-second loading state
- Simulates successful payment
- Updates UI to show payment complete
- Enables form submission

### Production Integration

To integrate with real payment providers:

1. Replace the `simulatePayment` function in `ServiceFeeCalculator`
2. Add your payment provider SDK (Stripe, Klarna, etc.)
3. Handle payment success/failure states
4. Store payment confirmation in your database

Example Stripe integration:

```typescript
const handlePayment = async () => {
  const stripe = await getStripe()
  const { error } = await stripe.redirectToCheckout({
    lineItems: [{
      price: 'price_1234567890',
      quantity: 1,
    }],
    mode: 'payment',
    successUrl: `${window.location.origin}/success`,
    cancelUrl: `${window.location.origin}/cancel`,
  })
}
```

## Testing

### Demo Page

Visit `/service-fee-demo` to test the calculator with:
- Different price ranges
- Various VAT rates
- All fee models
- Payment simulation

### Test Scenarios

1. **Basic Calculation**
   - Price: €250,000
   - VAT: 25%
   - Model: Add VAT on Top
   - Expected: €2,500 + €625 VAT = €3,125 total

2. **Minimum Fee**
   - Price: €1,000,000
   - VAT: 25%
   - Model: Flat Minimum
   - Expected: €30,000 (minimum) + €7,500 VAT = €37,500 total

3. **Tiered System**
   - Price: €2,000,000
   - VAT: 25%
   - Model: Tiered
   - Expected: €25,000 (1.25%) + €6,250 VAT = €31,250 total

## UI/UX Features

### Visual Indicators

- ✅ Payment completed status
- 🔒 Payment required indicators
- 📊 Real-time fee calculation
- 💳 Payment processing states

### Responsive Design

- Mobile-friendly layout
- Collapsible calculator section
- Touch-friendly controls
- Consistent with existing UI

### Accessibility

- Proper ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast indicators

## Future Enhancements

### Potential Improvements

1. **Advanced Pricing**
   - Time-based pricing (rush fees)
   - Premium listing options
   - Bulk discount tiers

2. **Payment Methods**
   - Multiple payment providers
   - Subscription options
   - Credit system

3. **Analytics**
   - Fee calculation tracking
   - Revenue reporting
   - User behavior insights

4. **Admin Features**
   - Fee model management
   - Pricing configuration
   - Payment monitoring

## Troubleshooting

### Common Issues

1. **Fee not calculating**
   - Check if car price is entered
   - Verify VAT rate is valid (0-100)
   - Ensure currency is selected

2. **Payment not processing**
   - Check browser console for errors
   - Verify payment provider configuration
   - Test with different payment methods

3. **Form validation errors**
   - Ensure all required fields are filled
   - Check fee payment status
   - Verify form data integrity

### Debug Mode

Enable debug logging by setting:
```typescript
const DEBUG_FEE_CALCULATOR = true
```

This will log all calculations and state changes to the console.

## Support

For technical support or feature requests, please refer to the main project documentation or contact the development team.

---

**Note**: This feature is designed to be modular and easily integrated into existing forms. The calculator component can be used independently or as part of a larger form workflow.
