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
const GOOGLE_STATE_SECONDS = 10 * 60;
const SESSION_SECRET = process.env.SESSION_SECRET || (process.env.VERCEL !== '1' ? DEMO_AUTH_SECRET : '');
const secureCookie = process.env.VERCEL === '1' ? '; Secure' : '';
function cookieValue(req, name) {
  const item = (req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(name + '='));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : '';
}
function safeEqual(a, b) {
  const aa = Buffer.from(String(a)); const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}
function signedGoogleSession(user) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return payload + '.' + signature;
}
function validGoogleSession(req) {
  if (!SESSION_SECRET) return false;
  const token = cookieValue(req, 'inventory_google');
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (!safeEqual(signature, expected)) return false;
  try { const user = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')); return Number(user.exp) > Math.floor(Date.now() / 1000) && Boolean(user.sub); }
  catch { return false; }
}
function googleOAuthReady() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI && SESSION_SECRET);
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function signSession(expiresAt) {
  const payload = String(expiresAt);
  const signature = crypto.createHmac('sha256', DEMO_AUTH_SECRET).update(payload).digest('hex');
  return payload + '.' + signature;
}

function hasValidSession(req) {
  if (validGoogleSession(req)) return true;
  const token = cookieValue(req, 'inventory_demo');
  if (!token) return false;
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

// OAuth 2.0 do Google com state, PKCE e sessão assinada no servidor.
app.get('/auth/google', (req, res) => {
  if (!googleOAuthReady()) return res.status(503).send('Login Google não configurado. Configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI e SESSION_SECRET na Vercel.');
  const state = crypto.randomBytes(32).toString('base64url');
  const verifier = crypto.randomBytes(48).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  const statePayload = Buffer.from(JSON.stringify({ state, verifier, exp: Date.now() + GOOGLE_STATE_SECONDS * 1000 })).toString('base64url');
  const stateSig = crypto.createHmac('sha256', SESSION_SECRET).update(statePayload).digest('base64url');
  res.setHeader('Set-Cookie', 'inventory_oauth=' + encodeURIComponent(statePayload + '.' + stateSig) + '; HttpOnly; Path=/; SameSite=Lax; Max-Age=' + GOOGLE_STATE_SECONDS + secureCookie);
  const params = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: process.env.GOOGLE_REDIRECT_URI, response_type: 'code', scope: 'openid email profile', state, code_challenge: challenge, code_challenge_method: 'S256', access_type: 'online' });
  return res.redirect('https://accounts.google.com/o/oauth2/v2/auth?' + params.toString());
});

app.get('/auth/google/callback', async (req, res) => {
  const clearState = 'inventory_oauth=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0' + secureCookie;
  try {
    if (req.query.error) return res.status(401).send('Autenticação Google cancelada ou recusada. <a href="/">Voltar</a>');
    if (!googleOAuthReady()) return res.status(503).send('Login Google não configurado na Vercel.');
    const stored = cookieValue(req, 'inventory_oauth');
    const [payload, signature] = stored.split('.');
    if (!payload || !signature) throw new Error('Estado OAuth ausente. Inicie o login novamente.');
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
    if (!safeEqual(signature, expected)) throw new Error('Estado OAuth inválido.');
    const transaction = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (transaction.exp < Date.now() || !safeEqual(transaction.state, String(req.query.state || ''))) throw new Error('A validação de segurança expirou. Inicie o login novamente.');
    if (!req.query.code) throw new Error('Código de autorização não recebido do Google.');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code: String(req.query.code), client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: process.env.GOOGLE_REDIRECT_URI, grant_type: 'authorization_code', code_verifier: transaction.verifier }) });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok || !tokens.access_token) throw new Error('O Google não autorizou a sessão. Confira o Client ID, Secret e URI de redirecionamento.');
    const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: 'Bearer ' + tokens.access_token } });
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.sub || !profile.email || profile.email_verified !== true) throw new Error('Não foi possível validar a identidade e o e-mail da conta Google.');
    const session = signedGoogleSession({ sub: profile.sub, email: profile.email, name: profile.name || profile.email, picture: profile.picture || '' });
    res.setHeader('Set-Cookie', [clearState, 'inventory_google=' + encodeURIComponent(session) + '; HttpOnly; Path=/; SameSite=Lax; Max-Age=' + SESSION_SECONDS + secureCookie]);
    return res.redirect(303, '/app');
  } catch (error) {
    res.setHeader('Set-Cookie', clearState);
    return res.status(401).send('Não foi possível concluir o login Google: ' + String(error.message || 'erro inesperado') + ' <a href="/">Tentar novamente</a>');
  }
});

app.get('/api/auth/session', (req, res) => {
  if (!validGoogleSession(req)) return res.status(200).json({ authenticated: false });
  const token = cookieValue(req, 'inventory_google').split('.')[0];
  try { const user = JSON.parse(Buffer.from(token, 'base64url').toString('utf8')); return res.json({ authenticated: true, user: { name: user.name, email: user.email, picture: user.picture } }); }
  catch { return res.json({ authenticated: false }); }
});

// Login demonstrativo legado. Mantenha apenas para ambientes de teste.
app.post('/api/demo-login', (req, res) => {
  const username = String(req.body?.username || '');
  const password = String(req.body?.password || '');
  const userOk = username === DEMO_USERNAME;
  const passOk = password === DEMO_PASSWORD;
  if (!userOk || !passOk) return res.status(401).json({ message: 'Usuário ou senha incorretos.' });

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  res.setHeader('Set-Cookie', 'inventory_demo=' + encodeURIComponent(signSession(expiresAt)) + '; HttpOnly; Path=/; SameSite=Lax; Max-Age=' + SESSION_SECONDS + secureCookie);
  return res.status(200).json({ authenticated: true });
});

app.get('/api/demo-session', (req, res) => {
  res.status(200).json({ authenticated: hasValidSession(req) });
});

app.post('/api/demo-logout', (_req, res) => {
  res.setHeader('Set-Cookie', ['inventory_demo=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0' + secureCookie, 'inventory_google=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0' + secureCookie]);
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
  if (['/health', '/demo-login', '/demo-session', '/demo-logout', '/auth/session'].includes(req.path)) return next();
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
