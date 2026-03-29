# Pickup Instructions — itsmrmetaverse-claude

## Status: WEB-CYCLE COMPLETE, PENDING CONTENT

The full 12-phase `/web-cycle` is done. The site is live at **https://claude.itsmrmetaverse.com/** with perfect Lighthouse scores. However, it's running on placeholder content — real assets are needed before it's production-ready.

## What Was Built

A premium futurist brand site for Aragorn Meulendijks (ItsMrMetaverse) with a persistent Tron: Legacy-inspired neon cityscape rendered in Three.js. Static HTML/CSS/JS — no framework, no build step.

- **Repo:** `Aragorn2046/itsmrmetaverse-claude`
- **Local:** `~/projects/itsmrmetaverse-claude/`
- **Live:** https://claude.itsmrmetaverse.com/ (GitHub Pages, gh-pages branch)
- **Deploy method:** `git subtree push --prefix src origin gh-pages`

## Lighthouse Scores (2026-03-29)

| Category | Desktop | Mobile |
|----------|---------|--------|
| Performance | 100 | 99 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

CWV: LCP 0.4s/1.7s, CLS 0.002/0.005, INP 0ms/0ms

## Architecture

```
src/
  index.html          # Single page, 8 content sections, JSON-LD structured data
  css/
    tokens.css        # Design tokens (colors, spacing, typography, z-index)
    layout.css        # Grid, responsive breakpoints, canvas, section dots
    components.css    # All component styles (nav, hero, cards, form, footer)
  js/
    main.js           # Scroll reveal, nav, section dots, lazy iframes, contact form
    city.js           # Three.js cityscape (InstancedMesh, GLSL shaders, post-processing)
  fonts/              # Self-hosted: Orbitron, Rajdhani, Share Tech Mono
  assets/
    hero.webp         # PLACEHOLDER — needs real hero photo
    og-image.webp     # PLACEHOLDER — needs real OG image (1200x630px)
    logos/             # PLACEHOLDER authority logos
  CNAME               # claude.itsmrmetaverse.com
  robots.txt
  sitemap.xml
  favicon.ico
```

## Content Placeholders to Replace

These are the items that need real content before the site is truly production-ready:

| Placeholder | Location | What's Needed |
|-------------|----------|---------------|
| `hero.webp` | `src/assets/hero.webp` | Real hero photo of Aragorn |
| `og-image.webp` | `src/assets/og-image.webp` | Open Graph image, 1200x630px |
| `placeholder-{1-6}.webp` | `src/assets/logos/` | Authority/client logos for "Trusted By" bar |
| `VIDEO_ID` | `src/index.html` (YouTube embed) | Real YouTube video ID |
| `SHOW_ID_EN` | `src/index.html` (Spotify embed) | English podcast Spotify show ID |
| `SHOW_ID_NL` | `src/index.html` (Spotify embed) | Dutch podcast Spotify show ID |
| `FORM_ID` | `src/index.html` (Formspree action URL) | Formspree form ID for contact form |
| Testimonial quotes | `src/index.html` (testimonials section) | Real testimonials from clients/partners |
| Booking URL | `src/index.html` (CTA buttons) | Speakers Academy or calendar booking link |

## How to Resume

```bash
# In a fresh Claude Code session:
cd ~/projects/itsmrmetaverse-claude

# To replace a placeholder and redeploy:
# 1. Edit the file(s) in src/
# 2. Commit
# 3. git subtree push --prefix src origin gh-pages
```

## Dual Build Context

This is **Build A** (Claude Code). There is a competing **Build B** (Gemini 3.1 Pro + Antigravity):
- Build B repo: `Aragorn2046/itsmrmetaverse-gemini`
- Build B local: `~/projects/itsmrmetaverse-gemini/`
- Both builds share the same spec (discovery.md, DESIGN.md, wireframes.md, components.md)
- Purpose: side-by-side comparison of AI-built websites from identical specs

## Key Design Decisions

- **No framework** — static HTML/CSS/JS for maximum performance and simplicity
- **Three.js cityscape** hidden below 1024px — mobile gets CSS grid background instead (battery/GPU)
- **Import maps** for CDN modules (Three.js r183, Lenis 1.3.21, GSAP 3.12.7) — all version-pinned
- **Progressive enhancement** — content works without JS; CSS adds design; JS adds animations + Three.js
- **WCAG 2.2 AA** — full compliance, `prefers-reduced-motion` respected, 44x44px touch targets
- **Formspree** for contact form (no server-side code needed)

## Planning Artifacts

All in `planning/`:
- `cycle-state.md` — full phase history and decisions log
- `itsmrmetaverse-webcycle/discovery.md` — scope and requirements
- `itsmrmetaverse-webcycle/research-brief.md` — technology research (1,343 lines)
- `itsmrmetaverse-webcycle/DESIGN.md` — full design system
- `itsmrmetaverse-webcycle/wireframes.md` — layout structure
- `itsmrmetaverse-webcycle/components.md` — component inventory
- `lighthouse-report.md` — performance audit
- `a11y-report.md` — accessibility audit
- `seo-report.md` — SEO audit
- `qa-report.md` — cross-browser QA
- `security-report.md` — security audit
