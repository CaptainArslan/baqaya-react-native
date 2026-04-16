# Offline Sync Flow

## Goal

Make the app feel reliable even without internet.

## Core Principle

- Save locally first
- Sync in background later
- Keep user informed without making sync their job

## Main Flow

1. User adds or edits data
2. App saves data locally immediately
3. UI updates instantly
4. Sync queue stores pending change
5. Background sync attempts when possible
6. If success:
   - item marked synced
7. If failure:
   - keep pending or failed state

## States

- All synced
- Pending sync
- Failed sync
- Offline mode

## UI Rules

- Show sync banner at top when useful
- Do not place Sync Now buttons inside core content areas unnecessarily
- Keep sync mostly automatic

## Notes

- User should feel in control, not burdened
- Sync should be supportive, not noisy
