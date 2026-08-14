# Border Radius Tokens — TypeUI · Warm

> Corner-radius tokens for the **TypeUI “Warm”** design system. Warm is a near-sharp, editorial theme: **one crisp 2px corner (`radius-md`) on controls and panels alike** — buttons, inputs, search, badges, cards, and modals all share it, never a generous curve and never a pill. Every value below is a literal size — tokens are the source of truth; components reference tokens, never ad-hoc px or rem.

Depends on: none (pairs with `colors.md` for nested-radius math on filled surfaces).

**Root assumption:** `1rem = 16px` unless the product documents a different root.

---

## Warm radius convention (read first)

This is the rule that defines the Warm look. Do not deviate without a documented exception.

| Rule | Token | Value | Applies to |
|---|---|---|---|
| **Controls = 2px** | `radius-md` | 2px | Buttons, badges, chips, tags, tabs, alerts, tooltips, and single-line field shells |
| **Near-sharp panels = 2px** | `radius-xl` | 2px | Cards, widgets, modals, drawers (free edges), accordions, tabs panels, tables — with dropdown & menu panels and popovers at `radius-lg` (2px) |
| **Textarea (multi-line) = 2px** | `radius-xl` | 2px | The multi-line `textarea` — the panel corner, never a pill |
| **Functionally round controls** | `radius-full` | 9999px | The toggle track, avatars, radio control, range thumb & track, status dots, spinners |
| **Checkbox box** | `radius-xs` | 2px | The 16px tick box — near-sharp, **never fully round** (round is for radios) |
| **Nested child inside a panel** | `radius-xs` | 2px | Inset cells inside a padded rounded parent (see Nested radius) — **not** menu/nav rows, which take `radius-md` |
| **Menu / nav row inside a menu panel** | `radius-md` | 2px | Dropdown menu items, nav rows, select options — the crisp control corner (see the menu-row rule) |
| **Flush data** | `radius-none` | 0 | Table cells, flush list rows, dividers |

Buttons, inputs, and alerts are **crisp 2px rectangles** (`radius-md`); cards, widgets, modals, and tables take the same **2px** (`radius-xl`) panel corner, with menus at **2px** (`radius-lg`). The **textarea takes the same 2px panel corner** (never a pill) and the **checkbox tick box stays 2px** (`radius-xs`). This uniform near-sharp geometry — with only the functionally round controls breaking it — is the Warm silhouette.

**Edge-anchored exception:** panels that sit flush against a viewport edge — drawers, full-bleed bottom sheets — keep **square** corners on the flush edges. Only their free, inward-facing corners take the panel `radius-xl` (2px).

---

## Token naming

| Pattern | Role |
|---|---|
| `radius-base` | Single base unit all steps derive from |
| `radius-{step}` | Named step on the scale (`none` → `full`) |

Steps are **multipliers of `radius-base`**, not independent picks.

---

## Base unit

| Token | rem | px |
|---|---|---|
| radius-base | 0.125rem | 2px |

---

## Radius scale

| Token | Multiplier | rem | px | Typical use |
|---|---|---|---|---|
| radius-none | 0 | 0 | 0 | Square corners — flush table cells, joined shared edges, flush dividers |
| radius-xs | 1× | 0.125rem | 2px | Hairline inset frames, checkboxes, nested children inside a padded panel |
| radius-sm | 1× | 0.125rem | 2px | Small inner controls, compact chips |
| radius-md | 1× | 0.125rem | 2px | **Warm control default** — buttons, inputs, alerts, badges, tabs, tooltips, and other small chrome |
| radius-lg | 1× | 0.125rem | 2px | Menus, popovers, small panels |
| radius-xl | 1× | 0.125rem | 2px | **Warm panel default** — cards, widgets, modals, tables, drawers |
| radius-xxl | 2× | 0.25rem | 4px | Large feature panels, media frames, the mockup mat (opt-in above the 2px default) |
| radius-xxxl | 2× | 0.25rem | 4px | Oversized hero cards / large feature panels (opt-in) |
| radius-full | 9999× | — | 9999px | Functionally round controls (toggle, avatar, radio, range, status dots, spinners) |

Controls and panels take the crisp 2px (`radius-md`); only naturally round controls use `radius-full`; `radius-none` is reserved for flush edges (table cells, joined seams, viewport-flush drawer edges).

---

## Flat registry

```
radius-base    0.125rem   (2px)
radius-none    0
radius-xs      0.125rem   (2px)
radius-sm      0.125rem   (2px)
radius-md      0.125rem   (2px)
radius-lg      0.125rem   (2px)
radius-xl      0.125rem   (2px)
radius-xxl     0.25rem    (4px)
radius-xxxl    0.25rem    (4px)
radius-full    9999px
```

---

## Nested radius

When a rounded parent wraps a rounded child with padding between them:

```
innerRadius = outerRadius − padding
```

Use the **px** values from the scale above. With Warm's near-sharp 2px panels the concentric result bottoms out immediately — a padded inset cell simply reuses `radius-xs` (2px), so inner and outer corners read as the same crisp edge.

**Menu and nav rows take `radius-md` (2px), the same crisp corner as every other control.** A hoverable row is a *control*, not an inset cell, so it wears the control corner. In Warm the concentric math and the control radius land on the same 2px value, so nothing inside a panel is ever rounder than the panel itself — the whole surface stays uniformly near-sharp. Concentric math governs decorative inset frames; the **control radius governs anything the user can hover, focus, or click**. This holds for dropdown menu items, account/nav menu rows, select options, and filter rows.

---

## Usage by surface type

| Surface | Token | px |
|---|---|---|
| **Buttons, inputs, selects, alerts** — always crisp rectangles | `radius-md` | 2px |
| **Badges, chips, tabs** | `radius-md` | 2px |
| **Panels** — cards, widgets, modals, drawers (free edges), accordions, tabs panels, tables | `radius-xl` | 2px |
| **Menus & popovers** — dropdown panels, popovers | `radius-lg` | 2px |
| **Textarea (multi-line)** — the panel corner, never a pill | `radius-xl` | 2px |
| **Functionally round controls** — toggle track, avatars, status dots, radio, range, spinners | `radius-full` | 9999px |
| Checkbox tick box | `radius-xs` | 2px |
| Inset cells inside a padded rounded panel (decorative frames) | `radius-xs` | 2px |
| Menu / nav rows inside a menu panel (hoverable controls) | `radius-md` | 2px |
| Oversized hero / feature panels (opt-in) | `radius-xxxl` | 4px |
| Flush lists, table cells, dividers | `radius-none` | 0 |

---

## Prohibited

- **No raw px/rem in components** — use a `radius-*` token.
- **No pill buttons or badges** — they take `radius-md` (2px), never `radius-full`; pill-shaped buttons are a different theme, not Warm.
- **No softly-rounded panels** — cards, modals, and menus take the crisp 2px corner; do not ship 8px/16px/24px panel corners.
- **No `radius-full` on content panels or controls** — full rounding is for naturally round controls only (toggle, avatar, radio, range, dots, spinner), never cards, buttons, inputs, or page panels.
- **No off-scale values** (e.g. 6px, 10px) — add a token to this file if the scale is insufficient.
- **No copying the parent radius onto nested children** without subtracting padding (see nested radius) — items inside a padded panel use `radius-xs`.
- **No mixing step names from foreign systems** — if a token exists here, use its name.
- **No round checkboxes** — the tick box is `radius-xs` (2px), near-sharp. Never `radius-full` on a checkbox control; full rounding is for radios.
