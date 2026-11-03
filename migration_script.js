require('dotenv').config();
const fs = require('fs').promises;
const { Pool } = require('pg');

// Configuração do Pool de Conexão com o PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

/**
 * Lê e analisa um arquivo JSON.
 * @param {string} filePath - O caminho para o arquivo JSON.
 * @returns {Promise<any>} - O conteúdo do JSON analisado.
 */
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Aviso: Arquivo ${filePath} não encontrado, pulando.`);
      return [];
    }
    throw error;
  }
}

/**
 * Analisa o arquivo de termos (termos.txt).
 * @param {string} filePath - O caminho para o arquivo de termos.
 * @returns {Promise<Array<object>>} - Um array de objetos de termos.
 */
async function parseTermosTXT(filePath) {
    try {
        const text = await fs.readFile(filePath, 'utf8');
        const termosData = [];
        const lines = text.split("\n");
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const cols = line.split(";");
            if (cols.length < 11) continue;

            termosData.push({
                modeloTermo: cols[0], 
                ticket: cols[1], 
                nome: cols[2], 
                matricula: cols[3], 
                local: cols[4],
                marcaModelo: cols[5], 
                imei1: cols[6], 
                imei2: cols[7], 
                sn: cols[8],
                chip: cols[9], 
                cc: cols[10]
            });
        }
        return termosData;
    } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`Aviso: Arquivo ${filePath} não encontrado, pulando.`);
          return [];
        }
        throw error;
    }
}

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Iniciando migração...');

    // 1. Migrar Localidades
    console.log('Migrando localidades...');
    const localities = await readJsonFile('localities.json');
    if (localities.length > 0) {
        const localityValues = localities.map(name => `('${name.replace(/'/g, "''")}')`).join(',');
        await client.query(`INSERT INTO localidades (nome) VALUES ${localityValues} ON CONFLICT (nome) DO NOTHING`);
    }
    console.log(`${localities.length} localidades migradas.`);

    // 2. Migrar Modelos
    console.log('Migrando modelos de telefone...');
    const phoneModels = await readJsonFile('models.json');
    if (phoneModels.length > 0) {
        for (const model of phoneModels) { // Usar loop para ON CONFLICT com UPDATE
          await client.query('INSERT INTO modelos (nome, base_termo) VALUES ($1, $2) ON CONFLICT (nome) DO UPDATE SET base_termo = EXCLUDED.base_termo', [model.name, model.base]);
        }
    }
    console.log(`${phoneModels.length} modelos migrados.`);

    // 3. Migrar Filtros Personalizados
    console.log('Migrando filtros personalizados...');
    const customFilters = await readJsonFile('filters.json');
    if (customFilters.length > 0) {
        for (const filter of customFilters) { // Usar loop para ON CONFLICT com UPDATE
          await client.query('INSERT INTO filtros_personalizados (nome, termo_busca) VALUES ($1, $2) ON CONFLICT (nome) DO UPDATE SET termo_busca = EXCLUDED.termo_busca', [filter.name, filter.term]);
        }
    }
    console.log(`${customFilters.length} filtros personalizados migrados.`);

    // 4. Migrar Termos
    console.log('Migrando histórico de termos...');
    const termosData = await parseTermosTXT('termos.txt');
    // Limpa a tabela antes de inserir para evitar duplicatas se o script for rodado novamente
    await client.query('TRUNCATE TABLE termos RESTART IDENTITY'); 
    if (termosData.length > 0) {
        for (const termo of termosData) { // Inserir um por um para melhor tratamento de dados
          await client.query(
            `INSERT INTO termos (modelo_termo, ticket, nome_colaborador, matricula, local_colaborador, centro_custo, marca_modelo_aparelho, imei1, imei2, serial_number, chip_iccid)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [termo.modeloTermo, termo.ticket, termo.nome, termo.matricula, termo.local, termo.cc, termo.marcaModelo, termo.imei1, termo.imei2, termo.sn, termo.chip]
          );
        }
    }
    console.log(`${termosData.length} registros de termos migrados.`);

    // 5. Migrar Smartphones e Entregas (o mais complexo)
    console.log('Migrando smartphones e histórico de entregas...');
    const stockData = await readJsonFile('banco.json');
    // Limpa as tabelas relacionadas para evitar duplicatas
    await client.query('TRUNCATE TABLE smartphones RESTART IDENTITY CASCADE');

    let smartphonesMigrados = 0;
    let entregasMigradas = 0;

    for (const item of stockData) {
      // Insere o smartphone
      const res = await client.query(
        `INSERT INTO smartphones (imei1, imei2, serial_number, modelo, localidade, photo_name, status, data_entrada, data_devolucao, data_envio)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (serial_number) DO UPDATE SET
           imei1 = EXCLUDED.imei1,
           modelo = EXCLUDED.modelo,
           status = EXCLUDED.status,
           updated_at = NOW()
         RETURNING id`,
        [
          item.imei1 || null,
          item.imei2 || null,
          item.sn,
          item.modelo || null,
          item.localidade || null,
          item.photoName || null,
          item.status || 'Disponível',
          item.dataEntrada || null,
          item.dataDevolucao || null,
          item.dataEnvio === "[]" ? null : item.dataEnvio // Corrige dado legado
        ]
      );

      if (res.rows.length === 0) {
          console.log(`Aviso: Smartphone com SN ${item.sn} já existe ou não pôde ser inserido. Pulando.`);
          continue;
      }
      smartphonesMigrados++;
      const smartphoneId = res.rows[0].id;

      // Insere a entrega ativa, se houver
      if (item.status === 'Entregue' && item.entrega && item.entrega.nome) {
        await client.query(
          `INSERT INTO entregas (smartphone_id, nome_colaborador, matricula, centro_custo, localidade_entrega, ticket, data_entrega, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
          [smartphoneId, item.entrega.nome, item.entrega.matricula, item.entrega.cc, item.entrega.localidade, item.entrega.ticket, item.entrega.dataEntrega]
        );
        entregasMigradas++;
      }

      // Insere o histórico de entregas
      if (item.history && item.history.length > 0) {
        for (const hist of item.history) {
          if (hist.nome) { // Garante que não estamos inserindo entradas de histórico vazias
            await client.query(
              `INSERT INTO entregas (smartphone_id, nome_colaborador, matricula, centro_custo, localidade_entrega, ticket, data_entrega, data_devolucao, is_active)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE)`,
              [smartphoneId, hist.nome, hist.matricula, hist.cc, hist.localidade, hist.ticket, hist.dataEntrega, hist.dataDevolucao || null]
            );
            entregasMigradas++;
          }
        }
      }
    }
    console.log(`${smartphonesMigrados} smartphones e ${entregasMigradas} registros de entrega migrados.`);

    await client.query('COMMIT');
    console.log('Migração concluída com sucesso!');

  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Erro durante a migração. As alterações foram revertidas.', e);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();