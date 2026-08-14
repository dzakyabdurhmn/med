# Elevation & Shadow Tokens — TypeUI · Warm

> The depth system for **TypeUI · Warm**. On Warm's light surface, depth is communicated by a **tone-stepped cream panel** plus a **subtle `default` (`#E3E2D8`) border** — never by drop shadows. Cards fill `neutral-primary-soft` (`#FFFEF2`), a raised ivory step off the warm paper page, and read as printed on it; buttons, inputs, and resting cards are **completely flat**. The elevation tokens below are the system’s depth vocabulary; nearly all resolve to **`none`** in this flat theme — components reference them, never one-off shadow values. **One documented exception:** floating overlays — dropdowns, popovers, and menus — carry a soft **medium drop shadow** (`elevation-2`), warm-tinted so it never reads cool. Everything else — every button, input, card, and section — rests shadowless (see `dropdowns.md`).

Depends on: `colors.md` (separation comes from a raised surface tone and the border token, not shadow color).

---

## Token naming

| Pattern | Role |
|---|---|
| `elevation-none` | Flat — no shadow |
| `elevation-{1–5}` | Depth level by intent; all resolve to `none` **except `elevation-2` (the floating-overlay medium shadow)** — resting separation is handled by surface color and border |

Each level is a single token — do not split or hand-roll shadow layers in component code.

---

## Shadow anatomy

| Property | Meaning |
|---|---|
| Offset X | Horizontal displacement (+ right, − left) |
| Offset Y | Vertical displacement (+ down, − up) |
| Blur | Softness of the shadow edge |
| Spread | Expansion (+) or contraction (−) of the shadow shape |
| Color | RGBA — opacity controls perceived elevation (or, for the glow, the brand hue) |

Warm paints almost no shadows; this anatomy is retained so the one documented exception describes its layers consistently.

---

## Elevation scale

| Token | Shadow value |
|---|---|
| elevation-none | `none` |
| elevation-1 | `none` |
| elevation-2 | `0px 0px 0px 1px rgba(25, 25, 24, 0.04), 0px 1px 1px 0.5px rgba(25, 25, 24, 0.04), 0px 3px 3px 1.5px rgba(25, 25, 24, 0.04), 0px 6px 6px -3px rgba(25, 25, 24, 0.04), 0px 12px 12px -6px rgba(25, 25, 24, 0.04), 0px 24px 24px -12px rgba(25, 25, 24, 0.04)` |
| elevation-3 | `none` |
| elevation-4 | `none` |
| elevation-5 | `none` |

---

## Flat registry

```
elevation-none   none
elevation-1      none
elevation-2      0px 0px 0px 1px rgba(25, 25, 24, 0.04), 0px 1px 1px 0.5px rgba(25, 25, 24, 0.04), 0px 3px 3px 1.5px rgba(25, 25, 24, 0.04), 0px 6px 6px -3px rgba(25, 25, 24, 0.04), 0px 12px 12px -6px rgba(25, 25, 24, 0.04), 0px 24px 24px -12px rgba(25, 25, 24, 0.04)
elevation-3      none
elevation-4      none
elevation-5      none
```

---

## Usage by surface type

| Surface | Token | Rationale |
|---|---|---|
| Resting cards, accordions (grouped) | `elevation-none` | Separation comes from the tone-stepped card surface, not shadow |
| Buttons (all variants) and inputs | `elevation-none` | Controls are flat — the fill and the hairline border alone define them |
| Separated cards, hover lift | `elevation-none` | Boundary read from surface tone and spacing |
| Dropdowns, popovers, menus | `elevation-2` | A soft **medium** drop shadow — the floating-overlay exception; lifts the bordered panel off the section |
| Emphasized / active brand element | `elevation-none` | Emphasis comes from the `brand` fill or a `brand` border — never a glow |
| Modals, drawers (sheet) | `elevation-none` | Separation from a backdrop scrim, not a drop shadow |
| Floating action, critical overlay | `elevation-none` | Emphasis through surface and placement |
| Flat lists, flush accordions, inline fields | `elevation-none` | No depth signal |

---

## Principles

- **Hierarchy** — closeness to the viewer is signalled by the `default` border, spacing, and scrims — never by a resting drop shadow.
- **Emphasis** — to prioritize a surface, give it a stronger border (e.g. `brand`), a brand-tinted fill, or a scrim behind it; do not lift a resting fill with shadow, and never with a glow.
- **Restraint** — the whole system is flat; if a screen looks like it needs a shadow to separate two surfaces, use the `default` border instead. The overlay shadow is a functional lift for menus, not a general depth tool.

---

## Prohibited

- **No raw box-shadow strings in components** — use an `elevation-*` token.
- **No drop shadows on resting cards or components** — Warm is flat; separation is by surface color and scrims. Buttons and inputs are likewise shadowless.
- **No colored shadows or glows anywhere** — do not invent per-component halos or brand blooms; if a new depth signal is truly needed, add a token to this file with documented intent.
- **No reintroducing shadow depth** to “lift” a resting element — use a lighter panel surface and a backdrop scrim.
- **No drop shadow to fake depth** — cards and shells separate with the `default` (`#E3E2D8`) border and surface color, not with elevation.
- **No foreign elevation naming** — map into these tokens in your implementation layer; do not rename and call that the design system.
