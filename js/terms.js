/* Módulo 4/7 — extraído de app.js. Ordem de carregamento obrigatória. */
// --- TERMOS ---
function renderSelectStockOptions() {
    devicesDataList.innerHTML = ''; // Limpa a datalist
    stockData.forEach(item => {
        // Exibe itens "Disponível" ou "Devolvido" para vinculação
        if (item.status === 'Disponível' || item.status === 'Devolvido' || !item.status) {
            const option = document.createElement('option');
            // O texto visível para o usuário (inclui o status se for devolvido)
            option.value = `[${item.modelo.includes('Galaxy') ? `Galaxy ${item.modelo}` : item.modelo}] SN: ${item.sn || 'Sem S/N'} - Loc: ${item.localidade || appSettings.primaryLocation}`;
            // Armazena o ID do item em um atributo de dados para referência
            option.dataset.id = item.id;
            devicesDataList.appendChild(option);
        }
    });
}

function updateTermoFormForDevice(item) {
    if (item) {
        displayTermoMarcaModelo.value = item.modelo.includes('Galaxy') && !item.modelo.includes('Samsung') ? `Samsung ${item.modelo}` : item.modelo;
        displayTermoImei1.value = item.imei1 || "-";
        displayTermoImei2.value = item.imei2 || "-";
        displayTermoSN.value = item.sn || "-";
        inputTermoLocal.value = item.localidade || appSettings.primaryLocation;

        const modelInfo = phoneModels.find(m => m.name === item.modelo);
        const baseModel = modelInfo ? modelInfo.base : 'A07'; // Padrão para Modelo 1 se não encontrar

        window.setModeloTermo(baseModel);

        // --- NOVO: Lógica para exibir o histórico ---
        if (item.history && item.history.length > 0) {
            termoHistoryList.innerHTML = '<ul>' + item.history.map(h => 
                `<li><strong>${h.nome || 'N/A'}</strong> (Mat: ${h.matricula || 'N/A'}) - Ticket: ${h.ticket || 'N/A'}</li>`
            ).join('') + '</ul>';
            displayTermoHistory.style.display = 'block';
        } else {
            displayTermoHistory.style.display = 'none';
        }

    } else {
        displayTermoMarcaModelo.value = ""; displayTermoImei1.value = ""; displayTermoImei2.value = ""; displayTermoSN.value = ""; inputTermoLocal.value = "";
        // Esconde o histórico se nenhum item for selecionado
        displayTermoHistory.style.display = 'none';
    }
}

selectDeviceStock.addEventListener('change', () => {
    const selectedValue = selectDeviceStock.value;
    let selectedId = null;

    // Encontra a opção na datalist que corresponde ao valor digitado/selecionado
    const option = Array.from(devicesDataList.options).find(opt => opt.value === selectedValue);

    if (option) {
        selectedId = parseFloat(option.dataset.id);
    } else {
        updateTermoFormForDevice(null); // Limpa o formulário se não encontrar correspondência
        return;
    }
    const item = stockData.find(i => i.id === selectedId);    
    updateTermoFormForDevice(item);
});

btnSaveTermo.addEventListener('click', async (event) => {
    event.preventDefault(); // Garante que o botão não recarregue a página.
    try {
        const selectedValue = selectDeviceStock.value;
        let selectedId = null;

        const option = Array.from(devicesDataList.options).find(opt => opt.value === selectedValue);
        if (option) {
            selectedId = parseFloat(option.dataset.id);
        }

        if (!selectedId) { showCustomAlert('Selecione um telefone na lista de disponíveis.', 'warning'); return; }
        if (!inputTermoNome.value.trim() || !inputTermoTicket.value.trim()) { showCustomAlert('Preencha o Ticket/Chamado e o Nome do colaborador.', 'warning'); return; }
        
        const nomeTecnico = inputTermoTecnico.value.trim();
        if (!nomeTecnico) {
            showCustomAlert('Por favor, informe o nome do técnico responsável pela entrega.', 'warning');
            return;
        }

        const itemSelected = stockData.find(i => i.id === selectedId);
        if (!itemSelected) {
            showCustomAlert('Erro: O item selecionado não foi encontrado. A operação foi cancelada.', 'error');
            return;
        }

        const modeloTermoFinal = inputTermoModelo.value.trim();

        termosData.unshift({
            modeloTermo: modeloTermoFinal || 'A07',
            ticket: inputTermoTicket.value.trim(),
            nome: inputTermoNome.value.trim(),
            matricula: inputTermoMatricula.value.trim(),
            local: inputTermoLocal.value.trim(),
            marcaModelo: displayTermoMarcaModelo.value,
            imei1: displayTermoImei1.value,
            imei2: displayTermoImei2.value,
            sn: displayTermoSN.value,
            chip: inputTermoChip.value.trim(),
            cc: inputTermoCC.value.trim(),
            nomeTecnico: nomeTecnico
        });

        itemSelected.status = 'Entregue';
        itemSelected.entrega = {
            nome: inputTermoNome.value.trim(),
            matricula: inputTermoMatricula.value.trim(),
            cc: inputTermoCC.value.trim(),
            localidade: inputTermoLocal.value.trim(),
            ticket: inputTermoTicket.value.trim(),
            nomeTecnico: nomeTecnico,
            dataEntrega: new Date().toISOString()
        };

        if (itemSelected.dataDevolucao) {
            itemSelected.dataDevolucao = null;
        }

        selectedItemIds.delete(selectedId); 

        await saveToTermosTXTFile();
        await saveToTermosCSVFile();
        await saveStockData();

        clearTermoForm();
        renderAllUI();
        showCustomAlert('Dispositivo vinculado e marcado como "Entregue" com sucesso!', 'success');
    } catch (error) {
        console.error("Ocorreu um erro ao vincular o termo:", error);
        showCustomAlert(`Falha ao salvar o vínculo. Detalhes do erro: ${error.message}`, 'error');
    }
});

function exportTermosToCSV(dataToExport, isNewExport = false) {
    if (termosData.length === 0) {
        showCustomAlert('Não há histórico de termos para exportar.', 'warning');
        return;
    }

    const header = "MODELO_TERMO;TICKET;NOME;MATRICULA;LOCAL;MARCA_MODELO;IMEI1;IMEI2;SN;CHIP;CC;TECNICO";
    const rows = dataToExport.map(item => {
        return `${item.modeloTermo || ''};${item.ticket || ''};${item.nome || ''};${item.matricula || ''};${item.local || ''};${item.marcaModelo || ''};="""${item.imei1 || ''}""";="""${item.imei2 || ''}""";="""${item.sn || ''}""";${item.chip || ''};${item.cc || ''};${item.nomeTecnico || ''}`;
    });

    const csvContent = "\ufeff" + header + "\n" + rows.join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `historico_termos_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (isNewExport) {
        // Salva o total atual como a nova contagem de exportados
        localStorage.setItem('lastTermosExportCount', termosData.length.toString());
        showCustomAlert(`${dataToExport.length} novo(s) registro(s) exportado(s) com sucesso!`, 'success');
    } else {
        showCustomAlert(`Histórico completo (${dataToExport.length} registros) exportado com sucesso!`, 'success');
    }
}

function formatReportDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString('pt-BR');
}

function addReportSheet(workbook, name, rows, columnWidths) {
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    sheet['!cols'] = columnWidths.map(width => ({ wch: width }));
    if (rows.length > 1) {
        sheet['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length - 1, c: rows[0].length - 1 } }) };
    }
    sheet['!freeze'] = { xSplit: 0, ySplit: 1 };
    XLSX.utils.book_append_sheet(workbook, sheet, name);
}

function exportStockToExcel() {
    if (typeof XLSX === 'undefined') {
        showCustomAlert('Não foi possível carregar o gerador de Excel. Verifique a conexão e tente novamente.', 'error');
        return;
    }
    if (stockData.length === 0) {
        showCustomAlert('Não há dados de estoque para exportar.', 'warning');
        return;
    }

    const workbook = XLSX.utils.book_new();
    const generatedAt = new Date().toLocaleString('pt-BR');
    const statusOrder = ['Disponível', 'Entregue', 'Enviado', 'Devolvido'];
    const summaryRows = [
        ['RELATÓRIO DE ESTOQUE'],
        ['Gerado em', generatedAt],
        ['Total de aparelhos', stockData.length],
        [],
        ['Status', 'Quantidade'],
        ...statusOrder.map(status => [status, stockData.filter(item => item.status === status).length]),
        [],
        ['Localidade atual', 'Quantidade'],
        ...Object.entries(stockData.reduce((totals, item) => {
            const location = item.localidade || appSettings.primaryLocation || 'Não informada';
            totals[location] = (totals[location] || 0) + 1;
            return totals;
        }, {})).sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'))
    ];
    const deviceHeader = ['Modelo', 'IMEI 1', 'IMEI 2', 'Número de Série', 'Status', 'Localidade Atual', 'Data de Entrada', 'Data de Envio', 'Data de Devolução'];
    const deviceRow = item => [item.modelo || '', item.imei1 || '', item.imei2 || '', item.sn || '', item.status || '', item.localidade || appSettings.primaryLocation || '', formatReportDate(item.dataEntrada), formatReportDate(item.dataEnvio), formatReportDate(item.dataDevolucao)];
    const deliveredHeader = [...deviceHeader, 'Colaborador', 'Matrícula', 'Centro de Custo', 'Destino da Entrega', 'Ticket', 'Entregue por', 'Data da Entrega'];
    const deliveredRow = item => {
        const delivery = item.entrega || {};
        return [...deviceRow(item), delivery.nome || '', delivery.matricula || '', delivery.cc || '', delivery.localidade || '', delivery.ticket || '', delivery.nomeTecnico || '', formatReportDate(delivery.dataEntrega)];
    };

    const available = stockData.filter(item => item.status === 'Disponível');
    const delivered = stockData.filter(item => item.status === 'Entregue');
    const historyRows = [['Modelo', 'IMEI 1', 'Número de Série', 'Situação do Vínculo', 'Colaborador', 'Matrícula', 'Centro de Custo', 'Destino da Entrega', 'Ticket', 'Entregue por', 'Data da Entrega']];
    stockData.forEach(item => {
        if (item.status === 'Entregue' && item.entrega) {
            const delivery = item.entrega;
            historyRows.push([item.modelo || '', item.imei1 || '', item.sn || '', 'Atual', delivery.nome || '', delivery.matricula || '', delivery.cc || '', delivery.localidade || '', delivery.ticket || '', delivery.nomeTecnico || '', formatReportDate(delivery.dataEntrega)]);
        }
        (Array.isArray(item.history) ? item.history : []).forEach(delivery => {
            historyRows.push([item.modelo || '', item.imei1 || '', item.sn || '', 'Histórico', delivery.nome || delivery.nome_colaborador || '', delivery.matricula || '', delivery.cc || delivery.centro_custo || '', delivery.localidade || delivery.localidade_entrega || '', delivery.ticket || '', delivery.nomeTecnico || '', formatReportDate(delivery.dataEntrega || delivery.data_entrega)]);
        });
    });

    addReportSheet(workbook, 'Resumo', summaryRows, [28, 20]);
    addReportSheet(workbook, 'Disponíveis', [deviceHeader, ...available.map(deviceRow)], [24, 18, 18, 22, 14, 22, 20, 20, 20]);
    addReportSheet(workbook, 'Entregues', [deliveredHeader, ...delivered.map(deliveredRow)], [24, 18, 18, 22, 14, 22, 20, 20, 20, 28, 16, 18, 24, 18, 24, 20]);
    addReportSheet(workbook, 'Todos', [deliveredHeader, ...stockData.map(deliveredRow)], [24, 18, 18, 22, 14, 22, 20, 20, 20, 28, 16, 18, 24, 18, 24, 20]);
    addReportSheet(workbook, 'Histórico Entregas', historyRows, [24, 18, 22, 18, 28, 16, 18, 24, 18, 24, 20]);

    XLSX.writeFile(workbook, `relatorio_estoque_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showCustomAlert(`Relatório gerado com ${stockData.length} aparelho(s).`, 'success');
}

if (btnExportStockExcel) {
    btnExportStockExcel.addEventListener('click', exportStockToExcel);
}

btnExportTermosHistory.addEventListener('click', () => {
    exportTermosToCSV(termosData, false);
});

btnExportNewTermos.addEventListener('click', () => {
    const lastExportCount = parseInt(localStorage.getItem('lastTermosExportCount') || '0', 10);
    const newCount = termosData.length - lastExportCount;

    if (newCount <= 0) {
        showCustomAlert('Não há novos termos para exportar desde a última vez.', 'warning');
        return;
    }

    // Como novos itens são adicionados no início (unshift), pegamos os 'newCount' primeiros.
    const newTermos = termosData.slice(0, newCount);

    const finalNewTermos = newTermos.filter(item => {
        const identifier = `${item.ticket}:${item.sn}`;
        return !generatedPdfIds.includes(identifier);
    });

    // CORREÇÃO: Verifica se a lista final não está vazia antes de exportar.
    if (finalNewTermos.length === 0) {
        showCustomAlert('Não há novos termos pendentes de geração de PDF para exportar.', 'warning');
        return;
    }

    // Chama a função de exportação com os novos dados
    exportTermosToCSV(finalNewTermos, true);
});

function renderTermosTable() {
    termosTableBody.innerHTML = '';

    // NOVO: Lógica de filtragem para a tabela de termos
    const searchTerm = normalizeText(inputSearchTermos ? inputSearchTermos.value : '');
    const filteredTermos = termosData.filter(item => {
        if (!searchTerm) return true;
        // Busca em vários campos do termo
        return normalizeText(item.ticket).includes(searchTerm) ||
               normalizeText(item.nome).includes(searchTerm) ||
               normalizeText(item.matricula).includes(searchTerm) ||
               normalizeText(item.marcaModelo).includes(searchTerm) ||
               normalizeText(item.sn).includes(searchTerm) ||
               normalizeText(item.imei1).includes(searchTerm) ||
               normalizeText(item.local).includes(searchTerm) ||
               normalizeText(item.cc).includes(searchTerm);
    });

    const totalItems = filteredTermos.length;

    if (totalItems === 0) {
        const noResultsMessage = searchTerm ? 'Nenhum termo encontrado para sua busca.' : 'Nenhum termo emitido.';
        termosTableBody.innerHTML = `<tr><td colspan="8" class="extracted-app-style-21">${noResultsMessage}</td></tr>`;
        document.getElementById('termosPagInfo').textContent = 'Mostrando 0-0 de 0';
        document.getElementById('btnTermosPrev').disabled = true;
        document.getElementById('btnTermosNext').disabled = true;
        return;
    }

    const start = (currentTermosPage - 1) * TERMOS_PER_PAGE;
    const end = Math.min(start + TERMOS_PER_PAGE, totalItems);
    const paginatedItems = filteredTermos.slice(start, end);

    document.getElementById('termosPagInfo').textContent = `Mostrando ${start + 1}-${end} de ${totalItems}`;
    document.getElementById('btnTermosPrev').disabled = currentTermosPage === 1;
    document.getElementById('btnTermosNext').disabled = end >= totalItems;

    paginatedItems.forEach(item => {
        const tr = document.createElement('tr');

        // NOVO: Verifica se o termo já teve PDF gerado e adiciona um ícone de check
        const identifier = `${item.ticket}:${item.sn}`;
        const isGenerated = generatedPdfIds.includes(identifier);
        const checkIcon = isGenerated ? `<svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>` : '';
 
        const actionButtonsHTML = isGenerated
            ? `<button class="btn btn-secondary btn-sm" title="Reemitir PDF" onclick='openTermoGenerator(${JSON.stringify(item)}, ${isGenerated})'><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg></button>
               <button class="btn btn-sm" title="Baixar PDF" onclick='downloadTermoPdf(${JSON.stringify(item)})'><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>`
            : `<button class="btn btn-secondary btn-sm" title="Gerar PDF" onclick='openTermoGenerator(${JSON.stringify(item)}, ${isGenerated})'><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg></button>`;

        // A ordem agora está correta: Ticket é item.ticket, CC é item.cc
        tr.innerHTML = `
            <td><strong>${item.ticket}</strong>${checkIcon}</td>
            <td>${item.nome}<br><small class="extracted-app-style-22">Mat.: ${item.matricula || '-'}</small></td>
            <td>${item.local || '-'}</td>
            <td><strong>${item.marcaModelo}</strong></td>
            <td>${item.nomeTecnico || '-'}</td>
            <td class="extracted-app-style-23">SN: ${item.sn}<br>IMEI: ${item.imei1}</td>
            <td>${item.chip || '-'}</td> 
            <td>CC: ${item.cc || '-'}<br><span class="user-badge stock extracted-app-style-24">${item.modeloTermo}</span></td>
            <td class="action-cell">
                <div class="action-btn-group">
                    ${actionButtonsHTML}
                </div>
            </td>
        `;
        termosTableBody.appendChild(tr);
    });
}

document.getElementById('btnTermosPrev').onclick = function() {
    if(currentTermosPage > 1) { currentTermosPage--; renderTermosTable(); }
};

document.getElementById('btnTermosNext').onclick = function() {
    if((currentTermosPage * TERMOS_PER_PAGE) < termosData.length) { currentTermosPage++; renderTermosTable(); }
};

/**
 * NOVO: Abre o gerador de termo individual, preenchendo os dados a partir do histórico.
 * @param {object} item O objeto do termo da linha clicada.
 */
window.openTermoGenerator = function(item, isGenerated) {
    const navigateToGenerator = () => {
        const baseUrl = 'geradordetermoprojetov1.html';
        const params = new URLSearchParams();

        // Mapeia os dados do item para os parâmetros da URL
        params.append('fTicket', item.ticket || '');
        params.append('fNome', item.nome || '');
        params.append('fMatricula', item.matricula || '');
        params.append('fCC', item.cc || '');
        params.append('fLocalidade', item.local || '');
        params.append('fModelo', item.marcaModelo || '');
        params.append('fImei', item.imei1 || '');
        params.append('fImei2', item.imei2 || '');
        params.append('fSerie', item.sn || '');
        params.append('fChip', item.chip || '');
        params.append('fTecnico', item.nomeTecnico || '');
        params.append('fModeloTermo', item.modeloTermo || 'A56');

        // NOVO: Salva a lista atual de PDFs gerados no sessionStorage
        sessionStorage.setItem('currentGeneratedPdfIds', JSON.stringify(generatedPdfIds));

        window.location.href = `${baseUrl}?${params.toString()}`;
    };

    if (isGenerated) {
        const title = "Reemitir Termo";
        const message = "Este termo já foi gerado anteriormente. Deseja reemitir o termo novamente?";
        openConfirmModal(title, message, navigateToGenerator);
    } else {
        navigateToGenerator();
    }
};

/**
 * NOVO: Abre o gerador de termo em uma nova aba com um parâmetro para download automático.
 * @param {object} item O objeto do termo da linha clicada.
 */
window.downloadTermoPdf = function(item) {
    const baseUrl = 'geradordetermoprojetov1.html';
    const params = new URLSearchParams();

    // Mapeia os dados do item para os parâmetros da URL
    params.append('fTicket', item.ticket || '');
    params.append('fNome', item.nome || '');
    params.append('fMatricula', item.matricula || '');
    params.append('fCC', item.cc || '');
    params.append('fLocalidade', item.local || '');
    params.append('fModelo', item.marcaModelo || '');
    params.append('fImei', item.imei1 || '');
    params.append('fImei2', item.imei2 || '');
    params.append('fSerie', item.sn || '');
    params.append('fChip', item.chip || '');
    params.append('fTecnico', item.nomeTecnico || '');
    params.append('fModeloTermo', item.modeloTermo || 'A56');
    
    // Adiciona o parâmetro para o download automático
    params.append('autodownload', 'true');

    const url = `${baseUrl}?${params.toString()}`;
    window.open(url, '_blank');
};

function clearTermoForm() {
    inputTermoTicket.value = ''; inputTermoNome.value = ''; inputTermoMatricula.value = '';
    inputTermoLocal.value = ''; inputTermoTecnico.value = ''; inputTermoCC.value = ''; inputTermoChip.value = '';
    selectDeviceStock.value = ''; displayTermoMarcaModelo.value = '';
    displayTermoImei1.value = ''; displayTermoImei2.value = ''; displayTermoSN.value = '';
}

// --- LIGHTBOX MODAL ---
async function openPhotoModal(index) {
    const filteredList = getFilteredStock();
    if (index < 0 || index >= filteredList.length) return;
    
    currentModalIndex = index;
    const item = filteredList[index];
    // Lógica para exibir o nome correto do modelo no modal
    modalDisplayModelo.textContent = item.modelo;
    modalDisplaySN.textContent = item.sn || '-';
    modalDisplayImei1.textContent = item.imei1 || '-';
    modalDisplayImei2.textContent = item.imei2 || '-';

    // Exibe a data e hora formatadas
    if (item.dataEntrada) {
        modalDisplayDataEntrada.textContent = new Date(item.dataEntrada).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } else {
        modalDisplayDataEntrada.textContent = '-';
    }

    const statusContainer = document.getElementById('modalStatusContainer');
    // --- CORREÇÃO: Lógica de status unificada ---
    // Agora o modal exibe o status correto (Disponível, Enviado, Devolvido) em vez de apenas "Em Estoque".
    if (item.status === 'Entregue') {
        statusContainer.innerHTML = `<span class="user-badge entregue extracted-app-style-25" onclick="openEntregaModal(${item.id})">Entregue (Ver)</span>`;
    } else if (item.status === 'Enviado') {
        statusContainer.innerHTML = `<span class="user-badge enviado extracted-app-style-26" onclick="revertSentStatus(${item.id})">Enviado (Reverter)</span>`;
    } else if (item.status === 'Devolvido') {
        statusContainer.innerHTML = `<span class="user-badge devolvido extracted-app-style-27" onclick="selectDeviceAndSwitchToTermo(${item.id})">Devolvido (Reatribuir)</span>`;
    } else {
        // O padrão é "Disponível", com a ação de abrir o modal de vínculo/envio.
        statusContainer.innerHTML = `<span class="user-badge stock extracted-app-style-28" onclick="openStockActionModal(${item.id})">Disponível</span>`;
    }

    // --- NOVO: Lógica para exibir o histórico no modal ---
    if (item.history && item.history.length > 0) {
        modalHistoryList.innerHTML = ''; // Limpa a lista
        item.history.forEach(h => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${h.nome || 'N/A'}</strong> (Mat: ${h.matricula || 'N/A'})<br><small>Ticket: ${h.ticket || 'N/A'} | CC: ${h.cc || 'N/A'}</small>`;
            modalHistoryList.appendChild(li);
        });
        modalHistoryContainer.style.display = 'block';
    } else {
        modalHistoryContainer.style.display = 'none';
    }

    const imgUrl = await getImageUrl(item.photoName);
    modalImg.src = imgUrl ? imgUrl : '';
    photoModal.classList.add('active');
}

function closeModal() {
    if (document.fullscreenElement) document.exitFullscreen();
    photoModal.classList.remove('active'); currentModalIndex = -1;
}

function navigateModal(direction) {
    if (currentModalIndex === -1) return;
    const filteredList = getFilteredStock();
    let newIndex = currentModalIndex + direction;
    if (newIndex >= 0 && newIndex < filteredList.length) openPhotoModal(newIndex);
}

modalClose.addEventListener('click', closeModal);
modalPrev.addEventListener('click', () => navigateModal(-1));
modalNext.addEventListener('click', () => navigateModal(1));
photoModal.addEventListener('click', (e) => { if (e.target === photoModal) closeModal(); });
modalImg.addEventListener('click', () => {
    if (!modalImg.src) return; // Não faz nada se não houver imagem
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        modalImg.requestFullscreen().catch(err => console.error(err));
    }
});

// --- MODO EDIÇÃO INDIVIDUAL COM DROPDOWN FIXED ---
window.startEdit = function(id, currentModelo, currentLocalidade) {
    const item = stockData.find(i => i.id === id);
    if (!item) return;

    const isGrid = (currentViewMode === 'grid');
    
    const modeloContainer = document.getElementById(isGrid ? `grid-modelo-txt-${id}` : `modelo-txt-${id}`);
    const localContainer = document.getElementById(isGrid ? `grid-local-txt-${id}` : `local-txt-${id}`);
    const actionsContainer = document.getElementById(isGrid ? `grid-actions-${id}` : `actions-${id}`);
    
    // --- NOVO: Adiciona o campo de edição para a data ---
    const dataContainer = document.getElementById(isGrid ? `grid-data-txt-${id}` : `data-txt-${id}`);
    const currentData = item.dataEntrada ? new Date(new Date(item.dataEntrada).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '';


    if (!modeloContainer || !localContainer || !actionsContainer) return;

    modeloContainer.innerHTML = `
        <select id="edit-select-${id}" class="edit-select">${generateModelOptions(currentModelo)}</select>
    `;

    localContainer.innerHTML = `
        <select id="edit-local-select-${id}" class="edit-select">${generateLocalityOptions(currentLocalidade)}</select>
    `;

    if (dataContainer) {
        dataContainer.innerHTML = `<input type="datetime-local" id="edit-data-input-${id}" class="edit-input extracted-app-style-29" value="${currentData}">`;
    }


    if (isGrid) {
        actionsContainer.innerHTML = `
            <span class="user-badge stock extracted-app-style-30">Editando...</span>
            <div class="action-btn-group">
                <button class="btn btn-success btn-sm" onclick="saveEdit(${id})">✔</button>
                <button class="btn btn-secondary btn-sm" onclick="renderStockTable()">❌</button>
            </div>
        `;
    } else {
        actionsContainer.innerHTML = `<div class="action-btn-group">
            <button class="btn btn-success btn-sm" onclick="saveEdit(${id})">Salvar</button>
            <button class="btn btn-secondary btn-sm" onclick="renderStockTable()">Cancelar</button>
        </div>`;
    }

    // Foca automaticamente no seletor de localidade para agilizar a edição
    document.getElementById(`edit-local-select-${id}`).focus();
};

window.saveEdit = async function(id) {
    const selectEl = document.getElementById(`edit-select-${id}`);
    const localEl = document.getElementById(`edit-local-select-${id}`);
    const dataEl = document.getElementById(`edit-data-input-${id}`); // --- NOVO: Pega o input da data
    if (!selectEl || !localEl || !dataEl) return;

    const newModelo = selectEl.value;
    const newLocalidade = localEl.value;
    const newDataEntrada = dataEl.value; // --- NOVO: Pega o valor da data
    
    const itemIndex = stockData.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        stockData[itemIndex].modelo = newModelo;
        stockData[itemIndex].localidade = newLocalidade;
        stockData[itemIndex].dataEntrada = newDataEntrada; 
        await saveStockData();
        renderSelectStockOptions();
        renderAllLocalitySelectors();
        renderAllModelSelectors();
        renderStockTable(); // Adicionado para redesenhar a tabela após salvar
    }
};

// --- NOVO MODAL DE DETALHES DE ENTREGA ---
window.openEntregaModal = function(itemId) {
    const item = stockData.find(i => i.id === itemId);
    if (!item || !item.entrega) return;
    currentEntregaModalItemId = itemId; // Armazena o ID do item atual

    document.getElementById('entregaNome').textContent = item.entrega.nome || '-';
    document.getElementById('entregaMatricula').textContent = item.entrega.matricula || '-';
    document.getElementById('entregaCC').textContent = item.entrega.cc || '-';
    document.getElementById('entregaLocal').textContent = item.entrega.localidade || '-';
    document.getElementById('entregaTicket').textContent = item.entrega.ticket || '-';
    document.getElementById('entregaTecnico').textContent = item.entrega.nomeTecnico || '-';

    document.getElementById('entregaModal').classList.add('active');
};

window.closeEntregaModal = function() {
    document.getElementById('entregaModal').classList.remove('active');
    currentEntregaModalItemId = null; // Limpa o ID ao fechar
};

btnRegistrarDevolucao.addEventListener('click', async () => {
    const itemId = currentEntregaModalItemId;
    if (!itemId) return;

    const item = stockData.find(i => i.id === itemId);
    if (!item) { 
        showCustomAlert('Item não encontrado.', 'error'); 
        return; 
    }

    const userName = item.entrega ? item.entrega.nome : 'usuário anterior';
    if (confirm(`Registrar a devolução do aparelho ${item.modelo} (SN: ${item.sn}) por ${userName}?`)) {
        try {
            if (!item.history) {
                item.history = [];
            }
            item.history.push({ ...item.entrega });

            item.entrega = { nome: '', cc: '', matricula: '', localidade: '', ticket: '' };
            item.status = 'Devolvido';
            item.dataDevolucao = new Date().toISOString();

            await saveStockData();
            renderAllUI();
            closeEntregaModal();
            showCustomAlert('Aparelho devolvido e movido para o estoque de usados.', 'success');
        } catch (error) {
            console.error("Erro ao registrar devolução:", error);
            showCustomAlert(`Falha ao registrar a devolução. Detalhes: ${error.message}`, 'error');
        }
    }
});

btnRevertToAvailable.addEventListener('click', async () => {
    const itemId = currentEntregaModalItemId;
    if (!itemId) return;
    const item = stockData.find(i => i.id === itemId);
    if (!item || item.status !== 'Entregue') {
        showCustomAlert('Item não encontrado ou não está com status "Entregue".', 'error');
        return;
    }
    // ALTERADO: Mensagem de confirmação para refletir que o histórico é mantido.
    if (confirm(`Tem certeza que deseja reverter a entrega para "${item.entrega.nome}"? O aparelho voltará para o status "Disponível", mas o registro desta entrega será mantido no histórico de termos.`)) {
        try {
            item.status = 'Disponível';
            item.entrega = { nome: '', cc: '', matricula: '', localidade: '', ticket: '' };
            delete item.dataDevolucao;

            // REMOVIDO: A lógica que removia o termo do histórico.
            // O histórico de termos agora é preservado.

            await saveStockData();
            closeEntregaModal();
            renderAllUI();
            showCustomAlert('Entrega revertida com sucesso. O aparelho está disponível no estoque.', 'success');
        } catch (error) {
            console.error("Erro ao reverter entrega:", error);
            showCustomAlert(`Falha ao reverter a entrega. Detalhes: ${error.message}`, 'error');
        }
    }
});

window.copyInfoToClipboard = async function(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const textToCopy = element.textContent;
    if (!textToCopy || textToCopy === '-') return;

    try {
        await navigator.clipboard.writeText(textToCopy);
        showCustomAlert(`"${textToCopy}" copiado para a área de transferência!`, 'success');
    } catch (err) {
        showCustomAlert('Falha ao copiar o texto.', 'error');
    }
};

window.printZebraLabel = function(itemId) {
    const item = stockData.find(i => i.id === itemId);
    if (!item) {
        showCustomAlert("Item não encontrado no estoque.", 'error');
        return;
    }

    const imei1 = encodeURIComponent(item.imei1 || '');
    const imei2 = encodeURIComponent(item.imei2 || '');
    const sn = encodeURIComponent(item.sn || '');

    const url = `zebra/zebra.html?modelo=celular&imei1=${imei1}&imei2=${imei2}&sn=${sn}`;
    window.location.href = url;
};


window.setModeloTermo = function(modelo) {
    // Atualiza o campo oculto
    document.getElementById('inputTermoModelo').value = modelo;
    
    // Alterna classes CSS
    document.getElementById('btnModelo1').classList.toggle('active', modelo === 'A07');
    document.getElementById('btnModelo2').classList.toggle('active', modelo === 'A56');
};
