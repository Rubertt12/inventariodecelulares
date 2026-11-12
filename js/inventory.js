/* Módulo 3/7 — extraído de app.js. Ordem de carregamento obrigatória. */
async function renderStockTable() {
    stockTableBody.innerHTML = '';
    stockGridContainer.innerHTML = '';
    
    const filteredStock = getFilteredStock();

    if(filteredStock.length === 0) {
        stockTableBody.innerHTML = '<tr><td colspan="9" class="extracted-app-style-1">Nenhum smartphone encontrado.</td></tr>';
        stockGridContainer.innerHTML = '<div class="extracted-app-style-2">Nenhum smartphone encontrado.</div>';
        document.getElementById('stockPagInfo').textContent = 'Mostrando 0-0 de 0';
        document.getElementById('btnStockPrev').disabled = true;
        document.getElementById('btnStockNext').disabled = true;
        return;
    }

    const start = (currentStockPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, filteredStock.length);
    const paginatedItems = filteredStock.slice(start, end);

    const allChecked = paginatedItems.every(item => selectedItemIds.has(item.id));
    selectAllCheckbox.checked = allChecked && paginatedItems.length > 0;

    if (currentViewMode === 'table') {
        stockTableWrapper.style.display = 'block';
        stockGridWrapper.style.display = 'none';

        for (const item of paginatedItems) {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', item.id);
            // --- NOVO: Adiciona a classe de animação se for um item recém-adicionado ---
            if (item.id === lastAddedItemId) {
                tr.classList.add('new-item-animation');
            }
            
            const tdCheck = document.createElement('td');
            tdCheck.style.textAlign = 'center';
            tdCheck.innerHTML = `<input type="checkbox" class="batch-checkbox row-checkbox" data-id="${item.id}" ${selectedItemIds.has(item.id) ? 'checked' : ''}>`;
            tr.appendChild(tdCheck);

            const tdPhoto = await createPhotoCell(item.photoName);
            tr.appendChild(tdPhoto);
            
            const tdModelo = document.createElement('td');
            tdModelo.id = `modelo-txt-${item.id}`;
            
            tdModelo.innerHTML = `<strong>${item.modelo}</strong>`;
            tr.appendChild(tdModelo);

            const tdLocal = document.createElement('td');
            tdLocal.id = `local-txt-${item.id}`;
            tdLocal.textContent = item.localidade || appSettings.primaryLocation;
            tr.appendChild(tdLocal);

            tr.appendChild(createCell(item.imei1));
            tr.appendChild(createCell(item.imei2));
            tr.appendChild(createCell(item.sn, true));
            tr.appendChild(createStatusCell(item)); // Passa o objeto completo para verificar o status

            // Célula de Data e Hora
            const tdData = document.createElement('td');
            tdData.id = `data-txt-${item.id}`; // --- CORREÇÃO: Adicionado o ID que faltava
            if (item.dataEntrada) {
                tdData.textContent = new Date(item.dataEntrada).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            } else {
                tdData.textContent = '-';
            }
            tr.appendChild(tdData);
            
            const tdActions = document.createElement('td');
            tdActions.className = 'action-cell';
            tdActions.id = `actions-${item.id}`;
            tdActions.innerHTML = `<div class="action-btn-group">
                    <button class="btn btn-secondary btn-sm" title="Editar" onclick="startEdit(${item.id}, '${item.modelo}', '${item.localidade || ''}')"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button class="btn btn-danger btn-sm" title="Remover" onclick="removeStock(${item.id})"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                    <button class="btn btn-secondary btn-sm" title="Copiar Dados" onclick="copyItemData(${item.id})"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
                    <button class="btn btn-zebra btn-sm" title="Imprimir Etiqueta Zebra" onclick="printZebraLabel(${item.id})"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5a.5.5 0 0 0 .5-.5v-19a.5.5 0 0 0-1 0v19a.5.5 0 0 0 .5.5Z"></path><path d="M12 2v20"></path><path d="M18.5 2a.5.5 0 0 0-.5.5v19a.5.5 0 0 0 1 0v-19a.5.5 0 0 0-.5-.5Z"></path><path d="M18 2v20"></path><path d="M5.5 2a.5.5 0 0 0-.5.5v19a.5.5 0 0 0 1 0v-19a.5.5 0 0 0-.5-.5Z"></path><path d="M5 2v20"></path></svg></button>
                </div>`;
            tr.appendChild(tdActions);
            stockTableBody.appendChild(tr);
        }
    } 
    else {
        stockTableWrapper.style.display = 'none';
        stockGridWrapper.style.display = 'block';

        for (const item of paginatedItems) {
            const card = document.createElement('div');
            card.className = 'stock-card';
            card.setAttribute('data-id', item.id);
            // --- NOVO: Adiciona a classe de animação se for um item recém-adicionado ---
            if (item.id === lastAddedItemId) {
                card.classList.add('new-item-animation');
            }

            card.style.position = 'relative';

            const checkWrapper = document.createElement('div');
            checkWrapper.className = 'grid-checkbox-wrapper';
            checkWrapper.innerHTML = `<input type="checkbox" class="batch-checkbox row-checkbox" data-id="${item.id}" ${selectedItemIds.has(item.id) ? 'checked' : ''}>`;
            card.appendChild(checkWrapper);

            const imgContainer = document.createElement('div');
            imgContainer.className = 'stock-card-img-container';

            const resolvedUrl = await getImageUrl(item.photoName);
            if (resolvedUrl) {
                const img = document.createElement('img');
                img.src = resolvedUrl;
                img.className = 'stock-card-img';
                img.addEventListener('click', () => {
                    const filteredList = getFilteredStock();
                    const itemIndex = filteredList.findIndex(i => i.photoName === item.photoName);
                    if (itemIndex !== -1) openPhotoModal(itemIndex);
                });
                imgContainer.appendChild(img);
            } else {
                imgContainer.innerHTML = '<span class="stock-card-no-img">Sem foto</span>';
            }

            const statusBadge = item.status === 'Entregue' 
                ? `<span class="user-badge entregue extracted-app-style-3" onclick="openEntregaModal(${item.id})">Entregue</span>`
                : item.status === 'Enviado'
                ? `<span class="user-badge enviado extracted-app-style-4" onclick="revertSentStatus(${item.id})">Enviado (Reverter)</span>`
                : item.status === 'Devolvido'
                ? `<span class="user-badge devolvido extracted-app-style-5" onclick="selectDeviceAndSwitchToTermo(${item.id})">Devolvido</span>`
                : `<span class="user-badge stock extracted-app-style-6" onclick="openStockActionModal(${item.id})">Disponível</span>`;

            const content = document.createElement('div');
            content.className = 'stock-card-content';
            content.innerHTML = `
                <div id="grid-modelo-txt-${item.id}" class="stock-card-sn extracted-app-style-7">${item.modelo}</div>
                <div id="grid-local-txt-${item.id}" class="extracted-app-style-8"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="extracted-app-style-9"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${item.localidade || appSettings.primaryLocation}</div>
                <div class="stock-card-sn extracted-app-style-10">SN: ${item.sn || 'SEM S/N'}</div>
                <div class="stock-card-info extracted-app-style-11">
                    <span><strong>IMEI 1:</strong> ${item.imei1 || '-'}</span>
                    <span><strong>IMEI 2:</strong> ${item.imei2 || '-'}</span>
                    <span id="grid-data-txt-${item.id}" class="extracted-app-style-12">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="extracted-app-style-13"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        ${item.dataEntrada ? new Date(item.dataEntrada).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </span>
                </div>
                <div class="stock-card-footer extracted-app-style-14" id="grid-actions-${item.id}">
                    ${statusBadge}
                    <div class="action-btn-group">
                        <button class="btn btn-secondary btn-sm" title="Editar" onclick="startEdit(${item.id}, '${item.modelo}', '${item.localidade || ''}')"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                        <button class="btn btn-danger btn-sm" title="Remover" onclick="removeStock(${item.id})"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                        <button class="btn btn-secondary btn-sm" title="Copiar Dados" onclick="copyItemData(${item.id})"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
                        <button class="btn btn-zebra btn-sm" title="Imprimir Etiqueta Zebra" onclick="printZebraLabel(${item.id})"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5a.5.5 0 0 0 .5-.5v-19a.5.5 0 0 0-1 0v19a.5.5 0 0 0 .5.5Z"></path><path d="M12 2v20"></path><path d="M18.5 2a.5.5 0 0 0-.5.5v19a.5.5 0 0 0 1 0v-19a.5.5 0 0 0-.5-.5Z"></path><path d="M18 2v20"></path><path d="M5.5 2a.5.5 0 0 0-.5.5v19a.5.5 0 0 0 1 0v-19a.5.5 0 0 0-.5-.5Z"></path><path d="M5 2v20"></path></svg></button>
                    </div>
                </div>
            `;

            card.appendChild(imgContainer);
            card.appendChild(content);
            stockGridContainer.appendChild(card);
        }
    }

    document.querySelectorAll('.row-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const id = parseFloat(e.target.getAttribute('data-id'));
            if (e.target.checked) { selectedItemIds.add(id); } else { selectedItemIds.delete(id); }
            updateBatchPanelUI();
        });
    });

    document.getElementById('stockPagInfo').textContent = `Mostrando ${start + 1}-${end} de ${filteredStock.length}`;
    document.getElementById('btnStockPrev').disabled = currentStockPage === 1;
    document.getElementById('btnStockNext').disabled = end >= filteredStock.length;
}

selectAllCheckbox.addEventListener('change', (e) => {
    const filteredStock = getFilteredStock();
    const start = (currentStockPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, filteredStock.length);
    const paginatedItems = filteredStock.slice(start, end);

    paginatedItems.forEach(item => {
        if (e.target.checked) { selectedItemIds.add(item.id); } else { selectedItemIds.delete(item.id); }
    });
    
    renderStockTable();
    updateBatchPanelUI();
});

function updateBatchPanelUI() {
    if (selectedItemIds.size > 0) {
        batchActionsPanel.classList.add('active');
        batchCountText.textContent = `${selectedItemIds.size} ${selectedItemIds.size === 1 ? 'item selecionado' : 'itens selecionados'}`;
    } else {
        batchActionsPanel.classList.remove('active');
    }
}

function clearBatchSelection() {
    selectedItemIds.clear();
    selectAllCheckbox.checked = false;
    batchSelectLocalidade.value = '';
    batchSelectModelo.value = '';
    updateBatchPanelUI();
}

btnCancelBatchEdit.addEventListener('click', () => {
    clearBatchSelection();
    renderStockTable();
});

btnApplyBatchEdit.addEventListener('click', async () => {
    if (selectedItemIds.size === 0) return;

    const targetModelo = batchSelectModelo.value;
    const targetLocalidade = batchSelectLocalidade.value;
    
    if(!targetModelo && !targetLocalidade) {
        showCustomAlert("Escolha um modelo ou uma localidade para alterar.", 'warning');
        return;
    }

    stockData.forEach(item => {
        if (selectedItemIds.has(item.id)) {
            if(targetModelo) item.modelo = targetModelo;
            if(targetLocalidade) item.localidade = targetLocalidade;
        }
    });

    await saveStockData();
    clearBatchSelection();
    renderSelectStockOptions();
    renderStockTable();
    showCustomAlert('Alteração em lote realizada com sucesso!', 'success');
});

// --- ALTERADO: Substituídos os eventos individuais de clique pelo evento change do Switch ---
if (viewToggleCheckbox) {
    viewToggleCheckbox.addEventListener('change', () => {
        if (viewToggleCheckbox.checked) {
            currentViewMode = 'grid';
        } else {
            currentViewMode = 'table';
        }
        renderStockTable();
    });
}

document.getElementById('btnStockPrev').onclick = function() {
    if(currentStockPage > 1) { currentStockPage--; renderStockTable(); }
};

document.getElementById('btnStockNext').onclick = function() {
    const filteredCount = getFilteredStock().length;
    if((currentStockPage * ITEMS_PER_PAGE) < filteredCount) { currentStockPage++; renderStockTable(); }
};

if (inputSearchStock) {
    inputSearchStock.addEventListener('input', () => { currentStockPage = 1; renderStockTable(); });
}

// NOVO: Listener para o campo de busca do histórico de termos
if (inputSearchTermos) {
    inputSearchTermos.addEventListener('input', () => {
        currentTermosPage = 1; // Reseta para a primeira página ao buscar
        renderTermosTable();
    });
}

btnActionCam.addEventListener('click', async () => {
    if (streamActive) { stopCamera(); } 
    else {
        try {
            streamActive = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment', width: { ideal: 4096 }, height: { ideal: 2160 } }, audio: false 
            });
            video.srcObject = streamActive; video.style.display = 'block'; 
            canvas.style.display = 'none'; placeholderText.style.display = 'none';
            btnActionCam.textContent = 'Desligar Câmera'; btnCapture.disabled = false;
        } catch (err) { showCustomAlert('Erro ao acessar a câmera. Verifique as permissões do navegador.', 'error'); }
    }
});

function stopCamera() {
    if (streamActive) { streamActive.getTracks().forEach(track => track.stop()); streamActive = null; }
    video.style.display = 'none'; btnActionCam.textContent = 'Ligar Câmera'; btnCapture.disabled = true;
    if (!tempPhotoBlob) placeholderText.style.display = 'flex';
}

btnCapture.addEventListener('click', () => {
    if (!streamActive) return;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
        tempPhotoBlob = blob; 
        tempPhotoUrl = URL.createObjectURL(blob); 
        canvas.style.display = 'block'; 
        stopCamera();

        // --- NOVO: Preenche a data e hora automaticamente ---
        // Pega a data e hora atuais no momento da captura da foto.
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - (offset * 60 * 1000));
        inputDataEntrada.value = localDate.toISOString().slice(0, 16);
    }, 'image/jpeg', 1.0); 
});

btnAddToStock.addEventListener('click', async () => {
    const imei1 = inputImei1.value.trim(); 
    const imei2 = inputImei2.value.trim(); 
    const sn = inputSN.value.trim();
    const modelo = inputModelo.value;
    const localidade = inputLocalidade.value;
    const dataEntrada = inputDataEntrada.value;

    // --- NOVA REGRA: Trava de Duplicidade ---
    // Verifica se os campos não estão vazios antes de checar duplicatas
    if (imei1 || imei2 || sn) {
        const duplicado = stockData.find(item => 
            (imei1 && item.imei1 === imei1) || 
            (imei2 && item.imei2 === imei2) || 
            (sn && item.sn === sn)
        );

        if (duplicado) {
            showCustomAlert('Já existe um dispositivo cadastrado com este IMEI ou SN!', 'error');
            return; // Interrompe a execução
        }
    }

    if (!imei1 && !sn) { showCustomAlert('Preencha o IMEI ou SN para continuar.', 'warning'); return; }

    let savedPhotoName = '';
    if (tempPhotoBlob) {
        savedPhotoName = `${sn || Date.now()}.jpg`;
        await saveImageToFolder(savedPhotoName, tempPhotoBlob);
    }

    const newItem = {
        id: Date.now() + Math.random(),
        imei1, imei2, sn, modelo, localidade, dataEntrada: dataEntrada || new Date().toISOString(),
        photoName: savedPhotoName,
        status: 'Disponível',
        entrega: { nome: '', cc: '', matricula: '', localidade: '', ticket: '' },
        history: []
    };

    stockData.unshift(newItem);
    lastAddedItemId = newItem.id; // Define o ID para a animação
    
    await saveStockData(); 
    clearForm();
    currentStockPage = 1; 
    renderStockTable();
    renderSelectStockOptions(); 
    showCustomAlert('Telefone cadastrado com sucesso!', 'success');

    // Limpa o gatilho da animação após ela ter tido tempo de tocar
    setTimeout(() => {
        lastAddedItemId = null;
    }, 2000); // Deve ser igual ou maior que a duração da animação em CSS
});

btnPasteOcr.addEventListener('click', async () => {
    if (!navigator.clipboard?.readText) {
        showCustomAlert('Seu navegador não suporta a leitura da área de transferência.', 'error');
        return;
    }
    try {
        const text = await navigator.clipboard.readText();
        if (!text) {
            showCustomAlert('A área de transferência está vazia.', 'warning');
            return;
        }

        // Regex aprimorada para encontrar IMEIs (qualquer número de 15 dígitos)
        const imeiRegex = /\b(\d{15})\b/g;
        
        // Regex para encontrar SN com rótulo (S/N, SN, Serial, etc.)
        const snLabeledRegex = /(?:s\/?n|serial(?:\s*number)?|n[oº\s]+de\s+s[eé]rie)[\s:.]*([A-Z0-9]{5,20})\b/i;

        const imeiMatches = [...text.matchAll(imeiRegex)];
        const snMatch = text.match(snLabeledRegex);

        let imeisFound = imeiMatches.map(match => match[1]);
        let snFound = snMatch ? snMatch[1] : null;
        
        let foundSomething = false;

        if (imeisFound.length > 0) {
            const uniqueImeis = [...new Set(imeisFound)];
            inputImei1.value = uniqueImeis[0] || '';
            if (uniqueImeis.length > 1) {
                inputImei2.value = uniqueImeis[1] || '';
            }
            foundSomething = true;
        }

        if (snFound) {
            inputSN.value = snFound.toUpperCase();
            foundSomething = true;
        } else {
            let remainingText = text;
            imeisFound.forEach(imei => { remainingText = remainingText.replace(new RegExp(imei, 'g'), ''); });
            const snGenericRegex = /\b([A-Z0-9]{7,20})\b/g;
            const potentialSnMatches = [...remainingText.matchAll(snGenericRegex)];
            for (const potentialMatch of potentialSnMatches) {
                const candidate = potentialMatch[1];
                if (/[A-Z]/i.test(candidate)) {
                    inputSN.value = candidate.toUpperCase();
                    foundSomething = true;
                    break; 
                }
            }
        }

        if (!foundSomething) {
            showCustomAlert('Nenhum IMEI ou Número de Série válido foi encontrado no texto colado.', 'warning');
        } else {
            showCustomAlert('Campos preenchidos a partir da área de transferência!', 'success');
        }

    } catch (err) {
        console.error('Falha ao ler a área de transferência: ', err);
        showCustomAlert('Não foi possível ler da área de transferência. Verifique se você concedeu a permissão de acesso ao site.', 'error');
    }
});

btnSyncDates.addEventListener('click', async () => {
    if (!dirHandle) {
        showCustomAlert('Vincule uma pasta primeiro para usar esta função.', 'warning');
        return;
    }

    if (!confirm('Isso irá sobrescrever a data de entrada dos itens com a data de modificação dos seus respectivos arquivos de foto. Deseja continuar?')) {
        return;
    }

    showCustomAlert('Iniciando sincronização... Isso pode levar alguns instantes.', 'warning');

    const photoDir = await getPhotoDirHandle();
    if (!photoDir) {
        showCustomAlert('Não foi possível acessar a pasta de fotos (fotofiles).', 'error');
        return;
    }

    let updatedCount = 0;
    for (const item of stockData) {
        if (item.photoName) {
            try {
                const fileHandle = await photoDir.getFileHandle(item.photoName);
                const file = await fileHandle.getFile();
                const lastModifiedDate = new Date(file.lastModified);
                const offset = lastModifiedDate.getTimezoneOffset();
                const localDate = new Date(lastModifiedDate.getTime() - (offset * 60 * 1000));
                item.dataEntrada = localDate.toISOString().slice(0, 16);
                updatedCount++;
            } catch (e) { /* Ignora arquivos de foto não encontrados */ }
        }
    }
    await saveStockData();
    renderStockTable();
    showCustomAlert(`${updatedCount} registros de data foram sincronizados com sucesso!`, 'success');
});

function createCell(text, monospace = false) {
    const td = document.createElement('td'); td.textContent = text || '-';
    if (monospace) td.style.fontFamily = 'monospace';
    return td;
}

function createStatusCell(item) {
    const td = document.createElement('td');
    if (item.status === 'Entregue') {
        td.innerHTML = `<span class="user-badge entregue extracted-app-style-15" onclick="openEntregaModal(${item.id})">Entregue (Ver)</span>`;
    } else if (item.status === 'Enviado') {
        td.innerHTML = `<span class="user-badge enviado extracted-app-style-16" onclick="revertSentStatus(${item.id})">Enviado (Reverter)</span>`;
    } else if (item.status === 'Devolvido') {
        td.innerHTML = `<span class="user-badge devolvido extracted-app-style-17" onclick="selectDeviceAndSwitchToTermo(${item.id})">Devolvido (Reatribuir)</span>`;
    } else {
        td.innerHTML = `<span class="user-badge stock extracted-app-style-18" onclick="openStockActionModal(${item.id})">Disponível</span>`;
    }
    return td;
}

async function createPhotoCell(photoName) {
    const td = document.createElement('td');
    const resolvedUrl = await getImageUrl(photoName);
    if (resolvedUrl) {
        const img = document.createElement('img'); img.src = resolvedUrl; img.className = 'badge-photo'; img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const filteredList = getFilteredStock();
            const itemIndex = filteredList.findIndex(i => i.photoName === photoName);
            if (itemIndex !== -1) openPhotoModal(itemIndex);
        });
        td.appendChild(img);
    } else { td.innerHTML = '<span class="extracted-app-style-19">Sem foto</span>'; }
    return td;
}

// --- NOVO: Lógica para o Modal de Confirmação Genérico ---
let onConfirmCallback = null;

function openConfirmModal(title, message, onConfirm) {
    confirmModalTitle.textContent = title;
    confirmModalMessage.innerHTML = message;
    onConfirmCallback = onConfirm;
    confirmModal.classList.add('active');
}

function closeConfirmModal() {
    confirmModal.classList.remove('active');
    onConfirmCallback = null;
}

confirmModalClose.addEventListener('click', closeConfirmModal);
confirmModalCancel.addEventListener('click', closeConfirmModal);
confirmModal.addEventListener('click', (e) => { if (e.target === confirmModal) closeConfirmModal(); });

confirmModalConfirm.addEventListener('click', () => {
    if (typeof onConfirmCallback === 'function') {
        // Armazena a função de callback em uma variável local antes que seja anulada.
        const callbackToExecute = onConfirmCallback;
        closeConfirmModal();
        // Executa o callback imediatamente para evitar a condição de corrida que ocorria com o setTimeout.
        callbackToExecute();
    }
});

window.removeStock = async function(id) {
    const item = stockData.find(i => i.id === id);
    if (!item) return;

    const title = "Excluir Smartphone";
    const message = `Tem certeza que deseja excluir o <strong>${item.modelo}</strong> (SN: ${item.sn || 'N/A'}) do estoque? <br><br><span class="extracted-app-style-20">Esta ação não pode ser desfeita.</span>`;

    const deleteAction = async () => {
        stockData = stockData.filter(i => i.id !== id);
        selectedItemIds.delete(id);
        await saveStockData();
        
        updateBatchPanelUI();
        if(((currentStockPage - 1) * ITEMS_PER_PAGE) >= getFilteredStock().length && currentStockPage > 1) currentStockPage--;
        renderStockTable();
        renderSelectStockOptions();
        showCustomAlert('Item removido do estoque.', 'success');
    };

    openConfirmModal(title, message, deleteAction);
};

function clearForm() {
    inputImei1.value = ''; inputImei2.value = ''; inputSN.value = '';
    // Define a data e hora atuais no formato para o input datetime-local
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    inputDataEntrada.value = localDate.toISOString().slice(0, 16);

    tempPhotoBlob = null; tempPhotoUrl = null; canvas.style.display = 'none'; placeholderText.style.display = 'flex';
}

// --- NOVO: Lógica para o Modal de Senha ---
let onPasswordSuccessCallback = null;

// --- NOVA FUNÇÃO: Hash da senha para ofuscação ---
// Isso evita que a senha de administrador fique visível no código-fonte.
async function verifyPassword(inputPassword) {
    // O hash SHA-256 da senha padrão "admin"
    const storedHash = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
    
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(inputPassword);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const inputHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return inputHash === storedHash;
    } catch (e) {
        console.error("Erro ao verificar a senha (Web Crypto API pode não estar disponível):", e);
        return false; // Retorna falso se a verificação falhar
    }
}

function openPasswordModal(title, message, onConfirm) {
    passwordModalTitle.textContent = title;
    passwordModalMessage.innerHTML = message;
    adminPasswordInput.value = '';
    onPasswordSuccessCallback = onConfirm;
    passwordModal.classList.add('active');
    adminPasswordInput.focus();
}

function closePasswordModal() {
    passwordModal.classList.remove('active');
    onPasswordSuccessCallback = null;
}

passwordModalClose.addEventListener('click', closePasswordModal);
passwordModalCancel.addEventListener('click', closePasswordModal);
passwordModal.addEventListener('click', (e) => { if (e.target === passwordModal) closePasswordModal(); });

passwordModalConfirm.addEventListener('click', async () => {
    const password = adminPasswordInput.value;
    if (await verifyPassword(password)) {
        if (typeof onPasswordSuccessCallback === 'function') {
            const callbackToExecute = onPasswordSuccessCallback;
            closePasswordModal();
            // Executa o callback imediatamente para evitar o mesmo problema do modal de confirmação
            callbackToExecute();
        }
    } else {
        showCustomAlert('Senha incorreta. Ação cancelada.', 'error');
        adminPasswordInput.focus();
        adminPasswordInput.select();
    }
});

btnClearStock.addEventListener('click', () => {
    const title = "Limpar Estoque Total";
    const message = "Esta é uma ação perigosa e irreversível. Para confirmar que deseja apagar <strong>TODO</strong> o estoque, digite a senha de administrador.";

    const clearStockAction = async () => {
        const confirmTitle = "ATENÇÃO: CONFIRMAÇÃO FINAL!";
        const confirmMessage = "Você está prestes a apagar permanentemente TODOS os registros de aparelhos. Esta ação NÃO PODE ser desfeita.<br><br>Deseja continuar? Espero que você tenha um backup...";

        const finalAction = async () => {
            stockData = [];
            await saveStockData();
            clearBatchSelection();
            currentStockPage = 1;
            renderAllUI();
            showCustomAlert('Poxa, por que fez isso?! O estoque foi completamente limpo... :(', 'warning');
        };

        openConfirmModal(confirmTitle, confirmMessage, finalAction);
    };

    openPasswordModal(title, message, clearStockAction);
});
