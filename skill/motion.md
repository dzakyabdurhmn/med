# Motion — TypeUI · Warm

> The motion system for **TypeUI · Warm**. Warm moves like it looks: **calm, short, and colour-led**. Motion in Warm is almost always a *state change* — a fill deepening, a border lighting up, a chevron turning — never a performance. Nothing bounces, nothing scales, nothing slides across the screen to announce itself. Every value below is a literal duration or curve and the single source of truth; components reference these tokens, never ad-hoc `0.28s` or `cubic-bezier(...)` values.
> Depends on: `colors.md`, `shadows.md`

**Why this file exists:** every other foundation (`colors`, `spacing`, `radius`, `shadows`, `typography`) owns a token registry. Motion is the one dimension authors are most tempted to invent per-component — and an interface where one control eases in 180ms, its neighbour 250ms, and a third 300ms feels *subtly broken* even when every screenshot looks perfect. Pick from the scale below; never invent a duration.

---

## Duration tokens

| Token | Value | Use |
|---|---|---|
| `duration-instant` | `0ms` | Reduced-motion fallback; state changes that must not animate |
| `duration-fast` | `150ms` | **Colour-only state changes** — hover / focus / active fills, borders, text colour, the focus ring |
| `duration-base` | `200ms` | **The default.** Anything that *moves or reveals*: a chevron rotating, a toggle thumb travelling, an accordion opening, a menu fading in |
| `duration-slow` | `300ms` | **Overlay entrances** — a modal/drawer backdrop fading, a drawer sliding in; also the hover-intent open delay on a hover-triggered menu |

**Nothing in Warm animates longer than `duration-slow`.** If a transition needs more than 300ms to read, the motion is wrong — not too fast.

---

## Easing tokens

| Token | Curve | Use |
|---|---|---|
| `ease-standard` | `ease` | **State changes that start and end in place** — hover fills, border and colour shifts, a fill deepening one step. The element is not going anywhere; it is *becoming* something. |
| `ease-entrance` | `ease-out` | **Anything entering or leaving the screen** — menus, tooltips, modals, drawers, alerts. Fast at the start, settling at the end: the element arrives and comes to rest. |

Warm does **not** ship an `ease-in-out`, a spring, or a custom `cubic-bezier`. Two curves cover the system.

---

## Flat registry

```
duration-instant   0ms
duration-fast      150ms
duration-base      200ms
duration-slow      300ms

ease-standard      ease
ease-entrance      ease-out
```

---

## What animates — and what never does

| Element | Property | Token |
|---|---|---|
| Button (all variants) | background-color, border-color, text colour | `duration-base` · `ease-standard` |
| Input, select, textarea | border-color, focus ring | `duration-fast` · `ease-standard` |
| Nav item, sidebar row, menu row | background, colour | `duration-fast` · `ease-standard` |
| Chevron / disclosure arrow | `transform: rotate` | `duration-base` · `ease-standard` |
| Toggle thumb | `transform: translateX` | `duration-base`; its track colour `duration-fast` |
| Accordion / collapsible | height or grid-template-rows | `duration-base` · `ease-standard` |
| Dropdown, tooltip, popover | opacity (+ optional slight scale) | `duration-base` · `ease-entrance` |
| Modal / drawer backdrop + panel | opacity, transform | `duration-slow` · `ease-entrance` |
| **Resting card / widget / section** | — | **Never. Cards are flat and static (`cards.md`).** |

---

## Reduced motion

**`prefers-reduced-motion: reduce` is honoured everywhere, and it is not optional.** Under reduced motion:

- **Movement is removed** — no transform, no slide, no scale, no rotate. A chevron simply *is* rotated; a drawer simply *is* open.
- **Colour changes may remain**, because a hover fill that snaps is not a motion hazard — but they resolve at `duration-instant` if the product prefers.
- **Never** substitute a "gentler" animation; remove it.

---

## Prohibited

- **No ad-hoc durations or curves.** `0.18s`, `0.25s`, `0.28s`, `250ms`, a hand-tuned `cubic-bezier` — all forbidden. If none of the four durations fits, the interaction is wrong; do not add a fifth value without adding a token here with documented intent.
- **No motion on resting surfaces.** Cards, widgets, and sections do not lift, glow, scale, tilt, or track the pointer on hover — see `cards.md`. Hover feedback belongs to the controls *inside* them.
- **No entrance animation on page or section load.** Content is present when the page paints; nothing fades up, staggers in, or reveals on scroll. Warm's motion is **reactive to the user**, never ambient.
- **No transform-based hover on buttons or links** — no `translateY(-1px)` lift, no `scale(1.02)`. The primary button's hover is a **colour deepening only** (`buttons.md`); a moving button is not Warm.
- **No layout-shifting animation.** Never animate `width`, `height`, `margin`, or `padding` on something that would reflow its siblings; animate `opacity`, `transform`, `background`, `border-color`, `box-shadow`, or a `grid-template-rows` collapse.
- **No looping / infinite animation** except a genuine loading spinner or skeleton shimmer.
- **No animation as the sole signal of a state change** — a state must also be readable when motion is off (colour, icon, text, `aria-*`).
