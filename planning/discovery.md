# Discovery: itsmrmetaverse.com Rebuild

**Date:** 2026-03-29
**Status:** Draft — pending user approval
**Distilled from:** 3 prior sessions + project-cycle brainstorm/analysis/research

---

## 1. What We're Building

A premium personal brand website for Aragorn Meulendijks (MrMetaverse) — futurist, keynote speaker, Future Historian. The site's primary purpose is establishing authority and driving keynote bookings.

**TWO competing implementations from the same spec:**
- **Build A:** Claude Code (AI-assisted coding in terminal)
- **Build B:** Gemini 3.1 Pro + Antigravity (AI-assisted coding in IDE)

Both share the same design system, wireframes, and component spec. The goal is to compare output quality, speed, and developer experience.

---

## 2. The Vision: Tron Cityscape Flight

**This is the defining feature.** Not a particle tunnel. Not an abstract effect. A **neon cityscape** inspired by Tron: Legacy — the user was very specific about this evolution across sessions.

### What It Is
- A persistent 3D city rendered on a fixed fullscreen canvas (position: fixed, z-index: 0)
- The camera flies through the city as the user scrolls the entire page
- Content sections appear as semi-transparent glass overlays at different points along the flight path
- The city is ALWAYS visible behind content — it's the background for the entire site, not just the intro

### What It Looks Like
- **Buildings:** Custom GLSL ShaderMaterial with procedural Tron grid lines (floor lines every 3 units, column lines every 2 units), window panels, Fresnel rim lighting, top glow
- **Ground:** Reflective wet surface (Three.js Reflector) with animated grid lines + pulse wave ripple
- **Atmosphere:** FogExp2, volumetric-style atmosphere lights, floating data streams
- **Post-processing:** UnrealBloomPass + cinematic color grading ShaderPass + FXAA
- **Tone mapping:** ACESFilmicToneMapping (NOT Reinhard — industry standard cinematic look)
- **Particles:** Dual-layer system — sharp foreground particles + soft atmospheric dust
- **Color:** Teal (#00E5D0) edges/glow, purple (#8B5CF6) at depth, near-black (#080c14) base

### What It Must NOT Be
- **NOT gamey** — "Porsche Design meets subtle sci-fi." Restrained authority.
- **NOT abstract blobs** — actual buildings with geometric detail, not just colored shapes
- **NOT blocks** — buildings need procedural detail (grid lines, windows, rim glow), not flat boxes
- **NOT just at the intro** — the city continues throughout the ENTIRE page scroll

### Scroll Behavior
- Lenis smooth scroll with momentum (duration 1.6, exponential ease-out)
- Scrolling DOWN = flying forward through the city (intuitive direction)
- Camera follows a CatmullRomCurve3 path with gentle curves
- Content sections float over the city with glassmorphism (backdrop-filter: blur(16px), semi-transparent dark background, teal accent borders)
- Hero overlay fades as camera descends (first 10% of scroll)

### Mobile
- No WebGL — CSS fallback with blueprint grid background
- Content sections get solid dark backgrounds instead of glass overlays
- prefers-reduced-motion: skip all animation, show content immediately

### Reference Quality Targets
- mcvean.nl — scene-based minimalism, controlled accents
- SynthCity — neon city aesthetic
- samsy.ninja — particle quality and scene depth
- Igloo Inc — Awwwards SOTY 2024 level polish
- The Monolith Project — cinematic scroll experience

---

## 3. Visual Identity System

### Color Palette
| Role | Hex | Usage |
|---|---|---|
| Base | `#080c14` | Background, canvas |
| Accent (teal) | `#00E5D0` | Borders, links, interactive states, building glow |
| Depth (purple) | `#8B5CF6` | Depth gradient, sparingly |
| Chrome | gradient `#C0C0C0 → #F5F5F5 → #A0A0A0` | "ARAGORN" logotype |
| Text primary | `#E6EDF3` | Body copy |
| Text muted | `#8B949E` | Captions, metadata |
| Text dim | `#484F58` | Very subtle labels |
| Grid | `#58a6ff` at 6% | Background grid texture |

### Typography
| Role | Font | Weight | Usage |
|---|---|---|---|
| Display | Orbitron | 600-700 | Section titles, ARAGORN logotype |
| Body | Rajdhani | 400-500 | Paragraphs, descriptions |
| Mono | Share Tech Mono | 400 | Handle, technical accents, labels |

### Naming Hierarchy
1. **ARAGORN** — Orbitron, chrome gradient, large display. Primary identity.
2. **ItsMrMetaverse** — Share Tech Mono, teal, handle. Styled as `> ItsMrMetaverse`
3. **Future Historian** — Rajdhani, subtle. Must be PROMINENT (user feedback) — not just footer text.

---

## 4. Content Sections (Final Order)

Based on analysis merging brand vision + conversion optimization:

| # | Section | Purpose |
|---|---|---|
| 1 | **City Intro** | Full-viewport 3D city. Camera begins flight. Name reveal overlaid. |
| 2 | **Hero** | Outcome-led statement + stage photo + "Book a Keynote" CTA. Worldview statement, NOT bio-first. |
| 3 | **Authority Bar** | "Trusted by" horizontal logo strip — 6-8 company/event logos. |
| 4 | **Media / Sizzle** | Best YouTube keynote clip (interim for sizzle reel) + Spotify embeds (EN/NL) + Substack link. |
| 5 | **Speaking Topics** | 3-4 topic cards with hooks, takeaways, individual "Book This Talk" CTAs. AI, XR, Exponential Change, Robotics. |
| 6 | **Testimonials** | Quotes from event organizers. Carousel desktop, stack mobile. |
| 7 | **Work With Me** | Dual booking (Speakers Academy NL + international direct). Ventures: EE, Innovation Network, VCM. |
| 8 | **Stay Connected** | Social links, newsletter, Extended Mind Blueprint link, footer. |

### CTA Strategy
"Book a Keynote" appears contextually in: hero, after sizzle reel, on each topic card, in Work With Me, and footer. The primary CTA button is the ONE element that breaks the restrained aesthetic — teal fill, high contrast.

### Dual Booking Path
- Netherlands/Benelux: Speakers Academy link
- International: Direct contact form (Formspree, no backend)

---

## 5. Technical Architecture

| Component | Technology |
|---|---|
| Framework | Static HTML/CSS/JS (no React/Next) |
| 3D Engine | Three.js r173+ |
| Build | esbuild (ES modules, Three.js external via importmap) |
| Scroll | Lenis + GSAP ScrollTrigger |
| Animations | GSAP (scroll reveals), CSS (hover/glow) |
| Fonts | Google Fonts (Orbitron, Rajdhani, Share Tech Mono) |
| Images | WebP with responsive srcset, lazy-loaded |
| Post-processing | EffectComposer: RenderPass → UnrealBloomPass → ShaderPass (cinematic) → FXAA |

### Key Three.js Techniques (from research)
- **ACESFilmicToneMapping** at exposure ~1.8 — cinematic color response
- **Reflector** for wet ground — the defining Tron look
- **Custom GLSL ShaderMaterial** for buildings — procedural grid, Fresnel rim, top glow
- **UnrealBloomPass** — strength ~1.8, radius ~0.8, threshold ~0.1
- **FXAA** — anti-aliasing pass after bloom
- **Dual-layer particles** — sharp foreground (size 2-4px) + soft atmospheric dust (size 1px, low opacity)
- **Cinematic ShaderPass** — chromatic aberration, vignette (NO scanlines — they cheapen it)
- **Dynamic fog** — density varies with scroll position
- **Camera easing** — smooth interpolation on curve, not snapping

---

## 6. Assets Status

| Asset | Status |
|---|---|
| Hero photos | Raw on Dawn (DSCF1435.jpg 70MB, DSCF1463.jpg 42MB) — need processing |
| Brand banners | On Dawn OneDrive + Canva |
| Company logos (authority bar) | **NEEDED from Aragorn** |
| Speakers Academy URL | **NEEDED from Aragorn** |
| YouTube clip for sizzle | **NEEDED — Aragorn selects or Claude recommends** |
| Testimonials | On current site — need verification they're from organizers |
| Sizzle reel | Does NOT exist — launch with YouTube clip |
| Media kit PDF | Post-launch |

---

## 7. Dual Build Approach

### Build A: Claude Code
- Claude Code builds everything from this spec
- Uses the terminal, esbuild, direct file editing
- Three.js city scene hand-coded with GLSL shaders

### Build B: Gemini 3.1 Pro + Antigravity
- Gemini builds everything from the same spec
- Uses Antigravity IDE
- Same Three.js approach but Gemini's implementation

### Shared Artifacts
Both builds use the same: discovery.md, DESIGN.md, wireframes.md, components.md

### Comparison Criteria
- Visual quality (especially the 3D city scene)
- Code quality and architecture
- Performance (Lighthouse scores)
- Accessibility compliance
- How close each gets to the reference quality targets

### Deployment
- Build A: `claude.itsmrmetaverse.com` (GitHub Pages)
- Build B: `gemini.itsmrmetaverse.com` (GitHub Pages)
- Winner becomes `itsmrmetaverse.com` (Hostinger)

---

## 8. What Changed From Previous Attempts

| Previous | Now |
|---|---|
| Particle tunnel entrance only | Full Tron CITYSCAPE as persistent background |
| City at intro, content below | City throughout entire page, content as glass overlays |
| MeshBasicMaterial (flat blocks) | Custom GLSL ShaderMaterial (procedural grid, glow) |
| ReinhardToneMapping | ACESFilmicToneMapping |
| No ground reflections | Reflector for wet ground |
| Mechanical scroll (only moves with mousewheel) | Lenis momentum scroll (keeps gliding) |
| Scrolling UP to fly forward | Scrolling DOWN = forward (intuitive) |
| Single-layer particles | Dual-layer particle system |
| Scanlines in post-processing | NO scanlines (cheapens the look) |
| Bio-first hero | Outcome-led hero (worldview statement + CTA) |
| No authority bar | "Trusted by" logo strip |
| Single booking path | Dual: Speakers Academy (NL) + international direct |

---

## 9. Non-Negotiables

1. The 3D city must look CINEMATIC — not "half-assed," not "blocks"
2. Scroll must feel smooth with momentum — not mechanical
3. Buildings continue throughout the ENTIRE website
4. "Future Historian" must be prominent, not buried
5. Design is "Porsche Design meets subtle sci-fi" — never gamey
6. Mobile must work perfectly without WebGL
7. Primary goal = keynote bookings, not just looking cool
