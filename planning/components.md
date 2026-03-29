# Component Inventory: itsmrmetaverse.com

**Date:** 2026-03-29
**Status:** Draft — pending user approval
**Sources:** DESIGN.md, wireframes.md, existing components.css

---

## Architecture

Static HTML/CSS/JS — no component framework. Components are CSS class patterns applied to semantic HTML. The "atomic design" hierarchy here describes reusable patterns, not framework components.

**No Storybook.** Components are simple enough to build and test inline. The CSS is already organized by token/layout/component layers.

---

## File Structure

```
src/
├── index.html              ← single page, all sections
├── css/
│   ├── tokens.css          ← design tokens (custom properties)
│   ├── layout.css          ← reset, sections, nav, grids, responsive
│   └── components.css      ← all component styles below
├── js/
│   ├── main.js             ← entry point, scroll reveal, nav, form
│   └── city.js             ← Three.js cityscape (separate module)
├── fonts/
│   ├── Orbitron-SemiBold.woff2
│   ├── Orbitron-Bold.woff2
│   ├── Rajdhani-Regular.woff2
│   ├── Rajdhani-Medium.woff2
│   └── ShareTechMono-Regular.woff2
└── assets/
    ├── hero.webp           ← processed hero photo
    ├── og-image.webp       ← Open Graph share image
    └── logos/              ← authority bar logos (WebP)
```

---

## Atoms

### Button (`.btn`)

The primary interactive element. Two variants, two sizes.

| Variant | Class | Appearance |
|---|---|---|
| Primary | `.btn--primary` | Teal fill, dark text. THE CTA breaker. |
| Secondary | `.btn--secondary` | Transparent, teal border + text |
| Small | `.btn--small` | Reduced padding + font size |

**HTML:**
```html
<a href="#work" class="btn btn--primary">Book a Keynote <span aria-hidden="true">&rarr;</span></a>
<a href="#" class="btn btn--secondary btn--small">Book This Talk <span aria-hidden="true">&rarr;</span></a>
```

**States:**
| State | Primary | Secondary |
|---|---|---|
| Default | `bg: --color-accent`, `color: --color-base` | `bg: transparent`, `border: --border-hairline` |
| Hover | `bg: #00ffea`, `shadow: --shadow-glow-strong` | `bg: --color-accent-dim` |
| Focus | 2px solid accent outline, 2px offset | 2px solid accent outline, 2px offset |
| Active | `transform: scale(0.98)` | `transform: scale(0.98)` |
| Disabled | `opacity: 0.5`, `cursor: not-allowed` | `opacity: 0.5`, `cursor: not-allowed` |

**Accessibility:**
- Use `<a>` for navigation, `<button>` for actions (form submit)
- Arrow icon (`→`) is decorative: `aria-hidden="true"`
- Minimum touch target: 44x44px
- Focus indicator visible in all states

---

### Text Styles

Not components per se — applied via semantic HTML + class overrides.

| Class | Element | Usage |
|---|---|---|
| `.chrome-text` | Any | Chrome gradient fill (ARAGORN logotype) |
| `.handle-text` | `<span>` | Teal mono text (> ItsMrMetaverse) |
| `.section__title` | `<h2>` | Orbitron uppercase section headings |
| `.section__subtitle` | `<p>` | Mono teal lowercase section label |

---

### Form Input (`.form__input`, `.form__textarea`)

| State | Treatment |
|---|---|
| Default | `bg: --color-base-card`, `border: --border-card` |
| Focus | `border-color: --color-accent`, no outline |
| Error | `border-color: --color-error` |
| Filled | Same as default |

**HTML:**
```html
<div class="form__field">
  <label for="name" class="form__label">Name</label>
  <input type="text" id="name" name="name" class="form__input" required>
</div>
```

**Accessibility:**
- Every input has a `<label>` with matching `for`/`id`
- Required fields use `required` attribute
- Error messages use `aria-live="polite"` or `role="alert"`

---

### Social Link (`.social-link`)

```html
<a href="https://linkedin.com/in/..." class="social-link" target="_blank" rel="noopener noreferrer">
  LinkedIn
</a>
```

Text-only links (no icons). Color transitions to accent on hover.

---

## Molecules

### Card (`.card`)

Container for topic cards and venture items.

| Variant | Class | Usage |
|---|---|---|
| Default | `.card` | Standard card |
| Primary | `.card--primary` | Highlighted card (booking card) |

**Subcomponents:**
- `.card__tag` — Mono, teal, lowercase topic tag
- `.card__title` — Orbitron, semibold heading
- `.card__text` — Muted body text
- `.takeaway-list` — Arrow-marked list items

**HTML:**
```html
<article class="card bracketed">
  <span class="card__tag">ai & future of work</span>
  <h3 class="card__title">AI Won't Replace You — But Someone Using AI Will</h3>
  <p class="card__text">How leaders can harness AI to amplify human potential.</p>
  <ul class="takeaway-list">
    <li>Key takeaway one</li>
    <li>Key takeaway two</li>
    <li>Key takeaway three</li>
  </ul>
  <a href="#work" class="btn btn--secondary btn--small">Book This Talk <span aria-hidden="true">&rarr;</span></a>
</article>
```

**States:** Border brightens to 30% accent on hover, glow shadow.

---

### Testimonial (`.testimonial`)

```html
<blockquote class="testimonial">
  <p class="testimonial__quote">Quote text here.</p>
  <footer>
    <cite class="testimonial__author">Jane Doe</cite>
    <span class="testimonial__role">Event Director, TechConf 2026</span>
  </footer>
</blockquote>
```

Left border accent. Large decorative `"` via `::before`. Uses `<blockquote>` for semantics.

---

### Embed Container (`.embed-container`)

Responsive 16:9 iframe wrapper for YouTube and Spotify.

```html
<div class="embed-container">
  <iframe src="..." title="Keynote: AI and the Future of Work" loading="lazy" allowfullscreen></iframe>
</div>
```

**Accessibility:** Every iframe gets a descriptive `title` attribute.

---

### Form Field (`.form__field`)

Label + input pair. See Atoms > Form Input for details.

---

### Metric (`.metric`)

For potential future stats display (talks given, countries, etc.).

```html
<div class="metric">
  <span class="metric__value">200+</span>
  <span class="metric__label">Keynotes Delivered</span>
</div>
```

---

## Organisms

### Nav (`.nav`)

Fixed top bar. Chrome logotype left, teal handle right.

```html
<header class="nav" role="banner">
  <a href="#intro" class="nav__name" aria-label="Scroll to top">ARAGORN</a>
  <a href="#intro" class="nav__handle">> ItsMrMetaverse</a>
</header>
```

**Behavior:** Hidden during intro, slides in via `.nav--hidden` toggle.

---

### City Intro (`.flight-section--intro`)

Full-viewport overlay for the name reveal.

```html
<section id="intro" class="flight-section flight-section--intro" aria-label="Introduction">
  <div class="intro__content">
    <h1 class="chrome-text intro__name">ARAGORN</h1>
    <p class="handle-text intro__handle">> ItsMrMetaverse</p>
    <p class="intro__title">Future Historian</p>
  </div>
  <button class="tunnel-skip" aria-label="Skip to content">↓ Scroll</button>
</section>
```

**Behavior:** Text fades out during first 10% of scroll. City canvas is behind (z-index: 0).

---

### Hero (`.hero`)

```html
<section id="hero" class="flight-section section" aria-label="About Aragorn">
  <div class="section__inner hero">
    <img src="assets/hero.webp" alt="Aragorn Meulendijks on stage delivering a keynote"
         class="hero__photo" width="380" height="380" fetchpriority="high">
    <div class="hero__content">
      <h2 class="hero__statement">Helping leaders navigate the exponential future</h2>
      <p class="hero__subtitle">Keynote speaker. Futurist. Future Historian.</p>
      <a href="#work" class="btn btn--primary">Book a Keynote <span aria-hidden="true">&rarr;</span></a>
    </div>
  </div>
</section>
```

**Responsive:** Column centered on mobile, row on desktop.
**Performance:** Hero photo gets `fetchpriority="high"` (LCP element).

---

### Authority Bar (`.logo-bar`)

```html
<section id="trusted-by" class="flight-section section" aria-label="Trusted by">
  <div class="section__inner">
    <p class="logo-bar__label">Trusted by</p>
    <div class="logo-bar" role="list">
      <img src="assets/logos/company1.webp" alt="Company One" class="logo-bar__item"
           width="120" height="32" loading="lazy" role="listitem">
      <!-- more logos -->
    </div>
  </div>
</section>
```

Grayscale + 50% opacity by default, full color on hover. Flex wrap.

---

### Media Section

```html
<section id="media" class="flight-section section" aria-label="Media">
  <div class="section__inner">
    <p class="section__subtitle">> media</p>
    <h2 class="section__title">See It In Action</h2>

    <div class="embed-container">
      <iframe src="..." title="Keynote: ..." loading="lazy" allowfullscreen></iframe>
    </div>

    <div class="embed-grid">
      <div class="embed-container">
        <iframe src="..." title="Singularity Surfers Podcast (EN)" loading="lazy"></iframe>
      </div>
      <div class="embed-container">
        <iframe src="..." title="Singularity Surfers Podcast (NL)" loading="lazy"></iframe>
      </div>
    </div>

    <p><a href="..." target="_blank" rel="noopener noreferrer">Read on Substack &rarr;</a></p>
  </div>
</section>
```

YouTube full-width, Spotify in 2-column grid on tablet+.

---

### Speaking Topics

```html
<section id="topics" class="flight-section section" aria-label="Speaking topics">
  <div class="section__inner">
    <p class="section__subtitle">> topics</p>
    <h2 class="section__title">Speaking Topics</h2>
    <div class="grid-4 stagger">
      <!-- 4x card molecules (see Card above) -->
    </div>
  </div>
</section>
```

Grid: 1col mobile → 2col tablet → 4col desktop. Cards use `.bracketed` corner marks.

---

### Testimonials

```html
<section id="testimonials" class="flight-section section" aria-label="Testimonials">
  <div class="section__inner">
    <p class="section__subtitle">> proof</p>
    <h2 class="section__title">What Organizers Say</h2>
    <div class="grid-3 stagger">
      <!-- 3x testimonial molecules -->
    </div>
  </div>
</section>
```

Grid: 1col mobile → 2col tablet → 3col desktop.

---

### Work With Me

```html
<section id="work" class="flight-section section" aria-label="Work with me">
  <div class="section__inner">
    <p class="section__subtitle">> book</p>
    <h2 class="section__title">Work With Me</h2>
    <div class="grid-2">

      <div class="card card--primary">
        <h3 class="card__title">Keynote Booking</h3>

        <div class="booking-path">
          <h4>Netherlands / Benelux</h4>
          <p class="card__text">Book via Speakers Academy</p>
          <a href="..." class="btn btn--secondary btn--small" target="_blank" rel="noopener noreferrer">
            Book via Agency <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <hr class="divider">

        <div class="booking-path">
          <h4>International</h4>
          <form class="form" action="https://formspree.io/f/..." method="POST">
            <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">
            <div class="form__field">
              <label for="contact-name" class="form__label">Name</label>
              <input type="text" id="contact-name" name="name" class="form__input" required>
            </div>
            <div class="form__field">
              <label for="contact-email" class="form__label">Email</label>
              <input type="email" id="contact-email" name="email" class="form__input" required>
            </div>
            <div class="form__field">
              <label for="contact-event" class="form__label">Event & Date</label>
              <input type="text" id="contact-event" name="event" class="form__input">
            </div>
            <div class="form__field">
              <label for="contact-message" class="form__label">Message</label>
              <textarea id="contact-message" name="message" class="form__textarea"></textarea>
            </div>
            <button type="submit" class="btn btn--primary">Send Inquiry <span aria-hidden="true">&rarr;</span></button>
          </form>
        </div>
      </div>

      <div class="card">
        <h3 class="card__title">Ventures</h3>
        <ul class="takeaway-list">
          <li><a href="...">Extended Edition</a></li>
          <li><a href="...">Innovation Network</a></li>
          <li><a href="...">VCM</a></li>
        </ul>
      </div>

    </div>
  </div>
</section>
```

---

### Stay Connected + Footer

```html
<section id="connect" class="flight-section section" aria-label="Stay connected">
  <div class="section__inner" style="text-align: center;">
    <p class="section__subtitle">> connect</p>
    <h2 class="section__title">Stay Connected</h2>
    <nav class="social-links" aria-label="Social media">
      <a href="..." class="social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="..." class="social-link" target="_blank" rel="noopener noreferrer">X</a>
      <a href="..." class="social-link" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="..." class="social-link" target="_blank" rel="noopener noreferrer">YouTube</a>
      <a href="..." class="social-link" target="_blank" rel="noopener noreferrer">Substack</a>
    </nav>
    <p><a href="...">Extended Mind Blueprint &rarr;</a></p>
  </div>
</section>

<footer class="footer" role="contentinfo">
  <p class="chrome-text">ARAGORN</p>
  <p class="handle-text">> ItsMrMetaverse &middot; Future Historian</p>
  <a href="#work" class="btn btn--primary btn--small">Book a Keynote <span aria-hidden="true">&rarr;</span></a>
  <p class="footer__copy">&copy; 2026 Aragorn Meulendijks. All rights reserved.</p>
</footer>
```

---

### Section Dots (`.section-dots`)

```html
<nav class="section-dots" aria-label="Page sections">
  <button class="section-dots__dot section-dots__dot--active" aria-label="Introduction" aria-current="true"></button>
  <button class="section-dots__dot" aria-label="About"></button>
  <button class="section-dots__dot" aria-label="Trusted by"></button>
  <button class="section-dots__dot" aria-label="Media"></button>
  <button class="section-dots__dot" aria-label="Speaking topics"></button>
  <button class="section-dots__dot" aria-label="Testimonials"></button>
  <button class="section-dots__dot" aria-label="Work with me"></button>
  <button class="section-dots__dot" aria-label="Stay connected"></button>
</nav>
```

Desktop only (hidden below 1024px). Active dot tracks scroll position via IntersectionObserver.

---

### Three.js City Canvas

```html
<canvas id="city-canvas" class="city-canvas" aria-hidden="true"></canvas>
```

- `position: fixed`, `inset: 0`, `z-index: 0`
- Purely decorative — `aria-hidden="true"`
- Initialized by `city.js` module
- Hidden on mobile (< 1024px) via CSS
- Respects `prefers-reduced-motion`

---

## Utility Classes

| Class | Purpose |
|---|---|
| `.reveal` | Scroll reveal target (opacity 0 → 1, translateY 12px → 0) |
| `.revealed` | Applied by JS when element enters viewport |
| `.stagger` | Parent of `.reveal` children — applies incremental delay |
| `.bracketed` | Corner bracket marks via `::before`/`::after` |
| `.grid-2` / `.grid-3` / `.grid-4` | Responsive grid layouts |

---

## Skip Link (Accessibility)

First element in `<body>`, before nav:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--space-4);
  background: var(--color-accent);
  color: var(--color-base);
  padding: var(--space-3) var(--space-5);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  z-index: var(--z-toast);
  border-radius: var(--border-radius);
}

.skip-link:focus {
  top: var(--space-4);
}
```

---

## CSS Architecture (No Changes Needed)

The existing 3-file structure handles everything:

1. **`tokens.css`** — Custom properties (design tokens)
2. **`layout.css`** — Reset, sections, nav, grids, hero, responsive breakpoints, reduced motion
3. **`components.css`** — All component styles (buttons, cards, testimonials, forms, etc.)

Load order in HTML:
```html
<link rel="stylesheet" href="src/css/tokens.css">
<link rel="stylesheet" href="src/css/layout.css">
<link rel="stylesheet" href="src/css/components.css">
```

---

## JS Architecture

1. **`main.js`** — Entry point
   - Scroll reveal (IntersectionObserver)
   - Nav show/hide logic
   - Section dot tracking
   - Form submission (Formspree fetch)
   - Lazy iframe loading
   - Intro text fade on scroll
   - Import and init `city.js`

2. **`city.js`** — Three.js module (exported as ES module)
   - Scene setup (renderer, camera, fog)
   - Building generation (InstancedMesh + GLSL ShaderMaterial)
   - Ground plane (Reflector + grid overlay)
   - Post-processing (EffectComposer pipeline)
   - Dual-layer particle system
   - Camera path (CatmullRomCurve3)
   - Scroll-linked camera position (GSAP ScrollTrigger)
   - Resize handler
   - Reduced motion check
   - `dispose()` cleanup method
