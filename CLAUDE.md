# CLAUDE.md — itsmrmetaverse-claude

## Project
Premium personal brand website for Aragorn Meulendijks (MrMetaverse). Tron: Legacy neon cityscape in Three.js as persistent background. Static HTML/CSS/JS with esbuild bundling.

## Architecture
- `src/index.html` — single page, 8 anchored sections
- `src/css/tokens.css` → `layout.css` → `components.css` (loaded in order)
- `src/js/main.js` — scroll reveal, nav, form, dots
- `src/js/city.js` — Three.js cityscape module
- `dist/` — built output (gitignored)

## Key Rules
- Mobile-first CSS with `min-width` breakpoints
- No WebGL below 1024px — CSS blueprint grid fallback
- WCAG 2.2 AA compliance
- Semantic HTML landmarks, single `<h1>`, logical heading hierarchy
- `<button>` for actions, `<a>` for navigation
- All images need `alt`, all inputs need `<label>`
- Touch targets minimum 44x44px
- `prefers-reduced-motion` must disable all animations
- Three.js CDN via importmap (no bundling Three.js)

## Design Tokens
See `DESIGN.md` for full visual system. CSS custom properties in `tokens.css`.

## Deployment
GitHub Pages at `claude.itsmrmetaverse.com`
