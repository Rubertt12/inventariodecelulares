/* Módulo 5/7 — extraído de app.js. Ordem de carregamento obrigatória. */
// --- NOVO: Funções de Gerenciamento de Modelos ---
function renderModelList() {
    modelList.innerHTML = '';
    phoneModels.forEach(model => {
        const sanitizedId = model.name.replace(/[^a-zA-Z0-9]/g, '');
        const li = document.createElement('li');
        li.className = 'model-list-item';
        li.id = `model-item-${sanitizedId}`;
        li.innerHTML = `
            <span>
                <strong>${model.name}</strong>
                <span class="user-badge stock extracted-app-style-31">Base: ${model.base}</span>
            </span>
            <div class="action-btn-group">
                <button class="btn btn-secondary btn-sm" onclick="startEditModel('${model.name}', '${model.base}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="removeModel('${model.name}')">Remover</button>
            </div>
        `;
        modelList.appendChild(li);
    });
}

function generateModelOptions(selectedValue = '') {
    return phoneModels.map(model => 
        `<option value="${model.name}" ${selectedValue === model.name ? 'selected' : ''}>${model.name}</option>`
    ).join('');
}

function renderAllModelSelectors() {
    inputModelo.innerHTML = generateModelOptions('Galaxy A56');
    batchSelectModelo.innerHTML = '<option value="">(Manter)</option>' + generateModelOptions();
    renderModelList();
}

btnAddNewModel.addEventListener('click', async () => {
    const name = inputNewModelName.value.trim();
    const base = selectNewModelBase.value;

    if (!name) {
        showCustomAlert('Por favor, insira um nome para o novo modelo.', 'warning');
        return;
    }
    if (phoneModels.some(m => m.name.toLowerCase() === name.toLowerCase())) {
        showCustomAlert('Este modelo já existe na lista.', 'error');
        return;
    }

    phoneModels.push({ name, base });
    phoneModels.sort((a, b) => a.name.localeCompare(b.name)); // Mantém a lista ordenada
    await saveModelsToJSONFile();
    renderAllModelSelectors();
    inputNewModelName.value = '';
    showCustomAlert(`Modelo "${name}" adicionado com sucesso!`, 'success');
});

window.removeModel = async function(modelName) {
    if (confirm(`Tem certeza que deseja remover o modelo "${modelName}"?`)) {
        phoneModels = phoneModels.filter(m => m.name !== modelName);
        await saveModelsToJSONFile();
        renderAllModelSelectors();
        showCustomAlert(`Modelo "${modelName}" removido.`, 'success');
    }
};

// --- NOVAS FUNÇÕES: Edição de Modelos ---
window.startEditModel = function(oldName, oldBase) {
    const sanitizedId = oldName.replace(/[^a-zA-Z0-9]/g, '');
    const li = document.getElementById(`model-item-${sanitizedId}`);
    if (!li) return;

    li.innerHTML = `
        <div class="extracted-app-style-32">
            <input type="text" id="edit-model-input-${sanitizedId}" class="input-field extracted-app-style-33" value="${oldName}">
            <select id="edit-model-base-select-${sanitizedId}" class="edit-select extracted-app-style-34">
                <option value="A07" ${oldBase === 'A07' ? 'selected' : ''}>Base: Modelo 1 (Padrão)</option>
                <option value="A56" ${oldBase === 'A56' ? 'selected' : ''}>Base: Modelo 2 (Especial)</option>
            </select>
        </div>
        <div class="action-btn-group">
            <button class="btn btn-success btn-sm" onclick="saveModelEdit('${oldName}')">Salvar</button>
            <button class="btn btn-secondary btn-sm" onclick="renderModelList()">Cancelar</button>
        </div>
    `;
    document.getElementById(`edit-model-input-${sanitizedId}`).focus();
};

window.saveModelEdit = async function(oldName) {
    const sanitizedId = oldName.replace(/[^a-zA-Z0-9]/g, '');
    const nameInput = document.getElementById(`edit-model-input-${sanitizedId}`);
    const baseSelect = document.getElementById(`edit-model-base-select-${sanitizedId}`);
    const newName = nameInput.value.trim();
    const newBase = baseSelect.value;

    if (!newName) {
        showCustomAlert('O nome do modelo não pode ser vazio.', 'warning');
        return;
    }

    // Verifica se o novo nome já existe (e não é o próprio nome antigo)
    if (newName.toLowerCase() !== oldName.toLowerCase() && phoneModels.some(m => m.name.toLowerCase() === newName.toLowerCase())) {
        showCustomAlert('Já existe um modelo com este nome.', 'error');
        return;
    }

    // 1. Atualiza o array de modelos
    const modelIndex = phoneModels.findIndex(m => m.name === oldName);
    if (modelIndex !== -1) {
        phoneModels[modelIndex] = { name: newName, base: newBase };
    }
    phoneModels.sort((a, b) => a.name.localeCompare(b.name));

    // 2. Atualiza todos os itens no estoque e nos termos
    stockData.forEach(item => {
        if (item.modelo === oldName) item.modelo = newName;
    });
    termosData.forEach(termo => {
        if (termo.marcaModelo.includes(oldName)) {
            termo.marcaModelo = termo.marcaModelo.replace(oldName, newName);
        }
    });

    // 3. Salva tudo e atualiza a UI
    await Promise.all([saveModelsToJSONFile(), saveStockData(), saveToTermosTXTFile(), saveToTermosCSVFile()]);
    renderAllUI();
    showCustomAlert('Modelo atualizado com sucesso em todos os registros!', 'success');
};

function renderAllUI() {
    clearBatchSelection();
    renderStockTable();
    renderSelectStockOptions();
    renderAllLocalitySelectors();
    renderAllModelSelectors();
    renderTabVisibilitySettings(); // NOVO
    renderTermosTable();
    renderCustomFilterList();
    renderUsedStockTable();
    renderDashboard();
}

// --- NOVO: Função de Inicialização ---
async function loadInitialState() {
    renderAllLocalitySelectors();
    renderCustomFilterButtons();
    renderAllModelSelectors();

    let savedHandle;
    if (desktopFiles) {
        const savedDirectory = await desktopFiles.getSavedDirectory();
        if (savedDirectory) savedHandle = new DesktopDirectoryHandle('', savedDirectory.name);
    } else {
        savedHandle = await idb.get('dirHandle');
        if (savedHandle === LOCAL_STORAGE_SENTINEL) savedHandle = new LocalDirectoryHandle();
    }
    if (savedHandle) {
        console.log("Tentando reconectar à pasta salva...");
        setBrandConnectionStatus('loading');
        if (await connectToDirectory(savedHandle)) {
            setBrandConnectionStatus('connected');
        } else {
            setBrandConnectionStatus('error');
        }
    }
    // --- NOVO: Renderiza o dashboard no carregamento inicial ---
    renderDashboard();
}

// --- NOVA FUNÇÃO: Renderiza os dados do Dashboard ---
function renderDashboard() {
    const statDisponiveis = document.getElementById('statDisponiveis');
    const statEntregues = document.getElementById('statEntregues');
    const statUsados = document.getElementById('statUsados');
    const statEnviados = document.getElementById('statEnviados');

    if (!statDisponiveis) return; // Sai se a view do dashboard não estiver carregada

    statDisponiveis.textContent = stockData.filter(item => item.status === 'Disponível').length;
    statEntregues.textContent = stockData.filter(item => item.status === 'Entregue').length;
    statUsados.textContent = stockData.filter(item => item.status === 'Devolvido').length;
    // --- NOVO: Adiciona a contagem para o status "Enviado" ---
    if (statEnviados) statEnviados.textContent = stockData.filter(item => item.status === 'Enviado').length;

    // --- NOVO: Chama a renderização da atividade recente ---
    renderRecentActivity();
    renderLocationDistributionChart();
}

// --- ALTERADO: Renderiza o gráfico de barras da distribuição por localidade ---
function renderLocationDistributionChart() {
    const container = document.getElementById('locationChartContainer');
    if (!container) return;

    // 1. Conta os aparelhos por localidade (excluindo os já devolvidos/em estoque de usados)
    const activeItems = stockData.filter(item => item.status !== 'Devolvido');
    const locationCounts = activeItems.reduce((acc, item) => {
        const location = item.localidade || appSettings.primaryLocation; // Usa a localidade principal como fallback
        acc[location] = (acc[location] || 0) + 1;
        return acc;
    }, {});

    const totalItems = activeItems.length;

    if (totalItems === 0) {
        container.innerHTML = '<div class="activity-placeholder extracted-app-style-35">Não há dispositivos ativos para exibir no gráfico.</div>';
        return;
    }

    // 2. Ordena as localidades por contagem
    const sortedLocations = Object.entries(locationCounts).sort(([, a], [, b]) => b - a);

    // Encontra a contagem máxima para escalar as barras
    const maxCount = sortedLocations.length > 0 ? sortedLocations[0][1] : 0;

    // 3. Define uma paleta de cores para as barras
    const colors = ['#0078d4', '#107c41', '#a16207', '#d13438', '#881798', '#005a9e', '#0d6334', '#757575'];
    
    // 4. Monta os itens do gráfico de barras
    const barChartItems = sortedLocations.map(([location, count], index) => {
        const color = colors[index % colors.length];
        const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

        return `
            <li class="bar-chart-item">
                <span class="bar-chart-label" title="${location}">${location}</span>
                <div class="bar-chart-bar-container">
                    <div class="bar-chart-bar" style="width: ${barWidth}%; background-color: ${color};"></div>
                </div>
                <span class="bar-chart-value">${count}</span>
            </li>
        `;
    }).join('');

    // 5. Insere o gráfico no DOM
    container.innerHTML = `
        <ul class="bar-chart-list">${barChartItems}</ul>
    `;
}

// --- NOVA FUNÇÃO: Renderiza a lista de atividades recentes ---
function renderRecentActivity() {
    const listElement = document.getElementById('recentActivityList');
    if (!listElement) return;

    let activities = [];

    stockData.forEach(item => {
        // Atividade: Item Adicionado
        if (item.dataEntrada) {
            activities.push({
                type: 'added',
                date: new Date(item.dataEntrada),
                item: item
            });
        }
        // Atividade: Item Entregue
        if (item.status === 'Entregue' && item.entrega && item.entrega.dataEntrega) {
            activities.push({
                type: 'delivered',
                date: new Date(item.entrega.dataEntrega),
                item: item
            });
        }
        // Atividade: Item Devolvido
        if (item.status === 'Devolvido' && item.dataDevolucao) {
            activities.push({
                type: 'returned',
                date: new Date(item.dataDevolucao),
                item: item
            });
        }
        // --- NOVO: Atividade: Item Enviado ---
        if (item.status === 'Enviado' && item.dataEnvio) {
            activities.push({
                type: 'sent',
                date: new Date(item.dataEnvio),
                item: item
            });
        }
    });

    // Ordena as atividades da mais recente para a mais antiga
    activities.sort((a, b) => b.date - a.date);

    // Pega apenas as 5 atividades mais recentes
    const recentActivities = activities.slice(0, 5);

    if (recentActivities.length === 0) {
        listElement.innerHTML = `
            <li class="activity-placeholder">
                <p>Nenhuma atividade recente para exibir.</p>
            </li>`;
        return;
    }

    listElement.innerHTML = ''; // Limpa a lista

    const icons = {
        added: {
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14m-7-7h14" /></svg>',
            color: '#107c41' // Verde
        },
        delivered: {
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>',
            color: '#0078d4' // Azul
        },
        returned: {
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 10l-5 5 5 5" /><path d="M20 4v7a4 4 0 0 1-4 4H4" /></svg>',
            color: '#a16207' // Amarelo/Laranja
        },
        // --- NOVO: Ícone para a atividade "Enviado" ---
        sent: {
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
            color: '#6d28d9' // Roxo
        }
    };

    recentActivities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        const { item } = activity;
        let detailsText = '';

        switch (activity.type) {
            case 'added':
                detailsText = `Novo aparelho <strong>${item.modelo}</strong> (SN: ${item.sn}) foi adicionado ao estoque.`;
                break;
            case 'delivered': { // NOVO: Usa nomeEntregador para o log de atividade
                const deliveredTo = `<strong>${item.entrega.nome}</strong>`;
                let deliveredBy = '';
                if (item.entrega.nomeTecnico && item.entrega.nomeTecnico.trim() !== '') {
                    deliveredBy = ` por <strong>${item.entrega.nomeTecnico}</strong>`;
                }
                detailsText = `O aparelho <strong>${item.modelo}</strong> foi entregue para ${deliveredTo}${deliveredBy}.`;
                break;
            }
            case 'returned':
                const lastUser = item.history && item.history.length > 0 ? item.history[item.history.length - 1].nome : 'um usuário'; // NOVO: Pega o nome do último usuário do histórico
                detailsText = `O aparelho <strong>${item.modelo}</strong> foi devolvido por <strong>${lastUser}</strong>.`;
                break;
            // --- NOVO: Texto para a atividade "Enviado" ---
            case 'sent':
                detailsText = `O aparelho <strong>${item.modelo}</strong> (SN: ${item.sn}) foi marcado como enviado.`;
                break;
        }

        li.innerHTML = `
            <div class="activity-icon" style="background-color: ${icons[activity.type].color};">
                ${icons[activity.type].icon}
            </div>
            <div class="activity-details">
                <p>${detailsText}</p>
            </div>
            <span class="activity-time">${timeAgo(activity.date)}</span>
        `;
        listElement.appendChild(li);
    });
}
// --- NOVO: Funções de Gerenciamento de Localidades ---
function renderLocalityList() {
    localityList.innerHTML = '';
    localities.forEach(loc => {
        // Criamos um ID seguro para o elemento da lista
        const sanitizedId = loc.replace(/[^a-zA-Z0-9]/g, '');
        const li = document.createElement('li');
        li.className = 'locality-list-item';
        li.id = `locality-item-${sanitizedId}`;
        li.innerHTML = `
            <span><strong>${loc}</strong></span>
            <div class="action-btn-group">
                <button class="btn btn-secondary btn-sm" onclick="startEditLocality('${loc}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="removeLocality('${loc}')">Remover</button>
            </div>
        `;
        localityList.appendChild(li);
    });
}

function generateLocalityOptions(selectedValue = '') {
    return localities.map(loc => 
        `<option value="${loc}" ${selectedValue === loc ? 'selected' : ''}>${loc}</option>`
    ).join('');
}

function renderAllLocalitySelectors() {
    inputLocalidade.innerHTML = generateLocalityOptions(appSettings.primaryLocation);
    batchSelectLocalidade.innerHTML = '<option value="">(Manter)</option>' + generateLocalityOptions();
    renderLocalityList();
    // CORREÇÃO: Popula o <select> da configuração de localidade principal
    if (primaryLocationSetting) {
        primaryLocationSetting.innerHTML = generateLocalityOptions(appSettings.primaryLocation);
    }
}

btnAddNewLocality.addEventListener('click', async () => {
    const name = inputNewLocalityName.value.trim();
    if (!name) {
        showCustomAlert('Por favor, insira um nome para a nova localidade.', 'warning');
        return;
    }
    if (localities.some(loc => loc.toLowerCase() === name.toLowerCase())) {
        showCustomAlert('Esta localidade já existe na lista.', 'error');
        return;
    }
    localities.push(name);
    localities.sort((a, b) => a.localeCompare(b));
    await saveLocalitiesToJSONFile();
    renderAllLocalitySelectors();
    inputNewLocalityName.value = '';
    showCustomAlert(`Localidade "${name}" adicionada com sucesso!`, 'success');
});

window.removeLocality = async function(localityName) {
    if (confirm(`Tem certeza que deseja remover a localidade "${localityName}"?`)) {
        localities = localities.filter(loc => loc !== localityName);
        await saveLocalitiesToJSONFile();
        renderAllLocalitySelectors();
        showCustomAlert(`Localidade "${localityName}" removida.`, 'success');
    }
};

// --- NOVAS FUNÇÕES: Edição de Localidades ---
window.startEditLocality = function(oldName) {
    const sanitizedId = oldName.replace(/[^a-zA-Z0-9]/g, '');
    const li = document.getElementById(`locality-item-${sanitizedId}`);
    if (!li) return;

    // Substitui o conteúdo do item da lista por um campo de input e botões de ação
    li.innerHTML = `
        <input type="text" id="edit-locality-input-${sanitizedId}" class="input-field extracted-app-style-36" value="${oldName}">
        <div class="action-btn-group">
            <button class="btn btn-success btn-sm" onclick="saveLocalityEdit('${oldName}')">Salvar</button>
            <button class="btn btn-secondary btn-sm" onclick="renderLocalityList()">Cancelar</button>
        </div>
    `;
    document.getElementById(`edit-locality-input-${sanitizedId}`).focus();
};

/**
 * NOVO: Reverte o status de um item de 'Enviado' para 'Disponível'.
 * Pede confirmação antes de executar a ação.
 */
window.revertSentStatus = async function(id) {
    const item = stockData.find(i => i.id === id);
    if (!item) {
        showCustomAlert('Item não encontrado.', 'error');
        return;
    }

    const title = "Reverter Status 'Enviado'";
    const message = `Tem certeza que deseja reverter o status do item <strong>${item.modelo}</strong> (SN: ${item.sn || 'N/A'}) para "Disponível"?`;

    const revertAction = async () => {
        item.status = 'Disponível';
        item.dataEnvio = null; // Limpa a data de envio
        await saveStockData();
        renderAllUI();
        showCustomAlert('Status revertido para "Disponível" com sucesso!', 'success');
    };

    openConfirmModal(title, message, revertAction);
};

/**
 * ALTERADO: Copia os dados de um item. Se não houver usuário, abre um modal simples para inserir o nome apenas para a cópia.
 */
window.copyItemData = async function(id) {
    const item = stockData.find(i => i.id === id);
    if (!item) {
        showCustomAlert('Item não encontrado.', 'error');
        return;
    }
    
    if (item.status === 'Entregue' && item.entrega?.nome) {
        const textToCopy = `Modelo: ${item.modelo}\nLocalidade: ${item.localidade}\nIMEI 1: ${item.imei1 || 'N/A'}\nIMEI 2: ${item.imei2 || 'N/A'}\nS/N: ${item.sn || 'N/A'}\nUsuário: ${item.entrega.nome}`;
        try {
            await navigator.clipboard.writeText(textToCopy);
            showCustomAlert('Dados do aparelho e usuário copiados!', 'success');
        } catch (err) {
            showCustomAlert('Falha ao copiar dados para a área de transferência.', 'error');
        }
    } else {
        // Se não tem usuário, abre o novo modal simples.
        openSimpleCopyModal(id);
    }
};

/**
 * NOVO: Abre o modal para inserir um nome para a cópia.
 */
function openSimpleCopyModal(id) {
    const item = stockData.find(i => i.id === id);
    if (!item) return;

    simpleCopyId = id;
    simpleCopyItemInfo.innerHTML = `Para copiar os dados do <strong>${item.modelo}</strong> (SN: ${item.sn || 'N/A'}), insira o nome do colaborador abaixo.`;
    simpleCopyNome.value = '';
    simpleCopyModal.classList.add('active');
    simpleCopyNome.focus();
}

/**
 * NOVO: Fecha o modal de cópia simples.
 */
function closeSimpleCopyModal() {
    simpleCopyModal.classList.remove('active');
    simpleCopyId = null;
}

// Listeners para o novo modal de cópia simples
simpleCopyModalClose.addEventListener('click', closeSimpleCopyModal);
simpleCopyModal.addEventListener('click', (e) => {
    if (e.target === simpleCopyModal) {
        closeSimpleCopyModal();
    }
});

btnSimpleCopyConfirm.addEventListener('click', async () => {
    if (!simpleCopyId) return;

    const item = stockData.find(i => i.id === simpleCopyId);
    if (!item) {
        showCustomAlert('Ocorreu um erro ao encontrar o item.', 'error');
        return;
    }

    const nome = simpleCopyNome.value.trim();
    if (!nome) {
        showCustomAlert('O nome do colaborador é obrigatório.', 'warning');
        return;
    }

    const textToCopy = `Modelo: ${item.modelo}\nLocalidade: ${item.localidade}\nIMEI 1: ${item.imei1 || 'N/A'}\nIMEI 2: ${item.imei2 || 'N/A'}\nS/N: ${item.sn || 'N/A'}\nUsuário: ${nome}`;
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        showCustomAlert('Dados do aparelho e usuário copiados!', 'success');
        closeSimpleCopyModal();
    } catch (err) {
        console.error("Falha ao copiar para a área de transferência:", err);
        showCustomAlert('Falha ao copiar dados para a área de transferência. Verifique as permissões do navegador.', 'error');
    }
});

window.saveLocalityEdit = async function(oldName) {
    const sanitizedId = oldName.replace(/[^a-zA-Z0-9]/g, '');
    const input = document.getElementById(`edit-locality-input-${sanitizedId}`);
    const newName = input.value.trim();

    if (!newName) {
        showCustomAlert('O nome da localidade não pode ser vazio.', 'warning');
        return;
    }

    if (newName.toLowerCase() !== oldName.toLowerCase() && localities.some(loc => loc.toLowerCase() === newName.toLowerCase())) {
        showCustomAlert('Já existe uma localidade com este nome.', 'error');
        return;
    }

    // 1. Atualiza a localidade no array principal de localidades
    const index = localities.findIndex(loc => loc === oldName);
    if (index !== -1) {
        localities[index] = newName;
    }
    localities.sort((a, b) => a.localeCompare(b));

    // 2. Atualiza a configuração de localidade principal, se aplicável
    if (appSettings.primaryLocation === oldName) {
        appSettings.primaryLocation = newName;
        saveAppSettings();
        
        const firstFilterButton = document.querySelector('#locationFilterGroup .btn-filter');
        if (firstFilterButton) {
            firstFilterButton.textContent = newName;
            firstFilterButton.dataset.filter = newName;
        }
        
        if (currentLocationFilter === oldName) {
            currentLocationFilter = newName;
        }
    }

    // 3. Atualiza todos os itens no estoque (localidade, entrega e histórico de uso)
    stockData.forEach(item => {
        if (item.localidade === oldName) {
            item.localidade = newName;
        }
        if (item.entrega && item.entrega.localidade === oldName) {
            item.entrega.localidade = newName;
        }
        if (item.history && item.history.length > 0) {
            item.history.forEach(h => {
                if (h.localidade === oldName) {
                    h.localidade = newName;
                }
            });
        }
    });

    // 4. Atualiza o histórico de termos de saída
    termosData.forEach(termo => {
        if (termo.local === oldName) {
            termo.local = newName;
        }
    });

    // 5. Salva todas as alterações nos arquivos e atualiza a UI
    await Promise.all([
        saveLocalitiesToJSONFile(),
        saveStockData(),
        saveToTermosTXTFile(),
        saveToTermosCSVFile()
    ]);
    
    renderAllUI(); // Re-renderiza tudo para refletir as mudanças
    showCustomAlert('Localidade atualizada com sucesso em todos os registros!', 'success');
};

// --- NOVO: Funções de Gerenciamento de Filtros Personalizados ---

function renderCustomFilterList() {
    filterList.innerHTML = '';
    customFilters.forEach(filter => {
        const sanitizedId = filter.name.replace(/[^a-zA-Z0-9]/g, '');
        const li = document.createElement('li');
        li.className = 'locality-list-item'; // Reutilizando estilo
        li.id = `filter-item-${sanitizedId}`;
        li.innerHTML = `
            <span>
                <strong>${filter.name}</strong>
                <br><small class="extracted-app-style-37">Busca por: "${filter.term}"</small>
            </span>
            <button class="btn btn-danger btn-sm" onclick="removeFilter('${filter.name}')">Remover</button>
        `;
        filterList.appendChild(li);
    });
}

function renderCustomFilterButtons() {
    customFiltersContainer.innerHTML = '';
    // Itera sobre os filtros personalizados e cria um botão para cada um
    customFilters.forEach(filter => {
        const button = document.createElement('button');
        button.className = 'btn-filter';
        button.dataset.filter = filter.name;
        button.textContent = filter.name;
        // Adiciona o listener de clique diretamente ao novo botão
        button.addEventListener('click', () => activateFilter(button));
        customFiltersContainer.appendChild(button);
    });
}

btnAddNewFilter.addEventListener('click', async () => {
    const name = inputNewFilterName.value.trim();
    const term = inputNewFilterTerm.value.trim();

    if (!name || !term) {
        showCustomAlert('Preencha o nome e o termo de busca do filtro.', 'warning');
        return;
    }
    if (customFilters.some(f => f.name.toLowerCase() === name.toLowerCase())) {
        showCustomAlert('Já existe um filtro com este nome.', 'error');
        return;
    }

    customFilters.push({ name, term });
    customFilters.sort((a, b) => a.name.localeCompare(b.name));
    await saveFiltersToJSONFile();

    renderCustomFilterList();
    renderCustomFilterButtons();
    inputNewFilterName.value = '';
    inputNewFilterTerm.value = '';
    showCustomAlert(`Filtro "${name}" adicionado com sucesso!`, 'success');
});

window.removeFilter = async function(filterName) {
    customFilters = customFilters.filter(f => f.name !== filterName);
    await saveFiltersToJSONFile();
    renderCustomFilterList();
    renderCustomFilterButtons();
    showCustomAlert(`Filtro "${filterName}" removido.`, 'success');
};

// --- NOVAS FUNÇÕES: Modal de Ação para Itens em Estoque ---
window.openStockActionModal = function(id) {
    const item = stockData.find(i => i.id === id);
    if (!item) return;

    currentStockActionItemId = id;
    stockActionItemInfo.innerHTML = `O que você deseja fazer com o <strong>${item.modelo}</strong> (SN: ${item.sn || 'N/A'})?`;
    stockActionModal.classList.add('active');
};

window.closeStockActionModal = function() {
    stockActionModal.classList.remove('active');
    currentStockActionItemId = null;
};

stockActionVincular.addEventListener('click', () => {
    if (currentStockActionItemId) {
        selectDeviceAndSwitchToTermo(currentStockActionItemId);
        closeStockActionModal();
    }
});

stockActionMarcarEnviado.addEventListener('click', async () => {
    if (!currentStockActionItemId) return;

    const item = stockData.find(i => i.id === currentStockActionItemId);
    if (item) {
        if (confirm(`Tem certeza que deseja marcar o item ${item.modelo} (SN: ${item.sn}) como "Enviado"?`)) {
            item.status = 'Enviado';
            // --- NOVO: Adiciona a data do envio ---
            item.dataEnvio = new Date().toISOString();
            await saveStockData();
            
            // Limpa a seleção se o item estava selecionado em lote
            if (selectedItemIds.has(item.id)) {
                selectedItemIds.delete(item.id);
                updateBatchPanelUI();
            }

            closeStockActionModal();
            renderAllUI();
            showCustomAlert('Item marcado como "Enviado" com sucesso!', 'success');
        }
    }
});

// --- NOVO: Marcar como Devolvido a partir do modal de ação ---
stockActionMarcarDevolvido.addEventListener('click', async () => {
    if (!currentStockActionItemId) return;

    const item = stockData.find(i => i.id === currentStockActionItemId);
    if (item) {
        const title = "Marcar como Devolvido";
        const message = `Tem certeza que deseja marcar o item <strong>${item.modelo}</strong> (SN: ${item.sn || 'N/A'}) como "Devolvido"? Ele será movido para o estoque de usados.`;

        const markAsDevolvidoAction = async () => {
            item.status = 'Devolvido';
            item.dataDevolucao = new Date().toISOString(); // Adiciona a data da devolução
            await saveStockData();
            
            if (selectedItemIds.has(item.id)) { selectedItemIds.delete(item.id); updateBatchPanelUI(); }

            closeStockActionModal();
            renderAllUI();
            showCustomAlert('Item marcado como "Devolvido" com sucesso!', 'success');
        };

        openConfirmModal(title, message, markAsDevolvidoAction);
    }
});

// Adiciona listeners para fechar o modal
stockActionModal.addEventListener('click', (e) => { if (e.target === stockActionModal) closeStockActionModal(); });

// --- NOVO: Funções para Estoque de Usados e Reatribuição ---
function renderUsedStockTable() {
    usedStockTableBody.innerHTML = '';
    const usedItems = stockData.filter(item => item.status === 'Devolvido');

    if (usedItems.length === 0) {
        usedStockTableBody.innerHTML = '<tr><td colspan="4" class="extracted-app-style-38">Nenhum item no estoque de usados.</td></tr>';
        return;
    }

    usedItems.sort((a, b) => new Date(b.dataDevolucao) - new Date(a.dataDevolucao));

    usedItems.forEach(item => {
        const tr = document.createElement('tr');
        // --- ALTERADO: Usa o último histórico para obter o nome de quem devolveu ---
        const lastHistoryEntry = item.history && item.history.length > 0 ? item.history[item.history.length - 1] : null;
        const devolvidoPor = lastHistoryEntry ? lastHistoryEntry.nome : 'Não informado';

        const dataDevolucao = item.dataDevolucao ? new Date(item.dataDevolucao).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';

        tr.innerHTML = `
            <td><strong>${item.modelo}</strong><br><small class="extracted-app-style-39">SN: ${item.sn || 'N/A'}</small></td>
            <td id="devolvido-por-${item.id}"><strong>${devolvidoPor}</strong></td>
            <td>${dataDevolucao}</td>
            <td class="action-cell" id="actions-devolvido-${item.id}">
                <div class="action-btn-group">
                    <button class="btn btn-sm" onclick="selectDeviceAndSwitchToTermo(${item.id})">Reatribuir</button>
                    <button class="btn btn-secondary btn-sm" onclick="startEditDevolvidoPor(${item.id})">Editar</button>                    
                </div>
            </td>
        `;
        usedStockTableBody.appendChild(tr);
    });
}

// --- NOVAS FUNÇÕES: Edição de Devolução ---
window.startEditDevolvidoPor = function(id) {
    const item = stockData.find(i => i.id === id);
    if (!item) return;

    const devolvidoPorCell = document.getElementById(`devolvido-por-${id}`);
    const actionsCell = document.getElementById(`actions-devolvido-${id}`);
    if (!devolvidoPorCell || !actionsCell) return;

    const lastHistoryEntry = item.history && item.history.length > 0 ? item.history[item.history.length - 1] : null;
    const currentName = lastHistoryEntry ? lastHistoryEntry.nome : '';

    devolvidoPorCell.innerHTML = `<input type="text" id="edit-devolvido-input-${id}" class="input-field extracted-app-style-40" value="${currentName}">`;

    actionsCell.innerHTML = `
        <div class="action-btn-group">
            <button class="btn btn-success btn-sm" onclick="saveEditDevolvidoPor(${item.id})">Salvar</button>
            <button class="btn btn-secondary btn-sm" onclick="renderUsedStockTable()">Cancelar</button>
        </div>
    `;
    document.getElementById(`edit-devolvido-input-${id}`).focus();
};

// --- NOVA FUNÇÃO: Renderiza os toggles de visibilidade das abas ---
function renderTabVisibilitySettings() {
    const container = document.getElementById('tab-tabs');
    if (!container) return;

    // Limpa o container, mas mantém o parágrafo de ajuda se ele existir
    const helpText = container.querySelector('p');
    container.innerHTML = '';
    if (helpText) container.appendChild(helpText);

    manageableTabs.forEach(tab => {
        const isVisible = appSettings.tabVisibility[tab.id] !== false; // O padrão é true

        const settingItem = document.createElement('div');
        settingItem.className = 'setting-item';
        settingItem.innerHTML = `
            <div>
                <strong>${tab.label}</strong>
                <p class="setting-item-description">Exibir a aba "${tab.label}" no menu principal.</p>
            </div>
            <label class="fluent-switch">
                <input type="checkbox" id="toggle-tab-${tab.id}" ${isVisible ? 'checked' : ''}>
                <span class="switch-slider"></span>
            </label>
        `;
        container.appendChild(settingItem);

        const toggle = document.getElementById(`toggle-tab-${tab.id}`);
        toggle.addEventListener('change', () => {
            appSettings.tabVisibility[tab.id] = toggle.checked;
            saveAppSettings();
            applyTabVisibility();
        });
    });
}

window.saveEditDevolvidoPor = async function(id) {
    const item = stockData.find(i => i.id === id);
    if (!item) return;

    const input = document.getElementById(`edit-devolvido-input-${id}`);
    const newName = input.value.trim();

    if (!item.history) item.history = [];
    if (item.history.length > 0) {
        item.history[item.history.length - 1].nome = newName;
    } else {
        item.history.push({ nome: newName, matricula: '', cc: '', localidade: '', ticket: '', dataEntrega: item.dataDevolucao });
    }

    await saveStockData();
    renderUsedStockTable();
    showCustomAlert('Informação de devolução atualizada!', 'success');
};

// --- NOVA FUNÇÃO: Seleciona o dispositivo e muda para a aba de termos ---
window.selectDeviceAndSwitchToTermo = function(id) {
    const item = stockData.find(i => i.id === id);
    if (!item) {
        showCustomAlert('Item não encontrado.', 'error');
        return;
    }

    // 1. Muda para a view de termos
    switchView('termos');

    // 2. Constrói o texto exato que aparece na opção do datalist
    const deviceText = `[${item.modelo.includes('Galaxy') ? `Galaxy ${item.modelo}` : item.modelo}] SN: ${item.sn || 'Sem S/N'} - Loc: ${item.localidade || 'Canoas'}`;
    
    // 3. Define o valor do input de busca
    selectDeviceStock.value = deviceText;

    // 4. Dispara o evento 'change' para que a lógica de preenchimento seja executada
    selectDeviceStock.dispatchEvent(new Event('change'));
};
