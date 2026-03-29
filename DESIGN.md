# Design System: itsmrmetaverse.com

**Date:** 2026-03-29
**Status:** Draft — pending user approval
**Sources:** discovery.md, research-brief.md, existing tokens.css

---

## 1. Design Philosophy

**"Porsche Design meets subtle sci-fi."** Every visual choice serves one of two purposes: establishing authority or evoking wonder. When in doubt, choose restraint over spectacle. The site must feel like a premium product, not a tech demo.

**Key constraints:**
- Dark-mode only (no light mode — the 3D cityscape demands it)
- Teal is the sole accent color — purple appears only in the 3D depth fog, never in UI
- The ONE element that breaks the restrained aesthetic: the primary CTA button (teal fill, high contrast)
- No decorative elements that don't serve function — no scanlines, no unnecessary borders

---

## 2. Color Tokens

### Core Palette

| Token | Hex / Value | Usage |
|---|---|---|
| `--color-base` | `#080c14` | Page background, canvas |
| `--color-base-raised` | `#0d1117` | Elevated surfaces (subtle lift) |
| `--color-base-card` | `#111820` | Card backgrounds, form inputs |
| `--color-accent` | `#00E5D0` | Links, borders, interactive states, building glow |
| `--color-accent-dim` | `rgba(0, 229, 208, 0.15)` | Hover backgrounds, subtle fills |
| `--color-accent-glow` | `rgba(0, 229, 208, 0.08)` | Very subtle ambient glow |
| `--color-depth` | `#8B5CF6` | 3D scene depth gradient ONLY — not used in UI |
| `--color-depth-dim` | `rgba(139, 92, 246, 0.15)` | Reserved for 3D scene |

### Chrome Gradient (Logotype)

| Token | Hex |
|---|---|
| `--color-chrome-light` | `#F5F5F5` |
| `--color-chrome-mid` | `#C0C0C0` |
| `--color-chrome-dark` | `#A0A0A0` |

Applied as: `linear-gradient(135deg, var(--color-chrome-mid), var(--color-chrome-light), var(--color-chrome-dark))`

### Text

| Token | Hex | Usage |
|---|---|---|
| `--color-text` | `#E6EDF3` | Primary body copy |
| `--color-text-muted` | `#8B949E` | Secondary text, captions |
| `--color-text-dim` | `#484F58` | Tertiary text, subtle labels |

### Utility

| Token | Value | Usage |
|---|---|---|
| `--color-grid` | `rgba(88, 166, 255, 0.06)` | CSS blueprint grid (mobile fallback) |
| `--color-success` | `#3FB950` | Form success states |
| `--color-error` | `#F85149` | Form error states, validation |
| `--color-warning` | `#D29922` | Caution states (if needed) |

### Contrast Compliance (WCAG 2.2 AA)

| Pair | Ratio | Passes |
|---|---|---|
| `--color-text` on `--color-base` | 13.8:1 | AAA |
| `--color-text-muted` on `--color-base` | 4.6:1 | AA |
| `--color-text-dim` on `--color-base` | 2.5:1 | Decorative only — never for functional text |
| `--color-accent` on `--color-base` | 9.2:1 | AAA |
| `--color-base` on `--color-accent` (CTA button text) | 9.2:1 | AAA |

---

## 3. Typography

### Font Stack

| Role | Token | Font | Fallback | Weight | Usage |
|---|---|---|---|---|---|
| Display | `--font-display` | Orbitron | system-ui, sans-serif | 600-700 | Section titles, ARAGORN logotype |
| Body | `--font-body` | Rajdhani | system-ui, sans-serif | 400-500 | Paragraphs, descriptions |
| Mono | `--font-mono` | Share Tech Mono | ui-monospace, monospace | 400 | Handle, technical accents, labels |

**Font delivery:** Self-hosted WOFF2 files with `font-display: swap`. Preloaded via `<link rel="preload">` for Orbitron 600 and Rajdhani 400 (the two most critical weights). No variable font available for Orbitron.

### Type Scale

| Token | Value | Responsive | Usage |
|---|---|---|---|
| `--text-xs` | `0.75rem` (12px) | — | Labels, meta |
| `--text-sm` | `0.875rem` (14px) | — | Captions, nav handle |
| `--text-base` | `1rem` (16px) | — | Body copy |
| `--text-lg` | `1.125rem` (18px) | — | Card titles, testimonial quotes |
| `--text-xl` | `1.25rem` (20px) | — | Hero subtitle |
| `--text-2xl` | `1.5rem` (24px) | — | Section titles |
| `--text-3xl` | `2rem` (32px) | — | Metric values, emphasis |
| `--text-4xl` | `2.5rem` (40px) | — | Decorative quote marks |
| `--text-5xl` | `3.5rem` (56px) | — | Large display text |
| `--text-hero` | `clamp(2.5rem, 5vw, 4.5rem)` | Fluid | Hero statement (40px → 72px) |

### Font Weights

| Token | Value | Usage |
|---|---|---|
| `--weight-regular` | 400 | Body text (Rajdhani), mono text |
| `--weight-medium` | 500 | Hero subtitle (Rajdhani) |
| `--weight-semibold` | 600 | Section titles (Orbitron), card titles |
| `--weight-bold` | 700 | ARAGORN logotype (Orbitron), metric values |

### Line Height

| Token | Value | Usage |
|---|---|---|
| `--leading-tight` | 1.15 | Display headings, hero statement |
| `--leading-normal` | 1.5 | Body copy default |
| `--leading-relaxed` | 1.7 | Long-form text, testimonial quotes |

### Letter Spacing

| Context | Value |
|---|---|
| Section titles (Orbitron uppercase) | `0.08em` |
| Buttons (Orbitron uppercase) | `0.06em` |
| Card titles (Orbitron) | `0.04em` |
| Mono labels (uppercase) | `0.08-0.1em` |

---

## 4. Spacing Scale

8px base grid. Named semantically but available as numbers for composition.

| Token | Value | Common Usage |
|---|---|---|
| `--space-1` | `0.25rem` (4px) | Tight gaps (label-to-input) |
| `--space-2` | `0.5rem` (8px) | Icon gaps, inline spacing |
| `--space-3` | `0.75rem` (12px) | Button vertical padding, small margins |
| `--space-4` | `1rem` (16px) | Form field gaps, card internal margins |
| `--space-5` | `1.5rem` (24px) | Component margins, embed grid gaps |
| `--space-6` | `2rem` (32px) | Section padding (horizontal), card padding |
| `--space-8` | `3rem` (48px) | Section title bottom margin, large gaps |
| `--space-10` | `4rem` (64px) | Hero top padding offset, wide-screen gutter |
| `--space-12` | `5rem` (80px) | Reserved for extra-large vertical spacing |
| `--space-16` | `8rem` (128px) | Reserved for dramatic vertical breathing room |
| `--space-section` | `clamp(4rem, 8vw, 8rem)` | Section vertical padding (fluid) |

---

## 5. Borders

| Token | Value | Usage |
|---|---|---|
| `--border-hairline` | `1px solid rgba(0, 229, 208, 0.2)` | Hero photo ring, prominent dividers |
| `--border-card` | `1px solid rgba(0, 229, 208, 0.1)` | Cards, nav bottom, embed containers |
| `--border-radius` | `4px` | All rounded corners — sharp, not playful |

**Border philosophy:** Minimal radius. Sharp corners reinforce the precision aesthetic. No `border-radius: 8px` or pill shapes anywhere except the hero photo circle.

---

## 6. Shadows & Elevation

| Token | Value | Usage |
|---|---|---|
| `--shadow-card` | `0 2px 8px rgba(0, 0, 0, 0.3)` | Subtle card depth |
| `--shadow-glow` | `0 0 20px rgba(0, 229, 208, 0.1)` | Hover glow on cards and buttons |
| `--shadow-glow-strong` | `0 0 30px rgba(0, 229, 208, 0.2)` | Primary CTA hover |
| `--shadow-nav` | `0 1px 0 rgba(0, 229, 208, 0.1)` | Nav bottom edge (redundant with border, use one) |

**Elevation model:** This site is essentially flat. The 3D city provides all depth perception. UI elements use border differentiation, not shadow elevation. Glow shadows are for interactive feedback, not spatial hierarchy.

---

## 7. Motion & Animation

### Duration Tokens

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | `150ms` | Micro-interactions (focus, hover start) |
| `--duration-normal` | `300ms` | State transitions (hover, toggle) |
| `--duration-slow` | `600ms` | Panel transitions, nav hide/show |
| `--duration-reveal` | `800ms` | Scroll reveal entrance (opacity + translateY) |

### Easing Curves

| Token | Value | Usage |
|---|---|---|
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions (Material Design standard) |
| `--ease-reveal` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Scroll reveal entrance (ease-out, natural deceleration) |

### Scroll Motion

| Property | Value |
|---|---|
| Scroll engine | Lenis 1.3.21 |
| Duration | 1.6 |
| Easing | Exponential ease-out |
| Integration | `gsap.ticker.add((time) => lenis.raf(time * 1000))` + `gsap.ticker.lagSmoothing(0)` |
| ScrollTrigger scrub | `0` (Lenis handles smoothing) |

### Scroll Reveal Pattern

Elements with class `.reveal` start at `opacity: 0; transform: translateY(12px)` and transition to `opacity: 1; transform: translateY(0)` when `.revealed` is added via IntersectionObserver.

Stagger: children of `.stagger` get incremental `transition-delay` (0ms, 100ms, 200ms, 300ms).

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

When `prefers-reduced-motion` is active:
- All CSS transitions/animations disabled
- Lenis smooth scroll disabled (native scroll)
- Three.js city scene static (no camera animation)
- ScrollTrigger still positions content but without animation
- Content sections visible immediately

---

## 8. Breakpoints

| Name | Token (reference) | Range | Behavior |
|---|---|---|---|
| Mobile | `sm` | < 640px | Single column, hamburger nav, no WebGL, blueprint grid background |
| Tablet | `md` | 640px – 1023px | 2-column grids, no WebGL, blueprint grid background |
| Desktop | `lg` | 1024px – 1439px | Full layout, WebGL city active, section dots visible |
| Wide | `xl` | >= 1440px | Wider gutters, more breathing room |

**Media query strategy:** Mobile-first with `min-width` breakpoints. CSS written for mobile, then enhanced upward.

```css
/* Mobile: default */
/* Tablet: @media (min-width: 640px) */
/* Desktop: @media (min-width: 1024px) */
/* Wide: @media (min-width: 1440px) */
```

**WebGL cutoff:** 1024px. Below this, the Three.js canvas is hidden and the CSS blueprint grid fallback is shown. The decision is based on both viewport size and likely device capability — mobile GPUs struggle with the Reflector's double-render pass.

---

## 9. Z-Index Scale

| Token | Value | Usage |
|---|---|---|
| `--z-canvas` | `0` | Three.js city canvas (position: fixed, behind everything) |
| `--z-grid` | `0` | CSS blueprint grid fallback (same layer as canvas — only one shows) |
| `--z-content` | `1` | Content sections (.section) |
| `--z-flight` | `2` | Flight sections (glassmorphism overlays over city) |
| `--z-skip` | `10` | Tunnel skip button |
| `--z-dots` | `90` | Section dot indicators (fixed right) |
| `--z-nav` | `100` | Fixed navigation bar |
| `--z-modal` | `200` | Future: modals, lightboxes (not currently used) |
| `--z-toast` | `300` | Future: notifications (not currently used) |

---

## 10. Glassmorphism (Flight Sections)

The defining UI treatment: content sections float over the 3D city as semi-transparent glass panels.

```css
.flight-section.section {
  background: rgba(8, 12, 20, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(0, 229, 208, 0.08);
  border-bottom: 1px solid rgba(0, 229, 208, 0.08);
}
```

**Rules:**
- `backdrop-filter: blur(16px)` — enough to make text readable without completely hiding the city
- Background opacity 0.75 — balances readability with transparency
- Teal accent borders at 8% opacity — visible but not distracting
- On mobile (no WebGL): sections get solid `--color-base` background instead

---

## 11. Naming Hierarchy

The three-tier naming system is a core brand element:

| Level | Text | Treatment |
|---|---|---|
| **ARAGORN** | Display name | Orbitron 700, chrome gradient, large (`--text-hero` in hero, `--text-lg` in nav) |
| **ItsMrMetaverse** | Handle | Share Tech Mono 400, `--color-accent`, prefixed with `> ` in hero, `--text-sm` in nav |
| **Future Historian** | Title | Rajdhani 500, `--color-text-muted`, PROMINENT — not buried. Visible in hero section, not just footer |

---

## 12. Component Style Direction

| Property | Direction | Rationale |
|---|---|---|
| Corners | Sharp (4px) | Precision, authority |
| Density | Spacious | Premium feel, breathing room |
| Ornamentation | Minimal | Let the 3D city be the spectacle |
| Interactivity | Subtle glow on hover | Reinforces the neon theme |
| Cards | Border-defined, no shadow elevation | Flat UI over 3D background |
| Buttons | Uppercase Orbitron, sharp | Match display typography |
| Forms | Dark inputs with teal focus border | Consistent with palette |
| Lists | Arrow markers (`→`) in teal | Replaces bullets, matches aesthetic |
| Quotes | Large `"` in dim teal | Decorative but restrained |
| Corner brackets | `::before`/`::after` pseudo-elements | Sci-fi framing device, used sparingly |

---

## 13. Three.js Scene Tokens

For consistency between the design system and the 3D scene:

| Property | Value |
|---|---|
| Building edge color | `#00E5D0` (matches `--color-accent`) |
| Building base color | `#080c14` (matches `--color-base`) |
| Depth fog color | `#8B5CF6` (matches `--color-depth`) |
| Ground grid color | `#00E5D0` at 15% opacity |
| Tone mapping | ACESFilmicToneMapping |
| Exposure | 1.4 |
| Fog type | FogExp2 |
| Bloom strength | 1.5 |
| Bloom radius | 0.6 |
| Bloom threshold | 0.15 |
| Particle foreground size | 2-4px |
| Particle dust size | 1px |
| Camera path | CatmullRomCurve3 |

---

## 14. Accessibility Tokens

| Property | Value |
|---|---|
| Minimum touch target | 44x44px (WCAG 2.5.5 — enhanced) |
| Focus indicator | 2px solid `--color-accent`, 2px offset |
| Focus indicator contrast | `--color-accent` on `--color-base` = 9.2:1 (exceeds 3:1 minimum) |
| Skip link | Hidden until focused, jumps to `<main>` |
| Heading hierarchy | Single `<h1>`, logical `h2`-`h6` per section |
| Color-only information | Never — always supplemented with text/icon |

---

## 15. Content Width Tokens

| Token | Value | Usage |
|---|---|---|
| `--content-max` | `1200px` | Standard section max-width |
| `--content-narrow` | `800px` | Text-heavy content, forms |
| `--nav-height` | `60px` | Fixed nav bar height, used for padding offsets |
