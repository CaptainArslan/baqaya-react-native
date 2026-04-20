# Baqaya Mobile App

## Overview

Baqaya is an offline-first mobile ledger app for small business owners to:

- track customer balances
- record transactions
- view reports
- send WhatsApp reminders

This is a **frontend-first prototype phase** (no backend integration yet).

---

## Tech Stack

- React Native (Expo)
- TypeScript (strict)
- Expo Router (file-based navigation)
- Local storage (AsyncStorage)
- i18n (JSON-based translations)

---

## Primary Goal

Build a **fully working prototype** where:

- all screens render correctly
- all navigation flows work
- all buttons perform actions
- no dead interactions exist
- app feels complete without backend

---

## Design Source

All UI references are located in:

`design-reference/screens/<screen-name>/`

Each folder contains:

- `design.png` → visual source of truth
- `layout.html` → structure reference only

### Rules:

1. NEVER copy HTML into React Native
2. ALWAYS follow `design.png` visually
3. Use HTML only to understand hierarchy
4. Build UI using React Native components only

---

## Mandatory Development Workflow

For EVERY screen:

1. Identify screen from:
   `design-reference/screens/`

2. Review:
   - design.png (visual)
   - layout.html (structure)

3. Map to route using:
   `design-reference/mapping/screen-mapping.md`

4. Build using:
   - reusable components first
   - then screen layout

5. Add navigation

6. Replace all text with translation keys

---

## Folder Architecture (STRICT)

### Routing

- `app/` → all screens (Expo Router)

### Core Code

- `src/components/ui/` → reusable UI primitives
- `src/components/common/` → shared components
- `src/features/` → feature-specific logic
- `src/theme/` → colors, spacing, typography
- `src/constants/` → constants
- `src/hooks/` → custom hooks
- `src/utils/` → helpers
- `src/services/` → storage, API placeholders
- `src/types/` → TypeScript types
- `src/animations/` → animation helpers

### Design Reference (DO NOT TOUCH)

- `design-reference/`

---

## Navigation Rules (CRITICAL)

### Route Groups:

- `(auth)` → login, verify
- `(onboarding)` → create-shop
- `(tabs)` → home, customers, cashbook, reports

### Flow:

- app start →
  - if no token → auth
  - if token → tabs

### Rules:

- use `router.replace()` for auth transitions
- use `router.push()` for internal navigation
- no auth screen accessible after login
- all back buttons must work correctly

---

## Auth Behavior (Prototype Mode)

- login → verify → success
- on success:
  - generate mock token
  - store in AsyncStorage
- app restart:
  - token exists → skip auth
- logout:
  - remove token → go to login

---

## Translation System (MANDATORY)

ALL static text must be translatable.

### Rules:

- NEVER hardcode strings
- ALWAYS use:
  `t("key.path")`

### Structure:

`src/i18n/en.json`

Example:

```json
{
  "auth": {
    "login_title": "Login"
  }
}
```
