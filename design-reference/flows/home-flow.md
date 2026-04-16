# Home Flow

## Goal

Give user a clear summary of their ledger and help them take action quickly.

## Main Home States

1. New user empty state
2. Active user dashboard
3. Offline state
4. Pending sync state

## New User Flow

1. User enters home after onboarding
2. No customers and no transactions exist
3. Show welcome state
4. Primary action = Add Customer

## Active User Flow

1. User has customers and/or transactions
2. Show balance summary
3. Show stats
4. Show tab section:
   - Recent Transactions
   - Top Debtors

## Tabs

### Recent Transactions

- Show latest transaction list
- If empty, show empty state

### Top Debtors

- Show customers with highest pending balances
- If empty, show empty state

## Sync Awareness

- Show top sync banner if pending or failed
- Do not place manual sync actions inside content list

## Primary Actions

- Add Entry
- Add Customer

## Notes

- New user state should be simpler than active state
- Home should feel action-driven, not overloaded
