/**
 * server.js — Servidor principal da Bescheiben Digital Agency
 *
 * Stack: Node.js + Express
 * Funcionalidades:
 *  - Serve o frontend estático
 *  - Rota POST /api/contact com rate limiting
 *  - Health check GET /api/health
 */

'use strict';

require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const path      = require('path');

const { contactHandler } = require('../api/contact');

/* ── App ─────────────────────────────────────────────────────── */
const app  = express();
const PORT = process.env.PORT || 3001;

/* ── Middleware ──────────────────────────────────────────────── */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin:  process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
}));

// Serve frontend (pasta raiz do projeto)
app.use(express.static(path.join(__dirname, '..')));

/* ── Rate Limiting — apenas na rota de contato ───────────────── */
const contactLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15 minutos
  max:             5,               // máx 5 tentativas por IP
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.',
  },
});

/* ── Rotas da API ────────────────────────────────────────────── */

/** Health check */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/** Formulário de contato */
app.post('/api/contact', contactLimiter, contactHandler);

/* ── Catch-all → SPA (serve index.html para todas as rotas) ──── */
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

/* ── Start ───────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n🚀  Bescheiben backend  →  http://localhost:${PORT}`);
  console.log(`    Health check        →  http://localhost:${PORT}/api/health\n`);
});
