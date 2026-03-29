/**
 * city.js — Tron: Legacy neon cityscape
 * Three.js r183 persistent background with scroll-linked camera flight
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

/* ─── Constants ─── */

const ACCENT = 0x00E5D0;
const DEPTH  = 0x8B5CF6;
const BASE   = 0x080c14;

const BUILDING_VARIANTS = [
  { w: 2,   h: 12, d: 2,   count: 70 },  // tall thin
  { w: 4,   h: 6,  d: 4,   count: 60 },  // squat wide
  { w: 3,   h: 9,  d: 3,   count: 65 },  // medium
  { w: 1.5, h: 18, d: 1.5, count: 50 },  // tower
  { w: 5,   h: 4,  d: 5,   count: 40 },  // low block
];

/* ─── Shaders ─── */

const buildingVertexShader = /* glsl */`
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = instanceMatrix * vec4(position, 1.0);
    worldPos = modelMatrix * worldPos;
    vWorldPosition = worldPos.xyz;
    vNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);
    vUv = uv;
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const buildingFragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec3 uEdgeColor;
  uniform vec3 uBaseColor;
  uniform float uRimPower;
  uniform float uRimIntensity;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  void main() {
    // Procedural grid lines
    float floorLine = 1.0 - step(0.05, fract(vWorldPosition.y / 3.0));
    float colLine = 1.0 - step(0.05, fract(vWorldPosition.x / 2.0));
    float gridIntensity = max(floorLine, colLine) * 0.4;

    // Window panels
    vec2 windowUV = fract(vec2(vWorldPosition.x / 1.5, vWorldPosition.y / 2.0));
    float windowMask = step(0.1, windowUV.x) * step(windowUV.x, 0.9)
                     * step(0.1, windowUV.y) * step(windowUV.y, 0.9);
    float windowHash = fract(sin(dot(floor(vec2(vWorldPosition.x / 1.5,
      vWorldPosition.y / 2.0)), vec2(12.9898, 78.233))) * 43758.5453);
    float windowOn = step(0.6, windowHash);
    float windowGlow = windowMask * windowOn * 0.3;

    // Fresnel rim lighting
    float rim = 1.0 - max(dot(vViewDir, vNormal), 0.0);
    rim = pow(rim, uRimPower) * uRimIntensity;

    // Top glow
    float topGlow = smoothstep(0.8, 1.0, vUv.y) * 0.5;

    // Combine
    vec3 color = uBaseColor;
    color += uEdgeColor * gridIntensity;
    color += uEdgeColor * windowGlow;
    color += uEdgeColor * rim;
    color += uEdgeColor * topGlow;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const gridOverlayFragment = /* glsl */`
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 grid = abs(fract(vUv * 40.0 - 0.5) - 0.5) / fwidth(vUv * 40.0);
    float line = min(grid.x, grid.y);
    float alpha = 1.0 - min(line, 1.0);
    alpha *= 0.15;

    // Pulse wave from center
    float dist = length(vUv - 0.5);
    float pulse = smoothstep(0.02, 0.0, abs(dist - fract(uTime * 0.2) * 0.7));
    alpha += pulse * 0.3;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

const CinematicShader = {
  uniforms: {
    tDiffuse: { value: null },
    uChromaticStrength: { value: 0.003 },
    uVignetteStrength: { value: 0.4 },
    uVignetteSoftness: { value: 0.7 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uChromaticStrength;
    uniform float uVignetteStrength;
    uniform float uVignetteSoftness;
    varying vec2 vUv;

    void main() {
      vec2 dir = vUv - 0.5;
      float dist = length(dir);

      // Chromatic aberration
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

/* ─── Scene Setup ─── */

let renderer, scene, camera, composer;
let foregroundGeo, dustGeo;
let cameraPath, lookAtPath, currentLookAt;
let gridOverlayMaterial, buildingMaterial;
let disposed = false;
let scrollProgress = 0;

export function init() {
  const canvas = document.getElementById('city-canvas');
  if (!canvas) return;

  // Reduced motion — don't init WebGL
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Mobile — no WebGL below 1024px
  if (window.innerWidth < 1024) return;

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BASE, 0.008);

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 20, 10);

  // Camera path
  cameraPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 20, 10),
    new THREE.Vector3(5, 12, -30),
    new THREE.Vector3(-3, 8, -80),
    new THREE.Vector3(2, 6, -140),
    new THREE.Vector3(-5, 10, -200),
    new THREE.Vector3(0, 5, -280),
  ], false, 'catmullrom', 0.5);

  lookAtPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 5, -20),
    new THREE.Vector3(3, 5, -60),
    new THREE.Vector3(-1, 4, -110),
    new THREE.Vector3(1, 3, -170),
    new THREE.Vector3(-3, 5, -230),
    new THREE.Vector3(0, 3, -310),
  ], false, 'catmullrom', 0.5);

  currentLookAt = new THREE.Vector3(0, 5, -20);

  // Build scene
  createBuildings();
  createGround();
  createParticles();
  setupPostProcessing();

  // Events
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial scroll position
  onScroll();

  // Start render loop
  tick();
}

/* ─── Buildings ─── */

function createBuildings() {
  buildingMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uEdgeColor: { value: new THREE.Color(ACCENT) },
      uBaseColor: { value: new THREE.Color(BASE) },
      uRimPower: { value: 4.0 },
      uRimIntensity: { value: 0.8 },
    },
    vertexShader: buildingVertexShader,
    fragmentShader: buildingFragmentShader,
    fog: false,
  });

  const dummy = new THREE.Object3D();
  const spreadX = 120;
  const corridorHalf = 8; // Keep center clear for camera path

  BUILDING_VARIANTS.forEach(({ w, h, d, count }) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.InstancedMesh(geo, buildingMaterial, count);

    for (let i = 0; i < count; i++) {
      // Place buildings on either side of the corridor
      let x = (Math.random() - 0.5) * spreadX;
      if (Math.abs(x) < corridorHalf) {
        x = x > 0 ? x + corridorHalf : x - corridorHalf;
      }

      dummy.position.set(
        x,
        h / 2,
        -i * (300 / count) - Math.random() * 20
      );
      // Slight random rotation for variety
      dummy.rotation.y = Math.random() * Math.PI * 0.1;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);
  });
}

/* ─── Ground (grid overlay — no Reflector for CDN simplicity) ─── */

function createGround() {
  // Grid overlay ground plane
  gridOverlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(ACCENT) },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: gridOverlayFragment,
  });

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    gridOverlayMaterial
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  scene.add(ground);
}

/* ─── Particles ─── */

function createParticles() {
  // Layer 1: Sharp foreground data motes
  const fgCount = 2000;
  const fgPositions = new Float32Array(fgCount * 3);
  for (let i = 0; i < fgCount; i++) {
    fgPositions[i * 3]     = (Math.random() - 0.5) * 100;
    fgPositions[i * 3 + 1] = Math.random() * 40;
    fgPositions[i * 3 + 2] = Math.random() * -300;
  }
  foregroundGeo = new THREE.BufferGeometry();
  foregroundGeo.setAttribute('position', new THREE.BufferAttribute(fgPositions, 3));

  const fgParticles = new THREE.Points(foregroundGeo, new THREE.PointsMaterial({
    size: 3,
    color: ACCENT,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }));
  scene.add(fgParticles);

  // Layer 2: Soft atmospheric dust
  const dustCount = 5000;
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3]     = (Math.random() - 0.5) * 200;
    dustPositions[i * 3 + 1] = Math.random() * 60;
    dustPositions[i * 3 + 2] = Math.random() * -400;
  }
  dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

  const dustParticles = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    size: 1,
    color: DEPTH,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }));
  scene.add(dustParticles);
}

/* ─── Post-Processing ─── */

function setupPostProcessing() {
  const size = new THREE.Vector2(window.innerWidth, window.innerHeight);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // Bloom
  const bloomPass = new UnrealBloomPass(size, 1.5, 0.6, 0.15);
  composer.addPass(bloomPass);

  // Cinematic (chromatic aberration + vignette)
  const cinematicPass = new ShaderPass(CinematicShader);
  composer.addPass(cinematicPass);

  // FXAA
  const fxaaPass = new ShaderPass(FXAAShader);
  const pixelRatio = renderer.getPixelRatio();
  fxaaPass.uniforms['resolution'].value.set(
    1 / (window.innerWidth * pixelRatio),
    1 / (window.innerHeight * pixelRatio)
  );
  composer.addPass(fxaaPass);
}

/* ─── Animation Loop ─── */

function tick() {
  if (disposed) return;
  requestAnimationFrame(tick);

  const time = performance.now() * 0.001;

  // Update uniforms
  if (buildingMaterial) buildingMaterial.uniforms.uTime.value = time;
  if (gridOverlayMaterial) gridOverlayMaterial.uniforms.uTime.value = time;

  // Camera flight
  updateCamera();

  // Fog variation
  updateFog();

  // Subtle particle drift
  animateParticles(time);

  // Render
  composer.render();
}

function updateCamera() {
  const t = Math.max(0, Math.min(scrollProgress, 1));
  const pos = cameraPath.getPointAt(t);
  const lookTarget = lookAtPath.getPointAt(Math.min(t + 0.05, 1.0));

  camera.position.lerp(pos, 0.08);
  currentLookAt.lerp(lookTarget, 0.08);
  camera.lookAt(currentLookAt);
}

function updateFog() {
  const density = 0.008 + Math.sin(scrollProgress * Math.PI) * -0.004;
  scene.fog.density = Math.max(0.002, density);
}

function animateParticles(time) {
  if (!foregroundGeo) return;
  const positions = foregroundGeo.attributes.position.array;
  const count = positions.length / 3;
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] += Math.sin(time + i) * 0.005;
  }
  foregroundGeo.attributes.position.needsUpdate = true;
}

/* ─── Events ─── */

function onScroll() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
}

function onResize() {
  if (!renderer || !camera) return;

  // Don't resize below desktop breakpoint
  if (window.innerWidth < 1024) return;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);

  // Update FXAA resolution
  const fxaaPass = composer.passes.find(p => p.uniforms && p.uniforms['resolution']);
  if (fxaaPass) {
    const pixelRatio = renderer.getPixelRatio();
    fxaaPass.uniforms['resolution'].value.set(
      1 / (window.innerWidth * pixelRatio),
      1 / (window.innerHeight * pixelRatio)
    );
  }
}

/* ─── Cleanup ─── */

export function dispose() {
  disposed = true;
  window.removeEventListener('resize', onResize);
  window.removeEventListener('scroll', onScroll);

  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }

  scene?.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => m.dispose());
      } else {
        obj.material.dispose();
      }
    }
  });
}
