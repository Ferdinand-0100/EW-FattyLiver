'use strict';

/* ── Scroll-reveal ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── Active nav ── */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav__link');
  const linkMap = {};
  navLinks.forEach(l => { linkMap[l.getAttribute('href').replace('#','')] = l; });
  const sections = document.querySelectorAll('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const link = linkMap[e.target.id];
      if (!link) return;
      navLinks.forEach(l => l.classList.remove('nav__link--active'));
      link.classList.add('nav__link--active');
    });
  }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
  sections.forEach(s => obs.observe(s));
})();

/* ── Scroll progress bar ── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;
  let ticking = false;
  function update() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

/* ── Back-to-top ── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('hidden', window.scrollY <= 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── Lightbox ── */
(function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const img = lb.querySelector('.lightbox__img');
  const closeBtn = lb.querySelector('.lightbox__close');
  const backdrop = lb.querySelector('.lightbox__backdrop');
  let trigger = null;

  function open(src, alt, el) {
    trigger = el; img.src = src; img.alt = alt;
    lb.classList.remove('hidden'); lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    lb.classList.add('hidden'); lb.setAttribute('aria-hidden','true');
    img.src = '';
    document.body.style.overflow = '';
    if (trigger) { trigger.focus(); trigger = null; }
  }

  document.querySelectorAll('.lightbox-trigger').forEach(t => {
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex','0');
    const go = () => open(t.src, t.alt, t);
    t.addEventListener('click', go);
    t.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); go(); } });
  });

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (lb.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
  });
})();

/* ── Mobile menu close on link click ── */
(function initMobileClose() {
  const toggle = document.getElementById('nav-toggle');
  if (!toggle) return;
  document.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => { toggle.checked = false; }));
})();

/* ── Subtle parallax on hero orbs ── */
(function initHeroParallax() {
  const orbs = document.querySelectorAll('.hero__orb');
  if (!orbs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 120;
      orb.style.translate = `${x * factor}px ${y * factor}px`;
    });
  });
})();
