/**
 * main.js — Scroll reveal, nav, section dots, form, lazy iframes, city init
 * itsmrmetaverse.com (Claude Code build)
 */

import { init as initCity } from './city.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Scroll Reveal (IntersectionObserver) ─── */

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (prefersReducedMotion) {
    reveals.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ─── Nav Auto-Hide ─── */

function initNav() {
  const nav = document.querySelector('.nav');
  const intro = document.getElementById('intro');
  if (!nav || !intro) return;

  const observer = new IntersectionObserver(([entry]) => {
    nav.classList.toggle('nav--hidden', entry.isIntersecting);
  }, { threshold: 0.1 });

  observer.observe(intro);
}

/* ─── Section Dot Indicator ─── */

function initSectionDots() {
  const dots = document.querySelectorAll('.section-dots__dot');
  if (!dots.length) return;

  const sections = Array.from(dots).map(dot => {
    const id = dot.dataset.section;
    return { dot, el: document.getElementById(id) };
  }).filter(s => s.el);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = sections.find(s => s.el === entry.target);
        if (!match) return;

        dots.forEach(d => {
          d.classList.remove('section-dots__dot--active');
          d.removeAttribute('aria-current');
        });
        match.dot.classList.add('section-dots__dot--active');
        match.dot.setAttribute('aria-current', 'true');
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-20% 0px -20% 0px'
  });

  sections.forEach(s => observer.observe(s.el));

  // Click to scroll
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.section);
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
}

/* ─── Intro Fade on Scroll ─── */

function initIntroFade() {
  const intro = document.querySelector('.intro__content');
  if (!intro || prefersReducedMotion) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const progress = Math.min(scrollY / (vh * 0.6), 1);
      intro.style.opacity = 1 - progress;
      intro.style.transform = `translateY(${progress * -30}px)`;
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─── Lazy Iframes ─── */

function initLazyIframes() {
  const iframes = document.querySelectorAll('iframe[data-src]');
  if (!iframes.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        iframe.src = iframe.dataset.src;
        iframe.removeAttribute('data-src');
        observer.unobserve(iframe);
      }
    });
  }, {
    rootMargin: '200px 0px'
  });

  iframes.forEach(iframe => observer.observe(iframe));
}

/* ─── Contact Form (Formspree fetch) ─── */

function initContactForm() {
  const form = document.querySelector('.form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const status = form.querySelector('.form__status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Honeypot check
    if (formData.get('_gotcha')) return;

    submitBtn.disabled = true;
    if (status) {
      status.hidden = true;
      status.className = 'form__status';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        if (status) {
          status.textContent = 'Message sent. I\'ll be in touch.';
          status.classList.add('form__status--success');
          status.hidden = false;
        }
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      if (status) {
        status.textContent = 'Something went wrong. Please try again or email directly.';
        status.classList.add('form__status--error');
        status.hidden = false;
      }
    } finally {
      submitBtn.disabled = false;
    }
  });
}

/* ─── Tunnel Skip Button ─── */

function initTunnelSkip() {
  const btn = document.querySelector('.tunnel-skip');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const hero = document.getElementById('hero');
    if (hero) hero.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

/* ─── Init ─── */

document.addEventListener('DOMContentLoaded', () => {
  initCity();
  initScrollReveal();
  initNav();
  initSectionDots();
  initIntroFade();
  initLazyIframes();
  initContactForm();
  initTunnelSkip();
});
