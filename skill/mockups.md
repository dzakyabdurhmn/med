# Mockups — TypeUI · Warm

> **TypeUI · Warm** — self-drawn product mockups for heroes and feature sections.
> Depends on: `colors.md`, `radius.md`, `typography.md`, `cards.md`, `SKILL.md` (mockup framing & spacing rules)

A Warm mockup is a **hand-drawn vector illustration of the product UI** — an SVG built from shapes and real microcopy that reads as a believable, live screen. It is **never a photograph, never a raster screenshot, never an embedded image**, and it **never carries a drop shadow**. Every hero or feature mockup follows the construction below so all mockups across the site read as one product.

---

## The frame — the translucent mat (mandatory)

Every mockup sits in the **two-layer frame** (see the framing rule in `SKILL.md`):

| Layer | Spec |
|---|---|
| **Outer mat** | Translucent warm field `rgba(25, 25, 24, 0.04)`; **1px `rgba(25, 25, 24, 0.05)` border** (near-invisible); **4px radius**; **8px padding** |
| **Inner surface** | The mockup itself; **2px radius**; **1px `rgba(25, 25, 24, 0.14)` warm hairline**; `overflow: hidden` so the artwork shares the corner; **no shadow — shadows on mockups are forbidden** |

Never frame a mockup with a single thick border, never drop it bare on the surface, and never add a drop shadow to either layer.

---

## The artwork — a realistic vector screen

Draw the screen as one SVG (a wide landscape viewBox, ~16:10) with **real, readable microcopy** — actual names, values, labels, and timestamps — not lorem bars alone. Placeholder bars are allowed only as secondary texture (e.g. inside a search field); anything the eye lands on first carries real text.

### Chrome anatomy

| Region | Spec |
|---|---|
| **Top bar** | White fill, hairline bottom border; the brand mark (near-sharp tile + wordmark) at the start; a crisp 2px search field with a magnifier glyph and real placeholder copy; a notification bell with a small red dot; a round avatar with initials at the end |
| **Sidebar** | White fill, hairline end border; a small uppercase workspace label; a stack of nav rows (small outline glyph + label); the **active row** on a soft brand-tint 2px fill with brand text; one row may carry a small count badge; a user block (avatar + name + role) anchored at the bottom |
| **Page head** | A medium-weight greeting-style title with a one-line muted subtitle, and a solid brand button (white label) at the end |

### Content regions

Compose the main area from **cards that follow the widget spec**: white fills, `#ECEBDF` hairlines, near-sharp corners (2–3px inside the mockup's own scale), no shadows. A believable mix is:

- **A KPI row** — value + label + a small tinted delta chip (green positive / red negative)
- **One large chart card** — a smooth two-series line/area chart with a legend, faint gridlines, axis labels (e.g. Mon–Sun), and one highlighted data point carrying a small ink tooltip chip with its value
- **One secondary visualization** — a donut with a center stat and dot legend, or a crisp bar chart with one brand-colored emphasis bar
- **One list/table card** — rows of avatar chip + name + event copy + timestamp + a tinted status chip (e.g. Paid / New / Due), separated by faint rules, with a small brand "View all" link

### Palette & type

| Aspect | Value |
|---|---|
| Structure | White surfaces on the `#F8F7EC` screen ground; `#ECEBDF` hairlines; faint `#F3F2E7` gridlines and control fills |
| Text | Ink `#191918` for titles/values; muted `#75756F` body; faint `#BAB9B0` meta — real strings at ~10–15px within the SVG scale, inheriting the UI font |
| Accents | `brand` for the active nav, primary series, buttons, and links; `brand-soft` / `brand-softer` for secondary series and tints; status tints only for real state (green paid, orange due, red alerts) |
| Numerals | Medium (500), tightly tracked for KPI values; tabular where they align |

---

## Prohibited

- **No photographs, raster screenshots, or embedded images** — the mockup is always drawn vector artwork.
- **No shadows on the mockup** — not on the mat, not on the inner surface, not on cards inside the artwork.
- **No lorem-only mockups** — the primary regions carry real, readable microcopy; bar-placeholders are secondary texture only.
- **No off-palette colors** — structure in the warm neutrals, accents from `colors.md`; never introduce foreign hues.
- **No bare or thick-framed mockups** — the two-layer translucent mat is the only mockup frame.
- **No clipped screens** — the framed mockup is fully visible within its section, never cropped by the viewport or section edge.
