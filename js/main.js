/**
 * main.js — Ponto de entrada e inicializações globais
 * Bescheiben Digital Agency
 *
 * Responsabilidades:
 *  - Navbar scroll behavior
 *  - Mobile menu toggle
 *  - Coordenar módulos (animations.js e form.js são carregados separadamente)
 */

'use strict';

/* ══════════════════════════════════════════════════════════════
   NAVBAR — glassmorphism no scroll
   ══════════════════════════════════════════════════════════════ */

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 24;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
}

/* ══════════════════════════════════════════════════════════════
   MOBILE MENU — toggle abrir/fechar
   ══════════════════════════════════════════════════════════════ */

function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!hamburger || !mobileMenu) return;

  /** Abre ou fecha o menu mobile */
  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Fechar ao clicar em qualquer link do menu mobile
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Fechar com Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
});
