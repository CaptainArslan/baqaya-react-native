# Onboarding Flow

## Goal

Set up the user's shop with minimal friction after successful auth.

## Main Flow

1. User completes auth successfully
2. User lands on Create Shop screen
3. User enters shop/business name
4. User taps continue
5. App saves local onboarding data
6. User enters home screen

## States

- Create shop idle
- Input validation error
- Saving state
- Success

## Rules

- Keep onboarding to one main step initially
- Do not overload user with unnecessary setup
- Focus on getting user into product fast

## Navigation Rules

- Auth success -> create shop
- Create shop success -> home (new user state)

## Notes

- Future onboarding steps can be added later
- For now keep this ultra-short
