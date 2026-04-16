# Add Customer Flow

## Goal

Allow user to quickly add a new customer manually.

## Main Flow

1. User taps Add Customer
2. Add Customer screen opens
3. User enters:
   - customer name
   - phone number
4. App validates input
5. User saves customer
6. Customer is stored locally
7. Customer appears in list
8. Data syncs later if needed

## States

- Idle
- Partial form
- Invalid phone number
- Save success
- Duplicate warning
- Offline saved locally

## Validation

- Name required
- Phone number required if business logic requires it
- Phone number should be normalized

## Duplicate Handling

- Check if customer already exists by number
- If duplicate found:
  - show warning
  - allow user to view existing customer

## Notes

- Keep form short
- Optimize for speed
