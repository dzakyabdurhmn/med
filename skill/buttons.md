# Buttons — TypeUI · Warm

> **TypeUI · Warm** — the action layer of the system.
> Depends on: `colors.md`, `radius.md`, `shadows.md`, `spacing.md`, `typography.md`, `badges.md`

In Warm, a button is a **crisp near-sharp block** (`radius-md`, 2px) set in the **primary UI family (Inter), always uppercase** (`font-family`, `font-weight-normal` (400) under wide `letter-spacing-wide` tracking — the label speaks through case, never through weight; the written string stays sentence case and a text transform does the capitalizing). The primary wears a **flat `brand` crimson fill** — no gradient, no shadow — with a **white label**. On hover the fill deepens one step (`brand` → `brand-medium`) while the white label holds. Buttons are confident but never loud: exactly one filled **brand** primary leads each section, and everything else steps back to secondary, tertiary, ghost, outline, or link. The deep **crimson brand** carries "the next step"; the status fills (success, danger, warning) appear only when the action genuinely is that. The hover treatment is documented under **Signature interaction**.

---

**The brand fill is DEEP, so the label is WHITE.** `brand` (`#A71D31`) is a deep crimson: a white label on it computes to **7.3:1** while an ink label is only **2.4:1** and fails. Every filled brand control — the primary button, the brand mark, an active segment, a selected chip — prints its label in `white`. Ink stays only on the genuinely light fills (like the light `warning`).

**Graphic fills still take `brand-strong`.** `brand` against a card now clears the floor at **6.6:1**, but a firmer graphic mark — a chart bar, a progress fill, a toggle track, a radio dot or a slider — still takes **`brand-strong`** (`#741320`), the deepest crimson, which reads emphatically and carries a white mark on top.

## Anatomy

| Part | Role |
|---|---|
| **Root** | Button or link-styled control |
| **Label** | Text content |
| **Leading / trailing icon** | Optional 16px glyph |
| **Badge** | Optional count pill inside label (see `badges.md`) |
| **Loader** | Optional spinner replacing icon or prefixing label |

---

## Sizes

**Dashboard rule — small buttons by default.** In dashboard, application, and product-UI layouts, buttons use the **Small** size — never the **Base** (or larger) default. Reserve Base and larger for marketing, landing, and editorial pages.

Five tiers, all sharing the same soft shell. A `font-size-xs` (12px) base label keeps buttons compact and businesslike — the uppercase label runs one step smaller than the 14px control baseline so it reads balanced; reach for Large/Extra large only on marketing CTAs.

**Buttons are sized by padding, not a fixed height** — the vertical padding drives the height so the shell scales cleanly. Two sizes carry the system:

| Size | Font | Padding (inline × block) | Height (approx) | Icon | Used for |
|---|---|---|---|---|---|
| Extra small | 10px | 14 × 9px | ~28px | 14px | Dense inline chips |
| **Small** | 12px | **20 × 13px** | **~38px** | 16px | **Only** navbars, widgets, modals, drawers, and sidebars |
| **Base (default)** | 12px | **26 × 15px** | **~42px** | 16px | Sections, cards, CTA cards, and footers — the landing-page default |
| **Large** | 12px | **24 × 19px** | **~50px** | 16px | **Hero CTAs — the default hero button** |

- **Large button** = **19px** vertical / **24px** horizontal padding (≈ 50px tall). The hero CTA size. Bordered variants (primary, outline) carry **18px / 23px** so the 1px border keeps the same box.
- **On mobile there is no Large button — it renders at Base.** Below the `sm` breakpoint (768px) every `Large` button steps down to the **Base** size (15px / 26px, 12px label; bordered variants 14px / 25px). Large is a *desktop hero affordance*: at phone width a ~50px button swallows the viewport and its label outgrows the copy around it. Author the CTA as Large as usual — the size steps down responsively; never hand-swap the class per breakpoint.
- **Base button** = **15px** vertical / **26px** horizontal padding (≈ 42px tall). This is the roomy, confident marketing button — the padding grew a step so the smaller uppercase label keeps the same box.
- **Small button** = **13px** vertical / **20px** horizontal padding (≈ 38px tall). Reach for this in navbars, product/dashboard chrome, and inline actions.
- Height comes from `padding-block` + a `line-height: 1` label — **never a fixed pixel height** — so a short label and a long label share the same box.

**Tier placement (binding):** on a landing / marketing page the **hero CTA buttons are Large by default**; buttons in **sections, cards, CTA cards, and the footer are Base**; the **Small** tier appears **only** in navbars, widgets, modals, drawers, and sidebars — never in page content. One tier per context, applied consistently.

Shared shell, every size:

| Property | Value |
|---|---|
| Weight | font-weight-normal (400) — the uppercase label trades weight for case |
| Line height | 1 (the label sits tight; padding sets the height) |
| Type | `font-family` (Inter, the primary UI family), **uppercase — always** (apply as a text transform), `letter-spacing-wide` (0.05em) |
| Radius | `radius-md` (2px) — every button is a crisp near-sharp rectangle, every size and variant |
| Surface depth | **None (`elevation-none`)** — every button variant is completely flat, no shadow ever; see `shadows.md` |
| Gap label ↔ icon | `spacing-1-5` (6px) — the fixed icon-to-label gap from `SKILL.md` |
| Min touch target | 44px on mobile — pad to meet if label is short |

---

## Variants — filled

The workhorses. The **brand** primary wears the flat crimson treatment (see **Signature interaction**); the other intents are solid fills of their intent token with the same focus ring and the same hover shift — the fill deepens to a *one-step-deeper shade of that same intent* and the label stays put (`white` on the dark brand / success / danger / dark fills, ink on the light warning fill). The **Secondary** rests on the soft cream `neutral-secondary-medium` (`#EFEEE3`) — a secondary button is never a white slab.

| Variant | Background | Text | Border | Hover background | Focus ring |
|---|---|---|---|---|---|
| **Primary (brand)** | `brand` — one flat crimson fill | `white` | transparent | `brand-medium` — one step deeper | `brand-medium` |
| **Secondary** | `neutral-secondary-medium` | `body` | `default-medium` | `neutral-tertiary-medium` + `heading` text | `neutral-tertiary` |
| **Tertiary** | `neutral-primary-soft` | `body` | `default` | `neutral-secondary-medium` + `heading` text | `neutral-tertiary-soft` |
| **Success** | `success` | `white` | transparent | `success-strong` | `success-medium` |
| **Danger** | `danger` | `white` | transparent | `danger-strong` | `danger-medium` |
| **Warning** | `warning` | `heading` (ink) | transparent | `warning-strong` | `warning-medium` |
| **Dark** | `dark` | `white` | transparent | `dark-strong` | `neutral-tertiary` |
| **Ghost** | transparent | `heading` | transparent | `neutral-secondary-medium` | `neutral-tertiary` |

Focus ring: a visible spread using the intent ring token; offset 0. This ring is how the system stays keyboard-first, so it is never removed.

---

## Variants — outline

The quieter sibling of filled: a soft cream **`neutral-secondary-medium` (`#EFEEE3`) fill — never white**, a **1px** intent border, and an intent-foreground label. On hover the button "fills in" with its intent and the label flips to that fill's proper contrast — **`white` on the deep brand and dark success / danger fills**, ink on the light warning fill.

**Outline border width is always 1px** — every outline variant carries a 1px border in its intent color (the `Border` column below names the color, the width is 1px). Like every other edge in the system, a button border is a hairline — **1px on every button variant that carries a border, never thicker**.

| Variant | Border (1px) | Label | Hover fill |
|---|---|---|---|
| Brand | `brand` | `fg-brand` | `brand` (label → `white`) |
| Neutral | `default` | `body` | `neutral-tertiary-medium` |
| Success | `success` | `success` | `success` |
| Danger | `danger` | `danger` | `danger` |
| Warning | `warning` | `warning` | `warning` |

Outline sizes mirror the filled size table exactly.

---

## Signature interaction — flat crimson fill + white label

The defining button of Warm is a **flat `brand` crimson block with a white label** — no gradient, no shadow, no border. At rest the fill is one uniform crimson slab, printed flat on the surface like everything else in the system. On hover the **fill deepens one step** (`brand` → `brand-medium`) while the **white label** holds. No bloom animation, no glow, no scale — one confident color shift. The rule is **stack-agnostic**: it names which token supplies each value, so it can be built with plain CSS, a CSS-in-JS layer, a utility framework, or any renderer.

**Token sourcing (never hard-coded):**

| Aspect | Source |
|---|---|
| Resting background | `brand` — one flat crimson fill — `colors.md` |
| Resting label | `white` — the deep crimson fill takes a white label, never ink |
| Resting border | none (transparent) — the flat fill alone defines the edge |
| Resting shadow | **`elevation-none`** — buttons are flat — `shadows.md` |
| Hover background | one step deeper: `brand-medium` |
| Hover label | stays `white` (the deeper crimson keeps it legible) |
| Focus ring | `brand-medium` — `colors.md` |
| Corner radius | `radius-md` (2px, near-sharp) — `radius.md` |
| Padding / sizing | the **Sizes** table above (`spacing-*`) — `spacing.md` |
| Font family / weight / size | `font-family` (Inter, the primary UI family), `font-weight-normal` (400), size per tier — `typography.md` |
| Tracking | `letter-spacing-wide` (0.05em) — the uppercase label needs air — `typography.md` |
| Easing / duration | ~150–200ms ease on the background shift |

**Surface depth — exact value, agnostic:**

```
box-shadow: none
```

Nothing lifts a Warm button off the page. Every button variant is equally flat (solid, outline, secondary, dark, danger, and ghost alike), and **inputs are just as flat** — the fill and the hairline border do all the work, no exceptions.

**Status variants:** each intent button rests on its own solid fill (`success` / `danger` / `warning`) and deepens to that intent's stronger step on hover (e.g. `success` → `success-strong`), the label staying put (`white` on success / danger, ink on warning) — same shift, same hue, one step deeper.

**Behavior:** at rest, a flat `brand` block with a ink label. On hover, the fill deepens one step; the label never moves. On focus, the `brand-medium` ring shows. Honor `prefers-reduced-motion` — the color shift is a plain transition, no movement to reduce.

**Reference implementation** (illustrative only — every literal here must resolve to the tokens in the table above):

```css
/* Flat crimson button — map every literal to a Warm token before shipping.
   The fill is a single background-color, so the one-step-deeper hover
   transitions smoothly on its own — no gradient tricks needed. */
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: var(--radius-md);                 /* crisp 2px rectangle */
  background-color: var(--brand);                  /* one flat crimson fill */
  box-shadow: none;                                /* buttons are flat */
  color: var(--white);                             /* white label — the deep crimson reads 7.3:1 with white */
  font-family: var(--font-family);                  /* Inter — the primary UI family */
  font-weight: 400; /* light labels — the uppercase does the talking */
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide); /* 0.05em */
  line-height: 1;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

button:hover {
  background-color: var(--brand-medium);           /* hover: one step deeper */
}

button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--brand-medium);       /* the focus ring */
}
```

Every other variant (outline, ghost, status) follows the same pattern — a plain `background-color` transition between the resting fill and the one-step-deeper hover fill, which interpolates smoothly on its own.

---

**Ghost carries no surface.** A ghost button is **transparent at rest**: no fill, no border, nothing but its label. Its hover fill (`neutral-tertiary-medium`) is the only surface it ever shows. A ghost that sits on a visible fill while idle has quietly become an outline button, and the tier below outline disappears from the system.

## Status buttons (success, warning, danger)

Status buttons come **last** in the variant order: they are the exception, not the palette. One per screen at most, and only when the action genuinely *is* that status.

| Variant | Fill | Label | Ratio |
|---|---|---|---|
| **Success** | `success-strong` | white | 5.4:1 |
| **Warning** | `warning` | **ink** | 6.3:1 |
| **Danger** | `danger-strong` | white | 5.2:1 |

**The fill picks the label, never the habit.** A status fill is not automatically dark: `warning` (`#F97316`) under a white label reaches only **2.8:1**, and plain `danger` (`#E5484D`) reaches **3.9:1** — both fail. Compute the pair; take white on the dark tones and ink on the light ones. This is the same rule the crimson brand fill obeys (deep fill → white label).

## Disabled (mandatory)

A button that cannot be pressed must **look** like it, in every variant. There is one disabled treatment and it overrides the variant entirely:

| Property | Value |
|---|---|
| Fill | `neutral-secondary-medium` (the flat secondary cream) — never the brand fill, never a variant fill |
| Label | `fg-disabled` |
| Border | `default` |
| Cursor | `not-allowed` |
| Hover / active | **none** — a disabled control never answers the pointer |

**One disabled look, shown once.** Because the treatment overrides the variant, every disabled button is identical — a disabled ghost and a disabled outline are the same object. Document and specimen it **once**; a row of four identical grey buttons teaches nothing and implies a difference that does not exist.

**Disabled is not invisible.** `fg-disabled` must stay **perceivable on the disabled fill (≥ 3:1)**. A label so faint it disappears does not read as "off", it reads as broken rendering, and users hunt for a control that is simply unavailable. Do not express disabled with opacity alone: opacity fades the *whole* button including its border, which flattens the control into the page.

## Icon buttons

A square control — width equals height per tier — for toolbars and compact actions. Use any filled, outline, or ghost row above.

| Size | Box | Icon |
|---|---|---|
| Small | 36 × 36px | 16px |
| Base | 40 × 40px | 16px |
| Large | 44 × 44px | 20px |

There is no visible label, so an **`aria-label` is mandatory** — never ship a nameless icon button.

---

## Special patterns

### With badge

Primary label + a circular count pill (`spacing-2` gap) — see the button-attached count in `badges.md`.

### Loader

A 16px spinner sits at the label start; keep or hide the label, but mark the control `disabled` or `aria-busy="true"` while it runs so it cannot be double-submitted.

### Disabled

Drop to 50% opacity or `fg-disabled` text, remove hover and the focus ring, set `pointer-events: none`, and apply the native `disabled` attribute. A disabled button must never look clickable.

### Link as button

An anchor wearing button tokens — use it for navigation that should read as a primary action, and keep the keyboard focus ring intact.

### Provider / OAuth / payment

The one place third-party brand color is allowed: isolated provider variants (social login, wallet, card network). Document the provider hex *outside* the semantic tokens and never recycle it as a system intent.

### Gradient / colored shadow (optional marketing)

Not part of core Warm. Default product UI is solid fills only. If a campaign needs a gradient, define the paired tokens in `colors.md` and `shadows.md` first — do not hand-roll them on the button.

---

## Motion

Warm buttons shift color on hover with a short, smooth transition — **never a hard snap between states**. The deepening must visibly ease in over ~150–200ms.

| Transition | Duration | Properties |
|---|---|---|
| Hover shift | ~150–200ms ease | background deepens one step (`brand` → `brand-medium`, or the intent's stronger step) |
| Focus | ~150ms | `brand-medium` ring |
| Loader | continuous | Spinner rotation |

Every Warm button is a solid flat fill, so the hover shift is a plain **`background-color`** transition between the resting fill and its one-step-deeper hover step — nothing else needs to animate. Every button carries the transition on its resting rule so both enter and leave animate.

Honor `prefers-reduced-motion`: the hover shift is a plain color transition — no movement, nothing further to reduce.

---

## Accessibility

- Native `<button type="button|submit|reset">` for actions; `<a>` only when navigating.
- Icon-only controls carry a descriptive `aria-label`.
- Loading state uses `aria-busy="true"` and blocks duplicate submits.
- The 4px focus ring is always visible on keyboard focus — never remove the outline without an equivalent replacement.
- Truly inactive controls leave the tab order.

---

## Prohibited

- **No Large buttons on mobile** — below `sm` (768px) the Large size resolves to Base. A 50px control is a desktop-only scale.
- **No raw hex in core variants** — semantic tokens only (documented provider buttons are the sole exception).
- **No pill or softly-rounded buttons** — every button is a crisp `radius-md` (2px) rectangle; a 9999px pill or an 8px/16px button corner is a different theme, not Warm.
- **No framework class names** in specs.
- **No shadows on buttons — at all.** Every button variant is flat (`elevation-none`); never drop shadows, layered lifts, or glows on any button in any state.
- **No two primary brand buttons** side by side in one action group — Warm allows a single obvious next step.
- **No mixed control heights or label styles in one row** — a button never sits beside a taller or shorter button, dropdown / select trigger, or field, and **never beside one wearing different label typography**. Adjacent controls share the row's tier box exactly (all ~38px Small in widget chrome, all ~42px Base in content) **and the one button label voice (uppercase, 400, 12px, wide tracking)**; a widget-header trigger is built to the Small button box, never a stray in-between height or a private sentence-case label. See the same-height row rule in `SKILL.md`.
- **No font-size above `font-size-xs` (12px)** on standard buttons — every tier (small, base, and large alike) shares the one 12px uppercase label; only the dense extra-small tier drops to 10px. Size is expressed through padding, never through the label.
- **No sentence-case or mixed-case button labels** — every button label renders uppercase (via a text transform; the source string stays sentence case), at `font-weight-normal` (400) with `letter-spacing-wide`. A medium or bold button label, or a lowercase one, is a different theme, not Warm.
- **No ghost variant for a destructive confirm** — use danger filled or outline so the stakes read.
- **No off-token hover fill** — the hover state is the *one-step-deeper shade of the resting fill* (`brand` → `brand-medium`, or the intent's stronger step) and the label stays put (`white` on brand/success/danger/dark, ink on warning); never an off-token fill, a pale washed-out tint, or a rainbow blend. There are no gradients on buttons — every fill is flat.


---

## Height parity — outline vs. solid

**An outline button is the exact same height as a solid button of the same size.** The outline variant's border must **not** make it taller than its solid counterpart.

- Give buttons **`box-sizing: border-box`** so the border is drawn *inside* the button's height, never added on top of it — a solid and an outline button of the same size then measure **identical heights** and line up pixel-for-pixel in a row.
- If a variant's border is thicker than the default, **trim its padding by the extra border width** so the content box (and total height) stays constant across variants.
- The label baseline, icon size, and vertical padding read the same whether the button is solid, outline, or ghost.
- **Icons never drive button height.** A 14–16px glyph inside a `line-height: 1` label box (12–13px) would silently stretch an icon button 2–3px taller than a text-only one — which reads as "the outline button is smaller" whenever the solid CTA carries an icon and the outline one doesn't. Absorb the icon's overflow vertically (e.g. a negative block margin on the glyph) so the label line + padding alone set the height: icon, text-only, outline, and solid buttons of one size all measure **identical**.
- **Prohibited:** an outline (or any bordered) button that renders taller than the solid button of the same size, and **any button whose height changes because it carries an icon**. Height parity across variants and content is mandatory.

---

## Labels never hide — no responsive icon-only collapse

**A labeled button keeps its visible text label at every breakpoint.** Never strip a button's label on small screens to squeeze it into a row — a button that reads "New run" on desktop must still read "New run" on a phone, not shrink to a bare `+` glyph.

- When horizontal space runs out, the layout adapts around the button: wrap the row, stack the buttons, widen to full-width, drop a *whole* lower-priority control (or move it into an overflow menu) — the surviving buttons keep their labels.
- Genuine **icon-only controls** (bell, theme toggle, hamburger, close ✕) are exempt — they are *designed* icon-only at every size and carry an accessible name. The rule forbids *converting* a labeled button into an icon-only one responsively.
- **Prohibited:** `display: none` (or equivalent) on a button's label text inside any breakpoint; shipping a control that is labeled on one viewport and icon-only on another.
