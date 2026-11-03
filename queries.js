const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// --- SMARTPHONES ---

const getSmartphones = async () => {
    // Esta query complexa junta o smartphone com sua entrega ativa mais recente.
    const query = `
        SELECT 
            s.*,
            json_build_object(
                'nome', e.nome_colaborador,
                'matricula', e.matricula,
                'cc', e.centro_custo,
                'localidade', e.localidade_entrega,
                'ticket', e.ticket,
                'dataEntrega', e.data_entrega
            ) AS entrega,
            (SELECT json_agg(h) FROM entregas h WHERE h.smartphone_id = s.id AND h.is_active = false) AS history
        FROM smartphones s
        LEFT JOIN entregas e ON s.id = e.smartphone_id AND e.is_active = true
        ORDER BY s.created_at DESC;
    `;
    const results = await pool.query(query);
    // O campo 'history' pode ser nulo se não houver histórico, então garantimos que seja um array vazio.
    return results.rows.map(row => ({
        ...row,
        history: row.history || []
    }));
};

const addSmartphone = async (body) => {
    const { imei1, imei2, sn, modelo, localidade, photoName, dataEntrada } = body;
    const result = await pool.query(
        'INSERT INTO smartphones (imei1, imei2, serial_number, modelo, localidade, photo_name, data_entrada, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [imei1, imei2, sn, modelo, localidade, photoName, dataEntrada, 'Disponível']
    );
    return result.rows[0];
};

const updateSmartphone = async (id, body) => {
    const { modelo, localidade, dataEntrada } = body;
    const result = await pool.query(
        'UPDATE smartphones SET modelo = $1, localidade = $2, data_entrada = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
        [modelo, localidade, dataEntrada, id]
    );
    return result.rows[0];
};

const deleteSmartphone = async (id) => {
    await pool.query('DELETE FROM smartphones WHERE id = $1', [id]);
    return { status: 'success', message: `Smartphone com ID ${id} deletado.` };
};

const deliverSmartphone = async (id, body) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // 1. Atualiza o status do smartphone e limpa data de devolução/envio
        await client.query(
            "UPDATE smartphones SET status = 'Entregue', data_devolucao = NULL, data_envio = NULL, updated_at = NOW() WHERE id = $1",
            [id]
        );
        // 2. Insere o novo registro de entrega como ativo
        const { nome, matricula, cc, localidade, ticket, dataEntrega } = body;
        await client.query(
            'INSERT INTO entregas (smartphone_id, nome_colaborador, matricula, centro_custo, localidade_entrega, ticket, data_entrega, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)',
            [id, nome, matricula, cc, localidade, ticket, dataEntrega]
        );
        await client.query('COMMIT');
        return { status: 'success', message: 'Aparelho entregue com sucesso.' };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

// --- TERMOS ---

const getTermos = async () => {
    const results = await pool.query('SELECT * FROM termos ORDER BY created_at DESC');
    return results.rows;
};

const addTermo = async (body) => {
    const { modeloTermo, ticket, nome, matricula, local, marcaModelo, imei1, imei2, sn, chip, cc } = body;
    const result = await pool.query(
        'INSERT INTO termos (modelo_termo, ticket, nome_colaborador, matricula, local_colaborador, centro_custo, marca_modelo_aparelho, imei1, imei2, serial_number, chip_iccid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [modeloTermo, ticket, nome, matricula, local, cc, marcaModelo, imei1, imei2, sn, chip]
    );
    return result.rows[0];
};

// --- CONFIGURAÇÕES (Modelos, Localidades, etc.) ---

const getModels = async () => (await pool.query('SELECT * FROM modelos ORDER BY nome')).rows;
const getLocalities = async () => (await pool.query('SELECT * FROM localidades ORDER BY nome')).rows;

module.exports = {
    getSmartphones,
    addSmartphone,
    updateSmartphone,
    deleteSmartphone,
    deliverSmartphone,
    getTermos,
    addTermo,
    getModels,
    getLocalities,
};