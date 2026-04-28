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

/* ── Active nav via IntersectionObserver ── */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav__link');
  const linkMap  = {};
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
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0.3 });
  sections.forEach(s => obs.observe(s));
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
  const lb      = document.getElementById('lightbox');
  if (!lb) return;
  const img     = lb.querySelector('.lightbox__img');
  const closeBtn= lb.querySelector('.lightbox__close');
  const backdrop= lb.querySelector('.lightbox__backdrop');
  let trigger   = null;

  function getFocusable() {
    return Array.from(lb.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])')).filter(e => !e.disabled);
  }

  function open(src, alt, el) {
    trigger = el; img.src = src; img.alt = alt;
    lb.classList.remove('hidden'); lb.setAttribute('aria-hidden','false');
    closeBtn.focus();
  }

  function close() {
    lb.classList.add('hidden'); lb.setAttribute('aria-hidden','true');
    img.src = '';
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
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      const f = getFocusable();
      if (!f.length) return;
      if (e.shiftKey) { if (document.activeElement===f[0]) { e.preventDefault(); f[f.length-1].focus(); } }
      else            { if (document.activeElement===f[f.length-1]) { e.preventDefault(); f[0].focus(); } }
    }
  });
})();

/* ── Mobile menu close on link click ── */
(function initMobileClose() {
  const toggle = document.getElementById('nav-toggle');
  if (!toggle) return;
  document.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => { toggle.checked = false; }));
})();
