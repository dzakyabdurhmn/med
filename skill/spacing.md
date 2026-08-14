# Spacing Tokens — TypeUI · Warm

> The spacing system for **TypeUI · Warm**. Warm breathes on a calm 4px rhythm: controls are comfortable, never cramped, and hierarchy comes from *deliberately uneven* spacing — tight inside a group, generous between groups. Every value below is a literal size and the single source of truth; components reference these tokens for padding, margin, gap, inset, and layout offset, never raw px or rem.

**Root assumption:** `1rem = 16px` unless the product documents a different root.

**Base unit:** one integer step = **0.25rem (4px)**. The scale is proportional — each step is derived from that unit unless listed as a fixed pixel (`spacing-px`) or zero (`spacing-0`).

---

## Token naming

| Pattern | Role |
|---|---|
| `spacing-{step}` | Value from the scale below (`0`, `1`, `2`, … `96`, plus `px` and half-steps) |
| `spacing-0` | Zero — flush, no gap |
| `spacing-px` | Single pixel — hairline separation |

**Applies to:** padding, margin, gap (flex/grid), inset, stack spacing between siblings, and any layout dimension that expresses **space** rather than content width.

**Does not replace:** component-specific width/height tokens for fixed control sizes — use spacing tokens for **distance between and around** elements.

---

## Spacing scale

| Token | rem | px |
|---|---|---|
| spacing-0 | 0 | 0 |
| spacing-px | 1px | 1px |
| spacing-0-5 | 0.125rem | 2px |
| spacing-1 | 0.25rem | 4px |
| spacing-1-5 | 0.375rem | 6px |
| spacing-2 | 0.5rem | 8px |
| spacing-2-5 | 0.625rem | 10px |
| spacing-3 | 0.75rem | 12px |
| spacing-3-5 | 0.875rem | 14px |
| spacing-4 | 1rem | 16px |
| spacing-5 | 1.25rem | 20px |
| spacing-6 | 1.5rem | 24px |
| spacing-7 | 1.75rem | 28px |
| spacing-8 | 2rem | 32px |
| spacing-9 | 2.25rem | 36px |
| spacing-10 | 2.5rem | 40px |
| spacing-11 | 2.75rem | 44px |
| spacing-12 | 3rem | 48px |
| spacing-14 | 3.5rem | 56px |
| spacing-16 | 4rem | 64px |
| spacing-20 | 5rem | 80px |
| spacing-24 | 6rem | 96px |
| spacing-28 | 7rem | 112px |
| spacing-32 | 8rem | 128px |
| spacing-36 | 9rem | 144px |
| spacing-40 | 10rem | 160px |
| spacing-44 | 11rem | 176px |
| spacing-48 | 12rem | 192px |
| spacing-52 | 13rem | 208px |
| spacing-56 | 14rem | 224px |
| spacing-60 | 15rem | 240px |
| spacing-64 | 16rem | 256px |
| spacing-72 | 18rem | 288px |
| spacing-80 | 20rem | 320px |
| spacing-96 | 24rem | 384px |

Half-step tokens use a **hyphen** (`spacing-0-5`, `spacing-1-5`) — not decimals in token names.

---

## Semantic spacing roles

Map component specs to scale tokens. Prefer the **smallest step that reads clearly** — do not jump to large steps without hierarchy reason.

| Role | Token | px | Typical use |
|---|---|---|---|
| none | spacing-0 | 0 | Collapse gutter, flush edges |
| hairline | spacing-px | 1 | Optical border adjacency |
| tight | spacing-1 | 4 | Icon inset, dense chip padding |
| compact | spacing-2 | 8 | Inline gap, badge padding, paragraph gap inside cards |
| inner | spacing-3 | 12 | Label-to-field gap, trigger icon gap, input↔button control row |
| default | spacing-4 | 16 | Standard control padding, card inner padding (mobile) |
| comfortable | spacing-5 | 20 | Accordion trigger padding, card padding (desktop) |
| group | spacing-6 | 24 | Section inner padding, separated card gap |
| section | spacing-8 | 32 | Between component groups in a page |
| layout | spacing-12 | 48 | Between major page sections |
| hero-top | spacing-24 | 96 | Sticky nav clearance below nav bar (see layout rules) |
| touch-min | spacing-11 | 44 | Minimum hit-target outer dimension reference |

These are **roles**, not separate values — each resolves to a `spacing-*` token above.

---

## Pairing rules

- **Inner group (related items):** `spacing-2` – `spacing-3` (8–12px).
- **Between groups in the same section:** `spacing-6` – `spacing-8` (24–32px).
- **Between page sections:** `spacing-12`+ (48px+).
- **Section side padding:** `48px` (`spacing-12`) of inline padding (`padding-inline: 48px`) on both sides of the 1280px container — every section, the navbar, and the footer share it.
- **Section vertical padding:** `112px` top and bottom on desktop, stepping down to **`64px` (`spacing-16`) below the 768px breakpoint** — always applied equally on every section (hero and footer excepted — see `SKILL.md`). The symmetric padding is what divides sections; a **faded separator** may sit centered in the gap between two plain text sections (see the separator rule below), but the padding is the primary divider and stays identical the whole way down the page.
- **Equal gap between every section (whole-page rule).** The vertical whitespace between any two adjacent sections must be **the same everywhere down the page** — no section may sit visibly closer to one neighbour than to the other. Because adjacent sections' vertical paddings stack, the gap you actually see is the **sum** of the upper section's bottom padding and the lower section's top padding (plus any inner margins on the last/first child). With standard symmetric sections this nets a consistent gap automatically. The moment a section is **non-standard** — it owns a background, uses asymmetric padding, or is placed next to one that does (hero, footer, a tinted band, or any section set to `padding-bottom: 0`) — you must **tune its padding so the measured gap to each neighbour equals the standard section gap**. Never let paddings double up on one side (e.g. 176px) while collapsing on the other (e.g. 64px): measure the real pixel gap above and below and make them match. When one neighbour already supplies the full gap (its own padding), the section sets its facing padding to `spacing-0` so the two do not add up. This is **not** in tension with "no equal spacing everywhere" below — that rule governs *inner vs. outer* rhythm inside a section; the gap *between* whole sections is deliberately uniform.
- **Section separators — a faded hairline between text sections.** Every section is either a **card** (a single bounded surface with its own border) or **text** (a heading with copy). Put a **faded separator in the gap between two adjacent text sections**, so text never runs straight into text with nothing between them. A **card section takes no separator on either edge — none above it and none below it** — because its own border already sets it apart; suppress the separator both on the card itself and on the section immediately after it (that one would otherwise land on the card's bottom edge). The separator is a **1px hairline** centered in the gap, a horizontal gradient that is **solid through the middle and fades to transparent at both ends** (`transparent → border → transparent`), spanning the container width. Stay agnostic about what a section contains — decide purely by card vs. text. Never a flat full-width rule; it always fades at the extremities.
- **Footer vertical padding (asymmetric):** top is `96px` (`spacing-24`) or `112px` (`spacing-28`); **bottom is light — at most half the top** (`spacing-12` under a 96px top, `spacing-14` under a 112px top), never equal to the top. **If the footer's last band already has its own `padding-bottom`, the container's `padding-bottom` is `0`** — only one of the two owns the footer's bottom spacing, never both (see `SKILL.md`).
- **Heading → body:** tighter than **section → section** — use `spacing-2`–`spacing-3` below headings, `spacing-8`+ between sections.
- **Control rows (input + button):** align heights first; horizontal gap **`spacing-3`** (12px) minimum.
- **Adjacent action buttons in a cluster:** **`spacing-2`** (8px). Two or more buttons sitting side by side as a unit — a toolbar's *Filters + Sort*, a widget header's *dropdown + Details*, a table's *Add + Settings + Hide fields*, a dialog footer's *Cancel + Save* — are separated by **8px**, not 12px. This is deliberately tighter than the 12px control row above: buttons in a cluster read as **one control group**, while an input and its button are two different things that need air between them. A segmented / joined group is different again — its members share a border and have **no gap at all** (see `button-group.md`).
- **Stacked form fields:** **`spacing-4`**–**`spacing-5`** (16–20px) vertical gap between fields.
- **Equal spacing everywhere is forbidden** — vary inner vs outer deliberately. (Scope: this is about *inner-vs-outer* rhythm within a section. The gap *between* whole sections is the exception — it stays uniform down the page; see the equal-gap-between-sections rule above.)

---

## Flat registry

```
spacing-0        0
spacing-px       1px
spacing-0-5      0.125rem   (2px)
spacing-1        0.25rem    (4px)
spacing-1-5      0.375rem   (6px)
spacing-2        0.5rem     (8px)
spacing-2-5      0.625rem   (10px)
spacing-3        0.75rem    (12px)
spacing-3-5      0.875rem   (14px)
spacing-4        1rem       (16px)
spacing-5        1.25rem    (20px)
spacing-6        1.5rem     (24px)
spacing-7        1.75rem    (28px)
spacing-8        2rem       (32px)
spacing-9        2.25rem    (36px)
spacing-10       2.5rem     (40px)
spacing-11       2.75rem    (44px)
spacing-12       3rem       (48px)
spacing-14       3.5rem     (56px)
spacing-16       4rem       (64px)
spacing-20       5rem       (80px)
spacing-24       6rem       (96px)
spacing-28       7rem       (112px)
spacing-32       8rem       (128px)
spacing-36       9rem       (144px)
spacing-40       10rem      (160px)
spacing-44       11rem      (176px)
spacing-48       12rem      (192px)
spacing-52       13rem      (208px)
spacing-56       14rem      (224px)
spacing-60       15rem      (240px)
spacing-64       16rem      (256px)
spacing-72       18rem      (288px)
spacing-80       20rem      (320px)
spacing-96       24rem      (384px)
```

---

## Usage by surface type

| Surface | Typical tokens |
|---|---|
| Button / input padding | spacing-4 (default), spacing-3 (compact) |
| Card inner padding (marketing / storefront) | spacing-5 desktop, spacing-4 mobile |
| Widget inner padding (application / dashboard) | spacing-6 (24px) desktop, spacing-4 (16px) mobile |
| Adjacent action buttons in a cluster | spacing-2 (8px) |
| Application widget grid gap | spacing-4 (16px) — see `SKILL.md` |
| Accordion trigger padding | spacing-5 |
| Gap label ↔ icon | spacing-3 |
| Gap between stacked paragraphs | spacing-2 |
| Gap between form fields | spacing-4 – spacing-5 |
| Gap between cards in a list | spacing-6 |
| Page section separation | spacing-12 – spacing-16 |
| Sticky nav → hero content offset | spacing-24 below nav (plus measured nav height) |
| Modal / dialog padding | spacing-6 – spacing-8 |
| Table cell padding | spacing-3 – spacing-4 |
| Inline badge padding | spacing-1 – spacing-2 |

---

## Prohibited

- **No raw px/rem in components** for padding, margin, or gap — use `spacing-*` tokens.
- **No off-scale values** (e.g. 15px, 18px) — pick the nearest step or add a token to this file with documented intent.
- **No equal spacing between inner groups and outer groups** — inner groups stay tight; outer groups breathe more. (This targets inner-vs-outer rhythm only; the whitespace *between* whole page sections is instead kept uniform down the page — see the equal-gap-between-sections rule.)
- **No spacing tokens as brand color** — spacing is distance only.
- **No foreign scale names** in specs or handoff — map into `spacing-*` in your implementation layer.
- **No margin hacks for vertical rhythm** when padding on the container is the correct tool — prefer padding on the owning surface for predictable backgrounds and borders.
- **No negative spacing tokens** unless a dedicated inset token is added to this file with documented exception.
