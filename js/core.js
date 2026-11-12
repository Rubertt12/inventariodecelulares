/* Módulo 1/7 — extraído de app.js. Ordem de carregamento obrigatória. */
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const placeholderText = document.getElementById('placeholderText');
const btnActionCam = document.getElementById('btnActionCam');
const btnCapture = document.getElementById('btnCapture');
const inputModelo = document.getElementById('inputModelo');
const inputLocalidade = document.getElementById('inputLocalidade');
const inputDataEntrada = document.getElementById('inputDataEntrada'); // NOVO
const inputImei1 = document.getElementById('inputImei1');
const inputImei2 = document.getElementById('inputImei2');
const inputSN = document.getElementById('inputSN');
const btnAddToStock = document.getElementById('btnAddToStock');
const btnPasteOcr = document.getElementById('btnPasteOcr');

const stockTableBody = document.getElementById('stockTableBody');
const usedStockTableBody = document.getElementById('usedStockTableBody');
const btnClearStock = document.getElementById('btnClearStock');
const btnSyncDates = document.getElementById('btnSyncDates'); // NOVO
const btnExportStockExcel = document.getElementById('btnExportStockExcel');

const btnConnectDir = document.getElementById('btnConnectDir');
const dbDot = document.getElementById('dbDot');
const dbStatusText = document.getElementById('dbStatusText');

const inputSearchStock = document.getElementById('inputSearchStock');
const stockTableWrapper = document.getElementById('stockTableWrapper');
const stockGridWrapper = document.getElementById('stockGridWrapper');
const stockGridContainer = document.getElementById('stockGridContainer');

// --- ALTERADO: Substituídos os botões antigos pelo elemento do Switch ---
const viewToggleCheckbox = document.getElementById('viewToggleCheckbox');

// Elementos de Edição em Lote
const batchActionsPanel = document.getElementById('batchActionsPanel');
const batchCountText = document.getElementById('batchCountText');
const batchSelectModelo = document.getElementById('batchSelectModelo');
const batchSelectLocalidade = document.getElementById('batchSelectLocalidade');
const btnApplyBatchEdit = document.getElementById('btnApplyBatchEdit');
const btnCancelBatchEdit = document.getElementById('btnCancelBatchEdit');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');

const photoModal = document.getElementById('photoModal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalDisplayModelo = document.getElementById('modalDisplayModelo');
const modalDisplaySN = document.getElementById('modalDisplaySN');
const modalDisplayImei1 = document.getElementById('modalDisplayImei1');
const modalDisplayImei2 = document.getElementById('modalDisplayImei2');
const modalDisplayDataEntrada = document.getElementById('modalDisplayDataEntrada');

const btnSaveTermo = document.getElementById('btnSaveTermo');
const selectDeviceStock = document.getElementById('selectDeviceStock');
const devicesDataList = document.getElementById('devicesDataList');
const termosTableBody = document.getElementById('termosTableBody');
const inputSearchTermos = document.getElementById('inputSearchTermos'); // NOVO
const btnExportTermosHistory = document.getElementById('btnExportTermosHistory');

const inputTermoTicket = document.getElementById('inputTermoTicket');
const inputTermoNome = document.getElementById('inputTermoNome');
const inputTermoMatricula = document.getElementById('inputTermoMatricula');
const inputTermoLocal = document.getElementById('inputTermoLocal');
const inputTermoTecnico = document.getElementById('inputTermoTecnico'); // NOVO
const inputTermoCC = document.getElementById('inputTermoCC');
const inputTermoModelo = document.getElementById('inputTermoModelo');
const inputTermoChip = document.getElementById('inputTermoChip');

const displayTermoMarcaModelo = document.getElementById('displayTermoMarcaModelo');
const btnExportNewTermos = document.getElementById('btnExportNewTermos');
const displayTermoImei1 = document.getElementById('displayTermoImei1');
const displayTermoImei2 = document.getElementById('displayTermoImei2');
const displayTermoSN = document.getElementById('displayTermoSN');
const displayTermoHistory = document.getElementById('displayTermoHistory');
const termoHistoryList = document.getElementById('termoHistoryList');
const modalHistoryContainer = document.getElementById('modalHistoryContainer');
const modalHistoryList = document.getElementById('modalHistoryList');

// --- NOVO: Elementos do Modal de Notificação ---
const notificationModal = document.getElementById('notificationModal');
const notificationIcon = document.getElementById('notificationIcon');
const notificationTitle = document.getElementById('notificationTitle');
const notificationMessage = document.getElementById('notificationMessage');
const notificationCloseBtn = document.getElementById('notificationCloseBtn');

// --- NOVO: Elementos de Gerenciamento de Modelos ---
const inputNewModelName = document.getElementById('inputNewModelName');
const selectNewModelBase = document.getElementById('selectNewModelBase');
const btnAddNewModel = document.getElementById('btnAddNewModel');
const modelList = document.getElementById('modelList');

// --- NOVO: Elementos de Gerenciamento de Localidades ---
const inputNewLocalityName = document.getElementById('inputNewLocalityName');
const btnAddNewLocality = document.getElementById('btnAddNewLocality');
const localityList = document.getElementById('localityList');

const sidebarToggle = document.getElementById('sidebarToggle');

// --- NOVO: Elementos de Configurações ---
const darkModeToggle = document.getElementById('darkModeToggle');
const itemsPerPageSetting = document.getElementById('itemsPerPageSetting');
const defaultViewModeSetting = document.getElementById('defaultViewModeSetting');
const layoutModeSetting = document.getElementById('layoutModeSetting');
const primaryLocationSetting = document.getElementById('primaryLocationSetting');
const localitiesDatalist = document.getElementById('localitiesDatalist');

// --- NOVO: Elementos de conexão de pasta nas Configurações ---
const dbDotSettings = document.getElementById('dbDotSettings');
const dbStatusTextSettings = document.getElementById('dbStatusTextSettings');
const btnConnectDirSettings = document.getElementById('btnConnectDirSettings');


// --- NOVO: Elementos do Modal de Ação em Estoque ---
const stockActionModal = document.getElementById('stockActionModal');
const stockActionItemInfo = document.getElementById('stockActionItemInfo');
const stockActionVincular = document.getElementById('stockActionVincular');
const stockActionMarcarEnviado = document.getElementById('stockActionMarcarEnviado');
const stockActionMarcarDevolvido = document.getElementById('stockActionMarcarDevolvido'); // NOVO
const btnBatchMarkAsEnviado = document.getElementById('btnBatchMarkAsEnviado');
const btnRegistrarDevolucao = document.getElementById('btnRegistrarDevolucao');
const btnRevertToAvailable = document.getElementById('btnRevertToAvailable');

// --- NOVO: Elementos do Modal de Senha ---
const passwordModal = document.getElementById('passwordModal');
const passwordModalClose = document.getElementById('passwordModalClose');
const passwordModalCancel = document.getElementById('passwordModalCancel');
const passwordModalConfirm = document.getElementById('passwordModalConfirm');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const passwordModalTitle = document.getElementById('passwordModalTitle');
const passwordModalMessage = document.getElementById('passwordModalMessage');

// --- NOVO: Elementos do Modal de Confirmação ---
const customFiltersContainer = document.getElementById('customFiltersContainer');
const inputNewFilterName = document.getElementById('inputNewFilterName');
const inputNewFilterTerm = document.getElementById('inputNewFilterTerm');
const btnAddNewFilter = document.getElementById('btnAddNewFilter');
const filterList = document.getElementById('filterList');

// --- NOVO: Elementos do Modal de Confirmação ---
const confirmModal = document.getElementById('confirmModal');
const confirmModalClose = document.getElementById('confirmModalClose');
const confirmModalCancel = document.getElementById('confirmModalCancel');
const confirmModalConfirm = document.getElementById('confirmModalConfirm');
const confirmModalTitle = document.getElementById('confirmModalTitle');
const confirmModalMessage = document.getElementById('confirmModalMessage');
// --- NOVO: Elementos do Modal de Cópia Simples ---
const simpleCopyModal = document.getElementById('simpleCopyModal');
const simpleCopyModalClose = document.getElementById('simpleCopyModalClose');
const simpleCopyItemInfo = document.getElementById('simpleCopyItemInfo');
const simpleCopyNome = document.getElementById('simpleCopyNome');
const btnSimpleCopyConfirm = document.getElementById('btnSimpleCopyConfirm');
let simpleCopyId = null;

let dirHandle = null;
const desktopFiles = window.desktopFiles || null;

function joinDataPath(directory, name) {
    return directory ? `${directory}/${name}` : name;
}

class DesktopFileHandle {
    constructor(path) {
        this.path = path;
    }

    async getFile() {
        const result = await desktopFiles.readFile(this.path);
        const contents = result.contents instanceof Uint8Array
            ? result.contents
            : new Uint8Array(result.contents);
        return new Blob([contents]);
    }

    async createWritable() {
        return {
            write: async contents => {
                let data = contents;
                if (data instanceof Blob) data = new Uint8Array(await data.arrayBuffer());
                if (data instanceof ArrayBuffer) data = new Uint8Array(data);
                await desktopFiles.writeFile(this.path, data);
            },
            close: async () => {}
        };
    }
}

class DesktopDirectoryHandle {
    constructor(path, name) {
        this.path = path;
        this.name = name;
    }

    async queryPermission() { return 'granted'; }
    async requestPermission() { return 'granted'; }

    async getFileHandle(name, options = {}) {
        const filePath = joinDataPath(this.path, name);
        if (options.create) await desktopFiles.ensureFile(filePath);
        return new DesktopFileHandle(filePath);
    }

    async getDirectoryHandle(name, options = {}) {
        const directoryPath = joinDataPath(this.path, name);
        if (options.create) await desktopFiles.ensureDirectory(directoryPath);
        return new DesktopDirectoryHandle(directoryPath, name);
    }

    async removeEntry(name) {
        await desktopFiles.removeFile(joinDataPath(this.path, name));
    }

    async move(sourceName, destinationName) {
        await desktopFiles.moveFile(
            joinDataPath(this.path, sourceName),
            joinDataPath(this.path, destinationName)
        );
    }
}
let streamActive = null;
let tempPhotoBlob = null; 
let tempPhotoUrl = null;  

let phoneModels = [
    { name: 'Galaxy A56', base: 'A56' },
    { name: 'iPhone', base: 'A56' },
    { name: 'Galaxy A07', base: 'A07' },
    { name: 'Galaxy A06', base: 'A07' }];

let localities = [
    "Canoas", "Manaus", "HQ Café", "Lapa São Paulo", "CD Itajaí", 
    "Estrema - MG", "Rio de Janeiro - RJ", "Totaline Brasilia DF", "Totaline Piracicaba - SP"
];

let customFilters = [
    // Exemplo: { name: "Com Defeito", term: "tela quebrada" }
];


let stockData = [];
let termosData = []; 
let generatedPdfIds = []; // NOVO: Armazena os IDs dos PDFs gerados em lote
let selectedItemIds = new Set(); 

let ITEMS_PER_PAGE = 12;
let currentStockPage = 1;
let currentViewMode = 'table'; 
let currentModalIndex = -1;    
let currentLocationFilter = 'Canoas';
let imageCache = new Map();

const TERMOS_PER_PAGE = 5;
let currentTermosPage = 1;

let currentStockActionItemId = null; // --- NOVO: Armazena o ID do item para o modal de ação
let currentEntregaModalItemId = null; // --- NOVO: Armazena o ID do item para o modal de entrega
let lastAddedItemId = null; // --- NOVO: Para animação de novo item
let dockPreviewTimeout = null;

// --- NOVO: Objeto de Configurações Globais ---
let appSettings = {
    itemsPerPage: 12,
    defaultView: 'table',
    theme: window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    layout: 'vertical',
    primaryLocation: 'Canoas',
    tabVisibility: {
        dashboard: true,
        cadastro: true,
        estoque: true,
        'estoque-usados': true,
        termos: true,
        reservas: true,
        geradordetermo: true,
        zebra: true,
        modelos: true,
        localidades: true,
        logs: true,
        caixas: true,
    }
};

// --- NOVO: Lista de abas gerenciáveis para a UI de configurações ---
const manageableTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cadastro', label: 'Monitor & Cadastro' },
    { id: 'estoque', label: 'Estoque Disponível' },
    { id: 'estoque-usados', label: 'Estoque de Usados' },
    { id: 'termos', label: 'Vincular Termo / Saída' },
    { id: 'reservas', label: 'Reservas' },
    { id: 'geradordetermo', label: 'Gerador de Termo' },
    { id: 'zebra', label: 'Etiquetas' },
    { id: 'modelos', label: 'Modelos' },
    { id: 'localidades', label: 'Localidades' },
    { id: 'logs', label: 'Logs do Sistema' },
    { id: 'caixas', label: 'Caixas' }
];

// --- NOVO: Funções para persistir o Handle da Pasta no IndexedDB ---
const idb = {
    db: null,
    async getDb() {
        if (this.db) return this.db;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('inventario-db', 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            request.onupgradeneeded = (e) => {
                e.target.result.createObjectStore('keyval');
            };
        });
    },
    async get(key) {
        const db = await this.getDb();
        return new Promise((resolve) => {
            const tx = db.transaction('keyval', 'readonly');
            const req = tx.objectStore('keyval').get(key);
            req.onsuccess = () => resolve(req.result);
        });
    },
    async set(key, value) {
        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('keyval', 'readwrite');
            tx.objectStore('keyval').put(value, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },
    async delete(key) {
        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('keyval', 'readwrite');
            tx.objectStore('keyval').delete(key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },
};

const LOCAL_STORAGE_SENTINEL = 'local-browser-storage-v1';
class LocalFileHandle {
    constructor(path) { this.path = path; }
    async getFile() {
        const value = await idb.get('local-file:' + this.path);
        if (value === undefined) { const e = new Error('Arquivo não encontrado.'); e.name = 'NotFoundError'; throw e; }
        const blob = value instanceof Blob ? value : new Blob([value]);
        return blob;
    }
    async createWritable() {
        let pending = null;
        return {
            write: async value => {
                if (value instanceof Blob) pending = value;
                else if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) pending = new Blob([value]);
                else pending = new Blob([String(value)]);
            },
            close: async () => idb.set('local-file:' + this.path, pending || new Blob([]))
        };
    }
}
class LocalDirectoryHandle {
    constructor(path = '', name = 'Armazenamento local deste navegador') { this.path = path; this.name = name; }
    async queryPermission() { return 'granted'; }
    async requestPermission() { return 'granted'; }
    childPath(name) { return this.path ? this.path + '/' + name : name; }
    async getFileHandle(name, options = {}) {
        const path = this.childPath(name), key = 'local-file:' + path, value = await idb.get(key);
        if (value === undefined && !options.create) { const e = new Error('Arquivo não encontrado.'); e.name = 'NotFoundError'; throw e; }
        if (value === undefined) await idb.set(key, new Blob([]));
        return new LocalFileHandle(path);
    }
    async getDirectoryHandle(name) { return new LocalDirectoryHandle(this.childPath(name), name); }
    async removeEntry(name) { await idb.delete('local-file:' + this.childPath(name)); }
    async move(sourceName, destinationName) {
        const from = 'local-file:' + this.childPath(sourceName), value = await idb.get(from);
        if (value === undefined) { const e = new Error('Arquivo não encontrado.'); e.name = 'NotFoundError'; throw e; }
        await idb.set('local-file:' + this.childPath(destinationName), value);
        await idb.delete(from);
    }
}

// --- NOVA FUNÇÃO: Aplica a visibilidade das abas do menu ---
function applyTabVisibility() {
    let firstVisibleTab = null;

    manageableTabs.forEach(tab => {
        const menuItem = document.getElementById(`menu-${tab.id}`);
        if (menuItem) {
            // O padrão é ser visível se a propriedade não existir (para compatibilidade)
            const isVisible = appSettings.tabVisibility[tab.id] !== false;

            // Se o item de menu estiver dentro de um link <a>, esconde o link. //
            const elementToToggle = menuItem.closest('a.menu-item-link') || menuItem;
            elementToToggle.style.display = isVisible ? '' : 'none';

            if (isVisible && !firstVisibleTab) {
                firstVisibleTab = tab.id;
            }
        }
    });

    // Ensure the settings tab itself is always visible
    const settingsMenu = document.getElementById('menu-configuracoes');
    if (settingsMenu) settingsMenu.style.display = '';

    // Verifica se a aba atualmente ativa foi ocultada
    const activeMenuItem = document.querySelector('.sidebar-menu .menu-item.active');
    if (activeMenuItem && activeMenuItem.style.display === 'none') {
        // Se a aba ativa foi escondida, muda para a primeira aba visível ou para as configurações
        const targetView = firstVisibleTab || 'configuracoes'; // Fallback to settings if no other tab is visible //
        switchView(targetView);
    }
}

// --- NOVA FUNÇÃO: Modal de Alerta Personalizado ---
function showCustomAlert(message, type = 'warning') {
    // Limpa qualquer timeout anterior para evitar fechamentos inesperados
    if (window.alertTimeout) clearTimeout(window.alertTimeout);
    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
    };
    const titles = {
        success: 'Sucesso',
        error: 'Erro',
        warning: 'Atenção'
    };

    notificationIcon.innerHTML = icons[type] || icons.warning;
    notificationIcon.className = `notification-icon ${type}`;
    notificationTitle.textContent = titles[type] || titles.warning;
    notificationTitle.className = `modal-title-text ${type}`;
    notificationMessage.textContent = message;

    if (type === 'success') {
        notificationCloseBtn.style.display = 'none';
        notificationModal.classList.add('toast-style'); // Adiciona estilo de notificação
        window.alertTimeout = setTimeout(closeCustomAlert, 2500); // Fecha automaticamente
    } else {
        notificationCloseBtn.style.display = 'block';
        notificationModal.classList.remove('toast-style'); // Garante que é um modal central
    }

    notificationModal.classList.add('active');
}

function setBrandConnectionStatus(status) {
    const indicator = document.getElementById('brandConnectionStatus');
    if (!indicator) return;

    indicator.className = 'brand-connection-status';
    indicator.replaceChildren();

    if (status === 'loading') {
        indicator.classList.add('is-loading');
        indicator.innerHTML = '<span class="brand-status-spinner" aria-hidden="true"></span><span>Reconectando...</span>';
        indicator.setAttribute('aria-label', 'Reconectando à pasta de dados');
    } else if (status === 'connected') {
        indicator.classList.add('is-connected');
        indicator.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span>Conectado</span>';
        indicator.setAttribute('aria-label', 'Conectado à pasta de dados');
    } else if (status === 'error') {
        indicator.classList.add('is-error');
        indicator.textContent = 'Não conectado';
        indicator.setAttribute('aria-label', 'Não foi possível reconectar à pasta de dados');
    } else {
        indicator.removeAttribute('aria-label');
    }
}

function updateConnectionStatusUI(isConnected, handleName = '') {
    const dotElements = [dbDot, dbDotSettings];
    const textElements = [dbStatusText, dbStatusTextSettings];
    const buttonElements = [btnConnectDir, btnConnectDirSettings];

    if (isConnected) {
        dotElements.forEach(el => el?.classList.add('connected'));
        textElements.forEach(el => { if(el) el.textContent = handleName; });
        
        if (buttonElements[0]) buttonElements[0].querySelector('.btn-text').textContent = "Trocar Pasta";
        if (buttonElements[1]) buttonElements[1].textContent = "Trocar Pasta";

        btnAddToStock.disabled = false;
        btnClearStock.disabled = false;
        btnSaveTermo.disabled = false;

    } else {
        dotElements.forEach(el => el?.classList.remove('connected')); // Fix for reported syntax error
        textElements.forEach(el => { if(el) el.textContent = 'Pasta Desconectada'; });

        if (buttonElements[0]) buttonElements[0].querySelector('.btn-text').textContent = "Vincular Pasta";
        if (buttonElements[1]) buttonElements[1].textContent = "Vincular Pasta";

        // Disable buttons that depend on the connection
        btnAddToStock.disabled = true;
        btnClearStock.disabled = true;
        btnSaveTermo.disabled = true;
    }
}


function closeCustomAlert() {
    notificationModal.classList.remove('active');
}

notificationCloseBtn.addEventListener('click', closeCustomAlert);
notificationModal.addEventListener('click', (e) => { if (e.target === notificationModal) closeCustomAlert(); });

// Helper function for time ago
function timeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " ano atrás" : " anos atrás");
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " mês atrás" : " meses atrás");

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " dia atrás" : " dias atrás");

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " hora atrás" : " horas atrás");

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + (Math.floor(interval) === 1 ? " minuto atrás" : " minutos atrás");

    if (seconds < 10) return "agora mesmo";
    
    return Math.floor(seconds) + " segundos atrás";
}

window.switchView = function(viewName) {
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    
    const menuItem = document.getElementById(`menu-${viewName}`);
    if (menuItem) {
        menuItem.classList.add('active');
    }
    
    document.getElementById(`view-${viewName}`).classList.add('active');
    if (window.matchMedia('(max-width: 900px)').matches) document.body.classList.remove('mobile-menu-open');

    // --- NOVO: Renderiza o dashboard se for a view selecionada ---
    if (viewName === 'dashboard') {
        renderDashboard();
    }

    // --- NOVO: Inicializa o glider do filtro na primeira vez que a aba de estoque é aberta ---
    // Isso corrige o problema do glider não ter a posição inicial correta, pois
    // a view de estoque não estava visível no carregamento inicial da página.
    if (viewName === 'estoque' && !isGliderInitialized) {
        const activeButton = filterGroup.querySelector('.btn-filter.active');
        if (activeButton) {
            // Usamos requestAnimationFrame para garantir que o navegador tenha renderizado a view
            // antes de calcularmos as posições e tamanhos dos elementos.
            requestAnimationFrame(() => {
                activateFilter(activeButton, true);
            });
        }
        isGliderInitialized = true;
    }
};
