/**
 * form.js — Lógica do formulário de contato
 * Bescheiben Digital Agency
 *
 * Responsabilidades:
 *  - Capturar submit do formulário
 *  - Validação client-side
 *  - Envio via fetch para /api/contact
 *  - Gerenciar estados de loading, sucesso e erro
 */

'use strict';

/* ── Seletores ───────────────────────────────────────────────── */
const SELECTORS = {
  form:     '#contact-form',
  message:  '#form-message',
  btn:      '#form-btn',
  btnText:  '#form-btn-text',
  btnIcon:  '#form-btn-icon',
  btnSpin:  '#form-btn-spinner',
};

/* ── Validação ───────────────────────────────────────────────── */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida os campos do formulário.
 * @param {Object} fields - { nome, email, empresa, mensagem }
 * @returns {string|null} Mensagem de erro ou null se válido
 */
function validate({ nome, email, empresa, mensagem }) {
  if (!nome || !email || !empresa || !mensagem) {
    return 'Por favor, preencha todos os campos obrigatórios.';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Por favor, informe um endereço de email válido.';
  }
  if (nome.length > 120 || empresa.length > 120) {
    return 'Nome ou empresa excedem o tamanho permitido.';
  }
  if (mensagem.length > 2000) {
    return 'A mensagem não pode ter mais de 2000 caracteres.';
  }
  return null;
}

/* ── UI Helpers ──────────────────────────────────────────────── */

/**
 * Exibe mensagem de feedback abaixo do botão.
 * @param {HTMLElement} el - Elemento da mensagem
 * @param {string} text
 * @param {'success'|'error'} type
 */
function showMessage(el, text, type) {
  el.textContent = text;
  el.className = `form-msg form-msg--${type}`;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-oculta após 8 segundos
  setTimeout(() => { el.style.display = 'none'; }, 8000);
}

/**
 * Define estado de loading no botão.
 * @param {Object} els - { btn, btnText, btnIcon, btnSpin }
 * @param {boolean} loading
 */
function setLoading({ btn, btnText, btnIcon, btnSpin }, loading) {
  btn.disabled     = loading;
  btnText.textContent = loading ? 'Enviando…' : 'Enviar mensagem';
  btnIcon.style.display = loading ? 'none'  : 'block';
  btnSpin.style.display = loading ? 'block' : 'none';
}

/* ── Submit Handler ──────────────────────────────────────────── */

async function handleSubmit(event, elements) {
  event.preventDefault();

  const { form, msgEl, btn, btnText, btnIcon, btnSpin } = elements;

  const fields = {
    nome:     form.nome.value.trim(),
    email:    form.email.value.trim(),
    empresa:  form.empresa.value.trim(),
    mensagem: form.mensagem.value.trim(),
  };

  // Validação
  const error = validate(fields);
  if (error) {
    showMessage(msgEl, error, 'error');
    return;
  }

  // Loading on
  setLoading({ btn, btnText, btnIcon, btnSpin }, true);

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(msgEl, '✓ Mensagem enviada! Entraremos em contato em breve.', 'success');
      form.reset();
    } else {
      showMessage(
        msgEl,
        data.message || 'Erro ao enviar. Tente novamente ou envie um email diretamente.',
        'error'
      );
    }
  } catch {
    showMessage(
      msgEl,
      'Erro de conexão. Tente novamente ou envie um email para bescheiben@gmail.com',
      'error'
    );
  } finally {
    setLoading({ btn, btnText, btnIcon, btnSpin }, false);
  }
}

/* ── Init ────────────────────────────────────────────────────── */

function initContactForm() {
  const form    = document.querySelector(SELECTORS.form);
  if (!form) return;

  const elements = {
    form,
    msgEl:   document.querySelector(SELECTORS.message),
    btn:     document.querySelector(SELECTORS.btn),
    btnText: document.querySelector(SELECTORS.btnText),
    btnIcon: document.querySelector(SELECTORS.btnIcon),
    btnSpin: document.querySelector(SELECTORS.btnSpin),
  };

  form.addEventListener('submit', (e) => handleSubmit(e, elements));
}

document.addEventListener('DOMContentLoaded', initContactForm);
