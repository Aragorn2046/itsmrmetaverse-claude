# Wireframes & Layout: itsmrmetaverse.com

**Date:** 2026-03-29
**Status:** Draft — pending user approval
**Sources:** discovery.md, DESIGN.md

---

## 1. Sitemap

Single-page site. All content on one scrolling page with anchor navigation.

```
itsmrmetaverse.com (single page)
├── #intro       — City Intro (full-viewport 3D canvas, name reveal)
├── #hero        — Hero (outcome statement + photo + CTA)
├── #trusted-by  — Authority Bar (logo strip)
├── #media       — Media / Sizzle (YouTube + Spotify + Substack)
├── #topics      — Speaking Topics (3-4 topic cards)
├── #testimonials — Testimonials (quotes carousel/stack)
├── #work        — Work With Me (dual booking + ventures)
└── #connect     — Stay Connected (socials + newsletter + footer)
```

**External links (open in new tab):**
- Speakers Academy booking URL (NL/Benelux)
- YouTube channel
- Spotify podcasts (EN + NL)
- Substack
- Social profiles (LinkedIn, X, Instagram)
- Extended Mind Blueprint

---

## 2. User Flows

### Primary Flow: Book a Keynote

```
Land on site → City intro captures attention → Scroll into hero
→ See outcome statement + authority photo → "Book a Keynote" CTA
   ├── Click CTA → Scroll to #work → Choose booking path
   │   ├── NL/Benelux → Speakers Academy (external)
   │   └── International → Contact form (Formspree)
   └── Continue scrolling → Authority bar builds trust
       → Media proves expertise → Topics show range
       → Testimonials confirm quality → #work section has CTA again
```

**CTA appears at:** hero, after sizzle, each topic card ("Book This Talk"), Work With Me section, footer. The primary CTA is always visible within one scroll's distance.

### Secondary Flow: Explore Content

```
Land on site → Scroll through city → See media section
→ Watch YouTube clip / Listen to podcast → Follow to YouTube/Spotify
→ Read Substack → Subscribe to newsletter
```

### Tertiary Flow: Check Credentials

```
Land on site → See authority bar (trusted by logos)
→ Read speaking topics → Read testimonials
→ Explore ventures → Book or connect
```

---

## 3. Page Layout (Section by Section)

### 3.1 City Intro (`#intro`)

**Purpose:** Full-viewport 3D cityscape. Camera begins flight. Name overlaid.

**Mobile (< 1024px):**
```
┌──────────────────────────────┐
│                              │
│    [Blueprint grid bg]       │
│                              │
│        A R A G O N           │  ← chrome gradient, centered
│    > ItsMrMetaverse          │  ← teal mono, centered
│      Future Historian        │  ← muted, centered, PROMINENT
│                              │
│      [ ↓ Scroll ]            │  ← skip button at bottom
│                              │
└──────────────────────────────┘
  height: 100vh
```

**Desktop (>= 1024px):**
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│               [Three.js Tron cityscape canvas]               │
│                                                              │
│                      A R A G O N                             │  ← chrome gradient
│                  > ItsMrMetaverse                            │  ← teal mono
│                    Future Historian                          │  ← muted, prominent
│                                                              │
│                    [ ↓ Scroll ]                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
  height: 100vh, position: relative, z-index: 2
  Text fades out during first 10% of scroll
  City canvas: position: fixed, z-index: 0 (behind everything)
```

### 3.2 Hero (`#hero`)

**Purpose:** Outcome-led statement + authority photo + primary CTA. NOT a bio section.

**Mobile:**
```
┌──────────────────────────────┐
│  [glassmorphism background]  │
│                              │
│       ┌──────────┐           │
│       │  Photo   │           │  ← 280px circle, centered
│       │ (circle) │           │
│       └──────────┘           │
│                              │
│  "Helping leaders navigate   │  ← hero statement, centered
│   the exponential future"    │     clamp(2.5rem, 5vw, 4.5rem)
│                              │
│  Keynote speaker. Futurist.  │  ← subtitle, muted
│  Future Historian.           │
│                              │
│   [ Book a Keynote → ]       │  ← PRIMARY CTA, teal fill
│                              │
└──────────────────────────────┘
  padding-top: nav-height + space-10
  min-height: 80vh
  text-align: center
```

**Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│  [glassmorphism background — city visible behind]            │
│                                                              │
│  ┌──────────┐   "Helping leaders navigate                   │
│  │  Photo   │    the exponential future"                     │
│  │ (circle) │                                                │
│  │  380px   │   Keynote speaker. Futurist.                   │
│  │          │   Future Historian.                             │
│  └──────────┘                                                │
│                 [ Book a Keynote → ]                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
  flex-direction: row, gap: space-10
  Photo left, text right, left-aligned
```

### 3.3 Authority Bar (`#trusted-by`)

**Purpose:** "Trusted by" horizontal logo strip — 6-8 company/event logos.

**Mobile:**
```
┌──────────────────────────────┐
│  TRUSTED BY                  │  ← mono, dim, uppercase, centered
│                              │
│  [logo] [logo] [logo]       │  ← wrap to 2 rows
│  [logo] [logo] [logo]       │     grayscale, 50% opacity
│                              │     hover: full color
└──────────────────────────────┘
  flex-wrap: wrap, gap: space-8
```

**Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│                         TRUSTED BY                           │
│   [logo]  [logo]  [logo]  [logo]  [logo]  [logo]  [logo]   │
└──────────────────────────────────────────────────────────────┘
  Single row, centered, 32px height per logo
```

### 3.4 Media / Sizzle (`#media`)

**Purpose:** Best YouTube keynote clip + Spotify embeds + Substack link.

**Mobile:**
```
┌──────────────────────────────┐
│  > media                     │  ← section subtitle (mono, teal)
│  SEE IT IN ACTION            │  ← section title (Orbitron)
│                              │
│  ┌──────────────────────┐    │
│  │   YouTube Embed      │    │  ← 16:9 responsive
│  │   (keynote clip)     │    │
│  └──────────────────────┘    │
│                              │
│  ┌──────────────────────┐    │
│  │ Spotify EN Podcast   │    │  ← embed card
│  └──────────────────────┘    │
│                              │
│  ┌──────────────────────┐    │
│  │ Spotify NL Podcast   │    │  ← embed card
│  └──────────────────────┘    │
│                              │
│  Read on Substack →          │  ← text link
│                              │
└──────────────────────────────┘
  Single column stack
```

**Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│  > media                                                     │
│  SEE IT IN ACTION                                            │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              YouTube Embed (keynote clip)            │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │ Spotify EN Podcast   │  │ Spotify NL Podcast   │         │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                              │
│  Read on Substack →                                          │
└──────────────────────────────────────────────────────────────┘
  YouTube: full width. Spotify: 2-column grid.
```

### 3.5 Speaking Topics (`#topics`)

**Purpose:** 3-4 topic cards with hooks, takeaways, individual "Book This Talk" CTAs.

**Topics:** AI & the Future of Work | XR & Spatial Computing | Exponential Change | Robotics & Automation

**Mobile:**
```
┌──────────────────────────────┐
│  > topics                    │
│  SPEAKING TOPICS             │
│                              │
│  ┌──────────────────────┐    │
│  │ ai & future of work  │ ← card tag (mono, teal)
│  │                      │
│  │ AI Won't Replace     │ ← card title (Orbitron)
│  │ You — But Someone    │
│  │ Using AI Will        │
│  │                      │
│  │ → Takeaway one       │ ← takeaway list (arrow markers)
│  │ → Takeaway two       │
│  │ → Takeaway three     │
│  │                      │
│  │ [Book This Talk →]   │ ← secondary CTA (outline)
│  └──────────────────────┘    │
│                              │
│  ┌──────────────────────┐    │
│  │ (next topic card)    │    │
│  └──────────────────────┘    │
│  ...                         │
└──────────────────────────────┘
  Single column, stacked cards
```

**Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│  > topics                                                    │
│  SPEAKING TOPICS                                             │
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ AI &       │ │ XR &       │ │ Exponential│ │ Robotics │ │
│  │ Future of  │ │ Spatial    │ │ Change     │ │ &        │ │
│  │ Work       │ │ Computing  │ │            │ │ Automat. │ │
│  │            │ │            │ │            │ │          │ │
│  │ → ...      │ │ → ...      │ │ → ...      │ → ...     │ │
│  │ → ...      │ │ → ...      │ │ → ...      │ → ...     │ │
│  │            │ │            │ │            │ │          │ │
│  │ [Book →]   │ │ [Book →]   │ │ [Book →]   │ [Book →]  │ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
└──────────────────────────────────────────────────────────────┘
  grid-4: 4 columns at desktop, 2 at tablet, 1 at mobile
  Cards have bracketed corner marks (::before/::after)
```

### 3.6 Testimonials (`#testimonials`)

**Purpose:** Quotes from event organizers. Carousel desktop, stack mobile.

**Mobile:**
```
┌──────────────────────────────┐
│  > proof                     │
│  WHAT ORGANIZERS SAY         │
│                              │
│  ┌──────────────────────┐    │
│  │ " Aragorn completely │    │  ← left border teal accent
│  │   transformed how    │    │     large " decorative
│  │   our team thinks    │    │
│  │   about AI."         │    │
│  │                      │    │
│  │ — Jane Doe           │    │  ← mono, muted
│  │   Event Director,    │    │  ← xs, dim
│  │   TechConf 2026      │    │
│  └──────────────────────┘    │
│                              │
│  ┌──────────────────────┐    │
│  │ (next testimonial)   │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
  Stacked vertically on mobile
```

**Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│  > proof                                                     │
│  WHAT ORGANIZERS SAY                                         │
│                                                              │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────┐ │
│  │ " Quote one...   │ │ " Quote two...   │ │ " Quote 3... │ │
│  │                  │ │                  │ │              │ │
│  │ — Author         │ │ — Author         │ │ — Author     │ │
│  │   Role, Company  │ │   Role, Company  │ │   Role, Co.  │ │
│  └──────────────────┘ └──────────────────┘ └──────────────┘ │
└──────────────────────────────────────────────────────────────┘
  grid-3: 3 columns at desktop
  If >3 testimonials: horizontal scroll or carousel with dots
```

### 3.7 Work With Me (`#work`)

**Purpose:** Dual booking paths + ventures. The conversion section.

**Mobile:**
```
┌──────────────────────────────┐
│  > book                      │
│  WORK WITH ME                │
│                              │
│  ┌──────────────────────┐    │
│  │ KEYNOTE BOOKING      │    │  ← card, primary border
│  │                      │    │
│  │ Netherlands/Benelux  │    │
│  │ Via Speakers Academy │    │
│  │ [Book via Agency →]  │    │  ← secondary CTA
│  │                      │    │
│  │ ─────────────────    │    │  ← hairline divider
│  │                      │    │
│  │ International        │    │
│  │ Direct booking       │    │
│  │                      │    │
│  │ [Name          ]     │    │  ← form fields
│  │ [Email         ]     │    │
│  │ [Event + Date  ]     │    │
│  │ [Message       ]     │    │
│  │                      │    │
│  │ [ Send Inquiry → ]   │    │  ← primary CTA
│  └──────────────────────┘    │
│                              │
│  ┌──────────────────────┐    │
│  │ VENTURES             │    │
│  │                      │    │
│  │ → Extended Edition   │    │
│  │ → Innovation Network │    │
│  │ → VCM               │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

**Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│  > book                                                      │
│  WORK WITH ME                                                │
│                                                              │
│  ┌───────────────────────────┐  ┌──────────────────────────┐ │
│  │ KEYNOTE BOOKING           │  │ VENTURES                 │ │
│  │                           │  │                          │ │
│  │ NL/Benelux               │  │ → Extended Edition       │ │
│  │ [Book via Agency →]      │  │ → Innovation Network     │ │
│  │                           │  │ → VCM                    │ │
│  │ International             │  │                          │ │
│  │ [Name    ] [Email     ]  │  │                          │ │
│  │ [Event + Date         ]  │  │                          │ │
│  │ [Message              ]  │  │                          │ │
│  │ [ Send Inquiry → ]       │  │                          │ │
│  └───────────────────────────┘  └──────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
  grid-2: booking left (wider), ventures right
```

### 3.8 Stay Connected (`#connect`)

**Purpose:** Social links, newsletter CTA, Extended Mind Blueprint link, footer.

**Mobile + Desktop (same layout, centered):**
```
┌──────────────────────────────────────────────────────────────┐
│  > connect                                                   │
│  STAY CONNECTED                                              │
│                                                              │
│     [LinkedIn]  [X]  [Instagram]  [YouTube]  [Substack]     │
│                                                              │
│     Extended Mind Blueprint →                                │
│                                                              │
│  ────────────────────────────────────────────────────────    │
│                                                              │
│  A R A G O N                                                 │
│  > ItsMrMetaverse · Future Historian                         │
│  [ Book a Keynote → ]                                        │
│                                                              │
│  2026 Aragorn Meulendijks. All rights reserved.             │
└──────────────────────────────────────────────────────────────┘
  Footer: border-top, glassmorphism, centered
```

---

## 4. Navigation

### Fixed Nav Bar

```
┌──────────────────────────────────────────────────────────────┐
│  ARAGORN                                        ItsMrMetaverse│
└──────────────────────────────────────────────────────────────┘
  height: 60px (--nav-height)
  glassmorphism: rgba(8,12,20,0.85) + blur(12px)
  border-bottom: --border-card
```

**Behavior:**
- Hidden during intro section (city takes full viewport)
- Slides in after scrolling past intro (transform transition)
- ARAGORN (left) = chrome gradient, links to #intro (scroll to top)
- ItsMrMetaverse (right) = teal mono, links to #intro

**No hamburger menu.** This is a single-page site with 8 sections. The nav has only the brand name and handle. Section navigation is handled by the dot indicator (desktop) or scrolling (mobile).

### Section Dot Indicator (Desktop Only)

```
        ●  ← active section (teal, scale 1.4)
        ○
        ○
        ○
        ○
        ○
        ○
        ○
```

- Fixed right side, vertically centered
- 8 dots for 8 sections
- Active dot: `--color-accent`, `scale(1.4)`
- Inactive dots: `--color-text-dim`
- Click to scroll to section
- Hidden below 1024px

---

## 5. Responsive Behavior Summary

| Element | Mobile (< 640px) | Tablet (640-1023px) | Desktop (>= 1024px) |
|---|---|---|---|
| 3D City canvas | Hidden | Hidden | Visible (fixed) |
| Background | Blueprint grid | Blueprint grid | City canvas |
| Section backgrounds | Solid `--color-base` | Solid `--color-base` | Glassmorphism |
| Hero layout | Column, centered | Column, centered | Row (photo left, text right) |
| Hero photo | 280px circle | 320px circle | 380px circle |
| Topic cards | 1 column | 2 columns | 4 columns |
| Testimonials | Stacked | 2 columns | 3 columns |
| Work With Me | Stacked | Stacked | 2 columns |
| Spotify embeds | Stacked | 2 columns | 2 columns |
| Section dots | Hidden | Hidden | Visible |
| Nav | Brand name + handle | Brand name + handle | Brand name + handle |
| Touch targets | >= 44x44px | >= 44x44px | N/A |

---

## 6. State Inventory

### Loading States

| Element | Loading State |
|---|---|
| 3D City | Show blueprint grid until WebGL context ready, then fade in canvas |
| YouTube embed | Card background with play icon placeholder until iframe loads |
| Spotify embed | Card background until iframe loads |
| Hero photo | Blur-up placeholder (tiny base64 inline, swap on load) |
| Authority logos | Grayscale silhouettes until images load |
| Fonts | System fallback → swap on WOFF2 load (`font-display: swap`) |

### Form States

| State | Treatment |
|---|---|
| Default | Dark input, `--border-card` |
| Focus | `--color-accent` border, no outline |
| Filled | Same as default |
| Error | `--color-error` border, error message below field |
| Success | Form replaced with "Thank you" message, `--color-success` accent |
| Submitting | Button shows "Sending..." disabled state |

### Interactive States

| Element | Hover | Focus | Active |
|---|---|---|---|
| Primary CTA | Brighter teal (#00ffea), `--shadow-glow-strong` | 2px accent outline, 2px offset | Scale 0.98 |
| Secondary CTA | `--color-accent-dim` background | 2px accent outline, 2px offset | Scale 0.98 |
| Card | Border brightens to 30% accent, `--shadow-glow` | 2px accent outline | — |
| Nav brand | — | 2px accent outline | — |
| Social link | Color → `--color-accent` | 2px accent outline | — |
| Logo | Grayscale → color, opacity 50% → 100% | 2px accent outline | — |
| Section dot | — | — | Scale 1.4, accent color |

### Empty States

| Element | If Missing |
|---|---|
| Authority logos | Hide entire section until logos provided |
| YouTube clip | Show placeholder card: "Sizzle reel coming soon" |
| Testimonials | Show 2-3 placeholder testimonials with real or realistic quotes |

---

## 7. Interaction Notes

### Scroll Reveal Animation

- Elements with `.reveal` class: enter from 12px below with opacity 0→1
- Duration: 800ms, `--ease-reveal`
- Triggered by IntersectionObserver at threshold ~10%
- Stagger children in groups of 4 (100ms delay increment)
- **Reduced motion:** elements visible immediately, no animation

### Hero Text Fade

- During first 10% of scroll progress, the intro overlay (name, handle, title) fades out
- Implemented via ScrollTrigger scrub with opacity tween
- City continues behind as user scrolls into hero section

### Nav Show/Hide

- Hidden during intro (transform: translateY(-100%))
- After scrolling past intro section: slides in with 300ms transition
- Stays fixed at top for remainder of page

### 3D City Camera Flight

- Camera follows CatmullRomCurve3 through city
- Scroll progress (0 to 1) maps to position on curve
- Gentle curves — no sharp turns
- Smooth interpolation, not snapping
- FogExp2 density varies subtly with scroll position
- Buildings placed along the path, visible in foreground and receding into distance

### Form Submission

- Formspree POST with `_gotcha` honeypot field (hidden, must be empty)
- On success: fade form out, show success message
- On error: show error message below submit button
- No page reload — fetch API with async handling

---

## 8. Accessibility Notes

- **Skip link:** First focusable element, hidden until focused. Target: `<main>`.
- **Landmarks:** `<header>` (nav), `<main>` (all sections), `<footer>`.
- **Heading hierarchy:** `<h1>` = "ARAGORN" in intro. Each section gets `<h2>`. Card titles = `<h3>`.
- **Scroll reveal:** `prefers-reduced-motion` disables all animation. Content visible by default.
- **3D canvas:** Decorative only. `aria-hidden="true"`, no interactive elements inside.
- **Embeds:** YouTube/Spotify iframes get descriptive `title` attributes.
- **Form:** All inputs have `<label>` elements. Error messages use `aria-live="polite"`.
- **Images:** Hero photo has descriptive alt. Authority logos have company name alt text.
- **Color:** No information conveyed by color alone. Accent teal always paired with text or icon.
- **Focus visible:** 2px solid `--color-accent`, 2px offset on all interactive elements.
- **Touch targets:** Minimum 44x44px on all interactive elements at mobile viewports.
