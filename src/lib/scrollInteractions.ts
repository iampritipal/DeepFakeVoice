/**
 * VoiceGuard AI — Scroll Interactions
 * Requires: GSAP + ScrollTrigger loaded globally (via index.html CDN)
 * Usage: import and call initScrollInteractions() after DOM ready
 */

const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Section theme zones ──────────────────────────────────── */
const SECTION_THEMES = [
  { id: '#hero-section',      bg: '#030303', accent: '#3b82f6', border: '#1e1e1e' },
  { id: '#how-it-works',      bg: '#050508', accent: '#0ea5e9', border: '#1a1c23' },
  { id: '#demo-section',      bg: '#02040a', accent: '#3b82f6', border: '#161b22' },
  { id: '#features',          bg: '#000000', accent: '#2563eb', border: '#171717' },
  { id: '#use-cases',         bg: '#05030a', accent: '#3b82f6', border: '#201633' },
  { id: '#cta-section',       bg: '#020202', accent: '#3b82f6', border: '#111111' },
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function applyTheme(theme: typeof SECTION_THEMES[0]) {
  const root = document.documentElement;
  const gsap = (window as any).gsap;
  if (!gsap) return;

  const proxy = {
    bgR: 3, bgG: 3, bgB: 3,
    acR: 59, acG: 130, acB: 246,
    boR: 30, boG: 30, boB: 30,
  };

  const bg = hexToRgb(theme.bg);
  const ac = hexToRgb(theme.accent);
  const bo = hexToRgb(theme.border);

  gsap.to(proxy, {
    bgR: bg.r, bgG: bg.g, bgB: bg.b,
    acR: ac.r, acG: ac.g, acB: ac.b,
    boR: bo.r, boG: bo.g, boB: bo.b,
    duration: 0.8,
    ease: 'power2.out',
    onUpdate() {
      root.style.setProperty('--bg',     `rgb(${Math.round(proxy.bgR)},${Math.round(proxy.bgG)},${Math.round(proxy.bgB)})`);
      root.style.setProperty('--accent', `rgb(${Math.round(proxy.acR)},${Math.round(proxy.acG)},${Math.round(proxy.acB)})`);
      root.style.setProperty('--border', `rgb(${Math.round(proxy.boR)},${Math.round(proxy.boG)},${Math.round(proxy.boB)})`);
    },
  });
}

export function initScrollInteractions() {
  const gsap = (window as any).gsap;
  const ScrollTrigger = (window as any).ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── Section theme switcher ── */
  SECTION_THEMES.forEach((theme) => {
    const el = document.querySelector(theme.id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      onEnter: () => applyTheme(theme),
      onEnterBack: () => applyTheme(theme),
    });
  });

  /* ── Scroll progress bar ── */
  const fill = document.querySelector('.scroll-progress-fill');
  if (fill) {
    gsap.to(fill, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true },
    });
  }

  /* ── Scanline sweep ── */
  const scanline = document.querySelector('.phase-scanline');
  if (scanline && !isReducedMotion) {
    gsap.fromTo(scanline,
      { top: '-10%' },
      { top: '110%', duration: 3, ease: 'none', repeat: -1, repeatDelay: 2 }
    );
  }

  /* ── Reveal: .reveal-text (clip mask) ── */
  if (!isReducedMotion) {
    document.querySelectorAll('.reveal-text').forEach((el) => {
      gsap.fromTo(el,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0, opacity: 1,
          duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    });

    /* ── Reveal: .reveal-item (fade + rise) ── */
    document.querySelectorAll('.reveal-item').forEach((el, i) => {
      gsap.fromTo(el,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.6, ease: 'power2.out',
          delay: (i % 4) * 0.08,
          scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
        }
      );
    });

    /* ── Line-mask reveals (.line-content) ── */
    document.querySelectorAll('.line-content').forEach((el) => {
      gsap.fromTo(el,
        { yPercent: 125 },
        {
          yPercent: 0,
          duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    });
  }
}
