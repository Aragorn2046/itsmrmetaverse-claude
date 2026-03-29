# Research Brief: itsmrmetaverse.com Rebuild

**Date:** 2026-03-29
**Status:** Complete
**Scope:** Technical research across 10 areas for the Tron-inspired personal brand website

---

## Executive Summary

1. **Three.js r183 is current** (not r173) -- use latest. Import addons via `three/addons/` path. WebGPURenderer exists but stick with WebGLRenderer for browser compatibility.
2. **Performance budget: <100 draw calls, <50K particles CPU-side.** Use InstancedMesh for buildings (1 draw call per building type vs 1 per building). Target 200-400 buildings with 3-5 instanced geometries = ~5 draw calls for the entire city.
3. **pmndrs/postprocessing is superior to Three.js's built-in EffectComposer** -- auto-merges effects into fewer passes, uses single-triangle fullscreen rendering. Use it instead of the native post-processing chain.
4. **Lenis 1.3.21 + GSAP ticker integration is the proven pattern** -- `gsap.ticker.add((time) => lenis.raf(time * 1000))` with `gsap.ticker.lagSmoothing(0)`. Three.js render call goes inside the same ticker.
5. **Self-host fonts, not Google CDN** -- eliminates third-party connection, enables preloading, reduces FOUT. Orbitron has no variable font alternative; download WOFF2 files.
6. **Formspree + honeypot is sufficient** for contact forms. Free tier: 50 submissions/month. Honeypot field named `_gotcha` is auto-filtered.
7. **GitHub Pages has hard limits**: 10-minute cache TTL (non-configurable), no custom headers, 100MB per file, 100GB bandwidth/month. For A/B dual deploy, use separate repos with CNAME files.

---

## 1. Three.js Cityscape Architecture

### 1.1 Current Version & Import Paths

Three.js is at **r183** (March 2026). Use the modern import path:

```javascript
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
```

The `three/examples/jsm/` path still works but `three/addons/` is the recommended convention going forward.

### 1.2 Custom GLSL Building Shader

The building shader needs four visual components: procedural grid lines, window panels, Fresnel rim lighting, and top glow. Here is the architecture:

**Vertex Shader** -- pass world position, normal, and UV to fragment:

```glsl
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewDir;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
```

**Fragment Shader** -- procedural Tron grid + windows + Fresnel:

```glsl
uniform float uTime;
uniform vec3 uEdgeColor;    // #00E5D0 = vec3(0.0, 0.898, 0.816)
uniform vec3 uBaseColor;    // near-black
uniform float uRimPower;    // 3.0-5.0
uniform float uRimIntensity; // 0.6-1.0

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewDir;

void main() {
  // --- Procedural grid lines ---
  // Floor lines every 3 units, column lines every 2 units
  float floorLine = 1.0 - step(0.05, fract(vWorldPosition.y / 3.0));
  float colLine = 1.0 - step(0.05, fract(vWorldPosition.x / 2.0));
  float gridIntensity = max(floorLine, colLine) * 0.4;

  // --- Window panels ---
  // Windows are 1.5 x 2.0 unit cells with 0.2 unit gaps
  vec2 windowUV = fract(vec2(vWorldPosition.x / 1.5, vWorldPosition.y / 2.0));
  float windowMask = step(0.1, windowUV.x) * step(windowUV.x, 0.9)
                   * step(0.1, windowUV.y) * step(windowUV.y, 0.9);
  // Random window illumination based on position
  float windowHash = fract(sin(dot(floor(vec2(vWorldPosition.x / 1.5,
    vWorldPosition.y / 2.0)), vec2(12.9898, 78.233))) * 43758.5453);
  float windowOn = step(0.6, windowHash); // ~40% of windows lit
  float windowGlow = windowMask * windowOn * 0.3;

  // --- Fresnel rim lighting ---
  float rim = 1.0 - max(dot(vViewDir, vNormal), 0.0);
  rim = pow(rim, uRimPower) * uRimIntensity;

  // --- Top glow (gradient from top of building) ---
  float topGlow = smoothstep(0.8, 1.0, vUv.y) * 0.5;

  // --- Combine ---
  vec3 color = uBaseColor;
  color += uEdgeColor * gridIntensity;
  color += uEdgeColor * windowGlow;
  color += uEdgeColor * rim;
  color += uEdgeColor * topGlow;

  gl_FragColor = vec4(color, 1.0);
}
```

**Key GLSL functions used:**
- `fract()` -- repeating patterns without UV wrapping
- `step()` -- hard edges for grid lines (no anti-aliasing needed -- bloom softens them)
- `smoothstep()` -- soft gradients for top glow
- `pow()` -- Fresnel falloff control
- `fract(sin(dot(...)))` -- pseudo-random hash for window on/off state

**Three.js material setup:**

```javascript
const buildingMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uEdgeColor: { value: new THREE.Color(0x00E5D0) },
    uBaseColor: { value: new THREE.Color(0x080c14) },
    uRimPower: { value: 4.0 },
    uRimIntensity: { value: 0.8 },
  },
  vertexShader: buildingVertexShader,
  fragmentShader: buildingFragmentShader,
  side: THREE.FrontSide,
});
```

### 1.3 InstancedMesh for Buildings

**Why instancing is critical:** Without it, 300 buildings = 300 draw calls. With InstancedMesh, 300 buildings of the same geometry type = 1 draw call.

**Architecture:**
- Define 4-6 building geometry variants (tall/thin, squat/wide, medium, tower)
- Each variant is one InstancedMesh with 50-80 instances
- Total: ~300 buildings, ~5 draw calls

```javascript
// Create building geometry variants
const geometries = [
  new THREE.BoxGeometry(2, 12, 2),   // tall thin
  new THREE.BoxGeometry(4, 6, 4),    // squat wide
  new THREE.BoxGeometry(3, 9, 3),    // medium
  new THREE.BoxGeometry(1.5, 18, 1.5), // tower
];

// Create instanced mesh per variant
const instances = geometries.map(geo => {
  const mesh = new THREE.InstancedMesh(geo, buildingMaterial, 75);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < 75; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * 200,
      geo.parameters.height / 2, // sit on ground
      -i * 8 - Math.random() * 40  // spread along z-axis (flight path)
    );
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
});
```

**Performance budget (mid-range GPU, GTX 1060 / M1 equivalent):**
- Buildings: 300 instances across 5 InstancedMesh = **5 draw calls**
- Ground reflector: **1 draw call** (but doubles scene render internally)
- Particles: 2 Points objects = **2 draw calls**
- Post-processing: 4 fullscreen passes
- **Total: ~12 draw calls** -- well under the 100 threshold
- Triangle budget: ~50K triangles for buildings (BoxGeometry is 12 triangles each, 300 * 12 = 3,600 -- very low)
- The Reflector doubles the effective render cost since it renders the scene from the reflection perspective

### 1.4 Reflector Ground Plane

The Three.js Reflector class renders the scene from a mirrored perspective into a texture, then displays it on a plane. This creates the "wet ground" Tron look.

```javascript
import { Reflector } from 'three/addons/objects/Reflector.js';

const groundMirror = new Reflector(
  new THREE.PlaneGeometry(400, 400),
  {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio * 0.5, // half-res for perf
    textureHeight: window.innerHeight * window.devicePixelRatio * 0.5,
    color: new THREE.Color(0x080c14),
  }
);
groundMirror.rotation.x = -Math.PI / 2;
groundMirror.position.y = 0;
scene.add(groundMirror);
```

**Combining with animated grid lines:** The Reflector uses its own shader internally. To add grid lines on the reflective surface, the best approach is to **overlay a second transparent plane** slightly above the Reflector with a custom ShaderMaterial that draws animated grid lines:

```javascript
const gridOverlay = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 400),
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x00E5D0) },
    },
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        vec2 grid = abs(fract(vUv * 40.0 - 0.5) - 0.5) / fwidth(vUv * 40.0);
        float line = min(grid.x, grid.y);
        float alpha = 1.0 - min(line, 1.0);
        alpha *= 0.15; // subtle

        // Pulse wave emanating from center
        float dist = length(vUv - 0.5);
        float pulse = smoothstep(0.02, 0.0, abs(dist - fract(uTime * 0.2) * 0.7));
        alpha += pulse * 0.3;

        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  })
);
gridOverlay.rotation.x = -Math.PI / 2;
gridOverlay.position.y = 0.01; // just above reflector
scene.add(gridOverlay);
```

**Performance note:** The Reflector renders the entire scene a second time. To mitigate:
- Use half-resolution textures (set textureWidth/Height to 50% of screen)
- Exclude particles from the reflection by using layers: `particles.layers.set(1)` and only enable layer 0 on the reflector's internal camera
- This is the single biggest performance cost in the scene

### 1.5 Post-Processing Pipeline

**Recommended: pmndrs/postprocessing over Three.js built-in EffectComposer.**

The pmndrs library auto-merges multiple effects into a single shader pass, uses single-triangle fullscreen rendering (more efficient than quads), and provides higher-quality implementations of bloom, chromatic aberration, and vignette.

However, for a vanilla JS (non-React) project, using Three.js's built-in EffectComposer is simpler. The pmndrs library can still be used without React -- it exports a vanilla `EffectComposer` class.

**Pipeline using built-in Three.js post-processing:**

```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

// Disable built-in AA when using post-processing
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4; // see tone mapping section

const composer = new EffectComposer(renderer);

// Pass 1: Render scene
composer.addPass(new RenderPass(scene, camera));

// Pass 2: Bloom
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,   // strength (1.2-1.8 for cinematic, NOT 2.0+ which gets gamey)
  0.6,   // radius
  0.15   // threshold -- low to catch building glow
);
composer.addPass(bloomPass);

// Pass 3: Cinematic (chromatic aberration + vignette, NO scanlines)
const cinematicPass = new ShaderPass(CinematicShader); // defined below
composer.addPass(cinematicPass);

// Pass 4: FXAA (anti-aliasing after bloom)
const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.uniforms['resolution'].value.set(
  1 / (window.innerWidth * window.devicePixelRatio),
  1 / (window.innerHeight * window.devicePixelRatio)
);
composer.addPass(fxaaPass);
```

**Custom Cinematic ShaderPass:**

```javascript
const CinematicShader = {
  uniforms: {
    tDiffuse: { value: null },
    uChromaticStrength: { value: 0.003 },  // subtle -- NOT 0.01+
    uVignetteStrength: { value: 0.4 },
    uVignetteSoftness: { value: 0.7 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uChromaticStrength;
    uniform float uVignetteStrength;
    uniform float uVignetteSoftness;
    varying vec2 vUv;

    void main() {
      vec2 dir = vUv - 0.5;
      float dist = length(dir);

      // Chromatic aberration -- offset R and B channels
      float rOffset = uChromaticStrength * dist;
      float r = texture2D(tDiffuse, vUv + dir * rOffset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - dir * rOffset).b;

      vec3 color = vec3(r, g, b);

      // Vignette
      float vignette = smoothstep(uVignetteStrength, uVignetteSoftness, dist);
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};
```

### 1.6 ACESFilmicToneMapping Settings

ACESFilmicToneMapping is the industry standard for cinematic rendering. It compresses highlights and lifts shadows, producing a "filmic" look.

**Settings for neon-on-dark scenes:**

```javascript
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
```

- **Exposure 1.0-1.2:** Conservative, preserves dark areas but neon may feel muted
- **Exposure 1.4-1.6:** Sweet spot for neon city -- highlights pop without washing out darks
- **Exposure 1.8+:** Too bright, washes out textures and reduces contrast

**Known issue:** ACESFilmic can wash out colors at high exposure. Compensate by:
- Using higher emissive intensity on materials (2.0-4.0 range)
- Keeping base colors very dark (close to black)
- Relying on bloom to amplify glow rather than raw material brightness

**Alternative tone mapping options:**
- `AgXToneMapping` -- newer, better color preservation, less saturated highlights. Worth testing as an alternative.
- `NeutralToneMapping` -- minimal color shift, good for accurate color reproduction
- Avoid `ReinhardToneMapping` -- too washed out for neon scenes

### 1.7 Dual-Layer Particle System

**Architecture: Two separate THREE.Points objects.**

Using two Points objects rather than one combined BufferGeometry is cleaner because each layer needs different PointsMaterial settings (size, opacity, color).

```javascript
// Layer 1: Sharp foreground particles (data motes)
const foregroundGeo = new THREE.BufferGeometry();
const foregroundCount = 2000;
const foregroundPositions = new Float32Array(foregroundCount * 3);
for (let i = 0; i < foregroundCount; i++) {
  foregroundPositions[i * 3] = (Math.random() - 0.5) * 100;
  foregroundPositions[i * 3 + 1] = Math.random() * 40;
  foregroundPositions[i * 3 + 2] = Math.random() * -300;
}
foregroundGeo.setAttribute('position', new THREE.BufferAttribute(foregroundPositions, 3));

const foregroundParticles = new THREE.Points(foregroundGeo, new THREE.PointsMaterial({
  size: 3,                    // 2-4px sharp motes
  color: 0x00E5D0,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true,
}));

// Layer 2: Soft atmospheric dust
const dustGeo = new THREE.BufferGeometry();
const dustCount = 5000;
const dustPositions = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) {
  dustPositions[i * 3] = (Math.random() - 0.5) * 200;
  dustPositions[i * 3 + 1] = Math.random() * 60;
  dustPositions[i * 3 + 2] = Math.random() * -400;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

const dustParticles = new THREE.Points(dustGeo, new THREE.PointsMaterial({
  size: 1,                    // 1px soft dust
  color: 0x8B5CF6,            // purple at depth
  transparent: true,
  opacity: 0.15,              // very subtle
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true,
}));
```

**Animation:** Particles drift slowly upward and sideways in the render loop:

```javascript
function animateParticles(time) {
  const fgPositions = foregroundGeo.attributes.position.array;
  for (let i = 0; i < foregroundCount; i++) {
    fgPositions[i * 3 + 1] += Math.sin(time * 0.001 + i) * 0.01;
  }
  foregroundGeo.attributes.position.needsUpdate = true;
}
```

**Performance:** 7,000 total particles is well under the 50,000 CPU-side bottleneck. No GPU compute needed.

### 1.8 FogExp2 Dynamic Density

```javascript
scene.fog = new THREE.FogExp2(0x080c14, 0.008); // base density

// In render loop -- vary density with scroll progress
function updateFog(scrollProgress) {
  // Denser fog at start (mystery), thinner in middle (reveal), dense at end (fade)
  const density = 0.008 + Math.sin(scrollProgress * Math.PI) * -0.004;
  scene.fog.density = Math.max(0.002, density);
}
```

**Fog + Bloom interaction:** Fog darkens distant objects, but bloom amplifies bright pixels. This creates a natural "neon in fog" effect where distant building edges glow through the atmosphere. No special configuration needed -- they complement each other automatically.

**Fog + custom shaders:** ShaderMaterial does NOT automatically receive fog uniforms. You must either:
1. Set `fog: true` on the ShaderMaterial and include the fog chunks, or
2. Use `onBeforeCompile` to inject fog into a standard material

For the building shader, add to the ShaderMaterial constructor: `fog: true` and include Three.js fog shader chunks in the fragment shader.

### 1.9 Camera Path

```javascript
import { CatmullRomCurve3 } from 'three';

// Define camera waypoints through the city
const cameraPath = new CatmullRomCurve3([
  new THREE.Vector3(0, 20, 10),     // Start: high above, looking down
  new THREE.Vector3(5, 12, -30),    // Descend, slight right curve
  new THREE.Vector3(-3, 8, -80),    // Level off, slight left
  new THREE.Vector3(2, 6, -140),    // Through dense city block
  new THREE.Vector3(-5, 10, -200),  // Rise slightly, left curve
  new THREE.Vector3(0, 5, -280),    // Final descent
], false, 'catmullrom', 0.5);       // tension 0.5 for smooth curves

// LookAt target follows a separate, offset curve
const lookAtPath = new CatmullRomCurve3([
  new THREE.Vector3(0, 5, -20),
  new THREE.Vector3(3, 5, -60),
  new THREE.Vector3(-1, 4, -110),
  new THREE.Vector3(1, 3, -170),
  new THREE.Vector3(-3, 5, -230),
  new THREE.Vector3(0, 3, -310),
], false, 'catmullrom', 0.5);

// In render loop
function updateCamera(scrollProgress) {
  // getPointAt uses arc-length parameterization (uniform speed)
  const pos = cameraPath.getPointAt(scrollProgress);
  const lookAt = lookAtPath.getPointAt(Math.min(scrollProgress + 0.05, 1.0));

  // Smooth interpolation to prevent jitter
  camera.position.lerp(pos, 0.1);

  // Use a target vector and lerp for smooth lookAt transitions
  currentLookAt.lerp(lookAt, 0.1);
  camera.lookAt(currentLookAt);
}
```

**Anti-jitter techniques:**
- Use `getPointAt()` (arc-length parameterized) instead of `getPoint()` (time parameterized) -- ensures uniform speed along the curve
- Lerp camera position and lookAt target (don't snap)
- Use fewer curve points (6-8) rather than many -- fewer points = smoother interpolation
- The lookAt target is offset 5% ahead on the curve to always look forward
- Keep the separate lookAt path slightly smoother than the camera path

---

## 2. Lenis + GSAP + Three.js Integration

### 2.1 The Single RAF Loop Pattern

This is the critical architecture decision. All three systems (Lenis, GSAP, Three.js) must share ONE requestAnimationFrame loop to avoid frame conflicts.

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis (do NOT use autoRaf -- we control the loop)
const lenis = new Lenis({
  duration: 1.6,          // momentum duration
  easing: (t) => 1 - Math.pow(1 - t, 3), // exponential ease-out
  smoothWheel: true,
  wheelMultiplier: 1,
});

// Connect Lenis scroll events to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Single unified loop via GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Lenis expects milliseconds, GSAP gives seconds
});
gsap.ticker.lagSmoothing(0); // Prevent GSAP from throttling on lag

// Three.js render inside the SAME ticker
gsap.ticker.add(() => {
  const scrollProgress = lenis.progress; // 0 to 1
  updateCamera(scrollProgress);
  updateFog(scrollProgress);
  animateParticles(performance.now());
  composer.render();
});
```

**Why this works:** GSAP's ticker fires once per frame. Lenis smooth-scrolls within that frame. ScrollTrigger reads the smoothed scroll position. Three.js renders using the same smoothed progress value. Everything is synchronized to the same frame.

### 2.2 ScrollTrigger Scrub Settings

- `scrub: 0` -- animation jumps instantly to scroll position (too snappy)
- `scrub: 1` -- 1 second of smooth catch-up (good default for cinematic feel)
- `scrub: 1.5` -- more cinematic lag, feels like the camera is "following" the scroll
- `scrub: true` -- equivalent to `scrub: 0` (instant)

**Recommendation:** `scrub: 1.5` for camera movement, `scrub: 0.5` for text reveals.

### 2.3 Scroll-to-Camera Mapping

The entire page height maps to the camera flight path. Use Lenis's `progress` property (0-1) directly as the curve parameter.

```javascript
// Page structure
// <div id="scroll-container" style="height: 800vh">
//   <canvas id="city-canvas" style="position: fixed; inset: 0; z-index: 0">
//   <div class="content-overlay" style="position: relative; z-index: 1">
//     <!-- Glass sections positioned at specific scroll points -->
//   </div>
// </div>

// The scroll container's height determines total flight distance
// 800vh = 8 screens of scroll = full flight path
```

### 2.4 Content Section Layering

```css
/* Fixed fullscreen canvas */
#city-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}

/* Scrollable content overlay */
.content-overlay {
  position: relative;
  z-index: 1;
  pointer-events: none; /* allow scroll through empty space */
}

/* Individual glass sections */
.section {
  pointer-events: auto; /* re-enable for interactive elements */
  max-width: 960px;
  margin: 0 auto;
  padding: 4rem;
  background: rgba(8, 12, 20, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 229, 208, 0.15);
  border-radius: 12px;
}
```

### 2.5 Hero Overlay Fade

```javascript
// Hero text fades as camera descends (first 10% of scroll)
ScrollTrigger.create({
  trigger: '.hero-overlay',
  start: 'top top',
  end: '10% top',
  scrub: 0.5,
  onUpdate: (self) => {
    gsap.set('.hero-overlay', { opacity: 1 - self.progress });
  },
});
```

---

## 3. Competitor/Reference Site Analysis

### 3.1 samsy.ninja (SMSY-Gen02)

- **URL:** https://samsy.ninja/
- **What it does well:** Breathtaking cyberpunk 3D world with neon-lit cityscape, holographic interfaces, Japanese design elements. Multiplayer, character customization, 120+ FPS. Awwwards SOTD.
- **Tech stack:** Vue.js + Three.js with TSL (Three.js Shading Language) + GSAP + **WebGPU** (not WebGL)
- **What to learn:** Proof that cyberpunk cities work as portfolios. The atmosphere and depth of field usage is exemplary. WebGPU enables higher particle counts but WebGL can approximate the aesthetic with careful budgeting.
- **Key takeaway:** The quality bar is set here. Our site doesn't need multiplayer, but the visual atmosphere and lighting should approach this level.

### 3.2 Igloo Inc (Awwwards SOTY 2024)

- **URL:** https://www.igloo.inc/
- **What it does well:** Immersive 3D experience combined with easy-to-navigate scroll interactions. "Pure art, like your favorite video game transformed into a website." Micro-interactions, first-class effects, blazing fast performance.
- **Tech stack:** Three.js, three-mesh-bvh, Svelte, GSAP, Vite, vanilla JS. UI rendered in WebGL for high-performance effects.
- **What to learn:** UI rendered in WebGL (not DOM) unlocks effects impossible with CSS. But for our use case, DOM overlays with glassmorphism are sufficient and more accessible.
- **Key takeaway:** Even the best sites use GSAP for scroll choreography. The "scroll reveals 3D content" pattern is the proven approach.

### 3.3 The Monolith Project

- **URL:** https://the-monolith.com/
- **What it does well:** Cinematic scroll experience blending hand-drawn 2D art with 3D environments. Modular shaders, layered particle systems, custom deferred renderer. 60fps throughout. FWA, Awwwards, CSS Design Awards winner.
- **Tech stack:** Three.js, React Three Fiber, GSAP. GPU-powered particle engine, custom transition shaders, composable shader framework.
- **What to learn:** Their modular shader approach -- every effect is composable and reusable. Their transition system between "scenes" is what we need between content sections.
- **Key takeaway:** Deferred rendering is overkill for our scene (forward rendering + bloom is sufficient), but their section-to-section transitions are worth studying.

### 3.4 Bilal El Moussaoui (bilal.show)

- **URL:** https://bilal.show/
- **What it does well:** Character journeys through a music-box environment via scroll. Technical skill married with storytelling.
- **Tech stack:** Scroll-driven Three.js animation
- **What to learn:** The pacing -- how fast the camera moves relative to scroll distance. Too fast feels rushed; too slow feels boring. Their ratio is good reference.

### 3.5 Sebastien Lempens

- **URL:** https://www.sebastien-lempens.com/
- **What it does well:** Paris tour shifting between first-person scooter ride and skydiving sequences. Camera transitions maintain engagement through variety.
- **Tech stack:** Three.js with scroll-driven camera transitions
- **What to learn:** Camera variety -- not just one straight path. Gentle curves, altitude changes, and speed variations prevent monotony.

### 3.6 Tron.js (Felix Palmer)

- **URL:** http://felixpalmer.github.io/tron.js/
- **What it does well:** Direct Tron-inspired grid landscape. Simple but effective neon grid aesthetic.
- **Tech stack:** Three.js, basic shader effects
- **What to learn:** The baseline Tron grid aesthetic -- our version should be significantly more polished than this reference, with buildings, particles, and post-processing adding depth.

### 3.7 Cyberpunk Interactive 3D Desk (Awwwards Honorable Mention)

- **URL:** https://www.awwwards.com/sites/cyberpunk-interactive-3d-desk
- **What it does well:** Cyberpunk-themed interactive 3D scene with Blender-modeled assets and WebGL rendering
- **Tech stack:** Three.js + Blender
- **What to learn:** How to achieve cyberpunk atmosphere with a combination of modeled assets and shader effects rather than fully procedural generation.

---

## 4. esbuild Configuration for Three.js

### 4.1 Development Setup

**build.mjs** (Node.js build script):

```javascript
import * as esbuild from 'esbuild';

const isDev = process.argv.includes('--dev');

const config = {
  entryPoints: ['src/main.js', 'src/style.css'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  target: ['es2020'],
  loader: {
    '.html': 'copy',
    '.glsl': 'text',     // Import GLSL files as strings
    '.vert': 'text',
    '.frag': 'text',
    '.woff2': 'file',    // Copy font files
    '.webp': 'file',     // Copy images
  },
  external: [],  // Bundle everything (not using importmap)
  minify: !isDev,
  sourcemap: isDev,
  metafile: true,
};

if (isDev) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  const { host, port } = await ctx.serve({ servedir: 'dist' });
  console.log(`Dev server: http://${host}:${port}`);
} else {
  const result = await esbuild.build(config);
  // Log bundle size analysis
  const text = await esbuild.analyzeMetafile(result.metafile);
  console.log(text);
}
```

**Live reload snippet** (src/livereload.js -- only injected in dev):

```javascript
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  new EventSource('/esbuild').addEventListener('change', () => location.reload());
}
```

**Dev command:**
```bash
node build.mjs --dev --inject:src/livereload.js
```

**Production command:**
```bash
node build.mjs
```

### 4.2 Import Map Alternative

If you prefer loading Three.js from CDN (reduces bundle size, leverages browser caching across sites):

**index.html:**
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.183.0/build/three.module.min.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.183.0/examples/jsm/"
  }
}
</script>
<script type="module" src="/main.js"></script>
```

**esbuild config for importmap approach:**
```javascript
external: ['three', 'three/*'],  // Don't bundle Three.js
```

**Trade-off:** Bundling Three.js with tree-shaking produces a smaller total payload (only imports used classes), but requires esbuild to process it. Import maps are simpler but load the full Three.js module (~700KB min). For a Three.js-heavy site like this, **bundling with tree-shaking is recommended** -- esbuild will only include the classes you actually import.

### 4.3 GLSL File Loading

With the `loader: { '.glsl': 'text' }` config, you can write shaders in separate files:

```javascript
// src/shaders/building.vert
// ... vertex shader code ...

// src/main.js
import buildingVertex from './shaders/building.vert';
import buildingFragment from './shaders/building.frag';

const material = new THREE.ShaderMaterial({
  vertexShader: buildingVertex,
  fragmentShader: buildingFragment,
  // ...
});
```

---

## 5. Mobile Fallback Strategy

### 5.1 Detection & Canvas Toggle

```javascript
// Detect WebGL support AND adequate GPU
function shouldRender3D() {
  // Check WebGL availability
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return false;

  // Check for mobile (no reliable GPU benchmark, use screen width)
  if (window.innerWidth < 1024) return false;

  // Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  return true;
}

if (shouldRender3D()) {
  initThreeJS();
} else {
  document.body.classList.add('no-webgl');
}
```

### 5.2 CSS Blueprint Grid Fallback

```css
.no-webgl body {
  background-color: #080c14;
  background-image:
    /* Subtle grid */
    linear-gradient(rgba(0, 229, 208, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 208, 0.04) 1px, transparent 1px),
    /* Larger grid overlay */
    linear-gradient(rgba(0, 229, 208, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 229, 208, 0.08) 1px, transparent 1px);
  background-size:
    30px 30px,
    30px 30px,
    150px 150px,
    150px 150px;
}

/* Solid dark backgrounds instead of glass overlays */
.no-webgl .section {
  background: #0d1117;
  backdrop-filter: none;
  border: 1px solid rgba(0, 229, 208, 0.2);
}

/* Hide the canvas element */
.no-webgl #city-canvas {
  display: none;
}
```

### 5.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Kill all animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Show all content immediately */
  .section {
    opacity: 1 !important;
    transform: none !important;
  }

  /* Static background */
  body {
    background: #080c14;
  }
}
```

### 5.4 Touch Scroll Considerations

Lenis with `syncTouch: false` (default) is correct for mobile -- native scroll feel with no smoothing overhead. Avoid `syncTouch: true` which is unstable on iOS <16.

---

## 6. Image & Asset Strategy

### 6.1 Hero Photo (LCP Element)

```html
<picture>
  <source
    type="image/avif"
    srcset="
      /img/hero-640.avif   640w,
      /img/hero-960.avif   960w,
      /img/hero-1280.avif 1280w,
      /img/hero-1920.avif 1920w
    "
    sizes="(max-width: 768px) 100vw, 50vw"
  />
  <source
    type="image/webp"
    srcset="
      /img/hero-640.webp   640w,
      /img/hero-960.webp   960w,
      /img/hero-1280.webp 1280w,
      /img/hero-1920.webp 1920w
    "
    sizes="(max-width: 768px) 100vw, 50vw"
  />
  <img
    src="/img/hero-960.jpg"
    alt="Aragorn Meulendijks on stage"
    width="960"
    height="640"
    fetchpriority="high"
    decoding="async"
  />
</picture>
```

**Critical rules:**
- **NEVER** lazy-load the LCP image
- **ALWAYS** use `fetchpriority="high"` on the hero image
- **ALWAYS** include explicit `width` and `height` to prevent layout shift
- Use AVIF as primary (30-50% smaller than WebP), WebP as fallback, JPEG as ultimate fallback
- Generate 4 sizes: 640, 960, 1280, 1920px wide

### 6.2 Below-Fold Images

```html
<img
  src="/img/topic-card.webp"
  alt="Description"
  loading="lazy"
  decoding="async"
  width="400"
  height="300"
/>
```

### 6.3 Authority Bar Logos

```css
.authority-bar img {
  filter: grayscale(100%) brightness(0.6);
  opacity: 0.5;
  transition: filter 0.3s ease, opacity 0.3s ease;
  height: 32px;
  width: auto;
}

.authority-bar img:hover {
  filter: grayscale(0%) brightness(1);
  opacity: 1;
}

/* Respect hover capability */
@media (hover: none) {
  .authority-bar img {
    filter: grayscale(100%) brightness(0.8);
    opacity: 0.7;
  }
}
```

Use SVG logos where available -- they scale perfectly and can be styled with CSS. For raster logos, use WebP at 2x resolution for retina.

### 6.4 Loading Skeleton During 3D Init

The Three.js scene takes 1-3 seconds to initialize. Show a loading state:

```css
#city-canvas {
  background: #080c14;
}

.loading-indicator {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: #00E5D0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0;
  animation: fadeIn 0.5s ease 0.5s forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}
```

Hide it once the scene is ready:

```javascript
renderer.compile(scene, camera); // Force shader compilation
document.querySelector('.loading-indicator').style.display = 'none';
```

---

## 7. Font Strategy

### 7.1 Self-Hosting (Recommended)

Self-hosting fonts eliminates a third-party DNS lookup and TCP connection, improving FCP by 100-300ms.

**Download WOFF2 files** using [google-webfonts-helper](https://gwfh.mranftl.com/fonts):
- Orbitron: weights 600, 700 (no variable font available)
- Rajdhani: weights 400, 500
- Share Tech Mono: weight 400

**Font face declarations:**

```css
/* Critical fonts -- loaded first */
@font-face {
  font-family: 'Orbitron';
  src: url('/fonts/orbitron-v31-latin-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Rajdhani';
  src: url('/fonts/rajdhani-v15-latin-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Share Tech Mono';
  src: url('/fonts/share-tech-mono-v15-latin-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: optional; /* mono font is least critical */
}
```

### 7.2 Preloading

Preload ONLY the 2 most critical font files (above-the-fold):

```html
<link rel="preload" href="/fonts/orbitron-v31-latin-600.woff2"
      as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/rajdhani-v15-latin-400.woff2"
      as="font" type="font/woff2" crossorigin>
```

Do NOT preload Share Tech Mono -- it's used for small labels and can load with `font-display: optional` (shows fallback if font doesn't load in time, never causes layout shift).

### 7.3 Font-Display Strategy

- **`swap`** for Orbitron and Rajdhani: Shows fallback immediately, swaps to custom font when loaded. Small FOUT but fast FCP.
- **`optional`** for Share Tech Mono: Browser decides whether to use the custom font based on connection speed. On slow connections, the fallback persists -- no FOUT at all.

### 7.4 Fallback Stacks

```css
:root {
  --font-display: 'Orbitron', 'Segoe UI', system-ui, sans-serif;
  --font-body: 'Rajdhani', 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'Share Tech Mono', 'SF Mono', 'Cascadia Code', monospace;
}
```

### 7.5 Variable Font Alternatives

- **Orbitron:** No variable font version available. Stick with static weights.
- **Rajdhani:** No variable font version. Static weights are fine since we only use 2 (400, 500).
- **Share Tech Mono:** No variable font version. Single weight only.

None of the selected fonts have variable font alternatives, which is fine -- with only 5 WOFF2 files total (~80KB), the overhead is minimal.

---

## 8. GitHub Pages Deployment

### 8.1 Dual Subdomain Setup

**DNS (GoDaddy -- already configured for itsmrmetaverse.com):**

| Record | Name | Value |
|--------|------|-------|
| CNAME | claude | Aragorn2046.github.io |
| CNAME | gemini | Aragorn2046.github.io |

**Repos:**
- `Aragorn2046/itsmrmetaverse-claude` -- Build A
- `Aragorn2046/itsmrmetaverse-gemini` -- Build B

Each repo needs a `CNAME` file in the deploy root:
```
claude.itsmrmetaverse.com
```

### 8.2 GitHub Actions Build Pipeline

**.github/workflows/deploy.yml:**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: node build.mjs

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Note:** When using GitHub Actions for deployment (not branch-based), the CNAME file must be in the `dist/` output directory, not the repo root. Either copy it during build or include it in the `public/` folder that gets copied to `dist/`.

### 8.3 Known Limitations

| Limitation | Impact | Workaround |
|-----------|--------|------------|
| 10-minute cache TTL | Returning visitors may see stale content for 10 min | Accept it -- not critical for this site |
| No custom headers | Can't set Cache-Control, CSP, etc. | Use `<meta>` tags for CSP; accept default caching |
| 100MB per file | Three.js bundle + assets must stay under 100MB each | Not an issue -- total site will be ~5-10MB |
| 100GB bandwidth/month | Sufficient for a personal brand site | Monitor via GitHub settings |
| No server-side logic | No SSR, no API routes | Static-only is the plan |
| No `.htaccess` or redirects config | Can't do server-side redirects | Use JS redirects or 404.html hack |
| HTTPS enforced | Good -- required for WebGL | Already enabled |

### 8.4 CNAME File Persistence

When using `actions/deploy-pages`, include the CNAME file in your build output:

```javascript
// In build.mjs, after build:
import { writeFileSync, copyFileSync } from 'fs';
writeFileSync('dist/CNAME', 'claude.itsmrmetaverse.com');
copyFileSync('public/404.html', 'dist/404.html');
```

---

## 9. Form Handling Without Backend

### 9.1 Formspree (Recommended)

**Free tier:** 50 submissions/month, 2 forms. Sufficient for a keynote speaker site.

```html
<form action="https://formspree.io/f/{form-id}" method="POST">
  <!-- Honeypot (hidden from real users) -->
  <input type="text" name="_gotcha" style="display: none" tabindex="-1" autocomplete="off">

  <input type="text" name="name" required placeholder="Your name">
  <input type="email" name="email" required placeholder="Your email">
  <select name="inquiry_type" required>
    <option value="">Select inquiry type</option>
    <option value="keynote">Keynote Booking</option>
    <option value="workshop">Workshop</option>
    <option value="media">Media / Press</option>
    <option value="other">Other</option>
  </select>
  <textarea name="message" required placeholder="Tell me about your event"></textarea>

  <!-- Redirect after submit -->
  <input type="hidden" name="_next" value="https://claude.itsmrmetaverse.com/thank-you">

  <button type="submit">Send Message</button>
</form>
```

**Spam prevention layers:**
1. **Honeypot field** (`_gotcha`) -- bots fill it, Formspree silently rejects
2. **Formspree built-in reCAPTCHA** -- ML-based bot detection, no visible CAPTCHA
3. **Form Rules** (paid tier) -- block specific patterns, require fields

### 9.2 Alternatives Comparison

| Service | Free Tier | Spam Prevention | Notable |
|---------|-----------|-----------------|---------|
| **Formspree** | 50 subs/mo, 2 forms | Honeypot + reCAPTCHA | Best for simple contact forms |
| **Web3Forms** | 250 subs/mo | hCaptcha | Higher free limit, no account needed |
| **EmailJS** | 200 emails/mo | Manual only | Sends directly from browser, no backend proxy |
| **Netlify Forms** | 100 subs/mo | Built-in | Only works on Netlify hosting |

**Recommendation:** Start with **Formspree** for simplicity. If the free tier is exceeded, switch to **Web3Forms** (250/mo free, no account required -- just an API key).

### 9.3 Accessible Form Validation

```html
<label for="email">Email <span aria-hidden="true">*</span></label>
<input
  type="email"
  id="email"
  name="email"
  required
  aria-required="true"
  aria-describedby="email-error"
  autocomplete="email"
>
<span id="email-error" class="error-message" role="alert" aria-live="polite"></span>
```

Use native HTML validation (`required`, `type="email"`) as the primary layer. Add JS validation only for custom rules (e.g., minimum message length).

---

## 10. Analytics

### 10.1 Recommendation: Plausible Analytics (Managed)

**Why Plausible over Umami:**
- Conversion funnels (track booking flow: CTA click -> form view -> submission)
- ClickHouse backend scales better than Umami's Postgres
- Better first-party documentation for self-hosting if needed later
- GDPR-compliant without cookie banners

**Why managed over self-hosted:**
- $9/mo for up to 10K monthly pageviews
- No server maintenance
- A personal brand site doesn't need self-hosted infrastructure overhead

### 10.2 Implementation

```html
<!-- Plausible analytics -- 1.4KB script, no cookies -->
<script defer data-domain="itsmrmetaverse.com"
  src="https://plausible.io/js/script.js"></script>
```

### 10.3 Custom Events for Keynote Booking Conversion

```javascript
// Track CTA clicks
document.querySelectorAll('[data-booking-cta]').forEach(btn => {
  btn.addEventListener('click', () => {
    plausible('Booking CTA Click', {
      props: { location: btn.dataset.section }
    });
  });
});

// Track form submission
document.querySelector('#contact-form').addEventListener('submit', () => {
  plausible('Contact Form Submit', {
    props: { inquiry_type: document.querySelector('[name="inquiry_type"]').value }
  });
});

// Track Speakers Academy link clicks
document.querySelectorAll('[data-speakers-academy]').forEach(link => {
  link.addEventListener('click', () => {
    plausible('Speakers Academy Click');
  });
});
```

### 10.4 What to Track

| Event | Why |
|-------|-----|
| Booking CTA Click | Which CTA positions convert best |
| Contact Form Submit | Direct conversion |
| Speakers Academy Click | NL booking path conversion |
| Sizzle Reel Play | Does the video drive bookings? |
| Topic Card Expand | Which speaking topics interest visitors |
| Scroll Depth (25/50/75/100%) | How far do visitors get? |

### 10.5 Alternative: Umami (Free)

If budget is a concern, Umami Cloud has a free tier (3 sites, 100K events/month). Setup:

```html
<script async src="https://cloud.umami.is/script.js"
  data-website-id="YOUR-ID"></script>
```

Umami lacks conversion funnels but handles basic pageview and event tracking well.

---

## Appendix: Library Versions (March 2026)

| Library | Version | NPM |
|---------|---------|-----|
| Three.js | r183 | `three@0.183.0` |
| Lenis | 1.3.21 | `lenis@1.3.21` |
| GSAP | 3.12+ | `gsap@3.12.x` (check latest) |
| esbuild | 0.24+ | `esbuild@0.24.x` |
| pmndrs/postprocessing | 6.x | `postprocessing@6.x` |

## Appendix: File Structure

```
itsmrmetaverse-claude/
  public/
    fonts/          # Self-hosted WOFF2 files
    img/            # WebP/AVIF hero + assets
    CNAME           # claude.itsmrmetaverse.com
    404.html
  src/
    main.js         # Entry point -- Lenis, GSAP, Three.js init
    style.css       # All styles
    city/
      scene.js      # Three.js scene setup
      buildings.js  # InstancedMesh building generation
      ground.js     # Reflector + grid overlay
      particles.js  # Dual-layer particle system
      camera.js     # CatmullRomCurve3 path + scroll mapping
      postprocessing.js  # EffectComposer pipeline
    shaders/
      building.vert
      building.frag
      cinematic.frag
      grid-overlay.frag
    livereload.js   # Dev only
  index.html
  build.mjs         # esbuild config
  package.json
  .github/
    workflows/
      deploy.yml
```
