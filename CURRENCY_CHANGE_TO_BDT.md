# Currency Migration to BDT (Bangladeshi Taka)

This document summarizes the changes made to convert the currency from USD/Rs to BDT throughout the application.

## Summary

All currency references have been updated from USD and Rs. to BDT (Bangladeshi Taka) to align with the SSLCommerz payment integration and Bangladesh-specific market.

## Changes Made

### 1. Backend Configuration

**File:** `backend/config/appConfig.js`

- ✅ Updated `defaultCurrency` from `"USD"` to `"BDT"`

### 2. Payment Integration

**File:** `backend/features/payments/payments.controller.js`

- ✅ Currency already set to `"BDT"` in SSLCommerz payment initialization (line 42)

### 3. Frontend Currency Utility

**New File:** `frontend/src/shared/utils/currency.js`

- ✅ Created centralized currency formatting utility
- ✅ Exports `formatBDT()` function using `Intl.NumberFormat` with fallback
- ✅ Consistent formatting across the entire application

### 4. Frontend Components Updated

#### Auction Display Components:

- ✅ `frontend/src/pages/ViewAuctionDetails.jsx` - Minimum bid + bid amounts
- ✅ `frontend/src/pages/AuctionItem.jsx` - Minimum bid (2 instances)
- ✅ `frontend/src/shared/components/AuctionView.jsx` - Minimum bid + bid amounts
- ✅ `frontend/src/shared/components/home-sub-components/UpcomingAuctions.jsx` - Starting bid (3 instances)

#### Admin Components:

- ✅ `frontend/src/features/admin/pages/Dashboard/sub-components/PendingAuctions.jsx` - Starting bid in table

#### Commission Components:

- ✅ `frontend/src/features/commissions/pages/SubmitCommission.jsx` - Unpaid commission display and validation messages

### 5. Documentation Files

- ✅ `README.md` - Updated defaultCurrency example to BDT
- ✅ `BRANDING.md` - Updated defaultCurrency in configuration examples (2 instances)

## Implementation Details

### Currency Formatting Function

```javascript
// frontend/src/shared/utils/currency.js
export const formatBDT = (amount, options = {}) => {
  try {
    const formatter = new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options,
    });
    return formatter.format(Number(amount) || 0);
  } catch (e) {
    // Fallback for browsers without BDT symbol support
    const n = Number(amount) || 0;
    return `BDT ${n.toLocaleString("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  }
};
```

### Usage Pattern

All currency displays now use the centralized formatter:

```javascript
import { formatBDT } from "@/shared/utils/currency";

// Instead of: Rs.{amount}
// Now use: {formatBDT(amount)}
```

## Before & After Examples

### Before:

```jsx
<p>Minimum Bid: <span>Rs.{auctionDetail.startingBid}</span></p>
<p>Unpaid Commission: BDT {user.unpaidCommission}</p>
<p>Rs. {element.startingBid}</p>
```

### After:

```jsx
<p>Minimum Bid: <span>{formatBDT(auctionDetail.startingBid)}</span></p>
<p>Unpaid Commission: {formatBDT(user.unpaidCommission)}</p>
<p>{formatBDT(element.startingBid)}</p>
```

## Output Format

The `formatBDT()` function produces:

- **With symbol support:** `৳ 1,500` or `Tk 1,500` (browser dependent)
- **Fallback:** `BDT 1,500`

Both formats are acceptable and clearly indicate Bangladeshi Taka.

## Benefits

1. **Consistency:** Single source of truth for currency formatting
2. **Localization:** Proper BDT formatting with thousand separators
3. **Flexibility:** Easy to adjust formatting options app-wide
4. **Maintainability:** Update once in utility, applies everywhere
5. **Future-proof:** Can easily add multi-currency support if needed

## Testing Checklist

- [x] Auction listing pages show BDT
- [x] Auction detail pages show BDT
- [x] Bid amounts display in BDT
- [x] Commission payment page shows BDT
- [x] Admin panel auction table shows BDT
- [x] Backend configuration set to BDT
- [x] Payment gateway uses BDT currency
- [x] Documentation updated

## Notes

- The SSLCommerz payment integration was already configured for BDT
- All hardcoded "Rs." and "USD" references have been replaced
- The currency utility handles edge cases and provides graceful fallback
- No changes needed to database schema (amounts stored as numbers)

---

**Date:** January 14, 2026  
**Status:** ✅ Complete
