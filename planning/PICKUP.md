# Pickup Instructions — itsmrmetaverse-claude

## Status: SITE LIVE, PLACEHOLDER CONTENT NEEDS REPLACING

The full 12-phase `/web-cycle` is done. The site is live at **https://claude.itsmrmetaverse.com/** with perfect Lighthouse scores. It's running on placeholder content — real assets are needed before it's production-ready.

## Quick Reference

- **Repo:** `Aragorn2046/itsmrmetaverse-claude` (PRIVATE)
- **Local:** `~/projects/itsmrmetaverse-claude/`
- **Live:** https://claude.itsmrmetaverse.com/ (GitHub Pages, gh-pages branch)
- **Deploy:** `cd ~/projects/itsmrmetaverse-claude && git subtree push --prefix src origin gh-pages`
- **Lighthouse:** 100/100/100/100 desktop, 99/100/100/100 mobile

## Content Replacement Checklist

Replace each placeholder, commit, and redeploy. Each item is independent — do them in any order.

### 1. Hero Photo (`src/assets/hero.webp`)
- **Current:** 44-byte placeholder file
- **Needed:** Real photo of Aragorn on stage or in professional setting
- **Format:** WebP, recommended ~800px wide, compressed
- **Referenced at:** `index.html:122` (hero section), `index.html:372` (JSON-LD schema)
- **How:** Replace the file at `src/assets/hero.webp`. Update alt text at line 122 if needed.

### 2. OG Image (`src/assets/og-image.webp`)
- **Current:** 44-byte placeholder file
- **Needed:** Social sharing image, 1200x630px
- **Referenced at:** `index.html:12` (og:image), `index.html:20` (twitter:image)
- **How:** Replace the file at `src/assets/og-image.webp`. Dimensions matter for social cards.

### 3. Authority Logos (`src/assets/logos/placeholder-{1-6}.webp`)
- **Current:** 6 placeholder files, 43 bytes each
- **Needed:** Real client/partner logos (companies Aragorn has spoken for)
- **Referenced at:** `index.html:137-148` (logo bar under hero)
- **How:** Replace each `placeholder-N.webp` with a real logo. Update the `alt` text on each `<img>` tag (lines 137-148) to match the company name. Logos should be ~120px height, WebP format, transparent/white for dark background.

### 4. YouTube Video ID
- **Current:** `VIDEO_ID` placeholder string
- **Referenced at:** `index.html:160` (`data-src` attribute on lazy iframe)
- **How:** Replace `VIDEO_ID` with the real YouTube video ID (the part after `v=` in a YouTube URL). Example: `dQw4w9WgXcQ`.

### 5. Spotify Podcast IDs
- **Current:** `SHOW_ID_EN` and `SHOW_ID_NL` placeholder strings
- **Referenced at:** `index.html:166` (English podcast), `index.html:170` (Dutch podcast)
- **How:** Replace with Spotify show IDs. Find these in the Spotify share URL: `open.spotify.com/show/XXXXXXXXXX`. The ID is the alphanumeric string.
- **EN podcast:** Singularity Surfers (English episodes) or relevant show
- **NL podcast:** Singularity Surfers (Dutch episodes) or relevant show

### 6. Formspree Contact Form
- **Current:** `FORM_ID` placeholder string
- **Referenced at:** `index.html:299` (form action URL)
- **How:** Create a form at formspree.io, get the form ID, replace `FORM_ID`. The form already has name, email, company, and message fields wired up with honeypot spam protection.

### 7. Testimonials (3 quotes)
- **Current:** Generic placeholder testimonials with fake attributions
- **Referenced at:** `index.html:249-270` (3 `<blockquote>` elements)
- **Fields per testimonial:**
  - `.testimonial__quote` — the actual quote text
  - `.testimonial__author` — person's name (inside `<cite>`)
  - `.testimonial__role` — their title + company (inside `<span>`)
- **How:** Edit each blockquote with real testimonials from clients, event organizers, or partners.

### 8. Speakers Academy Booking Link
- **Current:** `href="#"` placeholder
- **Referenced at:** `index.html:290` (the "Book via Agency" button)
- **How:** Replace `href="#"` with the real Speakers Academy profile URL.

### 9. (Optional) Favicon
- **Current:** `src/favicon.ico` exists
- **How:** Replace with a real branded favicon if desired.

## Deployment Flow

After making changes:

```bash
cd ~/projects/itsmrmetaverse-claude

# 1. Stage and commit
git add src/
git commit -m "Replace [placeholder name] with real content"

# 2. Deploy to GitHub Pages
git subtree push --prefix src origin gh-pages

# 3. Verify at https://claude.itsmrmetaverse.com/
```

If subtree push fails with "Updates were rejected" (history divergence):
```bash
git push origin --delete gh-pages
git subtree push --prefix src origin gh-pages
```

## Architecture Notes

```
src/
  index.html          # Single page, 8 sections, JSON-LD structured data
  css/
    tokens.css        # Design tokens (colors, spacing, typography, z-index)
    layout.css        # Grid, responsive breakpoints, canvas, section dots
    components.css    # All component styles (nav, hero, cards, form, footer)
  js/
    main.js           # Scroll reveal, nav, section dots, lazy iframes, contact form
    city.js           # Three.js cityscape (InstancedMesh, GLSL shaders, post-processing)
  fonts/              # Self-hosted: Orbitron, Rajdhani, Share Tech Mono
  assets/             # All placeholder files listed above
  CNAME               # claude.itsmrmetaverse.com
  robots.txt, sitemap.xml, favicon.ico
```

**Key design decisions:**
- No framework — static HTML/CSS/JS, no build step
- Three.js cityscape hidden below 1024px (mobile gets CSS grid instead)
- Import maps for CDN modules (Three.js r183, Lenis 1.3.21, GSAP 3.12.7)
- Progressive enhancement — content works without JS
- WCAG 2.2 AA compliant

## Dual Build Context

This is **Build A** (Claude Code). Build B is in Antigravity (Gemini):
- Build B repo: `Aragorn2046/itsmrmetaverse-gemini`
- Build B local: `~/projects/itsmrmetaverse-gemini/`
- Both share the same spec (`planning/itsmrmetaverse-webcycle/`)
- Purpose: side-by-side AI comparison

## Planning Artifacts

All in `planning/`: cycle-state.md, discovery.md, research-brief.md, DESIGN.md, wireframes.md, components.md, lighthouse-report.md, a11y-report.md, seo-report.md, qa-report.md, security-report.md
