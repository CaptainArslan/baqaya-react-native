# Design System Document: The Resilient Ledger

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Bedrock"**
The objective of this design system is to transform a traditional, paper-based ledger (Khata) into a high-end digital tool that feels as authoritative as a bank but as accessible as a neighborhood conversation. We are moving away from "generic app" templates toward **The Digital Bedrock**—a style defined by rock-solid stability, intentional whitespace, and a "No-Line" architecture. 

By utilizing **Tonal Layering** and **Editorial Typography**, we create a sense of premium reliability. We don't use lines to separate ideas; we use shifts in "physical" depth. This reduces visual noise for users with limited digital literacy, allowing the financial data to breathe and remain the undisputed hero of the screen.

---

## 2. Colors & Surface Architecture
Our palette is rooted in the "Deep Forest" of commerce (`primary: #004f45`) and the "Stability Blue" of professional finance (`secondary: #005db7`).

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section off content. 
Structure is achieved through **Surface Shifts**. A list item does not sit inside a bordered box; it sits as a `surface-container-lowest` card on a `surface-container-low` background. This creates a "soft edge" that is easier for the eye to scan on low-end mobile displays.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of premium cardstock.
*   **Base Layer:** `background (#f9f9f6)` – The wide-open canvas.
*   **Section Layer:** `surface-container-low (#f4f4f1)` – Used to group related ledger entries.
*   **Interactive Layer:** `surface-container-lowest (#ffffff)` – The "highest" physical point; used for cards that can be tapped.

### Signature Textures
While we avoid complex gradients, use a **Functional Glow** for primary actions. A subtle linear gradient from `primary (#004f45)` to `primary_container (#00695c)` gives buttons a "pressed" physical quality, signaling to the user that this element is a tool, not just a decoration.

---

## 3. Typography: The Editorial Authority
We utilize a dual-font system to bridge the gap between "Modern Business" and "Practical Utility."

*   **Display & Headlines (Plus Jakarta Sans):** These are our "Statement" fonts. They should be bold and large. The high x-height of Plus Jakarta Sans ensures that even at `headline-sm`, the brand feels premium and trustworthy.
*   **Body & Labels (Inter):** Chosen for its world-class legibility in both English and Urdu scripts. Inter’s neutral tone ensures that "Udhaar" (Credit) and "Cash" amounts are readable at a glance, even on cracked screens or in direct sunlight.

**Typography as Brand:**
*   **Financial Totals:** Use `display-md` for the main balance. It should feel massive and unmissable.
*   **Contextual Labels:** Use `label-md` in `on_surface_variant` for metadata (e.g., timestamps), creating a clear hierarchy without using different colors.

---

## 4. Elevation & Depth
In this design system, depth is a function of color, not just light.

*   **The Layering Principle:** To highlight a customer’s debt, do not use a heavy shadow. Place a `tertiary_container (#b61b1f)` card on a `surface (#f9f9f6)` background. The contrast carries the weight.
*   **Ambient Shadows:** For floating action buttons (FAB), use a "Ghost Shadow": `color: on_surface`, `opacity: 6%`, `blur: 16px`. It should feel like a soft glow, not a dark smudge.
*   **Glassmorphism:** For top navigation bars, use `surface` at 85% opacity with a `backdrop-blur: 10px`. This keeps the user grounded in their list as they scroll, maintaining a sense of place.

---

## 5. Components

### Buttons (The "Touch-First" Tools)
*   **Primary:** Large `48dp` minimum height. Use `primary` background with `on_primary` text. Use `xl (0.75rem)` corner radius for a friendly but professional feel.
*   **Status Buttons:** For "Received" (Green) and "Gave" (Red), use `secondary` and `tertiary` respectively. These must be full-width on mobile to ensure they are the easiest targets to hit.

### Ledger Cards (The "No-Divider" List)
*   **Style:** Instead of lines, each transaction is a `surface-container-lowest` rectangle with a `4px` left-accent bar using `secondary` (Received) or `tertiary` (Gave).
*   **Spacing:** Use `16px` vertical breathing room between cards. Space is the divider.

### Input Fields (The "High-Contrast" Entry)
*   **Field:** Never use a single bottom line. Use a `surface-container-high` background with a `Ghost Border` (outline-variant at 20% opacity).
*   **Active State:** The border jumps to `primary` at `2px` thickness. This provides immediate feedback to users who may be unsure of where they are typing.

### Financial Summary Chips
*   Compact, pill-shaped (`full` roundedness). Used at the top of the screen to filter "All," "Pending," or "Settled." Use `surface-variant` for inactive states and `primary` for active.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme type scale. If a number is important (like a total balance), make it significantly larger than the surrounding text.
*   **Do** use Urdu-specific line heights. Urdu characters are taller than Latin characters; ensure `body-lg` has a line-height of at least `1.6` for Urdu text.
*   **Do** use color as a status. `tertiary (#90000e)` always means money leaving or money owed.

### Don’t:
*   **Don’t use 1px dividers.** It clutters the screen and makes the app look like a cheap spreadsheet.
*   **Don’t use "Pure Black" (#000000) for text.** Use `on_surface (#1a1c1b)` to maintain an editorial, high-end feel that is easier on the eyes during long sessions.
*   **Don’t hide actions in "Long Press" menus.** This system is for business-focused users; keep all primary actions (Call, Remind, Add Entry) visible as large, icon-led buttons.