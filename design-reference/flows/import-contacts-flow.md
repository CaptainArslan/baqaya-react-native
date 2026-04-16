# Import Contacts Flow

## Goal

Reduce friction by letting user add customers from phone contacts.

## Main Flow

1. User taps Import from Contacts
2. App checks permission
3. If permission not granted:
   - show permission request
4. If granted:
   - load contacts
5. User selects contact
6. If multiple numbers:
   - show number selection sheet
7. App autofills customer data
8. User confirms save
9. Customer is saved locally

## Permission States

- Permission request
- Permission denied
- Open settings fallback

## Edge Cases

- Contact has no phone number
- Duplicate customer already exists
- Multiple phone numbers

## Rules

- Do not import all contacts automatically
- Let user choose manually
- Normalize selected number before save

## Notes

- This feature is for speed, not bulk migration
