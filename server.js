require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./queries');

const app = express();
const PORT = process.env.API_PORT || 3000;

// --- Middlewares ---
const path = require('path');

// Habilita o CORS para que a interface possa fazer requisições para esta API
app.use(cors());
app.use(express.json());

// Entrega os arquivos da interface web (HTML, CSS, JS e recursos estáticos).
app.use(express.static(__dirname));

// Página inicial do sistema.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'celular.rubertt.html'));
});

// Rota de verificação da API
app.get('/api/health', (req, res) => {
    res.json({ info: 'API do Inventário de Celulares no ar!' });
});

// --- Rotas da API ---

// --- ROTAS DE SMARTPHONES ---

app.get('/api/smartphones', async (req, res) => {
    try {
        const smartphones = await db.getSmartphones();
        res.status(200).json(smartphones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/smartphones', async (req, res) => {
    try {
        const newSmartphone = await db.addSmartphone(req.body);
        res.status(201).json(newSmartphone);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/smartphones/:id', async (req, res) => {
    try {
        const updatedSmartphone = await db.updateSmartphone(req.params.id, req.body);
        res.status(200).json(updatedSmartphone);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/smartphones/:id', async (req, res) => {
    try {
        await db.deleteSmartphone(req.params.id);
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para vincular/entregar um aparelho
app.post('/api/smartphones/:id/deliver', async (req, res) => {
    try {
        // O corpo da requisição terá os dados do termo (nome, matricula, etc.)
        // E os dados da entrega (data, etc.)
        const termoData = req.body.termo;
        const entregaData = { ...termoData, dataEntrega: new Date().toISOString() };

        // Primeiro, salva o termo no histórico de termos
        await db.addTermo(termoData);
        
        // Depois, atualiza o status do smartphone e cria o registro de entrega
        const result = await db.deliverSmartphone(req.params.id, entregaData);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROTAS DE TERMOS ---

app.get('/api/termos', async (req, res) => {
    try {
        const termos = await db.getTermos();
        res.status(200).json(termos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Inicialização do Servidor ---

app.listen(PORT, () => {
    console.log(`Servidor da API rodando na porta ${PORT}.`);
});