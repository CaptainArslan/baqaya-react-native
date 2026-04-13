# Baqaya Mobile App

## Overview
Baqaya is an offline-first mobile ledger app designed for small business owners to track customer balances, manage transactions, and send WhatsApp reminders.

---

## Tech Stack
- React Native (Expo)
- TypeScript
- Expo Router
- Laravel Backend API

---

## Design Source

All UI design references are stored in:

design-reference/screens/

Each screen has:
- design.png → visual reference
- layout.html → structure reference

---

## How to Use Design Reference

IMPORTANT RULES:

1. Do NOT copy HTML directly into React Native.
2. HTML is only for layout understanding.
3. PNG is the visual source of truth.
4. Build UI using native React Native components.

---

## Screen Development Workflow

For every screen:

1. Open corresponding folder in:
   design-reference/screens/

2. Review:
    - design.png (visual)
    - layout.html (structure)

3. Map screen to route using:
   design-reference/mapping/screen-mapping.md

4. Build UI in:
   app/ or src/features/

5. Extract reusable components

6. Implement navigation

---

## Folder Usage

### design-reference/screens/
Per screen design source

### design-reference/flows/
Defines user journeys:
- auth
- onboarding
- transactions
- reminders

### design-reference/mapping/
Maps design → actual routes

### design-reference/components/
Reusable UI patterns

---

## Development Rules

- Use TypeScript strictly
- Build reusable components
- Follow mobile-first design
- Keep UI clean and readable
- Focus on usability over pixel perfection

---

## Core Product Principles

- Offline-first
- Fast data entry
- Minimal friction
- Action-driven UX
- WhatsApp integration
- Clear empty states

---

## Modules

- Auth
- Onboarding
- Home Dashboard
- Customers
- Transactions
- Reports
- Sync states
- Reminders

---

## What to Avoid

- Do NOT mix design files with app code
- Do NOT build using web layouts
- Do NOT duplicate UI unnecessarily
- Do NOT over-engineer

---

## Expected Output

When building:
- Mention screen reference folder
- Keep code modular
- Reuse components
- Follow design closely