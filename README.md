# Baqaya Mobile App

Baqaya is a React Native + Expo ledger app focused on customer balances, udhaar/payment entries, cashbook tracking, and reminder workflows.

## Tech Stack

- Expo + React Native
- Expo Router (file-based navigation)
- TypeScript
- Centralized theme tokens (`Colors`, `Spacing`, `Radius`, `Typography`, `Shadows`)
- Centralized relational mock data for screen development

## Run Locally

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npx expo start
```

3. Start development server with cache reset (used in this session)

```bash
npx expo start -c
```

## Commands Used In This Session

```bash
# Install project dependencies
npm install

# Start Expo development server
npx expo start

# Start Expo server and clear Metro cache
npx expo start -c

# Build Android release bundle (AAB)
cd android
.\gradlew.bat bundleRelease

# Build Android release APK (direct install)
.\gradlew.bat assembleRelease

# Install release APK on connected Android device
adb install -r "D:\reactnative\Baqaya-react-natie\android\app\build\outputs\apk\release\app-release.apk"

# If install fails due to signature/package conflict
adb uninstall com.anonymous.Baqayareactnatie
adb install -r "D:\reactnative\Baqaya-react-natie\android\app\build\outputs\apk\release\app-release.apk"
```

## Release Artifacts

- AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- APK: `android/app/build/outputs/apk/release/app-release.apk`

## App Structure

- `app/` - Routes/screens (auth, onboarding, tabs, customers, modals)
- `src/components/` - Reusable UI and shared components
- `src/constants/mockData.ts` - Runtime-aware relational mock data helpers
- `data/screenMocks.ts` - Seed mock data for app screens
- `src/theme/` - Design tokens and UI scales
- `src/i18n/` - Translation keys and language files

## Key Features

- Auth flow: language, phone, OTP, maintenance, suspended
- Onboarding flow: create shop
- Drawer + tabs: Home, Customers, Cashbook, Reports
- Customer flow:
  - Add/Edit customer with avatar picker (camera/gallery)
  - Customer detail with ledger/payment actions
  - Transaction detail + edit transaction + delete confirmation
  - WhatsApp reminder flow with tone selection and message editing
- Cashbook flow:
  - Search + sorting + date filters
  - Sectioned entries and pagination
- Import contacts flow:
  - Permission request and denial handling
  - Contact picker and multi-number selection

## Recent UI/UX Updates

- Standardized font scale/weights across screens using `Typography` tokens
- Removed fancy/emoji-based icon styles and replaced with consistent `MaterialIcon` usage
- Unified card/tile spacing, border, and radius patterns across customers/cashbook/details screens
- Added global add-customer FAB behavior across tabs
- Added consistent confirmation modals for delete actions
- Added dedicated WhatsApp reminder screen before sending messages
- Refined transaction and edit transaction screens to align with latest design references

## Mock Data Notes

- Mock customers/transactions are relational and shared across screens.
- Runtime updates are supported for:
  - add/update/delete customer
  - add/update/delete transaction
- This allows realistic cross-screen behavior before backend integration.

## Development Notes

- Keep UI typography consistent with `src/theme/typography.ts`.
- Prefer theme tokens over hardcoded sizes/colors.
- Keep user-facing strings in i18n files where applicable.
