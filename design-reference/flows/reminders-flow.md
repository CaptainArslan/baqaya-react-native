# Reminders Flow

## Goal

Help user send payment reminders through WhatsApp quickly.

## Main Flow

1. User taps Remind on a customer
2. App builds prefilled reminder text
3. App opens WhatsApp with customer number
4. User reviews message
5. User sends message manually

## Data Needed

- Customer phone number
- Customer name
- Balance or pending amount
- Optional due info

## Important Rules

- Do not ask for shop owner WhatsApp number
- Use customer number only
- Open WhatsApp on user’s own device
- Prefill message only, do not auto-send

## Edge Cases

- Customer has no phone number
- Customer number invalid
- Customer not on WhatsApp
- WhatsApp not installed

## Notes

- Keep reminder flow very fast
- This is one of the core value features
