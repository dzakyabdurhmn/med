# Background Patterns — TypeUI · Warm

> **TypeUI · Warm** — decorative background patterns for the hero band.
> Depends on: `colors.md`, `SKILL.md` (hero pattern & band rules), `mockups.md`

Warm's one sanctioned decoration is a **barely visible dot-grid pattern behind the hero** — small filled round dots on a regular pitch, nothing else. It is always a full-bleed layer laid **absolutely over the whole hero region — behind the navbar, headings, CTAs, and mockup** (content sits above it; the navbar stays transparent so the pattern shows through), and it **fades to transparent toward the band's bottom edge** so it dissolves before the first content section. Patterns never appear outside the hero band, and page surfaces everywhere else stay flat and matte.

---

## The color rule (mandatory)

**Every dot is `#E6E0C8` — always.** Soft against the `#FAFAF5` hero surface: visible, but never hard. Never recolor dots toward gray or the brand, and never raise them to full-strength ink marks — the pattern is tiny filled dots only (r ≈ 1–1.5px); no strokes, no outlines, no shapes larger than a dot.

Most variants sit at **one flat fill** under the faint layer opacity; only the shimmer variant varies per-dot opacity (a quiet ~0.35 base with sparkles of 0.55 / 0.75 / 1.0) so the field glimmers instead of reading as a flat printed grid.

---

## The five variants

Exactly one variant per page. Variant 1 is the pattern currently shipped on both heroes; the others are equal citizens when a different texture is wanted. **Every variant is a dot grid — tiny filled round dots (r ≈ 1–1.5px, never larger than 2px) on a regular pitch — never lines, grids of rules, squares, hexagons, waves, or any stroked lattice.**

### 1 · Fine dot grid (currently on both heroes)

Filled **1px-radius dots on a uniform, dense 10px pitch**, rows and columns aligned, covering the full hero at one flat fill — a soft perforated-paper field. The default and the reference.

### 2 · Wide dot grid

The same 1px dots on a **20px pitch** — half the density, twice the air. Use it when the hero content is dense and the fine grid reads busy.

### 3 · Staggered dot grid

1px dots on a **10px pitch with alternate rows offset by half a pitch**, so the field reads as a diagonal weave while every mark stays a round dot on a regular rhythm.

### 4 · Anchor dots

Slightly larger **1.5px dots on a sparse 40px pitch** — barely a texture, more a calibration field. The quietest of the five.

### 5 · Shimmer dots

1px dots on a **20px pitch with per-dot opacity shimmer** (a quiet ~0.35 base with sparkles of 0.55 / 0.75 / 1.0), so the field glimmers instead of reading as a flat print.

---

## Placement & behavior (all variants)

| Aspect | Rule |
| --- | --- |
| Scope | The hero band only — never sections, footers, cards, or the dashboard |
| Position | Absolute, full width and full height of the hero region, `z` behind all hero content (navbar included) |
| Interaction | Non-interactive (`pointer-events: none`), decorative (`aria-hidden`) |
| Fade | Masked to fade to transparent toward the band's bottom edge — the pattern dissolves before the first section |
| Asset | Ship as a real SVG asset (or equivalent), scaled to cover — never a raster image |
| Motion | None — patterns are fully static |

---

## Prohibited

- **No dot color other than `#E6E0C8`** — no grays, no brand tints, no white.
- **No full-strength dots** — if the pattern reads at a glance before the content does, it is too strong.
- **No marks other than tiny round dots** (r ≈ 1–1.5px, 2px hard ceiling) — no lines, rules, squares, rings, crosses, or outlined shapes.
- **No mixing variants** on one page, and no patterns outside the hero band.
- **No animated patterns** — static always.
- **No raster or photographic textures** — patterns are drawn vector line work only.
