require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const db = require('./queries');

const app = express();
const PORT = process.env.API_PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DEMO_USERNAME = process.env.DEMO_USERNAME || 'admin';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'admin';
// Defina DEMO_AUTH_SECRET no ambiente antes de usar qualquer credencial real.
const DEMO_AUTH_SECRET = process.env.DEMO_AUTH_SECRET || 'temporary-inventory-demo-secret-change-before-production';
const SESSION_SECONDS = 8 * 60 * 60;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function signSession(expiresAt) {
  const payload = String(expiresAt);
  const signature = crypto.createHmac('sha256', DEMO_AUTH_SECRET).update(payload).digest('hex');
  return payload + '.' + signature;
}

function hasValidSession(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookie = cookieHeader.split(';').map(part => part.trim()).find(part => part.startsWith('inventory_demo='));
  if (!cookie) return false;
  const token = decodeURIComponent(cookie.slice('inventory_demo='.length));
  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature || !/^\d+$/.test(expiresAt) || Number(expiresAt) < Math.floor(Date.now() / 1000)) return false;
  const expected = crypto.createHmac('sha256', DEMO_AUTH_SECRET).update(expiresAt).digest('hex');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function requireDemoAuth(req, res, next) {
  if (hasValidSession(req)) return next();
  return res.status(401).json({ message: 'Sessão expirada. Entre novamente para continuar.' });
}

// Landing page pública e seus assets servidos por rotas explícitas na Vercel.
app.get('/', (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'landing.html'), error => {
    if (error && !res.headersSent) res.status(error.statusCode || 500).send('Não foi possível carregar a página inicial. Tente novamente em instantes.');
  });
});
app.get('/landing.css', (_req, res) => {
  res.type('text/css').sendFile(path.join(PUBLIC_DIR, 'landing.css'));
});
app.get('/landing.js', (_req, res) => {
  res.type('application/javascript').sendFile(path.join(PUBLIC_DIR, 'landing.js'));
});
app.get('/icon.svg', (_req, res) => {
  res.type('image/svg+xml').sendFile(path.join(PUBLIC_DIR, 'icon.svg'));
});

// Login demonstrativo. Troque as credenciais e configure DEMO_AUTH_SECRET antes de produção.
app.post('/api/demo-login', (req, res) => {
  const username = String(req.body?.username || '');
  const password = String(req.body?.password || '');
  const userOk = username === DEMO_USERNAME;
  const passOk = password === DEMO_PASSWORD;
  if (!userOk || !passOk) return res.status(401).json({ message: 'Usuário ou senha incorretos.' });

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const secure = process.env.VERCEL === '1' ? '; Secure' : '';
  res.setHeader('Set-Cookie', 'inventory_demo=' + encodeURIComponent(signSession(expiresAt)) + '; HttpOnly; Path=/; SameSite=Lax; Max-Age=' + SESSION_SECONDS + secure);
  return res.status(200).json({ authenticated: true });
});

app.get('/api/demo-session', (req, res) => {
  res.status(200).json({ authenticated: hasValidSession(req) });
});

app.post('/api/demo-logout', (_req, res) => {
  res.setHeader('Set-Cookie', 'inventory_demo=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0');
  res.status(200).json({ ok: true });
});

// A interface principal e as APIs de dados exigem a sessão demonstrativa.
function sendInventoryApp(req, res) {
  if (!hasValidSession(req)) return res.redirect('/?login=required');
  fs.readFile(path.join(PUBLIC_DIR, 'celular.rubertt.html'), 'utf8', (error, html) => {
    if (error) return res.status(500).send('Não foi possível carregar o inventário.');
    const onboardingScript = '<script src="/onboarding.js" defer></script>';
    const page = html.includes('</body>') ? html.replace('</body>', onboardingScript + '\n</body>') : html + onboardingScript;
    res.type('html').send(page);
  });
}

app.get('/app', sendInventoryApp);
app.get('/celular.rubertt.html', sendInventoryApp);
app.get('/onboarding.js', (_req, res) => {
  res.type('application/javascript').sendFile(path.join(PUBLIC_DIR, 'onboarding.js'));
});

// Health check e autenticação demonstrativa são públicos; as rotas de dados são protegidas.
app.get('/api/health', (_req, res) => {
  res.status(200).json({ info: 'API do Inventário de Celulares no ar!' });
});
app.use('/api', (req, res, next) => {
  if (['/health', '/demo-login', '/demo-session', '/demo-logout'].includes(req.path)) return next();
  return requireDemoAuth(req, res, next);
});

// --- ROTAS DE SMARTPHONES ---
app.get('/api/smartphones', async (_req, res) => {
  try {
    res.status(200).json(await db.getSmartphones());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/smartphones', async (req, res) => {
  try {
    res.status(201).json(await db.addSmartphone(req.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/smartphones/:id', async (req, res) => {
  try {
    res.status(200).json(await db.updateSmartphone(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/smartphones/:id', async (req, res) => {
  try {
    await db.deleteSmartphone(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/smartphones/:id/deliver', async (req, res) => {
  try {
    const termoData = req.body.termo;
    const entregaData = { ...termoData, dataEntrega: new Date().toISOString() };
    await db.addTermo(termoData);
    const result = await db.deliverSmartphone(req.params.id, entregaData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROTAS DE TERMOS ---
app.get('/api/termos', async (_req, res) => {
  try {
    res.status(200).json(await db.getTermos());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recursos estáticos por último: evita que o HTML do inventário contorne a sessão.
app.use(express.static(PUBLIC_DIR, { dotfiles: 'deny', index: false }));

if (require.main === module) {
  app.listen(PORT, () => console.log('Servidor do Inventário rodando na porta ' + PORT + '.'));
}

module.exports = app;
