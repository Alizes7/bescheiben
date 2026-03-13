/**
 * animations.js — Scroll reveal e microinterações
 * Bescheiben Digital Agency
 *
 * Responsabilidades:
 *  - Inicializar IntersectionObserver para revelar elementos no scroll
 *  - Destacar nav link ativo conforme seção visível
 */

'use strict';

/* ── Scroll Reveal ───────────────────────────────────────────── */

/**
 * Observa todos os elementos com classe .reveal, .reveal-right ou
 * .reveal-scale e adiciona .visible quando entram na viewport.
 */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-right, .reveal-scale');

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // observa só uma vez
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ── Active Nav Link ─────────────────────────────────────────── */

/**
 * Atualiza a classe .active nos links da navbar conforme a seção
 * atual visível, baseado no scroll Y.
 */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  function update() {
    let current = '';

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // executa na carga
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initActiveNav();
});
