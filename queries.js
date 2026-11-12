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



// --- GESTÃO UNIVERSAL DE ATIVOS (tenant demonstrativo resolvido no servidor) ---
const getAssetCategories = async (companyId) => {
  const result = await pool.query(
    "SELECT c.id, c.category_key, c.name, c.description, c.icon, " +
    "COALESCE(json_agg(json_build_object('id', f.id, 'field_key', f.field_key, 'label', f.label, 'data_type', f.data_type, 'options', f.options, 'is_required', f.is_required, 'show_in_list', f.show_in_list) ORDER BY f.sort_order) FILTER (WHERE f.id IS NOT NULL), '[]'::json) AS fields " +
    "FROM asset_categories c LEFT JOIN asset_field_definitions f ON f.category_id = c.id AND f.company_id = c.company_id AND f.is_active = TRUE " +
    "WHERE c.company_id = $1 AND c.is_active = TRUE GROUP BY c.id ORDER BY c.sort_order, c.name", [companyId]);
  return result.rows;
};

const getUniversalAssets = async (companyId, filters = {}) => {
  const values = [companyId];
  let where = 'a.company_id = $1';
  if (filters.categoryId) {
    values.push(filters.categoryId);
    where += ' AND a.category_id = $' + values.length;
  }
  if (filters.search) {
    values.push('%' + String(filters.search).replace(/[\\%_]/g, '\\$&') + '%');
    const p = '$' + values.length;
    where += ' AND (a.asset_tag ILIKE ' + p + ' OR a.serial_number ILIKE ' + p +
      ' OR a.model ILIKE ' + p + ' OR a.manufacturer ILIKE ' + p + ' OR a.assigned_to_name ILIKE ' + p + ')';
  }
  const result = await pool.query(
    "SELECT a.id, a.asset_tag, a.serial_number, a.manufacturer, a.model, a.status, a.location, a.assigned_to_name, a.assigned_to_identifier, a.purchase_date, a.warranty_until, a.notes, a.created_at, c.id AS category_id, c.name AS category_name, c.category_key, " +
    "COALESCE((SELECT json_object_agg(fd.field_key, cv.value) FROM asset_custom_values cv JOIN asset_field_definitions fd ON fd.id = cv.field_definition_id WHERE cv.asset_id = a.id AND cv.company_id = a.company_id), '{}'::json) AS custom_values " +
    "FROM assets a JOIN asset_categories c ON c.id = a.category_id AND c.company_id = a.company_id " +
    "WHERE " + where + " ORDER BY a.created_at DESC LIMIT 500", values);
  return result.rows;
};

const createUniversalAsset = async (companyId, body) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const category = await client.query('SELECT id FROM asset_categories WHERE id = $1 AND company_id = $2 AND is_active = TRUE', [body.category_id, companyId]);
    if (!category.rowCount) {
      const error = new Error('Categoria inválida.');
      error.status = 400;
      throw error;
    }
    const inserted = await client.query(
      'INSERT INTO assets (company_id, category_id, asset_tag, serial_number, manufacturer, model, status, location, assigned_to_name, assigned_to_identifier, purchase_date, warranty_until, notes) ' +
      'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id',
      [companyId, body.category_id, body.asset_tag || null, body.serial_number || null, body.manufacturer || null, body.model || null, body.status || 'available', body.location || null, body.assigned_to_name || null, body.assigned_to_identifier || null, body.purchase_date || null, body.warranty_until || null, body.notes || null]);
    const assetId = inserted.rows[0].id;
    const definitions = await client.query('SELECT id, field_key, data_type, is_required FROM asset_field_definitions WHERE company_id = $1 AND category_id = $2 AND is_active = TRUE', [companyId, body.category_id]);
    const supplied = body.custom_values && typeof body.custom_values === 'object' ? body.custom_values : {};
    for (const field of definitions.rows) {
      const value = supplied[field.field_key];
      if (field.is_required && (value === undefined || value === null || value === '')) {
        const error = new Error('Preencha o campo obrigatório: ' + field.field_key);
        error.status = 400;
        throw error;
      }
      if (value !== undefined && value !== null && value !== '') {
        await client.query('INSERT INTO asset_custom_values (company_id, asset_id, field_definition_id, value) VALUES ($1,$2,$3,$4::jsonb)', [companyId, assetId, field.id, JSON.stringify(value)]);
      }
    }
    await client.query("INSERT INTO asset_movements (company_id, asset_id, movement_type, to_status, to_location, to_responsible, notes) VALUES ($1,$2,'created',$3,$4,$5,'Cadastro inicial')", [companyId, assetId, body.status || 'available', body.location || null, body.assigned_to_name || null]);
    await client.query('COMMIT');
    return { id: assetId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

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
    getAssetCategories,
    getUniversalAssets,
    createUniversalAsset,
};