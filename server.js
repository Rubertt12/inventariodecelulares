require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./queries');

const app = express();
const PORT = process.env.API_PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Interface e recursos estáticos ficam centralizados em /public.
// O includeFiles do vercel.json garante que essa pasta acompanhe a Function.
app.use(express.static(PUBLIC_DIR, {
  dotfiles: 'deny',
  index: false
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Página inicial do sistema.
app.get('/', (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'celular.rubertt.html'));
});

// Health check separado da interface.
app.get('/api/health', (_req, res) => {
  res.status(200).json({ info: 'API do Inventário de Celulares no ar!' });
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

// Exporta o Express para a Vercel; no uso local, inicia o listener.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor do Inventário rodando na porta ${PORT}.`));
}

module.exports = app;
