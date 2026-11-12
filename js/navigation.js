/* Módulo 6/7 — extraído de app.js. Ordem de carregamento obrigatória. */
// --- Navegação responsiva para celulares e tablets ---
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
mobileMenuToggle?.addEventListener('click', () => document.body.classList.toggle('mobile-menu-open'));
sidebarBackdrop?.addEventListener('click', () => document.body.classList.remove('mobile-menu-open'));

// --- Lógica da Sidebar ---
sidebarToggle.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
    // Salva o estado no localStorage
    if (document.body.classList.contains('sidebar-collapsed')) {
        localStorage.setItem('sidebarState', 'collapsed');
    } else {
        localStorage.setItem('sidebarState', 'expanded');
    }
});

// --- NOVA LÓGICA DE FILTRO COM ANIMAÇÃO DE DESLIZE E ARRASTE ---
const filterGroup = document.getElementById('locationFilterGroup');
const glider = document.getElementById('filterGlider');
const filterButtons = document.querySelectorAll('#locationFilterGroup .btn-filter');
let isGliderInitialized = false; // Flag para controlar a inicialização do filtro

function moveGlider(targetButton) {
    const targetRect = targetButton.getBoundingClientRect();
    const groupRect = filterGroup.getBoundingClientRect();

    glider.style.width = `${targetRect.width}px`;
    glider.style.left = `${targetRect.left - groupRect.left}px`;
}

function activateFilter(targetButton, isInitial = false) {
    if (!targetButton || (targetButton.classList.contains('active') && !isInitial)) return;

    const newFilter = targetButton.dataset.filter;
    if (currentLocationFilter === newFilter && !isInitial) return;

    filterButtons.forEach(btn => btn.classList.remove('active'));
    targetButton.classList.add('active');
    moveGlider(targetButton);

    if (isInitial) return;

    currentLocationFilter = newFilter;
    currentStockPage = 1;

    const contentWrapper = currentViewMode === 'table' ? stockTableWrapper : stockGridWrapper;
    contentWrapper.style.animation = 'contentFadeOut 0.15s ease-out forwards';

    setTimeout(async () => {
        await renderStockTable();
        contentWrapper.style.animation = 'contentFadeIn 0.25s ease-in forwards';
    }, 150);
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => activateFilter(button));
});

// Lógica de arrastar
let isDragging = false;

// Garante que os listeners sejam adicionados ao grupo de filtros
filterGroup.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('btn-filter')) {
        isDragging = true;
        glider.classList.add('dragging'); // Adiciona classe para transição rápida durante o arraste
        // Previne a seleção de texto padrão do navegador durante o arraste
        e.preventDefault();
    }
});

document.addEventListener('mousemove', (e) => { // Alterado para 'document' para um arraste mais suave
    if (!isDragging) return;

    const target = e.target;
    if (target.classList.contains('btn-filter')) {
        // Move o glider visualmente sem ativar o filtro ainda
        moveGlider(target);
    }
});

document.addEventListener('mouseup', (e) => { // Alterado para 'document' para capturar o soltar em qualquer lugar
    if (!isDragging) return;
    isDragging = false;
    glider.classList.remove('dragging'); // Remove a classe para permitir a animação "elástica"

    const target = e.target;
    if (target.classList.contains('btn-filter')) {
        activateFilter(target);
    } else {
        // Se o mouse for solto fora de um botão, volta para o ativo
        const activeButton = filterGroup.querySelector('.btn-filter.active');
        if (activeButton) moveGlider(activeButton);
    }
});

// Garante que o arraste seja cancelado se o mouse sair do grupo
filterGroup.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        glider.classList.remove('dragging'); // Garante que a classe seja removida
        const activeButton = filterGroup.querySelector('.btn-filter.active');
        if (activeButton) moveGlider(activeButton);
    }
});

// --- Lógica de Tema e Configurações ---

function saveAppSettings() {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
}

function applyAppSettings() {
    // Aplica valores das configurações às variáveis de estado
    ITEMS_PER_PAGE = appSettings.itemsPerPage || 12;
    currentViewMode = appSettings.defaultView || 'table';
    appSettings.primaryLocation = appSettings.primaryLocation || 'Canoas'; // Garante um valor padrão

    // Atualiza a UI das configurações para refletir os valores carregados
    if (itemsPerPageSetting) itemsPerPageSetting.value = ITEMS_PER_PAGE;
    if (defaultViewModeSetting) defaultViewModeSetting.value = currentViewMode;
    if (layoutModeSetting) layoutModeSetting.value = appSettings.layout || 'vertical';
    if (primaryLocationSetting) primaryLocationSetting.value = appSettings.primaryLocation;
    
    // --- NOVO: Atualiza o botão de filtro principal ---
    const firstFilterButton = document.querySelector('#locationFilterGroup .btn-filter');
    if (firstFilterButton) {
        firstFilterButton.textContent = appSettings.primaryLocation;
        firstFilterButton.dataset.filter = appSettings.primaryLocation;
    }
    currentLocationFilter = appSettings.primaryLocation; // Define o filtro padrão

    // Aplica o tema
    applyTheme(appSettings.theme);

    // Aplica o layout (vertical ou dock)
    applyLayout(appSettings.layout);

    // --- NOVO: Aplica a visibilidade das abas ---
    applyTabVisibility();
}

function loadAppSettings() {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
        const savedSettings = JSON.parse(saved);
        // --- ALTERADO: Mescla as configurações de visibilidade para não quebrar com novas abas ---
        if (savedSettings.tabVisibility) {
            savedSettings.tabVisibility = { ...appSettings.tabVisibility, ...savedSettings.tabVisibility }; // Merge to keep new defaults
        }
        // Mescla as configurações salvas com as padrões para garantir que novas configurações sejam adicionadas no futuro
        Object.assign(appSettings, savedSettings);
    }
    applyAppSettings();
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if(darkModeToggle) darkModeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        if(darkModeToggle) darkModeToggle.checked = false;
    }
    appSettings.theme = theme;
}

function applyLayout(layout) {
    const body = document.body;
    if (layout === 'dock') {
        body.classList.remove('sidebar-collapsed'); // Garante que não está recolhida
        body.classList.add('dock-layout');
    } else {
        body.classList.remove('dock-layout');
    }
    appSettings.layout = layout;
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
        const theme = darkModeToggle.checked ? 'dark' : 'light';
        appSettings.theme = theme;
        saveAppSettings();
        applyTheme(theme);
    });
}

if (itemsPerPageSetting) {
    itemsPerPageSetting.addEventListener('change', () => {
        const value = parseInt(itemsPerPageSetting.value, 10);
        if (value > 0 && value <= 100) {
            appSettings.itemsPerPage = value;
            ITEMS_PER_PAGE = value;
            saveAppSettings();
            currentStockPage = 1; // Reseta para a primeira página
            renderStockTable();
            showCustomAlert('Configuração de itens por página salva!', 'success');
        } else {
            itemsPerPageSetting.value = appSettings.itemsPerPage; // Reverte para o valor salvo
            showCustomAlert('Por favor, insira um valor entre 1 e 100.', 'warning');
        }
    });
}

if (defaultViewModeSetting) {
    defaultViewModeSetting.addEventListener('change', () => {
        const newMode = defaultViewModeSetting.value;
        appSettings.defaultView = newMode;
        saveAppSettings();
        currentViewMode = newMode; // Aplica a mudança imediatamente
        if (viewToggleCheckbox) {
            viewToggleCheckbox.checked = (currentViewMode === 'grid');
        }
        renderStockTable();
        showCustomAlert('Visualização padrão salva!', 'success');
    });
}

if (layoutModeSetting) {
    layoutModeSetting.addEventListener('change', () => {
        const newLayout = layoutModeSetting.value;
        appSettings.layout = newLayout;
        saveAppSettings();
        applyLayout(newLayout);
        showCustomAlert('Layout de navegação alterado!', 'success');
    });
}

if (primaryLocationSetting) {
    primaryLocationSetting.addEventListener('change', () => {
        const newLocation = primaryLocationSetting.value.trim();
        if (newLocation) {
            const oldLocation = appSettings.primaryLocation;
            appSettings.primaryLocation = newLocation;
            saveAppSettings();
            
            const firstFilterButton = document.querySelector('#locationFilterGroup .btn-filter');
            if (firstFilterButton) {
                firstFilterButton.textContent = newLocation;
                firstFilterButton.dataset.filter = newLocation;
            }
            
            if (currentLocationFilter === oldLocation) {
                currentLocationFilter = newLocation;
            }
            
            const activeButton = filterGroup.querySelector('.btn-filter.active');
            if (activeButton) {
                activateFilter(activeButton, true);
            }
            
            renderAllUI();
            showCustomAlert('Localidade principal salva!', 'success');
        } else {
            primaryLocationSetting.value = appSettings.primaryLocation;
            showCustomAlert('O nome da localidade não pode ser vazio.', 'warning');
        }
    });
}

function initializeSettingsTabs() {
    const tabContainer = document.querySelector('.settings-tabs');
    if (!tabContainer) return;

    const tabButtons = tabContainer.querySelectorAll('.settings-tab-btn');
    const tabContents = document.querySelectorAll('.settings-tab-content');

    tabContainer.addEventListener('click', (e) => {
        const targetButton = e.target.closest('.settings-tab-btn');
        if (!targetButton) return;

        // Previne o comportamento padrão se for um link ou outro elemento
        e.preventDefault();

        const tabId = targetButton.dataset.tab;

        tabButtons.forEach(btn => btn.classList.remove('active'));
        targetButton.classList.add('active');

        tabContents.forEach(content => {
            if (content.id === `tab-${tabId}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // --- NOVO: Renderiza os toggles quando a aba é aberta ---
        if (tabId === 'tabs') {
            renderTabVisibilitySettings();
        }
    }); // Fecha o addEventListener
} // Fecha a função initializeSettingsTabs


function initializeDockPreview() {
    const dockPreviewContainer = document.createElement('div');
    dockPreviewContainer.className = 'dock-preview-container';
    document.body.appendChild(dockPreviewContainer);

    const sidebarMenu = document.querySelector('.sidebar-menu');
    if (!sidebarMenu) return;

    const showPreview = (menuItem) => {
        if (!document.body.classList.contains('dock-layout')) return;

        clearTimeout(dockPreviewTimeout);

        const titleText = menuItem.querySelector('.menu-item-text').textContent;
        let contentHTML = '';

        let viewName = null;
        const onclickAttr = menuItem.getAttribute('onclick');

        if (onclickAttr && onclickAttr.includes('switchView')) {
            viewName = onclickAttr.match(/switchView\('([^']+)'\)/)[1];
            const viewElement = document.getElementById(`view-${viewName}`);
            if (viewElement) {
                const clone = viewElement.cloneNode(true);
                clone.id = '';
                clone.querySelectorAll('script').forEach(s => s.remove());
                contentHTML = `<div class="dock-preview-content">${clone.outerHTML}</div>`;
            }
        } else {
            contentHTML = `
                <div class="simple-preview">
                    ${menuItem.querySelector('svg').outerHTML}
                    <h3>${titleText}</h3>
                    <p>Abre uma página dedicada.</p>
                </div>`;
        }

        dockPreviewContainer.innerHTML = `
            <div class="dock-preview-title">${titleText}</div>
            ${contentHTML}
        `;

        const itemRect = menuItem.getBoundingClientRect();
        const previewWidth = 320;
        dockPreviewContainer.style.left = `${itemRect.left + (itemRect.width / 2) - (previewWidth / 2)}px`;
        dockPreviewContainer.classList.add('visible');
    };

    const hidePreview = () => {
        dockPreviewTimeout = setTimeout(() => {
            dockPreviewContainer.classList.remove('visible');
        }, 200);
    };

    sidebarMenu.addEventListener('mouseover', (e) => {
        const menuItem = e.target.closest('.menu-item');
        if (menuItem) {
            showPreview(menuItem);
        }
    });

    sidebarMenu.addEventListener('mouseout', () => {
        hidePreview();
    });

    dockPreviewContainer.addEventListener('mouseover', () => {
        clearTimeout(dockPreviewTimeout);
    });

    dockPreviewContainer.addEventListener('mouseout', () => {
        hidePreview();
    });
}
