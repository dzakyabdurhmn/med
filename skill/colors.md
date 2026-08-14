# Color Tokens — TypeUI · Warm

> The color system for **TypeUI · Warm**. Warm is **light-first**: on marketing / storefront pages the content sits on one warm paper **`#FAFAF5` section surface** in a centered 1280px container — flat and matte, **no rails, no texture, no grain** — and the **hero and the footer share that exact same `#FAFAF5` surface: there are no accent bands** (everything flat, solid, and untextured) while the **crimson** brand (`#A71D31`) leads primary actions under a white label. Text is a warm charcoal ink — ink headings over muted warm-gray body — and panels separate by a subtle hairline border, not a hard line. Status hues (success, danger, warning) appear *only* when something truly is success, danger, or warning; they are never decoration. Every value below is a literal hex and the single source of truth; components reference semantic tokens, never raw hex or palette steps directly.

---

## Token naming

| Pattern | Role |
|---|---|
| `body`, `heading`, `body-subtle` | Default text hierarchy |
| `fg-{intent}` | Foreground / text for brand, status, accent |
| `neutral-{level}-{accent}` | Neutral surfaces (backgrounds) |
| `brand`, `brand-soft`, `brand-strong` | Brand surfaces |
| `success`, `danger`, `warning` (+ `-soft`, `-medium`, `-strong`) | Status surfaces |
| `default`, `light`, `muted`, `buffer` | Border intent |
| `{accent}` | Standalone accent surfaces (purple, cyan, teal, etc.) |

**Level:** `primary` · `secondary` · `tertiary` · `quaternary`  
**Accent (surface):** `soft` · `medium` · `strong` · `strongest`  
**Foreground accent:** `subtle` · `strong`

---

## Semantic tokens — text

| Token | Hex |
|---|---|
| body | `#474744` |
| body-subtle | `#6A6A64` |
| heading | `#191918` |
| fg-brand-subtle | `#35657B` |
| fg-brand | `#9E1B2E` |
| fg-brand-strong | `#6E1220` |
| fg-success | `#1EBD66` |
| fg-success-strong | `#0E7A41` |
| fg-danger | `#E5484D` |
| fg-danger-strong | `#C73737` |
| fg-warning-subtle | `#F97316` |
| fg-warning | `#A64E0B` |
| fg-yellow | `#9C7100` |
| fg-disabled | `#BAB9B0` |
| fg-purple | `#8E40CC` |
| fg-cyan | `#0891B2` |
| fg-indigo | `#473DFE` |
| fg-pink | `#E60076` |
| fg-lime | `#65A30D` |

---

## Semantic tokens — background

### Neutral

| Token | Hex |
|---|---|
| neutral-primary-soft | `#ECEBE0` |
| neutral-primary | `#F4F4EB` |
| neutral-primary-medium | `#F3F2E7` |
| neutral-primary-strong | `#E3E2D8` |
| neutral-secondary-soft | `#F3F2E7` |
| neutral-secondary | `#FFFFFF` |
| neutral-secondary-medium | `#EFEEE3` |
| neutral-secondary-strong | `#FFFFFF` |
| neutral-secondary-strongest | `#F8F7EC` |
| neutral-tertiary-soft | `#F8F7EC` |
| neutral-tertiary | `#F3F2E7` |
| neutral-tertiary-medium | `#E3E2D8` |
| neutral-quaternary | `#D1D0C6` |
| neutral-quaternary-medium | `#BAB9B0` |
| gray | `#75756F` |

### Brand

| Token | Hex |
|---|---|
| brand-softer | `#FCEEEF` |
| brand-soft | `#F6D8DC` |
| brand | `#A71D31` |
| brand-medium | `#8E1727` |
| brand-strong | `#741320` |

### Status

| Token | Hex |
|---|---|
| success-soft | `#EAFBF1` |
| success | `#1EBD66` |
| success-medium | `#BFF0D4` |
| success-strong | `#0E7A41` |
| danger-soft | `#FBEBEB` |
| danger | `#E5484D` |
| danger-medium | `#F5DBDB` |
| danger-strong | `#C73737` |
| warning-soft | `#FEF0E0` |
| warning | `#F97316` |
| warning-medium | `#FCE0C0` |
| warning-strong | `#D2610A` |

### Utility & accent

| Token | Hex |
|---|---|
| dark-soft | `#2E2E2C` |
| dark | `#191918` |
| dark-strong | `#0D0D0C` |
| disabled | `#F3F2E7` |
| purple | `#8E40CC` |
| sky | `#0099FF` |
| teal | `#0D9488` |
| pink | `#E60076` |
| cyan | `#0891B2` |
| fuchsia | `#C026D3` |
| indigo | `#473DFE` |
| orange | `#FC5F35` |

---

## Semantic tokens — border

| Token | Hex |
|---|---|
| buffer | `#191918` |
| buffer-medium | `#191918` |
| buffer-strong | `#191918` |
| muted | `#FFFFFF` |
| light-subtle | `#F8F7EC` |
| light | `#E3E2D8` |
| light-medium | `#D1D0C6` |
| default-subtle | `#ECEBDF` |
| default | `#E3E2D8` |
| default-medium | `#D1D0C6` |
| default-strong | `#BAB9B0` |
| success-subtle | `#BFF0D4` |
| danger-subtle | `#F5DBDB` |
| warning-subtle | `#FCE0C0` |
| brand-subtle | `#A7C2CC` |
| brand-light | `#C9455A` |
| dark-subtle | `#E5E1CE` |
| dark-backdrop | `#000000` |

---

## Light theme registry

Flat token map for the default theme. (Warm's canonical surface is **light**; resolve any darker theme in your token layer against `#0D0D0C` the same way this resolves against `#FFFFFF`.) Implement in your stack’s token layer — theme file, design tokens JSON, variables map, etc.

```
body                          #474744
body-subtle                   #6A6A64
heading                       #191918
fg-brand-subtle                 #35657B
fg-brand                        #9E1B2E
fg-brand-strong                 #6E1220
fg-success                      #1EBD66
fg-success-strong               #0E7A41
fg-danger                       #E5484D
fg-danger-strong                #C73737
fg-warning-subtle               #F97316
fg-warning                      #A64E0B
fg-yellow                       #9C7100
fg-disabled                     #BAB9B0
fg-purple                       #8E40CC
fg-cyan                         #0891B2
fg-indigo                       #473DFE
fg-pink                         #E60076
fg-lime                         #65A30D
neutral-primary-soft            #ECEBE0
neutral-primary                 #F4F4EB
neutral-primary-medium          #F3F2E7
neutral-primary-strong          #E3E2D8
neutral-secondary-soft          #F3F2E7
neutral-secondary               #FFFFFF
neutral-secondary-medium        #EFEEE3
neutral-secondary-strong        #FFFFFF
neutral-secondary-strongest     #F8F7EC
neutral-tertiary-soft           #F8F7EC
neutral-tertiary                #F3F2E7
neutral-tertiary-medium         #E3E2D8
neutral-quaternary              #D1D0C6
neutral-quaternary-medium       #BAB9B0
gray                            #75756F
brand-softer                    #FCEEEF
brand-soft                      #F6D8DC
brand                           #A71D31
brand-medium                    #8E1727
brand-strong                    #741320
success-soft                    #EAFBF1
success                         #1EBD66
success-medium                  #BFF0D4
success-strong                  #0E7A41
danger-soft                     #FBEBEB
danger                          #E5484D
danger-medium                   #F5DBDB
danger-strong                   #C73737
warning-soft                    #FEF0E0
warning                         #F97316
warning-medium                  #FCE0C0
warning-strong                  #D2610A
dark-soft                       #2E2E2C
dark                            #191918
dark-strong                     #0D0D0C
disabled                        #F3F2E7
purple                          #8E40CC
sky                             #0099FF
teal                            #0D9488
pink                            #E60076
cyan                            #0891B2
fuchsia                         #C026D3
indigo                          #473DFE
orange                          #FC5F35
buffer                          #191918
buffer-medium                   #191918
buffer-strong                   #191918
muted                           #FFFFFF
light-subtle                    #F8F7EC
light                           #E3E2D8
light-medium                    #D1D0C6
default-subtle                  #ECEBDF
default                         #E3E2D8
default-medium                  #D1D0C6
default-strong                  #BAB9B0
success-subtle                  #BFF0D4
danger-subtle                   #F5DBDB
warning-subtle                  #FCE0C0
brand-subtle                    #A7C2CC
brand-light                     #C9455A
dark-subtle                     #E5E1CE
dark-backdrop                   #000000
```

---

## Usage rules

- **Every content section sits on the warm `#FAFAF5` surface — no film grain.** On marketing / storefront pages all content sections share the one warm section surface (`#FAFAF5`) with no texture of any kind — no grain, no noise, no pattern; the surface stays flat and matte, and warmth comes from the palette alone.
- **The hero and the footer share the section surface.** The **hero** and the **footer** fill the same **`#FAFAF5`** as every content section — always — flat, solid, and untextured — no fade, no accent tint — keeping the normal ink text (`heading` `#191918` over `body`), links in `fg-brand` (`#9E1B2E`), and standard button variants; every border or divider on the hero, navbar, or footer is `dark-subtle` (`#E5E1CE`) — never a gray hairline. No section anywhere takes an accent fill.
- **The footer is ONE flat surface from top to bottom — never a two-tone footer.** However many internal bands the footer stacks (a brand / country row, the link columns, a legal / copyright bottom bar), they are **all the same single `#FAFAF5` surface** and are separated **only by `dark-subtle` (`#E5E1CE`) hairlines**. It is **strictly forbidden** to fill the legal bar, the bottom bar, or any other footer sub-band with a second, deeper, or darker tint (or any other color) — that produces the "two-color footer" look and must never happen. One footer, one surface.
- **The hero and the footer are solid — no fades, no gradients, no tints.** Each fills the one `#FAFAF5` surface **edge to edge**, continuous with the sections around it — no vertical gradient, no dissolve, no feathered boundary, in either direction. A footer must **never** be a pure white block, never a cream accent band, and never carry a gray top border — it is always the same solid surface as the hero and the page.
- **Flat panels & cards.** Every card, widget and panel fills `neutral-primary` (`#F4F4EB`), outlined by a `default` (`#E3E2D8`) hairline. It sits one tone step below the warm paper `#FAFAF5` section surface, so the fill plus the border is what separates a card from its surface. `neutral-primary-soft` (`#ECEBE0`) is the deeper tier reserved for a featured card or a hovered table row, never for the default card.
- **Brand is a crimson accent / block.** `brand` (`#A71D31`) leads primary actions and highlights; it may fill a full hero or feature block (white text on crimson) for maximum contrast. Brand is high-impact — use it deliberately, not as a wash across every section.
- **Inputs contrast their surface:** controls use a *contrasting* fill (`neutral-tertiary`, `#F3F2E7`), a step darker than the ivory card, plus a `default` border, so the field reads on the light surface. See `input-field.md`.
- **Primary actions:** `brand` background; label uses `white` (`#FFFFFF` — the deep crimson fill pairs with a white label for legibility at 7.3:1, never ink at 2.4:1), while quiet actions on the light surface take an ink label.
- **Headings:** `heading` (`#191918`) · **Body:** `body` (`#474744`) · **Muted:** `body-subtle` (`#75756F`).
- **Links / CTAs:** `fg-brand` (`#9E1B2E`) — a deep crimson, legible on the light surface (7.6:1 on the page).
- **Borders:** cards and component shells carry a subtle `default` (`#E3E2D8`) border; `default-strong` is reserved for genuine dividers and the rare functional edge.
- **Disabled states:** `disabled` background + `fg-disabled` text.
- **Never use raw hex in components** — always reference semantic tokens.

## Prohibited

These rules are non-negotiable unless a product brief explicitly documents an exception and a compensating control.

### Token identity — agnostic by design

- **Semantic tokens are this design system’s vocabulary** — named roles (`body`, `brand`, `neutral-secondary-soft`), not imports from any external palette, framework, or vendor scale. Palette tables in this file are derivation reference only; they are **not** token names and **not** licensed aliases for third-party color systems.
- **Do not label or treat tokens as foreign palette steps** — never refer to `brand` as “orange 600”, `body` as “stone 300”, or `neutral-quaternary` as “neutral 800” in specs, code comments, or handoff. If a token exists, use its name.
- **Do not rename tokens to match another stack** — map *into* your implementation layer (theme file, variables map, design tool styles); do not rename tokens to fit a framework’s naming convention and call that “the design system.”
- **Hex values belong to the token registry** — each semantic token owns one resolved hex per theme. Tokens are the contract; hex is the stored value, not something authors pick at build time.

### Implementation boundaries

- **No raw hex in UI surfaces** — components, layouts, illustrations, and marketing assets must reference semantic tokens only. Hex appears in this registry and in the token layer — nowhere else.
- **No palette steps in product UI** — do not apply base-palette rows directly to buttons, text, borders, or backgrounds. Every color choice resolves through a semantic token.
- **No token chaining** — semantic tokens must not point at other tokens or palette variables (`token-a → token-b → #hex`). Each semantic token holds its own hex so the system stays portable and auditable.
- **No one-off colors for “close enough”** — if no token fits, add a token to this file with documented intent; do not hard-code a nearby hex in a single screen or component.
- **No orphan colors — every value a component paints must exist as a token here.** A color that is *derived* from the brand but never registered (a button edge, a gradient stop, a chart series, an illustration fill) is the most common way a theme rots: it looks right on day one, then survives a rebrand as a stale leftover of the old hue. Any such value must either **resolve to an existing token** (e.g. the primary button's edge is `brand-light`, not a literal one step off `brand`) or be **added to this registry as a named token**. If you cannot name it, you may not paint it.
- **Rebrand invariant — changing the brand means editing this registry and the token layer, and nothing else.** Swapping the brand hue must be a **values-only** edit: the semantic values in this file plus the token layer that mirrors them. Every other spec file, component, illustration, and chart names **tokens** (`brand`, `brand-light`, `brand-medium`, `fg-brand`, …) and therefore re-themes automatically. **Any file that must be hand-edited to complete a rebrand has a raw-hex bug — fix the literal into its token rather than updating the literal.** A spec that writes `1px #376EF8` instead of `1px brand-light` is a defect even while the color happens to look correct.
- **Spec files name tokens, not brand hex.** Outside this registry's tables, component and pattern specs (`buttons.md`, `cards.md`, `mockups.md`, `SKILL.md`, …) must refer to brand colors by **token name only**. They may not restate the brand's hex, because a restated hex is a second source of truth that silently goes stale.
- **No mixing themes on one surface** — light-registry values and any darker-registry values must not be blended on the same element because the other theme “looked better.”
- **No saturated full-section fills except the brand block** — page and section backgrounds use the light neutral surfaces; the crimson brand is for controls, accents, and an intentional hero or feature block (white text on crimson), not a tint washed across every content band.

### Semantic misuse

- **No brand foreground for long copy** — `fg-brand`, `fg-brand-strong`, and related brand text tokens are for links, labels, badges, and short emphasis — not paragraphs, articles, or legal text. Body copy uses `body` / `body-subtle`.
- **No accent foreground for navigation or body** — `fg-purple`, `fg-cyan`, `fg-pink`, `fg-indigo`, `fg-lime`, and similar accent text tokens are for tags, charts, and inline highlights — not nav items, menu labels, or reading text.
- **No status colors without status meaning** — `success`, `danger`, `warning`, and their `-soft` / `-strong` variants communicate state. Do not use them for decoration, category color-coding unrelated to state, or “making it pop.”
### Interaction states

- **A hover fill must be a step you can SEE.** A navigation hover (menu item, sidebar link, list row) fills `hover-fill` (`#DCDAC8`), which sits **1.27:1** against the card it lands on. The old habit of hovering with `control-fill` produced **1.02:1** — a change the eye cannot detect, which means the control never answered the pointer at all. If a hover state cannot be seen at arm's length on a dim laptop screen, it does not exist, however correct the token name looks in the CSS.
- **Text stays readable on the hover fill**: `heading` 11.9:1 and `body` 6.3:1 on `hover-fill`. A deeper hover is only allowed as far as the label can follow it.

### Surfaces

- **One page surface, everywhere.** The application shell sits on the **same `#FAFAF5` paper** as a marketing section. There is no separate cream "app" tint: a dashboard is not a different world from the rest of the product, and a second background tone only tells the user they have crossed a seam that does not matter to them. Cards, widgets and panels separate from that paper by their own `neutral-primary` (`#F4F4EB`) fill and hairline border, exactly as they do on a marketing page.

### Charts and data visualisation

- **The brand series is the brand itself.** In a chart, the primary series wears `brand` (`#A71D31`) — not `brand-strong`, not a darkened stand-in. The deep crimson clears the 3:1 non-text floor on its own (6.6:1 against a card), so a **filled** brand shape (bar, slice, arc) needs **no readability hairline** — unlike a light fill, it reads on its own edge. The value is still always written as a label, a legend and a tooltip. Controls that need a firmer graphic — a toggle track, a progress fill, a radio dot, a slider — keep `brand-strong`.
- **A categorical series is coloured by ACCENT, not by shades of the brand.** When a chart encodes *different things* — plans, rooms, acquisition channels, product lines — each series takes a **distinct accent hue** (`brand`, `teal`, `purple`, `cyan`, `indigo`, `sky`, `pink`), starting with `brand` for the primary series. **Do not** paint every series in tints of the brand ramp (`brand-medium` / `brand` / `brand-light`). It looks disciplined in one widget and catastrophic across a dashboard: eight charts all rendered in one hue turn the page into a single wash of colour, the categories stop being separable at a glance, and the brand stops meaning "the primary action" because it now means everything.
- **A brand ramp is for ordered data, not categories.** Shades of one hue (`brand-light` → `brand` → `brand-medium`) are correct **only** where the values are *the same measure* — a metric over time (this year vs last year), a share of one total (mobile vs desktop), a sequential scale. Same measure → one hue in steps. Different things → different hues.
- **Status hues never encode a category.** `success`, `danger`, and `warning` are reserved for real state. A chart may use them for a **trend** (a metric rising is genuinely *good*, falling genuinely *bad*), but a plan tier, a room, or a traffic source is **not** a warning — never reach for the brand crimson just because a third colour is needed. Take the next accent instead.
- **Pick accents that hold together with the brand.** Adjacent series should not vibrate against each other or against the brand. Prefer a calm complement (a crimson brand pairs with `teal` or `orange`; avoid `pink`, which sits in the brand's own hue family) over an electric one; if two accents fight, choose a different accent, never a hand-mixed hex (see *No orphan colors*).

- **No accent backgrounds on full shells** — page backgrounds and section bands use the light neutral surfaces only. Brand and accent fills are for controls, badges, charts, and an intentional hero or feature block only.
- **No border tokens as fills or text colors** — `default`, `light`, `brand-subtle`, and other border tokens define edges; do not repurpose them as background or typography colors without adding a proper surface or text token.

### Contrast, accessibility, and states

- **No token pairing that fails readable contrast** — when combining text and surface tokens, verify legibility (WCAG 2.2 AA minimum for text). On the light surface, body text uses `body` / `body-subtle` and links use the deep `fg-brand`, never a pale brand tint as text. If a pair fails, change the token assignment or add a dedicated pair to the registry — do not override with raw hex.
- **No disabled styling that looks active** — disabled surfaces use `disabled` + `fg-disabled`; do not reuse `body` or `brand` on disabled controls because they read as clickable.
- **No hover/focus/active colors outside the system** — interaction states must derive from the same semantic set (e.g. a lighter brand step already in the registry), not ad-hoc lightened or darkened hex.

### Governance

- **No silent drift** — changing a token’s hex is a design-system change; update this file, note the reason, and propagate to all platforms. Per-platform hex tweaks break parity.
- **No duplicate tokens for the same job** — if two names resolve to the same role, merge them. Synonym sprawl erodes the agnostic contract.
- **No exceptions without documentation** — breaking any rule above requires naming the exception, the surface it applies to, and why the existing tokens were insufficient.
