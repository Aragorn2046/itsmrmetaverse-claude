# Web Cycle: itsmrmetaverse-webcycle

## Meta
- Created: 2026-03-29
- Description: Rebuild itsmrmetaverse.com — premium futurist brand site with Tron: Legacy neon cityscape. TWO competing builds: Claude Code vs Gemini 3.1 Pro + Antigravity.
- Framework: Static HTML/CSS/JS + Three.js (no React/Next)
- CSS Strategy: CSS custom properties (design tokens), single organized stylesheet
- Deployment Target: GitHub Pages (*.itsmrmetaverse.com) — dual builds for comparison
- Compliance Level: WCAG 2.2 AA
- Repo: Aragorn2046/itsmrmetaverse-claude
- Current Phase: complete
- Status: complete

## Performance Budget
- Lighthouse Performance: target >=90 / actual: 100 (desktop) 99 (mobile)
- Lighthouse Accessibility: target 100 / actual: 100 (desktop) 100 (mobile)
- Lighthouse Best Practices: target >=95 / actual: 100 (desktop) 100 (mobile)
- Lighthouse SEO: target >=95 / actual: 100 (desktop) 100 (mobile)
- LCP: target <=2.5s / actual: 0.4s (desktop) 1.7s (mobile)
- CLS: target <=0.1 / actual: 0.002 (desktop) 0.005 (mobile)
- INP: target <=200ms / actual: 0ms (desktop) 0ms (mobile)

## Phases
- [x] 0-discovery
- [x] 1-research
- [x] 2-design-system
- [x] 3-wireframe
- [x] 4-components
- [x] 5-implement
- [x] 6-lighthouse
- [x] 7-accessibility
- [x] 8-seo
- [x] 9-cross-browser-qa
- [x] 10-security
- [x] 11-deploy

## Artifacts
- discovery: planning/itsmrmetaverse-webcycle/discovery.md
- research: planning/itsmrmetaverse-webcycle/research-brief.md
- design-system: planning/itsmrmetaverse-webcycle/DESIGN.md
- wireframes: planning/itsmrmetaverse-webcycle/wireframes.md
- component-inventory: planning/itsmrmetaverse-webcycle/components.md
- lighthouse-report: planning/itsmrmetaverse-webcycle/lighthouse-report.md
- accessibility-report: planning/itsmrmetaverse-webcycle/a11y-report.md
- seo-report: planning/itsmrmetaverse-webcycle/seo-report.md
- qa-report: planning/itsmrmetaverse-webcycle/qa-report.md
- security-report: planning/itsmrmetaverse-webcycle/security-report.md

## Dual Build Strategy
- **Build A (Claude Code):** ~/projects/itsmrmetaverse-claude/ → Aragorn2046/itsmrmetaverse-claude
- **Build B (Gemini + Antigravity):** ~/projects/itsmrmetaverse-gemini/ → Aragorn2046/itsmrmetaverse-gemini
- Both share the same discovery.md, DESIGN.md, wireframes.md, and components.md
- Each builds independently from the shared spec

## Decisions Log
- 2026-03-29: Fresh start via /web-cycle. Previous project-cycle artifacts preserved for reference.
- 2026-03-29: Dual build approach — Claude Code vs Gemini 3.1 Pro + Antigravity, same spec.
- 2026-03-29: Discovery approved by user. Proceeding to research phase.
- 2026-03-29: Research complete (1,343 lines). Key: Three.js r183, InstancedMesh for buildings (~5 draw calls), Reflector + grid overlay, ACESFilmic at 1.4 exposure, Lenis+GSAP single RAF loop, self-hosted fonts, Formspree.
- 2026-03-29: Design system approved. DESIGN.md (15 sections), tokens.css updated with z-index scale + semantic colors. All CSS migrated to use z-index tokens.
- 2026-03-29: Wireframes approved. 8 sections with ASCII layouts, responsive behavior matrix, state inventory, interaction notes.
- 2026-03-29: Component inventory approved. Full HTML snippets for all 8 organisms, atomic design hierarchy, CSS 3-file architecture, JS 2-file split.
- 2026-03-29: Phase 5 complete. All implementation files built: index.html (362 lines), tokens/layout/components CSS, main.js (scroll/nav/form), city.js (~500 lines Three.js cityscape with GLSL shaders, InstancedMesh, post-processing, scroll-linked camera). Build passes (10.8kb bundled JS). Pushed to GitHub.
- 2026-03-29: Phase 6 complete. Lighthouse scores: 100/100/100/100 (desktop), 99/100/100/100 (mobile). LCP 0.4s/1.7s, CLS 0.002/0.005. Fixed: touch targets, favicon, shader errors, logo 404s.
- 2026-03-29: Phase 7 complete. Full WCAG 2.2 AA audit passed. Fixed contrast on .logo-bar__label and .testimonial__role (#484f58 → #768390, 5.05:1).
- 2026-03-29: Phase 8 complete. SEO: canonical URL, JSON-LD Person schema, robots.txt, sitemap.xml. Lighthouse SEO 100.
- 2026-03-29: Phase 9 complete. Cross-browser QA: all features supported Chrome 89+, Firefox 108+, Safari 16.4+, Edge 89+. Vendor prefixes verified.
- 2026-03-29: Phase 10 complete. Security audit: low-risk static site, all OWASP checks passed or N/A. No vulnerabilities found.
- 2026-03-29: Phase 11 complete. Deployed to GitHub Pages via git subtree push (src/ → gh-pages branch). Live at https://claude.itsmrmetaverse.com/ with HTTPS enforced. CNAME configured.
