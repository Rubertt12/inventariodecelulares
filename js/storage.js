/* Módulo 2/7 — extraído de app.js. Ordem de carregamento obrigatória. */
async function connectToDirectory(handle) {
    if (!handle) return false;

    // Verifica se temos permissão. Se não, o navegador pode pedir ao usuário.
    if ((await handle.queryPermission({ mode: 'readwrite' })) !== 'granted') {
        if ((await handle.requestPermission({ mode: 'readwrite' })) !== 'granted') {
            showCustomAlert('Permissão para acessar a pasta foi negada.', 'error');
            updateConnectionStatusUI(false);
            return false;
        }
    }

    dirHandle = handle;

    // --- NOVA LÓGICA DE MIGRAÇÃO E CARREGAMENTO DO BANCO DE DADOS ---
    let isMigrated = false;
    let jsonFileHandle = null;
    try {
        jsonFileHandle = await dirHandle.getFileHandle('banco.json');
    } catch (error) {
        if (error.name !== 'NotFoundError') throw error;
    }

    if (jsonFileHandle) {
        const jsonFile = await jsonFileHandle.getFile();
        const jsonText = await jsonFile.text();
        if (!parseStockJSON(jsonText)) {
            dirHandle = null;
            updateConnectionStatusUI(false);
            return false;
        }
    } else {
        try {
            const txtFileHandle = await dirHandle.getFileHandle('banco.txt');
            const txtFile = await txtFileHandle.getFile();
            const txtText = await txtFile.text();
            parseTXT(txtText);

            if (stockData.length > 0) {
                await saveStockData();
                await dirHandle.move('banco.txt', 'banco.txt.migrated');
                isMigrated = true;
            }
        } catch (txtError) {
            if (txtError.name !== 'NotFoundError') {
                stockData = [];
                dirHandle = null;
                updateConnectionStatusUI(false);
                showCustomAlert('Não foi possível carregar o banco de dados legado.', 'error');
                return false;
            }
            stockData = [];
            console.log("Nenhum arquivo de banco de dados (.txt ou .json) encontrado. Começando um novo.");
        }
    }

    const fileHandleTermos = await dirHandle.getFileHandle('termos.txt', { create: true });
    const fileTermos = await fileHandleTermos.getFile();
    const textTermos = await fileTermos.text();
    parseTermosTXT(textTermos);

    const fileHandleModels = await dirHandle.getFileHandle('models.json', { create: true });
    const fileModels = await fileHandleModels.getFile();
    const textModels = await fileModels.text();
    parseModelsJSON(textModels);

    const fileHandleLocalities = await dirHandle.getFileHandle('localities.json', { create: true });
    const fileLocalities = await fileHandleLocalities.getFile();
    const textLocalities = await fileLocalities.text();
    parseLocalitiesJSON(textLocalities);

    // NOVO: Carrega filtros personalizados
    const fileHandleFilters = await dirHandle.getFileHandle('filters.json', { create: true });
    const fileFilters = await fileHandleFilters.getFile();
    const textFilters = await fileFilters.text();
    parseFiltersJSON(textFilters);

    // NOVO: Carrega o arquivo de termos já gerados
    const fileHandleGenerated = await dirHandle.getFileHandle('gerados.json', { create: true });
    const fileGenerated = await fileHandleGenerated.getFile();
    const textGenerated = await fileGenerated.text();
    parseGeneratedJSON(textGenerated);

    updateConnectionStatusUI(true, dirHandle.name);

    if (isMigrated) {
        showCustomAlert('Banco de dados migrado para o novo formato (.json) com sucesso!', 'success');
    }

    renderAllUI();
    return true;
}

async function handleConnectClick() {
    const buttons = [btnConnectDir, btnConnectDirSettings].filter(Boolean);
    const previousLabels = buttons.map(button => button === btnConnectDir
        ? button.querySelector('.btn-text')?.textContent
        : button.textContent);
    buttons.forEach(button => {
        button.disabled = true;
        if (button === btnConnectDir) {
            const label = button.querySelector('.btn-text');
            if (label) label.textContent = 'Abrindo seletor...';
        } else {
            button.textContent = 'Abrindo seletor...';
        }
    });

    try {
        let handle;
        if (desktopFiles) {
            const directory = await desktopFiles.chooseDirectory();
            if (!directory) return;
            handle = new DesktopDirectoryHandle('', directory.name);
        } else if (window.showDirectoryPicker && window.isSecureContext) {
            try {
                handle = await window.showDirectoryPicker({ mode: 'readwrite' });
            } catch (pickerError) {
                // Em navegadores móveis e WebViews, o seletor pode existir mas ser bloqueado pelo contexto.
                // Cancelamento continua sendo respeitado; nos demais casos, oferecemos armazenamento local.
                if (pickerError.name === 'AbortError') throw pickerError;
                console.warn('Não foi possível abrir o seletor de pastas neste navegador. Usando armazenamento local.', pickerError);
                handle = new LocalDirectoryHandle();
            }
        } else {
            // Fallback para HTTP, navegadores móveis e WebViews sem suporte ao seletor de diretórios.
            handle = new LocalDirectoryHandle();
        }

        if (await connectToDirectory(handle)) {
            if (!desktopFiles) await idb.set('dirHandle', handle instanceof LocalDirectoryHandle ? LOCAL_STORAGE_SENTINEL : handle);
            showCustomAlert(handle instanceof LocalDirectoryHandle
                ? 'Armazenamento local ativado. Os dados ficam salvos neste navegador e neste dispositivo.'
                : 'Pasta vinculada e salva para futuras sessões!', 'success');
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error(err);
            showCustomAlert(`Falha ao vincular a pasta: ${err.message}`, 'error');
        }
    } finally {
        buttons.forEach((button, index) => {
            button.disabled = false;
            if (button === btnConnectDir) {
                const label = button.querySelector('.btn-text');
                if (label) label.textContent = previousLabels[index] || 'Vincular Pasta';
            } else {
                button.textContent = previousLabels[index] || 'Vincular Pasta';
            }
        });
    }
};

btnConnectDir.addEventListener('click', handleConnectClick);
if (btnConnectDirSettings) {
    btnConnectDirSettings.addEventListener('click', handleConnectClick);
}

async function saveModelsToJSONFile() {
    if (!dirHandle) return;
    try {
        const fileHandle = await dirHandle.getFileHandle('models.json', { create: true });
        const jsonContent = JSON.stringify(phoneModels, null, 2);
        const writable = await fileHandle.createWritable();
        await writable.write(jsonContent);
        await writable.close();
    } catch (e) {
        console.error('Erro ao salvar o arquivo models.json:', e);
        showCustomAlert('Não foi possível salvar a lista de modelos.', 'error');
        throw e;
    }
}

async function saveLocalitiesToJSONFile() {
    if (!dirHandle) return;
    try {
        const fileHandle = await dirHandle.getFileHandle('localities.json', { create: true });
        const jsonContent = JSON.stringify(localities, null, 2);
        const writable = await fileHandle.createWritable();
        await writable.write(jsonContent);
        await writable.close();
    } catch (e) {
        console.error('Erro ao salvar o arquivo localities.json:', e);
        showCustomAlert('Não foi possível salvar a lista de localidades.', 'error');
        throw e;
    }
}

async function saveFiltersToJSONFile() {
    if (!dirHandle) return;
    try {
        const fileHandle = await dirHandle.getFileHandle('filters.json', { create: true });
        const jsonContent = JSON.stringify(customFilters, null, 2);
        const writable = await fileHandle.createWritable();
        await writable.write(jsonContent);
        await writable.close();
    } catch (e) {
        console.error('Erro ao salvar o arquivo filters.json:', e);
        showCustomAlert('Não foi possível salvar a lista de filtros.', 'error');
        throw e;
    }
}


async function saveStockData() {
    if (!dirHandle) return;
    try {
        // O nome do arquivo agora é banco.json
        const fileHandle = await dirHandle.getFileHandle('banco.json', { create: true });
        // Converte todo o array de dados em uma string JSON formatada
        const jsonContent = JSON.stringify(stockData, null, 2);
        const writable = await fileHandle.createWritable();
        await writable.write(jsonContent);
        await writable.close();
    } catch (e) {
        console.error('Erro ao salvar o arquivo banco.json:', e);
        showCustomAlert('Não foi possível salvar o banco de dados principal.', 'error');
        throw e;
    }
}

async function saveToTermosTXTFile() {
    if (!dirHandle) return;
    try {
        const fileHandle = await dirHandle.getFileHandle('termos.txt', { create: true }); // NOVO: Cria o arquivo se não existir
        let txtLines = [];
        txtLines.push("MODELO_TERMO;TICKET;NOME;MATRICULA;LOCAL;MARCA_MODELO;IMEI1;IMEI2;SN;CHIP;CC;TECNICO;");
 
        termosData.forEach(item => {
           txtLines.push(`${item.modeloTermo || ''};${item.ticket || ''};${item.nome || ''};${item.matricula || ''};${item.local || ''};${item.marcaModelo || ''};${item.imei1 || ''};${item.imei2 || ''};${item.sn || ''};${item.chip || ''};${item.cc || ''};${item.nomeTecnico || ''};`);
        });

        const txtContent = "\ufeff" + txtLines.join("\n");
        const writable = await fileHandle.createWritable();
        await writable.write(txtContent);
        await writable.close();
    } catch (e) {
        console.error('Erro ao salvar o arquivo termos.txt:', e);
        showCustomAlert('Não foi possível salvar o histórico de termos.', 'error');
        throw e;
    }
}

async function saveToTermosCSVFile() {
    if (!dirHandle) return;
    try {
        const fileHandle = await dirHandle.getFileHandle('termos.csv', { create: true }); // NOVO: Cria o arquivo se não existir
        let csvLines = [];
        csvLines.push("MODELO_TERMO;TICKET;NOME;MATRICULA;LOCAL;MARCA_MODELO;IMEI1;IMEI2;SN;CHIP;CC;TECNICO");

        termosData.forEach(item => {
           csvLines.push(
               `${item.modeloTermo || ''};${item.ticket || ''};${item.nome || ''};${item.matricula || ''};${item.local || ''};${item.marcaModelo || ''};="""${item.imei1 || ''}""";="""${item.imei2 || ''}""";="""${item.sn || ''}""";${item.chip || ''};${item.cc || ''};${item.nomeTecnico || ''}`
           );
        });
 
        // O BOM \ufeff ajuda o Excel a abrir o CSV com a codificação correta (UTF-8)
        const csvContent = "\ufeff" + csvLines.join("\n");
        const writable = await fileHandle.createWritable();
        await writable.write(csvContent);
        await writable.close();
    } catch (e) {
        console.error('Erro ao salvar o arquivo termos.csv:', e);
        showCustomAlert('Não foi possível salvar o arquivo CSV de termos.', 'error');
        throw e;
    }
}

async function saveGeneratedPdfsToJSONFile() {
    if (!dirHandle) return;
    try {
        const fileHandle = await dirHandle.getFileHandle('gerados.json', { create: true });
        const jsonContent = JSON.stringify(generatedPdfIds, null, 2);
        const writable = await fileHandle.createWritable();
        await writable.write(jsonContent);
        await writable.close();
    } catch (e) {
        console.error('Erro ao salvar o arquivo gerados.json:', e);
        showCustomAlert('Não foi possível salvar a lista de PDFs gerados.', 'error');
        throw e;
    }
}

// --- NOVA FUNÇÃO: Analisa o novo formato de banco de dados JSON ---
function parseStockJSON(text) {
    if (!text) {
        showCustomAlert("O arquivo banco.json está vazio. Os dados não foram alterados.", "error");
        return false;
    }

    try {
        const data = JSON.parse(text);
        if (!Array.isArray(data)) {
            throw new Error('O conteúdo do banco.json não é uma lista.');
        }

        data.forEach(item => {
            if (item.dataEnvio === "[]") item.dataEnvio = null;
        });
        stockData = data;
        imageCache.clear();
        return true;
    } catch (e) {
        console.error("Erro ao analisar o arquivo banco.json. O arquivo pode estar corrompido.", e);
        showCustomAlert("Falha ao ler o banco de dados. O arquivo pode estar corrompido; os dados não foram alterados.", "error");
        return false;
    }
}

async function getPhotoDirHandle() {
    if (!dirHandle) return null;
    // Retorna o handle para a pasta 'fotofiles', criando-a se não existir.
    return await dirHandle.getDirectoryHandle('fotofiles', { create: true });
}

async function saveImageToFolder(filename, blob) {
    const photoDir = await getPhotoDirHandle();
    if (!photoDir || !blob) return;
    try {
        const fileHandle = await photoDir.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
    } catch (e) {
        console.error('Erro ao salvar a foto do aparelho:', e);
        showCustomAlert('Não foi possível salvar a foto do aparelho.', 'error');
        throw e;
    }
}

async function getImageUrl(filename) {
    const photoDir = await getPhotoDirHandle();
    if (!filename || !photoDir) return null;
    if (imageCache.has(filename)) return imageCache.get(filename);

    try {
        const fileHandle = await photoDir.getFileHandle(filename);
        const file = await fileHandle.getFile();
        const url = URL.createObjectURL(file);
        imageCache.set(filename, url);
        return url;
    } catch (e) {
        return null; 
    }
}

async function deleteImageFromFolder(filename) {
    const photoDir = await getPhotoDirHandle();
    if (!photoDir || !filename) return;
    try {
        await photoDir.removeEntry(filename);
        imageCache.delete(filename);
    } catch (e) {
        console.log("Arquivo físico removido.");
    }
}

function parseModelsJSON(text) {
    if (!text) {
        return; // Usa o padrão se o arquivo estiver vazio
    }
    try {
        const loadedModels = JSON.parse(text);
        if(Array.isArray(loadedModels) && loadedModels.length > 0) phoneModels = loadedModels;
    } catch (e) {
        console.error("Erro ao carregar models.json, usando padrão.", e);
    }
}

function parseLocalitiesJSON(text) {
    if (!text) {
        return;
    }
    try {
        const loadedLocalities = JSON.parse(text);
        if(Array.isArray(loadedLocalities) && loadedLocalities.length > 0) localities = loadedLocalities;
    } catch (e) {
        console.error("Erro ao carregar localities.json, usando padrão.", e);
    }
}

function parseFiltersJSON(text) {
    if (!text) {
        return; // Usa o padrão (vazio) se o arquivo estiver vazio
    }
    try {
        const loadedFilters = JSON.parse(text);
        if(Array.isArray(loadedFilters)) {
            customFilters = loadedFilters;
        }
    } catch (e) {
        console.error("Erro ao carregar filters.json, usando padrão.", e);
    }
}

function parseGeneratedJSON(text) {
    generatedPdfIds = [];
    if (!text) return;
    try {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
            generatedPdfIds = data;
        }
    } catch (e) {
        console.error("Erro ao analisar o arquivo gerados.json.", e);
    }
}

function cleanCSVField(field) {
    if (!field) return '';
    // Remove todos os caracteres de aspas e igual do início e do fim do campo.
    return field.replace(/^[="]+/, '').replace(/[="]+$/, '');
}

function parseTXT(text) {
    stockData = [];
    imageCache.clear();
    if (!text) return;

    const lines = text.split("\n");
    if (lines.length <= 1) return; // Se o arquivo está vazio ou só tem cabeçalho

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(";");
        // NOVO: Ajusta o número mínimo de colunas para incluir o novo campo nomeTecnico e os campos subsequentes
        if (cols.length < 18) continue; // 17 é o índice do último campo (history), então precisamos de 18 colunas

        stockData.push({
            id: Date.now() + Math.random(),
            imei1: cleanCSVField(cols[0]), 
            imei2: cleanCSVField(cols[1]), 
            sn: cleanCSVField(cols[2]),
            modelo: cols[3] || 'A56', // NOVO: Mantém o padrão
            localidade: cols[4] || 'Canoas',
            photoName: cols[5] || null,
            status: cols[6] || 'Disponível',
            entrega: {
                nome: cols[7] || '',
                cc: cols[8] || '',
                matricula: cols[9] || '',
                localidade: cols[10] || '',
                ticket: cols[11] || '', // NOVO: Mantém o índice
                dataEntrega: cols[12] || null, // NOVO: Mantém o índice
                nomeTecnico: cols[13] || '' // NOVO: Adiciona o nome do técnico
            },
            dataEntrada: cols[14] || new Date().toISOString(), // NOVO: Índice ajustado
            dataDevolucao: cols[15] || null, // NOVO: Índice ajustado
            dataEnvio: cols[16] === "[]" ? null : cols[16], // NOVO: Índice ajustado
            history: cols[17] ? JSON.parse(cols[17]) : [] // NOVO: Índice ajustado
        });
    }
}

function parseTermosTXT(text) {
    termosData = [];
    if (!text) return;

    const lines = text.split("\n");
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(";");
        // Ajusta o número de colunas para o formato simplificado (12 colunas)
        if (cols.length < 12) {
            console.warn(`Linha ignorada em termos.txt devido a colunas insuficientes: ${line}`);
            continue;
        }

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
            cc: cols[10], 
            nomeTecnico: cols[11] || ''
        });
    }
}

function normalizeText(text = '') {
    return text.toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getFilteredStock() {
    const searchTerm = normalizeText(inputSearchStock ? inputSearchStock.value : '');
    
    // Filtra itens devolvidos da visualização principal de estoque
    let filtered = stockData.filter(item => item.status !== 'Devolvido');

    // --- ALTERADO: Lógica de filtro para incluir "Todos" e localidade principal dinâmica ---
    const primaryLocationNormalized = normalizeText(appSettings.primaryLocation);

    if (currentLocationFilter !== 'Todos') {
        if (currentLocationFilter === appSettings.primaryLocation) {
            filtered = filtered.filter(item => normalizeText(item.localidade || appSettings.primaryLocation) === primaryLocationNormalized && item.status !== 'Enviado');
        } else if (currentLocationFilter === 'Outras') {
            filtered = filtered.filter(item => normalizeText(item.localidade || appSettings.primaryLocation) !== primaryLocationNormalized && item.status !== 'Enviado');
        } else if (currentLocationFilter === 'Disponíveis') {
            filtered = filtered.filter(item => item.status === 'Disponível');
        } else if (currentLocationFilter === 'Enviados') {
            filtered = filtered.filter(item => item.status === 'Enviado');
        } else {
            // NOVO: Verifica se é um filtro personalizado
            const customFilter = customFilters.find(f => f.name === currentLocationFilter);
            if (customFilter) {
                const customTerm = normalizeText(customFilter.term);
                // Busca o termo do filtro personalizado em todos os campos do item
                filtered = filtered.filter(item => Object.values(item).some(val => normalizeText(val).includes(customTerm)));
            }
        }
    }

    // --- ALTERADO: Lógica de busca aprimorada ---
    // Agora, a busca também funciona para os dados de entrega do colaborador.
    return filtered.filter(item => {
        if (!searchTerm) return true;

        const entrega = item.entrega || {};

        return normalizeText(item.imei1).includes(searchTerm) ||
               normalizeText(item.imei2).includes(searchTerm) ||
               normalizeText(item.sn).includes(searchTerm) ||
               normalizeText(item.localidade).includes(searchTerm) ||
               normalizeText(item.modelo).includes(searchTerm) ||
               (item.status === 'Entregue' && (normalizeText(entrega.nome).includes(searchTerm) || normalizeText(entrega.matricula).includes(searchTerm) || normalizeText(entrega.cc).includes(searchTerm) || normalizeText(entrega.ticket).includes(searchTerm)))

    });
}
