# Web Cycle: itsmrmetaverse-webcycle

## Meta
- Created: 2026-03-29
- Description: Rebuild itsmrmetaverse.com — premium futurist brand site with Tron: Legacy neon cityscape. TWO competing builds: Claude Code vs Gemini 3.1 Pro + Antigravity.
- Framework: Static HTML/CSS/JS + Three.js (no React/Next)
- CSS Strategy: CSS custom properties (design tokens), single organized stylesheet
- Deployment Target: GitHub Pages (*.itsmrmetaverse.com) — dual builds for comparison
- Compliance Level: WCAG 2.2 AA
- Repo: TBD (two repos needed)
- Current Phase: 5-implement
- Status: in-progress

## Performance Budget
- Lighthouse Performance: target >=90 / actual: —
- Lighthouse Accessibility: target 100 / actual: —
- Lighthouse Best Practices: target >=95 / actual: —
- Lighthouse SEO: target >=95 / actual: —
- LCP: target <=2.5s / actual: —
- CLS: target <=0.1 / actual: —
- INP: target <=200ms / actual: —

## Phases
- [x] 0-discovery
- [x] 1-research
- [x] 2-design-system
- [x] 3-wireframe
- [x] 4-components
- [ ] 5-implement
- [ ] 6-lighthouse
- [ ] 7-accessibility
- [ ] 8-seo
- [ ] 9-cross-browser-qa
- [ ] 10-security
- [ ] 11-deploy

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
