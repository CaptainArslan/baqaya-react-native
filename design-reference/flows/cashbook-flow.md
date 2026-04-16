# Cashbook Flow

## Goal

Allow user to record money in and out quickly.

## Main Flow

1. User opens Cashbook tab
2. User sees list of entries
3. User can add:
   - received payment
   - given amount
4. App saves entry locally
5. UI updates instantly
6. Sync happens later

## Entry Types

- Credit / payment received
- Debit / amount given / udhar

## States

- Empty list
- Populated list
- Offline saved
- Pending sync
- Failed sync

## Filters

- All
- Received
- Given

## Notes

- Fast data entry matters most here
- Avoid overcomplicating the screen
