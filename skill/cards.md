# Cards — TypeUI · Warm

> **TypeUI · Warm** — the system's primary content surface.
> Depends on: `colors.md`, `radius.md`, `shadows.md`, `spacing.md`, `typography.md`, `buttons.md`, `tabs.md`

The card is the face of Warm: a raised ivory panel — `neutral-primary-soft` (`#FFFEF2`), sitting on the warm paper content column and separated from it by a subtle **`default-subtle` (`#ECEBDF`) border** — the crisp `radius-xl` (2px) corners, and generous `spacing-6` padding. It is **flat and static**: a plain ivory fill under a uniform hairline border, with **no effect of any kind on hover** — no glow, no border light-up, no pointer-tracking treatment, no lift. The card lets its content lead; hover feedback belongs to the interactive elements inside it, never to the card surface.

---

## Anatomy

| Part | Role |
|---|---|
| **Root** | Bordered, rounded surface |
| **Media** | Optional top or side image |
| **Header** | Title + optional meta |
| **Body** | Description, lists, form fields |
| **Footer** | Actions, links, meta row |
| **Badge / tag** | Optional status label |
| **Tabs** | Optional nav tabs in header (see `tabs.md`) |

---

## Layout

| Property | Token / value |
|---|---|
| Background | `neutral-primary-soft` (`#FFFEF2`) — a plain, flat ivory fill (widgets on the cream app surface use `neutral-primary` `#FFFFFF`) |
| Border | `default-subtle` (`#ECEBDF`), 1px — a uniform hairline, static in every state (on the cream app surface: `default` `#E3E2D8`) |
| Radius | `radius-xl` (2px) |
| Glow | None — never, in any state |
| Padding (default) | `spacing-6` |
| Max width | Content-driven (~384px for demo cards); full width in grids |
| Gap title ↔ body | `spacing-3` |
| Gap body ↔ footer actions | `spacing-6` |
| Gap between footer buttons | `spacing-4` |
| Hover (clickable card) | **None on the card surface** — the panel stays exactly as it rests; only the interactive elements inside it (links, buttons) show their own hover states |

### Horizontal card

Media column ~40% width; body column padded `spacing-6`; stacks vertically below the tablet breakpoint.

### Image top

Media bleeds to the top edge; its top corners follow the root `radius-xl` and its bottom edge sits square against the body.

---

## Typography

Card titles stay quiet — `font-size-2xl` is the ceiling inside a standard card. Display type belongs to the page, not the card.

| Element | Size | Weight | Line height | Color |
|---|---|---|---|---|
| Card title | font-size-xl (20px — the card-heading rule in `SKILL.md`) | font-weight-medium | line-height-heading | `heading` |
| Card subtitle / meta | font-size-sm | font-weight-normal | line-height-body | `body-subtle` |
| Body | font-size-sm | font-weight-normal | line-height-body | `body` |
| Footer link | font-size-sm | font-weight-medium | line-height-body | `fg-brand` |
| Price / stat emphasis | font-size-xl | font-weight-medium | line-height-heading | `heading` |

---

## Variants

Every variant is the same shell — raised ivory, shadowless, a light step off the paper page, near-sharp corners — rearranged around its content.

### Default

Title + body; the whole card may be a single link.

### With button

Body plus a primary button (`buttons.md` base size) in the footer; an optional trailing icon on the button.

### With text link

The CTA is an `fg-brand` underlined link instead of a button — for lower-stakes follow-through.

### With image

Image above or beside the content; outer-edge radius rules still apply.

### With description only

Longer body copy at the same padding.

### Horizontal

Side-image layout for lists and featured entries.

### User profile

A circular avatar (64–96px) centered above the name, then role, a stats row, and action buttons; an optional dropdown menu in the corner.

### With form

Stacked inputs in the body and a submit button in the footer; field spacing `spacing-4`–`spacing-5`.

### E-commerce

Image, title, price, rating, add-to-cart — the price row uses the stat typography. Two generic rules: a product card's **price may step up to `font-size-2xl` `font-weight-medium`** when it anchors the card (the one place a card price passes the stat size), and a card's **actions row pins to the card foot** (auto top margin) so buttons align across unequal cards in one grid — full-width paired actions share a `spacing-4` gap, and the card's stacked parts sit `spacing-4` apart.

### Card media

Design rules only — the content is the user's:

- Media **fills its slot edge to edge** (cover cropping, centered) inside a **fixed-height, `radius-xl`, overflow-clipped** block — never letterboxed, never a bare icon on a tile (see the imagery rule in `SKILL.md`).
- When card or hero media is a **carousel**, slides move by horizontal translate at **300ms ease**, one active at a time; controls sit centered `spacing-4` below the frame in a **16px-gap** row — ghost icon-only prev/next (`spacing-1-5` padding, neutral hover fill, `radius-xl`, glyphs up to 28px here) around a `font-size-md` `font-weight-medium` `body-subtle` position counter.
- **Media mini-grids inside a card** divide with thin 1px cell-border hairlines (per the composite rules — never doubled at the card edge), content padded `spacing-4` away from every divider.

### Call to action

Centered copy and a single primary button; emphasis comes from a `brand` border over the raised panel, not a fill change.

### With tabs

A tab strip in the header with panel content below; the tab model is delegated to `tabs.md`.

### With list

Icon + text rows in the body; list item padding `spacing-2`–`spacing-3`.

### Pricing

Tier name, price, feature list, and CTA — the highlighted tier is marked by a `brand` border (in place of the default `#E3E2D8`) over the same raised panel.

### Testimonial

Quote body, avatar, and author name — the quote may step up to `font-size-md`.

### Crypto / stats

A large metric, a delta badge, and a sparkline area — the badge follows `badges.md`.

### Composite / glued grid

Several regions sitting **flush in one grid**, separated only by hairline rules rather than free space (a feature matrix, comparison grid, or any flush multi-cell panel), are **one composite card — not many cards glued together**.

**The grid element is the card.** It — and only it — carries the flat `neutral-primary` (`#FFFFFF`) fill, the uniform `default` (`#E3E2D8`) border, and the `radius-xl` (2px) corners with `overflow: hidden`. Never wrap it in a second "frame" element; one element owns the surface.

**Inner cells are fully transparent.** They lay content over the shared fill and never carry their own background, border, or radius — repeating the panel fill per cell reads as separate tiles and is prohibited.

**Dividers are cell borders, never a painted gutter behind transparent cells.** The classic trap is `gap: 1px` + a flat `default` (`#E3E2D8`) `background` on the grid with `background: transparent` cells: since transparent cells sit *on top of* the grid, they show that **flat `#E3E2D8` gutter colour across the whole cell** instead of the shared `neutral-primary` fill, so every cell reads as a separate flat tile with the wrong background. Instead:

- Grid: `gap: 0`, `background: neutral-primary`, a uniform 1px `default` border, `border-radius: radius-md`, `overflow: hidden`.
- Cells: `background: transparent`; draw hairlines as **1px `default` borders on the cells** — `border-top` between rows, `border-right` between columns, resetting the trailing edges at each breakpoint so the outer frame border is never doubled.

Cells show **no hover surface** — the composite stays static like every card, on marketing and dashboard surfaces alike.

### Bento / decorative visual

A bento or feature card whose top holds a **signature decorative visual** — a pill-toggle, connected integration nodes, a radiating pulse core, and the like — above the title and body. The visual is **built in Warm's own palette from CSS + inline SVG**, never an off-theme raster image.

**Stage.** The visual lives in its own inset **stage**: a `radius-xl` (2px) block over the card's `#FFFFFF` fill, backed by a **faint brand dot-grain** (`radial-gradient` dot pattern in `default-medium` `#D1D0C6`, ~0.55 opacity, ~18px cells) that **fades to nothing via a radial `mask-image`** so the pattern never hits the stage edges. Mark the stage `aria-hidden` — it is decoration; the card's heading + body carry the meaning. The visual's layers sit below the card's content and never reflow on hover.

**Palette.** Warm brand tones only: fills run `brand` / `brand-soft` → `neutral-primary`; edges are `default` / `brand-subtle`; emphasis is a flat `brand-soft` / `brand-softer` tint at low opacity — never a glow. No off-token hues.

**Signature construction (stack-agnostic):**

- **Nested rings** — stacked `0 0 0 Npx` `box-shadow`s on a `radius-full` element, so the rings follow the circle shape. Never build rings as extra DOM elements.
- **Integrations = hub-and-orbit** (the preferred "connect your stack" layout — not a cramped row of tiles): a **square stage** holding a centred **brand hub** (a flat filled `brand` `radius-xl` tile, white icon, a `neutral-primary-soft` ring via `box-shadow` + a soft flat `brand-softer` disc behind it), encircled by **one or two dashed orbit rings** (`radius-full` element, `1px dashed default-strong`, ~0.55–0.8 opacity). **App tiles sit on the orbits** at the cardinal points — each an absolutely-positioned `radius-xl` tile pulled onto the ring with `translate(-50%, -50%)`, a `neutral-primary` fill and `default` border — flat, no glow. One orbit slot is the **"+N More" chip**. The rings read as the connective tissue, so no separate connector lines are needed.
- **Hexagon tiles** (optional honeycomb motif) — a `clip-path` polygon (`polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)`) with a **2px-inset `::before`** for the inner fill; edges stay flat hairlines (a `box-shadow` can't escape a `clip-path`, and Warm adds no glow in its place).
- **Connectors** (when nodes are not on orbit rings) — dashed SVG arc `path`s stroked in `fg-brand` with `stroke-dasharray`, at ~0.3–0.5 opacity, behind the nodes.
- **Label chip** (e.g. `+N More`) — a crisp `radius-md` (2px) chip on a flat `brand-softer` tint, no glow.

**Marketing only.** Decorative bento visuals are a landing-page flourish — **never on dashboard / application** cards, which stay flat and data-first.

---

## Shadow & elevation

Cards separate from the paper column by their **`default` (`#E3E2D8`) hairline border** alone. There is no resting drop shadow and **no hover treatment** — a card looks identical at rest, on hover, and on press.

| State | Surface |
|---|---|
| Resting | Plain `neutral-primary-soft` (`#FFFEF2`) fill + `default-subtle` (`#ECEBDF`) border; no shadow, no glow |
| Hover (interactive) | **Identical to resting** — the card surface never changes on hover |
| Inset card (inside another card) | A tone between the parent panel and the page, with its own `default` border, so it reads recessed |

### Static by rule — no hover treatments

A Warm card has **no hover move**. Do not add border recolors, breathing glows, pointer-tracking edge lights, gradient sheens, grain, scale, lift, or shadow on hover — on any surface, marketing included. If a card is clickable, the affordance is its content (a link-styled title, a button), never a surface effect.

---

## Accessibility

- A clickable whole card is one link wrapping the card **or** a heading link plus distinct buttons — never nested interactive elements.
- Images carry meaningful `alt`, or `alt=""` when decorative.
- Tab cards follow the keyboard model in `tabs.md`.

---

## Prohibited

- **No corners other than `radius-xl`** (2px) and no raw hex — a near-sharp 12–24px card or an over-rounded pill card is a different theme, not a Warm card.
- **No shadow and no glow — in any state.** A card carries no shadow at rest and no glow, light-up, breathing border, or pointer-tracking effect on hover. Do not add multi-layer float shadows or any hover surface treatment.
- **No borderless cards** — every card carries the hairline `default` (`#E3E2D8`) border; do not drop it and rely on a shadow.
- **No flat card flush with the page** — a card is a *distinct* panel (`neutral-primary-soft`, `#FFFEF2`) a raised step off the paper page, plus the `default-subtle` (`#ECEBDF`) hairline; never the same tone as the page and never a heavy shadow. Emphasis uses a `brand` border.
- **No off-token or heavy borders** — the border is the hairline `default` (`#E3E2D8`) at 1px in **every state** (a highlighted pricing tier or status card may use an intent edge). Do not thicken it beyond ~1px, recolor it on hover, or use colors outside the token set.
- **No gradient or sheen on the card face** — the fill is the plain `neutral-primary-soft` (`#FFFEF2`) ivory (widgets: `neutral-primary` `#FFFFFF`); never gradient fills, brand sheens, grain, or off-token tints.
- **No full-width hero typography inside default cards** — that lives in the page section, not the card.
- **No per-cell surface in a composite / glued grid** — inner cells never carry their own fill, border, radius, or grain; the grid element alone owns the surface (see **Variants → Composite / glued grid**).
- **No flat gutter behind transparent cells** — never `gap: 1px` + a flat `default` (`#E3E2D8`) `background` on the grid with transparent cells; the cells show the flat gutter colour, not the shared `neutral-primary` fill, and read as separate tiles. Use `gap: 0` and draw dividers as 1px cell borders instead.
- **No two competing primary CTAs** without hierarchy (one filled, one link).
- **No framework class names** in specs.

---

## Card treatments — signature vertical styling

> Moved here from `SKILL.md` (the authoritative card visual rules). These are Warm-specific; marketing/landing only where noted, never on dashboard / application surfaces.

- **Cards are flat and static — no hover effects, ever.** On the paper content column (marketing, storefront) a card is a raised ivory `neutral-primary-soft` (`#FFFEF2`) panel with a uniform 1px `default-subtle` (`#ECEBDF`) border and `radius-xl` (2px) corners; on the cream application surface a widget stays `neutral-primary` (`#FFFFFF`) with a `default` (`#E3E2D8`) border. The card surface never changes on hover: no glow, no border light-up or recolor, no pointer-tracking edge light, no gradient sheen, no grain, no scale, no lift, no shadow. Hover feedback lives only on the interactive elements inside the card (links, buttons).

- **Glued grid / composite card panels — one surface, many cells.** When several regions sit **flush in one grid** — cells separated only by **hairline rules**, not free space between independent cards (e.g. a feature matrix, comparison grid, or any flush panel) — they are **one composite card**, not many cards stacked together. **The grid element itself is the card**: it carries the flat `neutral-primary` fill, the uniform `default` border, and the `radius-xl` (2px) corners with `overflow: hidden` — no grain, no glow, no bloom. Do **not** wrap it in a second "frame" element — one element owns the surface. **Inner cells must be transparent** over that shared fill — **never** each their own panel background, border, or grain layer; repeating the panel fill per cell reads as separate tiles glued together and is prohibited.
  - **Dividers are cell borders, never a painted gutter behind transparent cells.** The classic trap: setting `gap: 1px` + a flat `default` (`#E3E2D8`) `background` on the grid, then making cells `background: transparent`. Because transparent cells sit **on top of** the grid, they don't reveal the grid's `neutral-primary` fill — they reveal that **flat `#E3E2D8` gutter colour across the whole cell**, so every cell reads as a separate flat tile with the wrong background. **Prohibited.** Instead: give the grid `gap: 0` and draw the hairlines as **1px `default` borders on the cells** (`border-top` between rows, `border-right` between columns, reset at row/column ends per breakpoint). The cells stay fully transparent and the one `neutral-primary` fill shows through every cell as a single continuous surface. (If you must use `gap`, the gutter background has to be the **same fill as the frame**, not a flat off-tone colour — but cell borders are the reliable pattern.)
  - The hairline rules use the `default` (`#E3E2D8`) colour purely as **functional dividers** — never a stronger step than the frame border. Cells show **no hover surface** on any page — the composite stays static like every Warm card; hover feedback belongs to the links and buttons inside a cell.
- **A badge / label anchored to a card's top must stay fully inside the card — never straddle the edge, because the card clips (`overflow: hidden`).** A marketing card owns its surface with `overflow: hidden` (for the dust grain and the `radius-xl` border clip). So a "Recommended" / "Most popular" pill (or any top-anchored badge) that is absolutely positioned **must sit entirely within the card's top area** — do **not** pull it half-outside the top border with a `translateY(-50%)`, because `overflow: hidden` will **crop the half that sticks out**. Position it fully inside: `position: absolute; top: <spacing>; left: 50%; transform: translateX(-50%)` (no negative Y translate), and give the card **extra top padding** so its heading clears the badge. If a design truly needs a badge straddling the border, that specific card must drop `overflow: hidden` (and therefore forgo the clipped grain) — but the default and preferred pattern is **badge fully inside a clipped card**. Also remember `.marketing-page .card > *` forces `position: relative` on direct children, so scope the absolute badge rule under `.marketing-page` (or raise specificity) or it will fall back into normal flow and stretch full-width.
- **Bento decorative visuals — built in-palette, never off-theme raster art (marketing only).** A bento / feature card may carry a **signature decorative visual** in its upper "stage" (a pill-toggle, connected integration nodes, a radiating pulse core, etc.) above its title + body. Build these **entirely from CSS + inline SVG in Warm's own light brand palette** — never drop in an off-brand raster image. The visual sits on its own stage inside the card: a `radius-xl` (2px) inset block over the card's `#FFFFFF` fill, backed by a **faint brand dot-grain** (a `radial-gradient` dot pattern in `default-medium` `#D1D0C6` at ~0.55 opacity, `~18px` cells) that **fades out via a radial `mask-image`** so it never meets the stage edges as a hard pattern. Every accent element uses Warm brand tones only — fills run `brand`/`brand-soft` → `neutral-primary`, edges are `default`/`brand-subtle`, and emphasis is a flat `brand-soft`/`brand-softer` tint at low opacity, never a glow. Signature moves, all stack-agnostic: **nested "rings"** are drawn as stacked `0 0 0 Npx` `box-shadow`s on a `radius-full` element (they follow the circle shape — never real extra DOM rings); an **integrations / "connect your stack" visual** is a **hub-and-orbit**, not a cramped row of tiles — a single flat **brand hub** (a filled `brand` `radius-xl` tile with a white icon, a `neutral-primary-soft` ring + a flat `brand-softer` disc behind it) centred in a **square stage**, encircled by **1–2 dashed orbit rings** (a `radius-full` element with a `1px dashed default-strong` border at ~0.55–0.8 opacity), with **app tiles positioned on the orbits** at the cardinal points (each an absolutely-placed `radius-xl` tile `translate(-50%,-50%)` onto the ring, `neutral-primary` fill, `default` border — flat, no glow) and a **"+N More" chip** occupying one orbit slot; the flat `brand-softer` disc sits behind the hub. Prefer this orbit layout over hexagon rows for integration ecosystems. (Hexagon tiles remain available where a honeycomb motif is wanted: a `clip-path` polygon with a 2px-inset `::before` for the inner fill; edges stay flat hairlines — a `box-shadow` won't show past a `clip-path`, and Warm adds no glow in its place.) A **"+N More" / label chip** is a crisp `radius-md` (2px) chip on a flat `brand-softer` tint, no glow. The stage is **decorative** — mark it `aria-hidden` and keep the real meaning in the card's heading + body. The visual's own layers sit **below the content** and **never animate the layout** on hover. This is **marketing / landing only — never on dashboard or application** cards, which stay flat and data-first.
