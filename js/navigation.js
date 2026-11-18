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

    // Aplica o tema e restaura a paleta selecionada
    applyTheme(appSettings.theme);
    initializeThemePicker();

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

const THEME_PALETTES = {
    ocean: { name: 'Ocean Blue', accent: '#087e8b' },
    emerald: { name: 'Emerald', accent: '#15966b' },
    purple: { name: 'Purple', accent: '#8254c7' },
    graphite: { name: 'Graphite', accent: '#64748b' },
    sunset: { name: 'Sunset', accent: '#e07836' },
    rose: { name: 'Rose', accent: '#d45c83' }
};
let pendingPalette = appSettings.palette || 'ocean';
let pendingCustomColor = appSettings.customThemeColor || '';

function setThemeAccent(color) {
    const hex = /^#[0-9a-f]{6}$/i.test(color || '') ? color : '#087e8b';
    const rgb = hex.match(/[\da-f]{2}/gi).map(v => parseInt(v, 16));
    const darker = rgb.map(v => Math.round(v * 0.82));
    const hover = rgb.map(v => Math.round(v * 0.9));
    const toHex = values => '#' + values.map(v => v.toString(16).padStart(2, '0')).join('');
    document.documentElement.style.setProperty('--accent-color', hex);
    document.documentElement.style.setProperty('--accent-hover', toHex(hover));
    document.documentElement.style.setProperty('--accent-active', toHex(darker));
    document.documentElement.style.setProperty('--accent-color-subtle', 'rgba(' + rgb.join(',') + ',0.12)');
    document.documentElement.style.setProperty('--menu-item-active-bg', 'rgba(' + rgb.join(',') + ',0.13)');
    document.documentElement.style.setProperty('--input-border-focus', hex);
}
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = false;
    }
    appSettings.theme = theme;
    const palette = appSettings.customThemeColor || (THEME_PALETTES[appSettings.palette || 'ocean'] || THEME_PALETTES.ocean).accent;
    setThemeAccent(palette);
}
function renderThemePreview(palette, customColor = '') {
    const data = THEME_PALETTES[palette] || THEME_PALETTES.ocean;
    const color = customColor || data.accent;
    const grid = document.getElementById('themePaletteGrid');
    if (grid) grid.querySelectorAll('[data-palette]').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.palette === palette && !customColor);
        btn.setAttribute('aria-pressed', String(btn.dataset.palette === palette && !customColor));
    });
    const preview = document.getElementById('themePreview');
    const label = document.getElementById('themePreviewLabel');
    if (preview) preview.style.setProperty('--preview-accent', color);
    if (label) label.textContent = customColor ? 'Personalizado' : data.name;
}
function initializeThemePicker() {
    const grid = document.getElementById('themePaletteGrid');
    const colorInput = document.getElementById('customThemeColor');
    const applyButton = document.getElementById('applyThemeButton');
    const resetButton = document.getElementById('resetThemeButton');
    if (!grid || grid.dataset.initialized) return;
    grid.dataset.initialized = 'true';
    pendingPalette = appSettings.palette || 'ocean';
    pendingCustomColor = appSettings.customThemeColor || '';
    if (colorInput) colorInput.value = pendingCustomColor || (THEME_PALETTES[pendingPalette] || THEME_PALETTES.ocean).accent;
    renderThemePreview(pendingPalette, pendingCustomColor);
    grid.addEventListener('click', e => {
        const button = e.target.closest('[data-palette]');
        if (!button) return;
        pendingPalette = button.dataset.palette;
        pendingCustomColor = '';
        if (colorInput) colorInput.value = THEME_PALETTES[pendingPalette].accent;
        renderThemePreview(pendingPalette);
    });
    colorInput?.addEventListener('input', () => {
        pendingCustomColor = colorInput.value;
        renderThemePreview(pendingPalette, pendingCustomColor);
    });
    applyButton?.addEventListener('click', () => {
        appSettings.palette = pendingPalette;
        appSettings.customThemeColor = pendingCustomColor;
        applyTheme(appSettings.theme || 'light');
        saveAppSettings();
        showCustomAlert('Tema aplicado e salvo!', 'success');
    });
    resetButton?.addEventListener('click', () => {
        pendingPalette = 'ocean';
        pendingCustomColor = '';
        appSettings.palette = 'ocean';
        appSettings.customThemeColor = '';
        if (colorInput) colorInput.value = THEME_PALETTES.ocean.accent;
        renderThemePreview('ocean');
        applyTheme(appSettings.theme || 'light');
        saveAppSettings();
        showCustomAlert('Tema original restaurado!', 'success');
    });
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
