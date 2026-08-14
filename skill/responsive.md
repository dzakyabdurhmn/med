# Responsive Rules — TypeUI · Warm

> How every Warm surface adapts across viewports. These rules are **stack-agnostic** — they name behaviors and breakpoints, not framework utilities — and they are **binding**: a layout that horizontally scrolls at any viewport width is broken, full stop. Depends on: `SKILL.md`, `spacing.md`, `buttons.md`, `tables.md`, `dropdowns.md`.

---

## Breakpoints

One canonical set. Do not invent per-component breakpoints when one of these fits.

| Name | Width | What changes at or below it |
|---|---|---|
| `xl` | 1280px | The 1280px content container meets the viewport edges; its side padding is all that remains |
| `lg` | 1024px | App sidebar goes off-canvas; two-pane layouts (filters + grid, split heroes, two-column sections) stack; 3/4-column grids drop to 2 |
| `md` | 900px | Marketing/store navbar link rows collapse; app top bar wraps (see below); footer grids drop to 2 columns |
| `sm` | 768px | Container side padding steps down 48px → 24px; toolbars stack; feature/stat rows go single column |
| `xs` | 640px | All remaining multi-column grids go single column; joined search drops its category segment; inline input+button pairs stack |

---

## The no-horizontal-scroll law

- **The page never scrolls horizontally, at any width.** Test at 360, 768, 1024, and 1440px: the body must show no horizontal scrollbar and no content may push past the viewport edge.
- **Wide content scrolls inside its own container, never the page.** A data table scrolls within its card (`overflow-x: auto` on the wrapper, with the columns keeping their order); code blocks and wide media scroll inside their own box. Nothing else earns a horizontal scrollbar.
- **Fixed-width elements must be bounded.** Anything with an intrinsic width (dropdown panels, phone mockups, images, badges) is clamped to the viewport (`max-width`, or the dropdown's viewport-edge clamp from `dropdowns.md`) so it can never overflow.
- When a row runs out of room, the fix is **wrap, stack, or relocate — never shrink a control below its spec, never hide a button label, and never let the row overflow** (see `buttons.md`).

---

## Application shell

- **Sidebar:** fixed and visible at `lg` and up; **off-canvas below `lg`**, opened by a hamburger in the top bar (hamburger hidden at `lg`+), over a scrim, sliding from the start edge.
- **Top bar wraps — it never overflows.** The app top bar is a wrapping row: at `md` and below, the **search field drops onto its own full-width row** beneath the actions (order changes, `flex-basis: 100%`), the action cluster keeps its 16px labeled / 4px icon-cluster gaps, and every button keeps its visible label. The bar's horizontal padding steps 24px → 16px at `sm`.
- **Page head** (greeting + primary action) wraps rather than clipping.
- **Widget grids:** KPI rows go 4 → 2 (≈1100px) → 1 (`xs`); chart pair rows stack below ≈1100px. Chart canvases stay their fixed spec height and let the chart library resize horizontally.
- **Tables:** the card never widens the page — the table scrolls inside `overflow-x: auto`, toolbar stacks at `sm` (search full-width row, buttons in a paired grid), and the quick-filter strip wraps.
- **App body padding:** 24px, stepping to 16px at `sm`.

---

## Marketing / storefront

- **Container side padding:** 48px (`spacing-12`) at `sm` and up; **24px below `sm`**. The section rhythm is **112px top and bottom, stepping down to 64px at `sm` (768px) and below** — equally on every section (see `SKILL.md`); the **section header → content gap steps 64px → 48px** at the same breakpoint.
- **Navbars:** the inner content keeps the section width; link rows hide below `md` behind a menu pattern; the store's search and category rows collapse into the mobile pattern from `SKILL.md`.
- **Heroes:** split heroes stack (copy first, media second); the hero H1 may scale down on narrow viewports but never below readable display size; store's joined search keeps input + button only at `xs` (category trigger hidden, input takes the start rounding).
- **Section grids:** feature/testimonial/pricing/product grids collapse 4 → 2 → 1 and 3 → 2 → 1 down the breakpoints, preserving reading order; two-column splits (social proof, CTA, proof quads) stack with their divider removed.
- **Section head with a trailing action:** when a section title carries a small action button at the inline end (e.g. "see more"), the inline button shows **only from `md` (900px) up**; below `lg` (1024px) a **full-width copy of the same button renders after the section's grid** instead (only one of the two is ever visible), so small screens keep the action without crowding the title row.
- **Link directories collapse to an accordion on phones:** a multi-column link directory (e.g. a top-categories section) keeps its open columns down to `sm` (768px); below it, each column becomes an **accordion row** — the column heading turns into a full-width trigger (44px+ touch row, trailing rotating chevron, hairline dividers between groups) with its links hidden until expanded, **one group open at a time** — so phones see a short list of tappable headings instead of a wall of links.
- **Footers:** link grids 4 → 2 (`md`) → wrap; newsletter label/form and bottom-bar clusters stack centered; the input + button pair stacks below `xs` with both keeping full spec height.

---

## Controls & overlays

- **Touch targets:** ≥ 44×44px effective at touch sizes, ≥ 8px between adjacent targets.
- **Buttons:** labels never hide, buttons never shrink or wrap their text (`buttons.md`); rows of buttons wrap or stack as whole units.
- **Inputs + buttons in a row:** equal heights always; below the group's minimum width they stack vertically at full width.
- **Radio option rows collapse to a select on phones:** a horizontal single-select radio cluster (e.g. a toolbar's order-by row) is replaced below `xs` (640px) by a **native select carrying the exact same options** and the cluster's accessible name — one visible control at a time, never both. Checkbox clusters keep their rows (multi-select does not map to a single select).
- **Dropdowns:** panels clamp to the viewport with an 8px margin and flip when they run out of room (`dropdowns.md`); they may grow toward the available width on narrow screens but never past it.
- **Modals:** full-width minus 16px viewport padding on small screens; internal two-column bodies stack below ≈560px; body scrolls, never the page.
- **Images & media:** `max-width: 100%`, intrinsic ratios preserved; mockups scale with their column.

---

## Prohibited

- **No page-level horizontal scroll** at any viewport — ever. If it appears, a fixed-width element or non-wrapping row is the bug; fix the element, do not clip the page.
- **No hiding button labels or dropping controls** to make a row fit — restructure the row instead.
- **No per-component breakpoint inventions** when a canonical breakpoint fits.
- **No shrinking type below spec** to fit — reading text keeps its 16px floor, controls keep their sizes; the layout adapts, not the type.
- **No desktop-only testing.** Every surface ships verified at 360, 768, 1024, and 1440px.
