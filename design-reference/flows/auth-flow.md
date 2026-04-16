# Auth Flow

## Goal

Allow user to securely enter the app with minimal friction using phone number and OTP.

## Entry Points

- App launch
- Logged out state
- Session expired state

## Main Flow

1. User opens app
2. Splash screen appears
3. User selects language
4. User enters phone number
5. System validates number format
6. User taps send OTP
7. App requests OTP
8. OTP verification screen opens
9. User enters OTP
10. App verifies OTP
11. On success, user enters app or onboarding

## States

- Splash
- Language selection
- Phone entry idle
- Phone entry invalid
- Phone entry offline
- OTP idle
- OTP verifying
- OTP invalid
- OTP expired
- OTP resend state
- OTP rate-limited
- Account suspended
- Maintenance
- Auth success

## Validation Rules

- Phone number must be normalized
- Invalid number should not proceed
- Verify button disabled until complete OTP entered

## Error Flows

- Invalid phone number
- No internet
- OTP failed
- OTP expired
- Too many attempts
- Suspended account
- Maintenance mode

## Navigation Rules

- Success + first-time user -> onboarding
- Success + existing user -> home
- Back from OTP -> phone entry

## Notes

- Keep auth fast and minimal
- Avoid asking for unnecessary data during auth
