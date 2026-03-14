/**
 * ============================================================
 * ATLAS / INTERACTIONS
 * ============================================================
 * Usage: Load as <script type="module"> at end of <body>.
 *
 * Dependencies (load before this script):
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
 *   <script src="https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js"></script>
 *
 * Three.js is imported as an ES module (see initWebGL).
 *
 * Sections:
 *   1.  CONFIG & STATE
 *   2.  THEME TOKENS
 *   3.  WEBGL PARTICLE SYSTEM (Three.js)
 *   4.  SMOOTH SCROLL (Lenis + GSAP ticker)
 *   5.  SECTION THEME SWITCHER (GSAP ScrollTrigger)
 *   6.  PINNED SCROLL TIMELINE (Multi-phase hero animation)
 *   7.  SCROLL REVEAL (Static sections)
 *   8.  BOOTSTRAP
 * ============================================================
 */

import * as THREE from 'https://esm.sh/three@0.160.0';

/* ============================================================
 * 1. CONFIG & STATE
 * ============================================================ */

/** Detect user preference for reduced motion */
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Central configuration — adjust these values to tune the feel.
 * @type {Object}
 */
const CONFIG = {
  /**
   * Total scroll distance for the pinned hero section.
   * Increase to give more breathing room between phases.
   */
  scrollDistance: '+=3800',

  /** GSAP scrub smoothing (seconds). Higher = more lag/inertia. */
  scrubSmoothing: 1,

  /** Three.js particle count. Lower for mobile performance. */
  particleCount: 12000,

  /** Particle point size in world units */
  particleSize: 1.5,

  /** Spread of field (scattered) particle positions */
  spread: 2500,

  /** Radius of the orb (clustered) formation */
  orbRadius: 280,

  /** Camera Z at scroll start (far away) */
  cameraZStart: 600,

  /** Camera Z at scroll end (pulled in close) */
  cameraZEnd: 150,

  /** Idle rotation speed (radians/frame) */
  idleRotationSpeed: isReducedMotion ? 0.0001 : 0.0008,

  /** How much scroll progress affects X-axis rotation tilt */
  scrollRotationFactor: isReducedMotion ? 0 : 0.5,
};

/** Shared scroll progress state — updated by WebGL render loop */
const state = {
  scrollProgress: 0,   // Current interpolated value
  targetProgress: 0,   // Set by ScrollTrigger
};

/* ============================================================
 * 2. THEME TOKENS
 * ============================================================
 * Each entry maps to a page section.
 * applyTheme() crossfades CSS vars AND Three.js material colors.
 *
 * To add a new zone:
 *   1. Push a new object here with id, bg, accent, border, panel.
 *   2. Add a matching ScrollTrigger in initThemesAndNav().
 */
const THEMES = [
  { id: '#pinned-stage', bg: '#030303', accent: '#3b82f6', border: '#1e1e1e', panel: 'rgba(20, 20, 20, 0.4)' },
  { id: '#manifesto',    bg: '#050508', accent: '#0ea5e9', border: '#1a1c23', panel: 'rgba(15, 20, 30, 0.4)' },
  { id: '#overview',     bg: '#02040a', accent: '#3b82f6', border: '#161b22', panel: 'rgba(10, 15, 25, 0.4)' },
  { id: '#interface',    bg: '#000000', accent: '#2563eb', border: '#171717', panel: 'rgba(15, 15, 15, 0.4)' },
  { id: '#modules',      bg: '#05030a', accent: '#3b82f6', border: '#201633', panel: 'rgba(20, 15, 35, 0.4)' },
  { id: '#pricing',      bg: '#020202', accent: '#3b82f6', border: '#111111', panel: 'rgba(10, 10, 10, 0.4)' },
  { id: '#access',       bg: '#000000', accent: '#3b82f6', border: '#1a1a1a', panel: 'rgba(15, 15, 15, 0.4)' },
];

/* ============================================================
 * 3. WEBGL PARTICLE SYSTEM
 * ============================================================
 * Two particle formations:
 *   fieldPositions — particles scattered in a large 3D cloud
 *   orbPositions   — particles clustered into a dense sphere
 *
 * Each frame, positions lerp between field ↔ orb based on
 * scroll progress. Scroll down = particles collapse to orb.
 * Scroll back = particles expand to field.
 */

let scene, camera, renderer, particles;

/** Live Three.Color references for GSAP to tween */
const themeProxy = {
  bg:     new THREE.Color(THEMES[0].bg),
  accent: new THREE.Color(THEMES[0].accent),
};

/** Pre-computed particle position buffers */
const webglState = {
  fieldPositions: null,
  orbPositions:   null,
};

/**
 * Initialize Three.js scene, camera, renderer, and particles.
 * Appends canvas to #webgl-container.
 */
function initWebGL() {
  const container = document.getElementById('webgl-container');

  /* Scene */
  scene = new THREE.Scene();
  scene.fog        = new THREE.FogExp2(themeProxy.bg.getHex(), 0.0015);
  scene.background = themeProxy.bg;

  /* Camera */
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    3000
  );
  camera.position.z = CONFIG.cameraZStart;

  /* Renderer */
  renderer = new THREE.WebGLRenderer({
    antialias:        false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  /* Particles */
  _createParticles();

  /* Resize handler */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* Start render loop */
  _renderLoop();
}

/** Build BufferGeometry with field + orb position arrays */
function _createParticles() {
  const count    = CONFIG.particleCount;
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(count * 3);

  webglState.fieldPositions = new Float32Array(count * 3);
  webglState.orbPositions   = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    /* Field: random cloud */
    webglState.fieldPositions[i * 3]     = (Math.random() - 0.5) * CONFIG.spread;
    webglState.fieldPositions[i * 3 + 1] = (Math.random() - 0.5) * CONFIG.spread;
    webglState.fieldPositions[i * 3 + 2] = (Math.random() - 0.5) * CONFIG.spread;

    /* Orb: uniform sphere using spherical coordinates */
    const u     = Math.random();
    const v     = Math.random();
    const theta = 2 * Math.PI * u;
    const phi   = Math.acos(2 * v - 1);
    const r     = CONFIG.orbRadius * Math.cbrt(Math.random()); // cbrt = uniform volume density

    webglState.orbPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    webglState.orbPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    webglState.orbPositions[i * 3 + 2] = r * Math.cos(phi);

    /* Start in orb formation */
    vertices[i * 3]     = webglState.orbPositions[i * 3];
    vertices[i * 3 + 1] = webglState.orbPositions[i * 3 + 1];
    vertices[i * 3 + 2] = webglState.orbPositions[i * 3 + 2];
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({
    color:       themeProxy.accent,
    size:        CONFIG.particleSize,
    sizeAttenuation: true,
    transparent: true,
    opacity:     0.6,
    blending:    THREE.AdditiveBlending,
    depthWrite:  false,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

/** rAF render loop — lerps particle positions and rotates */
function _renderLoop() {
  requestAnimationFrame(_renderLoop);

  /* Smooth scroll progress interpolation */
  state.scrollProgress += (state.targetProgress - state.scrollProgress) * 0.05;

  /* Lerp factor: orb at start → field at end of hero */
  const p      = state.scrollProgress;
  const t      = Math.max(0, Math.min(1, (p - 0.15) / (0.75 - 0.15)));
  const smooth = t * t * (3 - 2 * t); // smoothstep
  const orbMix = Math.max(0.8 * (1 - smooth), 0.12);

  /* Update particle positions */
  const positions = particles.geometry.attributes.position.array;
  const field     = webglState.fieldPositions;
  const orb       = webglState.orbPositions;

  for (let i = 0; i < positions.length; i++) {
    positions[i] = field[i] + (orb[i] - field[i]) * orbMix;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  /* Camera + rotation */
  if (!isReducedMotion) {
    camera.position.z = CONFIG.cameraZStart -
      ((CONFIG.cameraZStart - CONFIG.cameraZEnd) * state.scrollProgress);
    scene.fog.density = 0.0015 + (state.scrollProgress * 0.0005);

    const dynamicRotation = CONFIG.idleRotationSpeed + (p * 0.001);
    particles.rotation.y += dynamicRotation;
    particles.rotation.x  = state.scrollProgress * CONFIG.scrollRotationFactor;
  } else {
    particles.rotation.y += CONFIG.idleRotationSpeed;
  }

  renderer.render(scene, camera);
}

/* ============================================================
 * 4. SMOOTH SCROLL — Lenis + GSAP ticker
 * ============================================================
 * Lenis replaces native scroll with a buttery inertial scroll.
 * It feeds into GSAP's ticker so ScrollTrigger stays in sync.
 *
 * Expose `lenis` globally so inline onclick handlers can call
 * lenis.scrollTo('#section') from HTML buttons.
 */
let lenis;

function initScroll() {
  lenis = new Lenis({
    duration:         2.1,
    easing:           (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
    direction:        'vertical',
    gestureDirection: 'vertical',
    smooth:           !isReducedMotion,
    smoothTouch:      false,
    touchMultiplier:  1.05,
    wheelMultiplier:  0.75,
  });

  /* Keep ScrollTrigger in sync with Lenis */
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* Make lenis globally accessible for inline onclick="lenis.scrollTo(...)" */
  window.lenis = lenis;

  /* Smooth-scroll all anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      lenis.scrollTo(anchor.getAttribute('href'), { offset: 0, duration: 1.8 });
    });
  });
}

/* ============================================================
 * 5. SECTION THEME SWITCHER
 * ============================================================
 * Each section in THEMES[] gets a ScrollTrigger.
 * When 50% of the section is in view, applyTheme() fires.
 * This crossfades CSS variables AND Three.js material colors.
 */

/**
 * Crossfade to a new theme.
 * @param {{ bg: string, accent: string, border: string, panel: string }} theme
 */
function applyTheme(theme) {
  /* Tween CSS custom properties on :root */
  gsap.to(document.documentElement, {
    '--bg':     theme.bg,
    '--accent': theme.accent,
    '--border': theme.border,
    '--panel':  theme.panel,
    duration:   1.2,
    ease:       'power2.out',
  });

  /* Tween Three.js scene colors in parallel */
  const targetBg     = new THREE.Color(theme.bg);
  const targetAccent = new THREE.Color(theme.accent);

  gsap.to(themeProxy.bg, {
    r: targetBg.r, g: targetBg.g, b: targetBg.b,
    duration: 1.2,
    onUpdate: () => {
      scene.background.copy(themeProxy.bg);
      scene.fog.color.copy(themeProxy.bg);
    },
  });

  gsap.to(themeProxy.accent, {
    r: targetAccent.r, g: targetAccent.g, b: targetAccent.b,
    duration: 1.2,
    onUpdate: () => {
      particles.material.color.copy(themeProxy.accent);
    },
  });
}

function initThemesAndNav() {
  const navLinks = document.querySelectorAll('.nav-link');

  THEMES.forEach((theme, index) => {
    /* Theme crossfade trigger */
    ScrollTrigger.create({
      trigger:    theme.id,
      start:      'top 50%',
      end:        'bottom 50%',
      onEnter:      () => applyTheme(theme),
      onEnterBack:  () => applyTheme(theme),
    });

    /* Nav active state sync */
    if (index > 0) {
      ScrollTrigger.create({
        trigger: theme.id,
        start:   'top center',
        end:     'bottom center',
        onToggle: (self) => {
          if (self.isActive && navLinks[index - 1]) {
            navLinks.forEach(l => l.classList.remove('is-active'));
            navLinks[index - 1].classList.add('is-active');
          }
        },
      });
    }
  });
}

/* ============================================================
 * 6. PINNED SCROLL TIMELINE
 * ============================================================
 * The hero section (#pinned-stage) is pinned for CONFIG.scrollDistance.
 * A single GSAP timeline controls 5 sequential phases:
 *
 *   Phase 0 — Idle overlay fades out
 *   Phase 1 — Hero headline reveals (line mask animation)
 *   Phase 2 — Grid overlay + scanline sweep
 *   Phase 3 — Feature cards emerge (staggered 3D reveal)
 *   Phase 4 — Bridge quote
 *   Phase 5 — Exit to static content
 *
 * Timeline position values (e.g. 0.2, 1.8) are label points
 * on the scrubbed timeline — not real seconds.
 */
function initScrollTimeline() {
  /* Initial states */
  gsap.set('#phase-1-content .line-content', { yPercent: 125, force3D: true, opacity: 1 });
  gsap.set('.feature-card', { opacity: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#pinned-stage',
      start:   'top top',
      end:     CONFIG.scrollDistance,
      pin:     true,
      scrub:   isReducedMotion ? true : CONFIG.scrubSmoothing,
      onUpdate: (self) => {
        state.targetProgress = self.progress;
        /* Drive the vertical scroll-progress bar */
        gsap.set('#scroll-progress', { scaleY: self.progress });
      },
    },
  });

  /* ── PHASE 0: Dismiss idle overlay ─────────────────────── */
  tl.to('#idle-overlay', {
    opacity: 0, duration: 0.8, ease: 'power2.out',
  }, 0.1);

  /* ── PHASE 1: Hero headline + UI chrome ─────────────────── */
  tl.to('#phase-1-content .line-content', {
    yPercent: 0, duration: 1.1, stagger: 0.15, ease: 'power3.out',
  }, 0.2)
  .to('#ui-top, #ui-bottom', {
    opacity: 1, y: 0, duration: 1, ease: 'power2.out',
  }, 0.5)
  .to('#hero-descriptor, #hero-ctas', {
    opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power2.out',
  }, 0.8);

  /* ── PHASE 2: Grid + Scanline ───────────────────────────── */
  tl.to('#phase-1-content', {
    opacity: 0, y: -40, filter: 'blur(8px)',
    duration: 1, ease: 'power2.inOut', pointerEvents: 'none',
  }, 1.8)
  .to('#phase-2-content', {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    duration: 1.2, ease: 'power2.out', pointerEvents: 'auto',
  }, 2.1)
  /* Scanline enters */
  .to('#phase-2-scanline', { opacity: 0.35, duration: 0.2, ease: 'power1.inOut' }, 2.2)
  /* Scanline sweeps */
  .to('#phase-2-scanline', { top: '110%', duration: 1.2, ease: 'linear' }, 2.2)
  /* Scanline exits */
  .to('#phase-2-scanline', { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, 3.2);

  /* ── PHASE 3: Feature Cards ─────────────────────────────── */
  tl.to('#phase-2-content', {
    opacity: 0, y: -40, filter: 'blur(8px)',
    duration: 1, ease: 'power2.inOut', pointerEvents: 'none',
  }, 3.3)
  .to('#phase-3-content', {
    opacity: 1, duration: 0.8, ease: 'power2.out', pointerEvents: 'auto',
  }, 3.4)
  .to('#phase-3-intro', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  }, 3.5)
  /* Cards: staggered 3D entrance from below with blur */
  .fromTo('.feature-card',
    { opacity: 0, y: 30, scale: 0.94, filter: 'blur(12px)', rotateX: 6 },
    { opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)',  rotateX: 0,
      stagger: 0.18, duration: 1.2, ease: 'power3.out' },
    3.7
  );

  /* Hold cards and drift them slightly upward */
  tl.to('.feature-card', { y: -15, duration: 1.8, ease: 'none' }, 4.9);

  /* Extra hold beat */
  tl.to({}, { duration: 0.4 }, 6.7);

  /* ── PHASE 4: Bridge Quote ──────────────────────────────── */
  tl.to('#phase-3-content', {
    opacity: 0, y: -40, filter: 'blur(8px)',
    duration: 1, ease: 'power2.inOut', pointerEvents: 'none',
  }, 7.1)
  .to('#bridge-content', {
    opacity: 1, y: 0, filter: 'blur(0px)',
    duration: 1.2, ease: 'power3.out', pointerEvents: 'auto',
  }, 7.4)
  /* Stagger each line of the bridge quote */
  .to('.bridge-stagger', {
    opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
  }, 7.5);

  /* ── PHASE 5: Exit to static sections ───────────────────── */
  tl.to('#bridge-content, #ui-top, #ui-bottom', {
    opacity: 0, y: -20, filter: 'blur(4px)',
    duration: 1, ease: 'power2.inOut',
  }, 9.2);
}

/* ============================================================
 * 7. SCROLL REVEAL — Static Sections
 * ============================================================
 * Two reveal patterns for content below the pinned hero:
 *
 *   .reveal-text  — single lines, slide up from clip mask
 *   .reveal-item  — block elements, fade + slide up
 *
 * Both trigger when the nearest .reveal-block enters viewport.
 */
function initScrollReveals() {
  /* Typography reveal (clipped lines) */
  document.querySelectorAll('.reveal-text').forEach(text => {
    gsap.fromTo(text,
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity:  1,
        duration: 0.9,
        ease:     'power3.out',
        scrollTrigger: {
          trigger: text.closest('.reveal-block'),
          start:   'top 85%',
        },
      }
    );
  });

  /* Block element reveal */
  document.querySelectorAll('.reveal-block').forEach(block => {
    gsap.fromTo(block.querySelectorAll('.reveal-item'),
      { y: 30, opacity: 0 },
      {
        y:        0,
        opacity:  1,
        duration: 0.9,
        stagger:  0.15,
        ease:     'power3.out',
        scrollTrigger: {
          trigger: block,
          start:   'top 80%',
        },
      }
    );
  });
}

/* ============================================================
 * 8. BOOTSTRAP
 * ============================================================
 * Initialization order matters:
 *   1. WebGL first (needs canvas in DOM)
 *   2. Scroll (Lenis must be set up before ScrollTrigger)
 *   3. Themes + Nav (ScrollTrigger zones)
 *   4. Pinned timeline (longest ScrollTrigger)
 *   5. Reveals (simple ScrollTriggers for static sections)
 */
document.addEventListener('DOMContentLoaded', () => {
  initWebGL();
  initScroll();
  initThemesAndNav();
  initScrollTimeline();
  initScrollReveals();
});
