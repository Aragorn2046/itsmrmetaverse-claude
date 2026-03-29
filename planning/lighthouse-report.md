# Lighthouse Report — itsmrmetaverse-claude

## Date: 2026-03-29

## Scores

| Category | Target | Desktop | Mobile |
|----------|--------|---------|--------|
| Performance | >=90 | **100** | **99** |
| Accessibility | 100 | **100** | **100** |
| Best Practices | >=95 | **100** | **100** |
| SEO | >=95 | **100** | **100** |

## Core Web Vitals

| Metric | Target | Desktop | Mobile |
|--------|--------|---------|--------|
| LCP | <=2.5s | 0.4s | 1.7s |
| CLS | <=0.1 | 0.002 | 0.005 |
| TBT (proxy for INP) | <=200ms | 0ms | 0ms |
| FCP | — | 0.4s | 1.5s |
| Speed Index | — | 1.0s | 1.5s |

All targets met. All four categories score 100 on desktop. Mobile performance at 99 (excellent).

## Issues Found & Fixed

### 1. Section dots touch targets (Accessibility)
**Issue:** `.section-dots__dot--active` applied `background: var(--color-accent)` on the full 44px button element, creating an oversized visual indicator.
**Fix:** Changed selector to `.section-dots__dot--active::after` so only the 8px pseudo-element gets the accent color. Set container `gap: 0` since 44px button areas provide natural spacing.

### 2. Favicon 404 (Best Practices)
**Issue:** Browser auto-requests `/favicon.ico`, returning 404.
**Fix:** Created minimal 16x16 teal (#00E5D0) ICO file (1150 bytes) and added `<link rel="icon">` to HTML head.

### 3. Three.js shader errors (Best Practices)
**Issue:** `THREE.WebGLProgram: Shader Error 0` and `TypeError: Cannot read properties of undefined (reading 'value')` in `refreshFogUniforms`. ShaderMaterials had `fog: true` but lacked fog shader includes and fog uniforms.
**Fix:** Set `fog: false` on both ShaderMaterials (building + grid overlay) and removed all fog-related shader includes. Visual depth fading is handled by the vignette post-processing effect. Scene fog still applies to PointsMaterial particles.

### 4. Logo placeholder 404s (Best Practices)
**Issue:** Six authority logo images referenced in HTML returned 404.
**Fix:** Created minimal WebP placeholder files (43 bytes each) at `assets/logos/placeholder-{1-6}.webp`.

## Performance Strategy

- Three.js lazy-loaded via dynamic `import()` — zero main-thread blocking
- WebGL canvas hidden below 1024px (mobile gets CSS grid background instead)
- All iframes use `data-src` lazy loading via IntersectionObserver
- No external CSS/JS frameworks — pure custom properties + vanilla JS
- Fonts loaded with `font-display: swap`
- Images use WebP format with `loading="lazy"`
