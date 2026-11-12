/* Módulo 7/7 — extraído de app.js. Ordem de carregamento obrigatória. */
async function ensureJSZipLoaded() {
    if (window.JSZip) return window.JSZip;
    await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Não foi possível carregar o leitor de arquivos ZIP.'));
        document.head.appendChild(script);
    });
    if (!window.JSZip) throw new Error('Biblioteca ZIP indisponível.');
    return window.JSZip;
}

async function importCollectorZip(file) {
    if (!dirHandle) {
        showCustomAlert('Vincule o armazenamento primeiro antes de importar o lote.', 'warning');
        return;
    }
    const JSZip = await ensureJSZipLoaded();
    const zip = await JSZip.loadAsync(file);
    const manifestFile = zip.file('manifest.json');
    if (!manifestFile) throw new Error('ZIP sem manifest.json. Gere o pacote pelo Coletor de Aparelhos atualizado.');
    const manifest = JSON.parse(await manifestFile.async('string'));
    if (manifest.format !== 'inventario-celulares-v1' || !Array.isArray(manifest.items)) {
        throw new Error('Formato de lote não reconhecido.');
    }
    const digitsOnly = value => String(value || '').replace(/\\D/g, '');
    const norm = value => String(value || '').trim().toLowerCase();
    let added = 0, skipped = 0, photosFailed = 0;
    for (const record of manifest.items) {
        const photoFile = record.photo && zip.file(record.photo);
        if (!photoFile) { skipped++; continue; }
        const imei1 = digitsOnly(record.imei).slice(0, 15);
        const imei2 = digitsOnly(record.imei2).slice(0, 15);
        const sn = String(record.sn || '').trim();
        const duplicate = stockData.some(item =>
            (imei1 && [digitsOnly(item.imei1), digitsOnly(item.imei2)].includes(imei1)) ||
            (imei2 && [digitsOnly(item.imei1), digitsOnly(item.imei2)].includes(imei2)) ||
            (sn && norm(item.sn) === norm(sn))
        );
        if (duplicate) { skipped++; continue; }
        const photoBlob = await photoFile.async('blob');
        const photoName = 'coleta_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.jpg';
        try {
            await saveImageToFolder(photoName, photoBlob);
        } catch (error) {
            photosFailed++;
            continue;
        }
        stockData.unshift({
            id: Date.now() + Math.random(),
            imei1, imei2, sn,
            modelo: String(record.model || 'Não informado'),
            localidade: String(record.locality || 'Canoas'),
            dataEntrada: record.createdAt || new Date().toISOString(),
            photoName,
            status: 'Disponível',
            entrega: { nome: '', cc: '', matricula: '', localidade: '', ticket: '' },
            history: []
        });
        added++;
    }
    if (added) {
        await saveStockData();
        currentStockPage = 1;
        renderStockTable();
        renderSelectStockOptions();
        renderDashboard();
    }
    showCustomAlert('Importação concluída: ' + added + ' aparelho(s) incluído(s), ' +
        skipped + ' duplicado(s)/sem foto ignorado(s)' +
        (photosFailed ? ', ' + photosFailed + ' foto(s) não puderam ser salvas.' : '.') , added ? 'success' : 'warning');
}

const zipImportInput = document.getElementById('inputImportarLoteZip');
zipImportInput?.addEventListener('change', async event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
        await importCollectorZip(file);
    } catch (error) {
        console.error('Falha ao importar lote ZIP:', error);
        showCustomAlert('Falha ao importar o lote: ' + (error.message || 'erro inesperado'), 'error');
    } finally {
        event.target.value = '';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    inputDataEntrada.value = localDate.toISOString().slice(0, 16);

    loadAppSettings();

    updateConnectionStatusUI(false); // Garante que a UI de conexão comece no estado desconectado
    initializeDockPreview();
    initializeSettingsTabs();    
    loadInitialState().then(() => {
        // NOVO: Verifica se há uma atualização de PDFs gerados vinda do gerador de termos
        const updatedIdsJSON = sessionStorage.getItem('updateGeneratedPdfs');
        if (updatedIdsJSON) {
            try {
                const updatedIds = JSON.parse(updatedIdsJSON);
                generatedPdfIds = updatedIds;
                saveGeneratedPdfsToJSONFile(); // Salva no arquivo .json
                renderTermosTable(); // Re-renderiza a tabela para mostrar os novos checks
                showCustomAlert('Lista de PDFs gerados foi atualizada.', 'success');
            } catch (e) {
                console.error("Falha ao processar atualização de PDFs gerados.", e);
            } finally {
                sessionStorage.removeItem('updateGeneratedPdfs'); // Limpa o dado após o uso
            }
        }
    });
});
