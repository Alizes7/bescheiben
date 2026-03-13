/**
 * api/contact.js — Rota POST /api/contact
 * Bescheiben Digital Agency
 *
 * Responsabilidades:
 *  - Validação de campos no servidor
 *  - Sanitização de inputs
 *  - Envio de email via Nodemailer
 *  - Respostas JSON padronizadas
 */

'use strict';

const nodemailer = require('nodemailer');

/* ── Configuração do transporter ─────────────────────────────── */

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* ── Helpers ─────────────────────────────────────────────────── */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sanitização básica contra XSS */
const sanitize = (str) =>
  String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();

/** Template HTML do email de notificação */
function buildEmailHtml({ nome, email, empresa, mensagem }) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <style>
    body  { font-family: 'Sora', -apple-system, sans-serif; background:#0C0C18; margin:0; padding:0; }
    .wrap { max-width:560px; margin:0 auto; padding:40px 24px; }
    .logo { font-size:18px; font-weight:700; color:#A58BFF; letter-spacing:-.02em; margin-bottom:32px; }
    .card { background:#161628; border:1px solid rgba(107,78,255,.18); border-radius:16px; padding:32px; }
    .sep  { height:1px; background:rgba(107,78,255,.14); margin:12px 0 24px; }
    .lbl  { font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:rgba(165,139,255,.5); margin-bottom:4px; }
    .val  { font-size:15px; color:#E5E7EB; margin-bottom:20px; line-height:1.6; }
    .msg  { background:rgba(107,78,255,.07); border:1px solid rgba(107,78,255,.14); border-radius:10px; padding:16px; }
    .foot { margin-top:28px; font-size:12px; color:rgba(255,255,255,.2); text-align:center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">Bescheiben · Digital Agency</div>
    <div class="card">
      <div class="lbl">Novo contato recebido</div>
      <div class="sep"></div>
      <div class="lbl">Nome</div>
      <div class="val">${nome}</div>
      <div class="lbl">Email</div>
      <div class="val"><a href="mailto:${email}" style="color:#A58BFF">${email}</a></div>
      <div class="lbl">Empresa</div>
      <div class="val">${empresa}</div>
      <div class="lbl">Mensagem</div>
      <div class="msg"><div class="val" style="margin:0">${mensagem.replace(/\n/g, '<br>')}</div></div>
    </div>
    <div class="foot">
      Bescheiben Digital Agency · ${new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' })}
    </div>
  </div>
</body>
</html>`;
}

/** Template texto plano do email */
function buildEmailText({ nome, email, empresa, mensagem }) {
  return `
NOVO CONTATO — Bescheiben Digital Agency
=========================================
Nome:    ${nome}
Email:   ${email}
Empresa: ${empresa}

Mensagem:
${mensagem}
-----------------------------------------
Recebido em: ${new Date().toLocaleString('pt-BR')}
`.trim();
}

/* ── Controller ──────────────────────────────────────────────── */

/**
 * POST /api/contact
 * Body: { nome, email, empresa, mensagem }
 */
async function contactHandler(req, res) {
  const { nome, email, empresa, mensagem } = req.body;

  // 1. Validação
  if (!nome || !email || !empresa || !mensagem) {
    return res.status(400).json({
      success: false,
      message: 'Todos os campos são obrigatórios.',
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Endereço de email inválido.',
    });
  }

  if (nome.length > 120 || empresa.length > 120 || mensagem.length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'Dados excedem o tamanho permitido.',
    });
  }

  // 2. Sanitização
  const safe = {
    nome:     sanitize(nome),
    email:    sanitize(email),
    empresa:  sanitize(empresa),
    mensagem: sanitize(mensagem),
  };

  // 3. Envio de email
  try {
    await transporter.sendMail({
      from:    `"Bescheiben Site" <${process.env.MAIL_USER}>`,
      to:      'bescheiben@gmail.com',
      replyTo: safe.email,
      subject: `[Bescheiben] Novo contato de ${safe.nome} — ${safe.empresa}`,
      text:    buildEmailText(safe),
      html:    buildEmailHtml(safe),
    });

    console.log(`[${new Date().toISOString()}] ✓ Email enviado: ${safe.nome} <${safe.email}>`);

    return res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ✗ Erro ao enviar email:`, err.message);

    return res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem. Por favor, tente novamente.',
    });
  }
}

module.exports = { contactHandler };
