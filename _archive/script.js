/* ═══════════════════════════════════════════════════════════
   NESTGEN '26 — INTERACTIONS & SCROLL MECHANICS
   Custom cursor · Typewriter cold open · Stat counters
   IntersectionObserver reveals · Progress bar · Nav scroll
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── UTILITIES ─────────────────────────────────────────── */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function $(selector, ctx = document) {
  return ctx.querySelector(selector);
}

function $$(selector, ctx = document) {
  return [...ctx.querySelectorAll(selector)];
}

/* ─── CUSTOM CURSOR ─────────────────────────────────────── */
(function initCursor() {
  const cursor     = $('#cursor');
  const cursorRing = $('#cursorRing');
  if (!cursor || !cursorRing) return;

  // Only show on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.remove();
    cursorRing.remove();
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  }, { passive: true });

  // Smooth-follow ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow on interactive elements
  const interactives = 'a, button, .stat-card, .industry-card, .speaker-track, .nav-register-btn, .cta-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      document.body.classList.remove('cursor-hover');
    }
  });
})();

/* ─── TYPEWRITER COLD OPEN ──────────────────────────────── */
(function initColdOpen() {

  const LINES = [
    { lineId: 'tl-1', textId: 'tt-1', text: 'SYSTEM ALERT ── ALARM TRIGGERED',                       speed: 42, pauseAfter: 220 },
    { lineId: 'tl-2', textId: 'tt-2', text: 'FIRE AT ZONE C  ·  SENSOR D  ·  ALARM ID A91S290',       speed: 30, pauseAfter: 280 },
    { lineId: 'tl-3', textId: 'tt-3', text: 'DRONE DISPATCHED AUTONOMOUSLY  ·  ETA 90 SECONDS',       speed: 30, pauseAfter: 260 },
    { lineId: 'tl-4', textId: 'tt-4', text: 'NO OPERATOR REQUIRED.',                                  speed: 70, pauseAfter: 400 },
  ];

  async function typeChar(el, char) {
    el.textContent += char;
  }

  async function typeLine(lineEl, textEl, text, speed) {
    lineEl.classList.add('t-visible');
    for (const char of text) {
      typeChar(textEl, char);
      await sleep(speed + (Math.random() * 14 - 7)); // tiny jitter
    }
  }

  async function runSequence() {
    await sleep(500); // brief pause before starting

    for (const cfg of LINES) {
      const lineEl = $('#' + cfg.lineId);
      const textEl = $('#' + cfg.textId);
      if (!lineEl || !textEl) continue;

      await typeLine(lineEl, textEl, cfg.text, cfg.speed);
      await sleep(cfg.pauseAfter);
    }

    // Show blinking cursor line
    const cursorLine = $('#tl-cursor');
    if (cursorLine) cursorLine.classList.add('t-visible');

    await sleep(1100);

    // Reveal the kicker message
    const reveal = $('#termReveal');
    if (reveal) {
      reveal.classList.add('t-visible');
      reveal.removeAttribute('aria-hidden');
    }
  }

  // Kick off after fonts are loaded (or 400ms, whichever first)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => runSequence());
  } else {
    window.addEventListener('load', runSequence);
  }

})();

/* ─── STAT COUNTERS ─────────────────────────────────────── */
function animateCounter(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';

  const target = parseInt(el.dataset.target, 10);
  if (isNaN(target)) return;

  const suffix   = el.dataset.suffix || '';
  const duration = 1600;
  const startTs  = performance.now();

  function tick(now) {
    const elapsed  = now - startTs;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = Math.floor(eased * target);

    el.textContent = value + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target + suffix;
      // Terracotta flash
      el.style.transition = 'color 0.15s';
      el.style.color = 'var(--terracotta)';
    }
  }

  requestAnimationFrame(tick);
}

/* ─── INTERSECTION OBSERVER: REVEAL ANIMATIONS ──────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('revealed');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

$$('.reveal-up').forEach(el => revealObserver.observe(el));

/* ─── INTERSECTION OBSERVER: STAT COUNTERS ──────────────── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

$$('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

/* ─── CHAPTER PROGRESS TRACKING ─────────────────────────── */
(function initProgress() {
  const chapters    = $$('.chapter');
  const dots        = $$('.chapter-dot');
  const fillEl      = $('#chapterFill');
  const totalChaps  = chapters.length;

  if (!chapters.length || !dots.length || !fillEl) return;

  const chapterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const idx = parseInt(entry.target.dataset.chapterIndex, 10);
      if (isNaN(idx)) return;

      // Activate correct dot
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));

      // Update fill height
      const pct = totalChaps > 1 ? (idx / (totalChaps - 1)) * 100 : 100;
      fillEl.style.height = pct + '%';
    });
  }, { threshold: 0.45 });

  chapters.forEach(ch => chapterObserver.observe(ch));

  // Click on dot → scroll to chapter
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const target = chapters[i];
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

})();

/* ─── NAV HIDE / SHOW ON SCROLL ─────────────────────────── */
(function initNavScroll() {
  const header = $('#siteHeader');
  if (!header) return;

  header.style.transition = 'transform 0.32s ease';

  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;

        if (currentY > lastY && currentY > 80) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }

        lastY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

})();

/* ─── CTA BUTTON PRESS EFFECT ───────────────────────────── */
(function initCtaButton() {
  const btn = $('#ctaMainBtn');
  if (!btn) return;

  btn.addEventListener('mousedown', () => {
    btn.style.boxShadow = 'none';
    btn.style.transform = 'translate(7px, 7px)';
  });

  const release = () => {
    btn.style.boxShadow = '';
    btn.style.transform = '';
  };

  btn.addEventListener('mouseup',    release);
  btn.addEventListener('mouseleave', release);

})();

/* ─── INDUSTRY CARD STAGGER ─────────────────────────────── */
(function staggerCards() {
  // Re-observe industry cards individually with cascade delay
  const cards = $$('.industry-card');
  if (!cards.length) return;

  const gridObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Small extra delay based on grid position within its row
      const siblings = [...entry.target.parentElement.children];
      const posInRow = siblings.indexOf(entry.target) % 3;
      entry.target.style.transitionDelay = `${posInRow * 0.08}s`;
      entry.target.classList.add('revealed');
      gridObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  cards.forEach(c => {
    c.classList.add('reveal-up');
    // Remove from general observer to avoid double-fire
    revealObserver.unobserve(c);
    gridObserver.observe(c);
  });

})();

/* ─── SPEAKER ROW STAGGER ───────────────────────────────── */
(function staggerSpeakerRows() {
  const rows = $$('.speaker-row');
  rows.forEach((row, idx) => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-12px)';
    row.style.transition = `opacity 0.45s ease ${idx * 0.07}s, transform 0.45s ease ${idx * 0.07}s`;
  });

  const rowObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Trigger all rows in a track at once when track enters
      const track = entry.target;
      track.querySelectorAll('.speaker-row').forEach(row => {
        row.style.opacity  = '1';
        row.style.transform = 'translateX(0)';
      });
      rowObserver.unobserve(track);
    });
  }, { threshold: 0.3 });

  $$('.speaker-track').forEach(t => rowObserver.observe(t));

})();

/* ─── SMOOTH HASH NAV (Chapter dot clicks via keyboard) ─── */
document.addEventListener('keydown', e => {
  const focused = document.activeElement;
  if (focused && focused.classList.contains('chapter-dot')) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      focused.click();
    }
  }
});

/* ─── CONSOLE EASTER EGG ────────────────────────────────── */
console.log(
  '%c NESTGEN \'26 — Physical AI Summit %c September 29 · Online ',
  'background:#C96A35;color:#EDE8DA;font-family:monospace;font-size:14px;padding:6px 12px;',
  'background:#E4B12A;color:#2A1F16;font-family:monospace;font-size:14px;padding:6px 12px;'
);
console.log('%c Powered by FlytBase · flytbase.com', 'color:#254A33;font-family:monospace;font-size:12px;');
