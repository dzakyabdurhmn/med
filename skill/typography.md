# Typography Tokens — TypeUI · Warm

> The type system for **TypeUI · Warm**. Warm speaks in **Inter** for everything — body, UI, buttons, and every heading (`font-family-serif`, the display-face slot, resolves to the same Inter), with headings at **medium (500), tightly tracked** (`letter-spacing-tighter`, -0.04em), **small uppercase Inter** for labels, eyebrows, ticker strips, and every button label (wide tracking, normal 400 weight on buttons), and a neutral **monospace for code only** — one calm, editorial voice; nothing renders heavier than medium (500). A 14px control/body baseline with a disciplined heading ramp, so interfaces read quiet, printed, and confident. Sizes, weights, line heights, letter spacing, and family stacks are literal values and the single source of truth; components reference these tokens (and color tokens from `colors.md`), never ad-hoc type settings.

**Root assumption:** `1rem = 16px` unless the product documents a different root.

**Size scale logic:** Major-second ratio (**×1.125** per step from base), rounded to whole pixels on desktop. Custom text must pick a token from the scale — never invent sizes between steps.

---

## Token naming

| Pattern | Role |
|---|---|
| `font-family` | **Primary UI family** — set once per design system (brand face + fallbacks) |
| `font-family-monospace` | Code and preformatted text only |
| `font-family-serif` | The display-face slot — every heading renders in it (resolves to Inter in Warm, not a serif) |
| `font-size-{step}` | T-shirt scale (`xxs` → `10xl`, plus `hero`) |
| `line-height-{role}` | Multipliers for heading, body, component, detail, **display** |
| `font-weight-{step}` | Weight scale (`thin` → `black`) |
| `letter-spacing-{step}` | Tracking scale |

Default body: **`font-size-sm`** + **`line-height-body`** + **`font-weight-normal` (400)** + **`font-family`**.

---

## Primary font family

**`font-family` is the main typography token.** All UI surfaces use `font-family` unless a spec names `font-family-monospace` or `font-family-serif`.

| Token | Value |
|---|---|
| font-family | "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif |

**Brand typefaces for this design system:** [Inter](https://rsms.me/inter/) for body, UI, and headings alike; **every heading (`h1`–`h6`) renders in the display face `font-family-serif` — which resolves to the same Inter — at medium (500) with tight negative tracking (`letter-spacing-tighter`, -0.04em)**; **labels, eyebrows, and ticker text use the primary `font-family` (Inter) in small uppercase with wide tracking (`letter-spacing-wide`); button labels are uppercase too — always — at `font-weight-normal` (400) with the same wide tracking**; the monospace `font-family-monospace` is reserved for code. Load the face in your product’s font layer; the tokens are the stacks components reference.

```
font-family   "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif
```

### Fallback stack (reference only)

| Token | Stack |
|---|---|
| font-family-fallback | system-ui, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif |

---

## Font size scale — desktop

Base size: **`font-size-sm` = 14px**.

| Token | rem | px |
|---|---|---|
| font-size-xxs | 0.6875rem | 11px |
| font-size-xs | 0.75rem | 12px |
| font-size-sm | 0.875rem | 14px |
| font-size-md | 1rem | 16px |
| font-size-lg | 1.125rem | 18px |
| font-size-xl | 1.25rem | 20px |
| font-size-2xl | 1.375rem | 22px |
| font-size-3xl | 1.5625rem | 25px |
| font-size-4xl | 1.75rem | 28px |
| font-size-5xl | 2rem | 32px |
| font-size-6xl | 2.25rem | 36px |
| font-size-7xl | 2.5rem | 40px |
| font-size-8xl | 2.8125rem | 45px |
| font-size-9xl | 3.125rem | 50px |
| font-size-10xl | 3.75rem | 60px |
| font-size-hero | 4rem | 64px |

**`font-size-hero` (64px) is the absolute maximum** for any heading or display text in the system. Nothing may exceed 64px.

---

## Font size scale — mobile

Same token names; values shift up for readability on narrow viewports.

| Token | rem | px |
|---|---|---|
| font-size-xxs | 0.8125rem | 13px |
| font-size-xs | 0.9375rem | 15px |
| font-size-sm | 1.0625rem | 17px |
| font-size-md | 1.1875rem | 19px |
| font-size-lg | 1.375rem | 22px |
| font-size-xl | 1.5rem | 24px |
| font-size-2xl | 1.6875rem | 27px |
| font-size-3xl | 1.9375rem | 31px |
| font-size-4xl | 2.125rem | 34px |
| font-size-5xl | 2.4375rem | 39px |
| font-size-6xl | 2.75rem | 44px |
| font-size-7xl | 3.0625rem | 49px |
| font-size-8xl | 3.4375rem | 55px |
| font-size-9xl | 3.875rem | 62px |
| font-size-10xl | 4.375rem | 70px |

Mobile **`font-size-hero` cap:** 4rem (64px) — same ceiling as desktop.

---

## Line height scale

Unitless multipliers applied to the element’s font size.

| Token | Multiplier | Used for | At 14px (`font-size-sm`) |
|---|---|---|---|
| line-height-heading | 1.2 | Headings **rendered below 52px** (section titles, page titles, card titles) | 16.8px |
| line-height-display | 1 | **Huge headings only — rendered 52px and above** (marketing hero h1, display numerals) | Matches font size |
| line-height-detail | 1.3 | Captions, metadata, helper labels | 18.2px |
| line-height-component | 1.3 | Text inside controls (buttons, tabs, chips) | 18.2px |
| line-height-body | 1.5 | Body copy, paragraphs, lists | 21px |
| line-height-code | 1.5 | Monospace blocks and inline code | 21px |

**Default body pairing:** `font-size-sm` + `line-height-body` → 14px / 21px line box.

**Line-height by heading size (mandatory):** The line-height a heading takes is driven by its **rendered font size**, with **52px** as the single cut-off:

- **Huge headings — rendered 52px or larger** (the marketing hero h1, and any display heading that actually reaches ≥ 52px) use **`line-height-display` (1)**; the tight 1:1 leading is part of the Warm marketing look.
- **Everything below 52px** — section titles, sub-section / band headings, card titles, and any heading whose largest rendered size is under 52px (e.g. a `clamp()` that maxes out at 40px) — uses **`line-height-heading` (1.2)**, never `line-height-display`. A `line-height` of 1 on a sub-52px heading crowds multi-line headings; reserve it for the genuinely huge type only.

When a heading uses a responsive `clamp()`, judge by its **maximum** rendered size: if that maximum is below 52px it is a 1.2 heading, even though it shares the display gradient / weight of the larger titles.

---

## Font weight scale

| Token | Value |
|---|---|
| font-weight-thin | 100 |
| font-weight-extra-light | 200 |
| font-weight-light | 300 |
| font-weight-normal | 400 |
| font-weight-medium | 500 |
| font-weight-semibold | 600 |
| font-weight-bold | 700 |
| font-weight-extra-bold | 800 |
| font-weight-black | 900 |

---

## Letter spacing scale

| Token | Value |
|---|---|
| letter-spacing-tightest | -0.05em |
| letter-spacing-tighter | -0.04em |
| letter-spacing-tight | -0.025em |
| letter-spacing-normal | 0em |
| letter-spacing-wide | 0.05em |
| letter-spacing-wider | 0.08em |
| letter-spacing-widest | 0.1em |

Default body tracking: **`letter-spacing-normal`**.

---

## Heading & paragraph gaps (mandatory — fixed 24px)

The vertical gap **below a heading** and **below a paragraph** is **fixed at `spacing-6` (24px)** — never more, never less — so stacked content reads as one consistent beat:

1. **Heading → what follows.** A **heading** (`h1`–`h6`, `.section-heading`, `.card__title`, or equivalent title token) immediately followed by **anything** — a paragraph or lead, a button or button group, a card, a list, an image, or any block — keeps **exactly 24px** below it.
2. **Paragraph → what follows.** A **paragraph** followed by **anything** — another paragraph, a button or button group, a card, a list, an image, or any block — keeps the **same exact 24px** below it.

| Token | Value |
|---|---|
| `spacing-6` | 24px — fixed gap below a heading, and below a paragraph, to whatever follows |

- **24px is a hard, fixed value — not a minimum.** Never exceed 24px and never collapse below it for either gap; both stacking gaps are always exactly 24px.
- Applies anywhere a heading or paragraph stacks above the next block — marketing pages, cards, hero bands, pricing intros, dashboards, and CTAs.
- Eyebrows, badges, or labels *above* a heading may use a smaller gap (`spacing-3` / 12px is typical); the **fixed 24px governs heading → next element and paragraph → next element**.
- Implement with `margin-bottom: spacing-6` on the heading and on the paragraph (or `margin-top: spacing-6` on the following element) — not with a flex `gap` other than 24px between those elements.

---

## Text formatting

| Treatment | Rule |
|---|---|
| **Bold** | Emphasis within a sentence, toasts — `font-weight-medium` (500), the heaviest weight Warm ships (button labels sit lighter, at `font-weight-normal`, see `buttons.md`) |
| **Italic** | Placeholder / ghost text and image captions only — not general UI copy |
| **Underline** | Links only (default or hover per link spec) — never for emphasis |
| **Strong** | Semantic importance — heavier weight |
| **Emphasis** | Semantic stress — italic where appropriate |

Capitalization: **sentence case** for UX strings unless the brief documents an exception (proper nouns, acronyms). **Button labels are the one standing exception: they always render uppercase** (via a text transform, while the written string stays sentence case in code).

### Punctuation

**Never use an em dash (`—`) in UI copy.** Not in headings, leads, body copy, item names, tooltips, empty states, alt text, or screen-reader strings. An em dash reads as a machine writing prose, not as a product talking to a person, and it hides the fact that a sentence is doing two jobs at once.

Rewrite instead of substituting a character. Pick whichever of these the sentence actually wants:

| Instead of an em dash | Write |
|---|---|
| Two joined statements | Two sentences. `Booked out. Join the waitlist at the desk.` |
| A trailing qualifier | A comma. `…every parent in the loop, without another spreadsheet.` |
| A label introducing detail | A colon. `Warm Days 2026: three days for the people who open at seven.` |
| An aside inside a sentence | Parentheses. `Nap mat (toddler)` |

The **en dash (`–`) stays** for genuine ranges only: `08:00 – 08:45`, `27 – 29 May`, `1–10 of 1000`. A hyphen (`-`) stays for compound words. Nothing else.

---

## Heading size caps (mandatory)

Semantic HTML level and visual size are independent — but these **maximum visual sizes** apply by surface:

| Surface | h1 max | h2 max | Notes |
|---|---|---|---|
| **Marketing / landing / campaign** | **font-size-hero (64px)** | font-size-9xl (50px) | Display heroes only; never above 64px |
| **Dashboard / application UI** | **font-size-4xl (28px)** | font-size-3xl (25px) | Dense product chrome — one h1 per view |
| **E-commerce (non-hero)** | font-size-4xl (28px) | font-size-3xl (25px) | Storefront hero bands may use marketing caps |
| **Widget / in-card titles** | font-size-2xl (22px) | font-size-xl (20px) | KPI and chart headers stay quiet |

**Rules:**

- **64px is the hard ceiling** for the entire system — use `font-size-hero`; do not add a larger token.
- **28px is the hard ceiling for h1 in dashboard and app UI** — use `font-size-4xl` even if larger display tokens exist.
- **Line-height by size, cut-off at 52px** — only headings **rendered 52px or larger** (e.g. the marketing hero h1) use `line-height-display` (1); **every heading below 52px**, including section titles, uses `line-height-heading` (1.2). Judge a `clamp()` heading by its maximum rendered size.
- Marketing pages must not reuse app-sized h1 tokens on hero bands; app pages must not reuse `font-size-hero` on page titles.

---

## Semantic text roles

Map roles to scale tokens + color tokens from `colors.md`. All roles use **`font-family`** unless noted.

### Application & dashboard

| Role | Family | Size (max) | Weight | Line height | Color token |
|---|---|---|---|---|---|
| app-h1 | font-family-serif | font-size-4xl (28px) | font-weight-medium | line-height-heading | `heading` |
| app-h2 | font-family-serif | font-size-3xl (25px) | font-weight-medium | line-height-heading | `heading` |
| app-h3 | font-family-serif | font-size-2xl (22px) | font-weight-medium | line-height-heading | `heading` |
| title | font-family-serif | font-size-xl (20px) | font-weight-medium | line-height-heading | `heading` |
| widget-title | font-family-serif | font-size-xl (20px) | font-weight-medium | line-height-heading | `heading` |
| body | font-family | font-size-sm (14px) | font-weight-normal | line-height-body | `body` |
| body-small | font-family | font-size-xs (12px) | font-weight-normal | line-height-body | `body` |
| label | font-family | font-size-xs (12px) | font-weight-medium | line-height-component | `heading` |
| caption | font-family | font-size-xxs (11px) | font-weight-normal | line-height-detail | `body-subtle` |
| code-inline | font-family-monospace | font-size-xs (12px) | font-weight-normal | line-height-code | `body` |

### Marketing & landing

| Role | Family | Size (max) | Weight | Line height | Color token |
|---|---|---|---|---|---|
| hero-h1 | font-family-serif | font-size-hero (64px) | font-weight-medium | line-height-display | `heading` |
| display | font-family-serif | font-size-10xl (60px) | font-weight-medium | line-height-display | `heading` |
| section-heading | font-family-serif | font-size-7xl (40px) | font-weight-medium | line-height-heading | `heading` |
| lead | font-family | font-size-lg (18px) | font-weight-normal | line-height-body | `body` |
| body | font-family | font-size-sm (14px) | font-weight-normal | line-height-body | `body` |
| overline | font-family (uppercase) | font-size-xs (12px) | font-weight-medium | line-height-detail | letter-spacing-wide | `body-subtle` |

---

## Specialized font families

| Token | Stack | When |
|---|---|---|
| font-family-monospace | ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Roboto Mono", "Ubuntu Mono", "Courier New", monospace | **Code blocks and inline code only** — labels, eyebrows, and ticker text use the primary `font-family` (Inter) in small uppercase with wide tracking, and button labels stay in the primary `font-family`, uppercase at normal (400) weight |
| font-family-serif | "Inter", ui-sans-serif, system-ui, sans-serif | **Every heading (`h1`–`h6`)** — the display voice; the slot resolves to the same Inter, set medium (500) and tightly tracked |

---

## Flat registry (desktop)

```
font-family                "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
font-family-monospace      ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Roboto Mono", "Courier New", monospace
font-family-serif          "Inter", ui-sans-serif, system-ui, sans-serif   (headings — resolves to the same Inter)
font-size-xxs              0.6875rem   (11px)
font-size-xs               0.75rem     (12px)
font-size-sm               0.875rem    (14px)
font-size-md               1rem        (16px)
font-size-lg               1.125rem    (18px)
font-size-xl               1.25rem     (20px)
font-size-2xl              1.375rem    (22px)
font-size-3xl              1.5625rem   (25px)
font-size-4xl              1.75rem     (28px)
font-size-5xl              2rem        (32px)
font-size-6xl              2.25rem     (36px)
font-size-7xl              2.5rem      (40px)
font-size-8xl              2.8125rem   (45px)
font-size-9xl              3.125rem    (50px)
font-size-10xl              3.75rem     (60px)
font-size-hero             4rem        (64px)
line-height-heading        1.2
line-height-display        1
line-height-detail         1.3
line-height-component      1.3
line-height-body           1.5
line-height-code           1.5
font-weight-normal         400
font-weight-medium         500
font-weight-semibold       600
font-weight-bold           700
letter-spacing-normal      0em
```

---

## Long-form content (prose)

For article/rich-text bodies (CMS output, docs, help content) map these elements to tokens. All use `font-family` unless noted.

| Element | Size | Weight | Line height | Color | Notes |
|---|---|---|---|---|---|
| Prose paragraph | font-size-md (16px) | font-weight-normal | line-height-body | `body` | `spacing-4` between paragraphs |
| Prose h2 / h3 | font-size-3xl / 2xl | font-weight-medium | line-height-heading | `heading` | `spacing-6` above, `spacing-3` below |
| Lead paragraph | font-size-lg (18px) | font-weight-normal | line-height-body | `body` | Intro sentence under a heading |
| Unordered / ordered list | font-size-md | font-weight-normal | line-height-body | `body` | `spacing-5` inline-start inset; disc / decimal markers; `spacing-2` between items |
| List with icon markers (landing check lists) | font-size-md | font-weight-medium (500) | line-height-body | `heading` | **16px leading check icon in the `brand` color, `spacing-3` (12px) gap between icon and text** — always these values on landing-page check lists; no disc marker |
| Description list term | font-size-md | font-weight-medium | line-height-body | `heading` | Definition below uses `body` |
| Blockquote | font-size-lg (18px), display face `font-family-serif` (the display voice, like headings) | font-weight-medium | line-height-body | `heading` | 4px (`spacing-1`) inline-start accent border `default-medium`; `spacing-4` inline-start padding; italic optional |
| Inline link in prose | inherit | font-weight-medium | inherit | `fg-brand` | Underline on hover |
| Standalone link (nav, footer, "Learn more") | font-size-md (16px) max | font-weight-medium | inherit | per surface | **Never 18px or 20px** — links cap at 16px even when the surrounding copy is larger; trailing arrow icons match the 16px size |
| Image caption | font-size-sm (14px) | font-weight-normal | line-height-detail | `body-subtle` | Centered under figure; italic allowed |
| Horizontal rule | — | — | — | `default` | 1px full-width divider; `spacing-8` vertical margin |

Prose blocks may step up one size on large viewports (lead and headings) without exceeding the heading caps above.

### Where hover-underline belongs — and where it is forbidden

Underline-on-hover is a **content-link** signal, not a generic hover effect. It says "this word in a sentence is a link". Apply it only where the link is a *run of text* the eye must be told is clickable:

- **Underline on hover — allowed:** links inside prose and paragraphs, footer link lists and legal text, a card's title or product name, and inline "Learn more" links.
- **Never underline on hover — navigation.** **Links in a navbar or a sidebar must never gain an underline on hover** — not the top-level nav items, not the sidebar/rail items, not a nav account/login link, not the items inside a nav dropdown or menu. Navigation already signals hover through **color and/or a background/fill change** (and its active state through color + fill). An underline on a nav item reads as a stray inline link, breaks the calm of the bar, and shifts the text's optical baseline. This holds on **every** surface — the marketing navbar, the storefront navbar, the application top bar, the sidebar, and the icon rails.
- **Never underline on hover — labels inside a hit-target tile or card.** When the **whole tile, card, or cell is the clickable target** (an icon-tile category grid, a feature card, a stat tile, a product cell), the **tile itself is the hover affordance** — it shifts its fill, border, or elevation. The label inside it is *not* a separate link and **must not underline on hover**; doing so duplicates the signal and makes the label read as an inline text link floating inside the card.

---

## Usage by surface type

| Surface | Typical tokens |
|---|---|
| Marketing hero h1 | hero-h1 → font-size-hero (≤64px) + line-height-display |
| Marketing section title | section-heading → font-size-7xl + line-height-heading (below the 52px cut-off) |
| Marketing stat / proof numeral | font-size-6xl (36px), font-family, font-weight-medium, line-height-display, tabular figures |
| App / dashboard page h1 | app-h1 → font-size-4xl (≤28px) |
| Card / widget title | widget-title → font-size-xl |
| Paragraphs | body → font-size-sm |
| Form labels | label → font-size-xs |
| Buttons (labeled) | font-size-xs (12px, every tier) + font-weight-normal (400) + line-height-component, uppercase, letter-spacing-wide |
| Badges, chips | font-size-xs or font-size-xxs |
| Code | code-inline |

---

## Prohibited

- **No em-dash or en-dash in copy.** The em-dash (`—`) and en-dash (`–`) are banned from every string a user reads: headings, leads, body, labels, buttons, badges, nav, and microcopy. Rewrite the sentence with a comma, a period, a colon, or parentheses. A hyphen (`-`) is allowed only inside compound words (like `async-first`), never as a spaced sentence break or a trailing flourish.
- **No raw px/rem font sizes in components** — use `font-size-*` tokens from the scale.
- **No numeric size names** (`font-size-100`, `font-size-700`, etc.) — use the t-shirt scale only.
- **No sizes above font-size-hero (64px)** — 64px is the system maximum for any text.
- **No app/dashboard h1 above font-size-4xl (28px)** — even when marketing tokens exist in the scale.
- **No marketing hero sizes on app chrome** — dashboard nav, settings, and data surfaces use app role tokens only.
- **No arbitrary line-height** — use `line-height-heading`, `line-height-display`, `line-height-body`, `line-height-component`, or `line-height-detail`.
- **No `line-height-display` on sub-52px headings** — only headings rendered **52px or larger** use `line-height-display` (1); every heading below 52px (section titles included) uses `line-height-heading` (1.2). Judge `clamp()` headings by their maximum rendered size.
- **No underline for emphasis** — underline is for links only.
- **No underline on hover for navbar or sidebar links — forbidden.** Nav items, sidebar/rail items, nav login/account links, and items inside a nav menu or dropdown **never** take a `text-decoration` on hover, on any surface (marketing navbar, storefront navbar, app top bar, sidebar, rails). Navigation hover is expressed with **color and/or a background/fill change** only.
- **No underline on hover for a label inside a clickable tile or card** — if the tile/card/cell is the hit target, it owns the hover state (fill, border, or elevation shift). The label inside it is not an inline link and must not underline.
- **No italic on general UI copy** — captions and placeholders only.
- **No raw font-family stacks in components** — use `font-family` or `font-family-monospace`.
- **No paragraph width beyond ~50–120 characters** without layout constraint.
- **No fully justified body text** — left-align paragraphs.
- **No negative letter-spacing on body paragraphs** — tight tracking is for headings and overlines only.
