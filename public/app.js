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
        return {
            lastModified: result.lastModified,
            text: async () => new TextDecoder().decode(contents),
            arrayBuffer: async () => contents.slice().buffer
        };
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
            const request = indexedDB.open('inventario-db', 2);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            request.onupgradeneeded = (e) => {
                const db=e.target.result;if(!db.objectStoreNames.contains('keyval'))db.createObjectStore('keyval');if(!db.objectStoreNames.contains('photos'))db.createObjectStore('photos');
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
    async putPhoto(key,blob){const db=await this.getDb();return new Promise((resolve,reject)=>{const tx=db.transaction('photos','readwrite');tx.objectStore('photos').put(blob,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});},
    async getPhoto(key){const db=await this.getDb();return new Promise((resolve,reject)=>{const tx=db.transaction('photos','readonly');const q=tx.objectStore('photos').get(key);q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>reject(q.error);});},
    async deletePhoto(key){const db=await this.getDb();return new Promise((resolve,reject)=>{const tx=db.transaction('photos','readwrite');tx.objectStore('photos').delete(key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
};

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

function updateConnectionStatusUI(isConnected, handleName = '') {
    const localMode=isConnected&&!dirHandle,dots=[dbDot,dbDotSettings],texts=[dbStatusText,dbStatusTextSettings],buttons=[btnConnectDir,btnConnectDirSettings];
    if(isConnected){dots.forEach(el=>el?.classList.add('connected'));texts.forEach(el=>{if(el)el.textContent=localMode?'Dados neste celular':handleName;});
        if(buttons[0])buttons[0].querySelector('.btn-text').textContent=localMode?'Vincular Pasta':'Trocar Pasta';
        if(buttons[1])buttons[1].textContent=localMode?'Vincular Pasta':'Trocar Pasta';
        btnAddToStock.disabled=false;btnClearStock.disabled=false;btnSaveTermo.disabled=false;
    }else{dots.forEach(el=>el?.classList.remove('connected'));texts.forEach(el=>{if(el)el.textContent='Pasta Desconectada';});
        if(buttons[0])buttons[0].querySelector('.btn-text').textContent='Vincular Pasta';if(buttons[1])buttons[1].textContent='Vincular Pasta';
        btnAddToStock.disabled=true;btnClearStock.disabled=true;btnSaveTermo.disabled=true;}
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
    if (window.matchMedia('(max-width: 768px)').matches) {
        document.body.classList.remove('mobile-sidebar-open');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.setAttribute('aria-label', 'Abrir menu');
        }
    }

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
        } else {
            if (!window.showDirectoryPicker) {
                throw new Error('Este navegador não oferece seleção de pastas.');
            }
            handle = await window.showDirectoryPicker({ mode: 'readwrite' });
        }

        if (await connectToDirectory(handle)) {
            if (!desktopFiles) await idb.set('dirHandle', handle);
            showCustomAlert('Pasta vinculada e salva para futuras sessões!', 'success');
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
    if (!dirHandle) { await idb.set('mobileStockData',stockData); return; }
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
    if (!blob) return;
    if (!dirHandle) { await idb.putPhoto(filename,blob); return; }
    const photoDir = await getPhotoDirHandle();
    if (!photoDir) return;
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
    if (!filename) return null;
    if (imageCache.has(filename)) return imageCache.get(filename);
    if (!dirHandle) { const blob=await idb.getPhoto(filename);if(!blob)return null;const url=URL.createObjectURL(blob);imageCache.set(filename,url);return url; }
    const photoDir = await getPhotoDirHandle();
    if (!photoDir) return null;

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
    if (!filename) return;
    if (!dirHandle) { await idb.deletePhoto(filename);const url=imageCache.get(filename);if(url)URL.revokeObjectURL(url);imageCache.delete(filename);return; }
    const photoDir = await getPhotoDirHandle();
    if (!photoDir) return;
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

async function renderStockTable() {
    stockTableBody.innerHTML = '';
    stockGridContainer.innerHTML = '';
    
    const filteredStock = getFilteredStock();

    if(filteredStock.length === 0) {
        stockTableBody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:20px; color:var(--text-muted);">Nenhum smartphone encontrado.</td></tr>';
        stockGridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted);">Nenhum smartphone encontrado.</div>';
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
                ? `<span class="user-badge entregue" style="cursor:pointer;" onclick="openEntregaModal(${item.id})">Entregue</span>`
                : item.status === 'Enviado'
                ? `<span class="user-badge enviado" style="cursor:pointer;" onclick="revertSentStatus(${item.id})">Enviado (Reverter)</span>`
                : item.status === 'Devolvido'
                ? `<span class="user-badge devolvido" style="cursor:pointer;" onclick="selectDeviceAndSwitchToTermo(${item.id})">Devolvido</span>`
                : `<span class="user-badge stock" style="cursor:pointer;" onclick="openStockActionModal(${item.id})">Disponível</span>`;

            const content = document.createElement('div');
            content.className = 'stock-card-content';
            content.innerHTML = `
                <div id="grid-modelo-txt-${item.id}" class="stock-card-sn" style="color: var(--primary-color); font-weight:700; font-size:1.1rem; margin-bottom:2px;">${item.modelo}</div>
                <div id="grid-local-txt-${item.id}" style="font-size:0.85rem; font-weight:600; color:var(--text-main); margin-bottom:8px;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${item.localidade || appSettings.primaryLocation}</div>
                <div class="stock-card-sn" style="font-size:0.8rem; opacity:0.8; margin-bottom:10px;">SN: ${item.sn || 'SEM S/N'}</div>
                <div class="stock-card-info" style="margin-bottom:15px;">
                    <span><strong>IMEI 1:</strong> ${item.imei1 || '-'}</span>
                    <span><strong>IMEI 2:</strong> ${item.imei2 || '-'}</span>
                    <span id="grid-data-txt-${item.id}" style="margin-top: 8px; font-weight: 500; color: var(--text-muted);">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        ${item.dataEntrada ? new Date(item.dataEntrada).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </span>
                </div>
                <div class="stock-card-footer" id="grid-actions-${item.id}" style="display: flex; justify-content: space-between; align-items: center;">
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
        td.innerHTML = `<span class="user-badge entregue" style="cursor: pointer;" onclick="openEntregaModal(${item.id})">Entregue (Ver)</span>`;
    } else if (item.status === 'Enviado') {
        td.innerHTML = `<span class="user-badge enviado" style="cursor: pointer;" onclick="revertSentStatus(${item.id})">Enviado (Reverter)</span>`;
    } else if (item.status === 'Devolvido') {
        td.innerHTML = `<span class="user-badge devolvido" style="cursor: pointer;" onclick="selectDeviceAndSwitchToTermo(${item.id})">Devolvido (Reatribuir)</span>`;
    } else {
        td.innerHTML = `<span class="user-badge stock" style="cursor: pointer;" onclick="openStockActionModal(${item.id})">Disponível</span>`;
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
    } else { td.innerHTML = '<span style="color:#bdc3c7; font-size:0.85rem;">Sem foto</span>'; }
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
    const message = `Tem certeza que deseja excluir o <strong>${item.modelo}</strong> (SN: ${item.sn || 'N/A'}) do estoque? <br><br><span style="color: var(--text-muted);">Esta ação não pode ser desfeita.</span>`;

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
        termosTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:15px;">${noResultsMessage}</td></tr>`;
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
            <td>${item.nome}<br><small style="color:var(--text-muted);">Mat.: ${item.matricula || '-'}</small></td>
            <td>${item.local || '-'}</td>
            <td><strong>${item.marcaModelo}</strong></td>
            <td>${item.nomeTecnico || '-'}</td>
            <td style="font-family:monospace; font-size:0.8rem;">SN: ${item.sn}<br>IMEI: ${item.imei1}</td>
            <td>${item.chip || '-'}</td> 
            <td>CC: ${item.cc || '-'}<br><span class="user-badge stock" style="background:#e0f2fe; color:#0369a1; border-color:#bae6fd;">${item.modeloTermo}</span></td>
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
        statusContainer.innerHTML = `<span class="user-badge entregue" style="cursor: pointer;" onclick="openEntregaModal(${item.id})">Entregue (Ver)</span>`;
    } else if (item.status === 'Enviado') {
        statusContainer.innerHTML = `<span class="user-badge enviado" style="cursor: pointer;" onclick="revertSentStatus(${item.id})">Enviado (Reverter)</span>`;
    } else if (item.status === 'Devolvido') {
        statusContainer.innerHTML = `<span class="user-badge devolvido" style="cursor: pointer;" onclick="selectDeviceAndSwitchToTermo(${item.id})">Devolvido (Reatribuir)</span>`;
    } else {
        // O padrão é "Disponível", com a ação de abrir o modal de vínculo/envio.
        statusContainer.innerHTML = `<span class="user-badge stock" style="cursor: pointer;" onclick="openStockActionModal(${item.id})">Disponível</span>`;
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
        dataContainer.innerHTML = `<input type="datetime-local" id="edit-data-input-${id}" class="edit-input" value="${currentData}" style="max-width: none;">`;
    }


    if (isGrid) {
        actionsContainer.innerHTML = `
            <span class="user-badge stock" style="background:#fef3c7; color:#d97706;">Editando...</span>
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
                <span class="user-badge stock" style="margin-left: 8px;">Base: ${model.base}</span>
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
        <div style="display: flex; flex-grow: 1; gap: 10px; align-items: center;">
            <input type="text" id="edit-model-input-${sanitizedId}" class="input-field" value="${oldName}" style="height: 36px;">
            <select id="edit-model-base-select-${sanitizedId}" class="edit-select" style="max-width: 180px; height: 36px;">
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
    }
    let connected=false;
    if(savedHandle){console.log("Tentando reconectar à pasta salva...");connected=await connectToDirectory(savedHandle);if(connected)showCustomAlert('Reconectado à pasta anterior.','success');}
    if(!connected){const localStock=await idb.get('mobileStockData');if(Array.isArray(localStock)){stockData=localStock;imageCache.clear();updateConnectionStatusUI(true,'Dados neste celular');}}
    renderAllUI();
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
        container.innerHTML = '<div class="activity-placeholder" style="padding: 20px 0;">Não há dispositivos ativos para exibir no gráfico.</div>';
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
        <input type="text" id="edit-locality-input-${sanitizedId}" class="input-field" value="${oldName}" style="flex-grow: 1; height: 36px;">
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
                <br><small style="color: var(--text-muted);">Busca por: "${filter.term}"</small>
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
        usedStockTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">Nenhum item no estoque de usados.</td></tr>';
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
            <td><strong>${item.modelo}</strong><br><small style="font-family:monospace;">SN: ${item.sn || 'N/A'}</small></td>
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

    devolvidoPorCell.innerHTML = `<input type="text" id="edit-devolvido-input-${id}" class="input-field" value="${currentName}" style="height: 36px;">`;

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

// --- Navegação responsiva da Sidebar ---
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const mobileSidebarQuery = window.matchMedia('(max-width: 768px)');

function setMobileSidebar(open) {
    document.body.classList.toggle('mobile-sidebar-open', !!open && mobileSidebarQuery.matches);
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', String(!!open && mobileSidebarQuery.matches));
        mobileMenuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }
}
if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', () => {
    setMobileSidebar(!document.body.classList.contains('mobile-sidebar-open'));
});
if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', () => setMobileSidebar(false));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMobileSidebar(false);
});
const sidebarMenuElement = document.querySelector('.sidebar-menu');
if (sidebarMenuElement) sidebarMenuElement.addEventListener('click', event => {
    if (event.target.closest('.menu-item') && mobileSidebarQuery.matches) setMobileSidebar(false);
});
if (mobileSidebarQuery.addEventListener) {
    mobileSidebarQuery.addEventListener('change', event => {
        setMobileSidebar(false);
        if (!event.matches) {
            const saved = localStorage.getItem('sidebarState');
            document.body.classList.toggle('sidebar-collapsed', saved === 'collapsed');
        }
    });
} else if (mobileSidebarQuery.addListener) {
    mobileSidebarQuery.addListener(() => setMobileSidebar(false));
}
if (sidebarToggle) sidebarToggle.addEventListener('click', () => {
    if (mobileSidebarQuery.matches) {
        setMobileSidebar(!document.body.classList.contains('mobile-sidebar-open'));
        return;
    }
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarState', document.body.classList.contains('sidebar-collapsed') ? 'collapsed' : 'expanded');
});
// Restaura o recolhimento apenas no desktop; no celular o menu começa fechado.
if (!mobileSidebarQuery.matches && localStorage.getItem('sidebarState') === 'collapsed') {
    document.body.classList.add('sidebar-collapsed');
}

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


async function importCollectorZip(file){
 if(!file||typeof JSZip==='undefined')return showCustomAlert('Leitor ZIP indisponível. Verifique a internet.','error');
 try{
  const zip=await JSZip.loadAsync(file),mf=zip.file('manifest.json');if(!mf)throw new Error('ZIP sem manifest.json. Exporte novamente pelo Coletor.');
  const manifest=JSON.parse(await mf.async('string'));if(manifest.format!=='inventario-celulares-v1'||!Array.isArray(manifest.items))throw new Error('Formato de pacote não reconhecido.');
  const digits=v=>String(v||'').replace(/\D/g,''),norm=v=>String(v||'').trim().toLowerCase(),additions=[],seen=[];let duplicates=0,invalid=0;
  const duplicate=r=>stockData.some(old=>{const ids=[digits(old.imei1),digits(old.imei2)].filter(Boolean);return [digits(r.imei),digits(r.imei2)].filter(Boolean).some(id=>ids.includes(id))||(!!norm(r.sn)&&norm(r.sn)===norm(old.sn));});
  for(const r of manifest.items){const photo=r.photo&&zip.file(r.photo),imei1=digits(r.imei).slice(0,15),imei2=digits(r.imei2).slice(0,15),sn=String(r.sn||'').trim();
   if(!photo||(!imei1&&!sn)||(imei1&&imei1.length!==15)||(imei2&&imei2.length!==15)){invalid++;continue;}
   if(duplicate({imei:imei1,imei2,sn})||seen.some(x=>{const ids=[x.imei1,x.imei2].filter(Boolean);return [imei1,imei2].filter(Boolean).some(id=>ids.includes(id))||(!!norm(sn)&&norm(sn)===norm(x.sn));})){duplicates++;continue;}
   const blob=await photo.async('blob'),photoName='coleta_'+(imei1||sn).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,28)+'_'+Math.random().toString(36).slice(2,7)+'.jpg';await saveImageToFolder(photoName,blob);
   const item={id:Date.now()+Math.random(),imei1,imei2,sn,modelo:String(r.model||'Não informado'),localidade:String(r.locality||appSettings.primaryLocation||'Canoas'),dataEntrada:r.createdAt||new Date().toISOString(),photoName,status:'Disponível',entrega:{nome:'',cc:'',matricula:'',localidade:'',ticket:''},history:[]};additions.push(item);seen.push(item);
  }
  if(!additions.length)return showCustomAlert('Nenhum aparelho novo. Duplicados: '+duplicates+'; inválidos: '+invalid+'.','warning');
  stockData.unshift(...additions);await saveStockData();if(!dirHandle)updateConnectionStatusUI(true,'Dados neste celular');currentStockPage=1;renderAllUI();
  showCustomAlert(additions.length+' aparelho(s) importado(s). Duplicados ignorados: '+duplicates+'; inválidos: '+invalid+'.','success');
 }catch(e){console.error(e);showCustomAlert('Falha ao importar ZIP: '+(e.message||'erro inesperado'),'error');}
}

document.addEventListener('DOMContentLoaded', () => {
    const zipInput=document.getElementById('collectorZipImport');
    if(zipInput){zipInput.addEventListener('change',async e=>{const file=e.target.files&&e.target.files[0];if(file)await importCollectorZip(file);e.target.value='';});}
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


// Spotlight de busca rápida: pesquisa modelo, IMEI 1/2 e número de série.
(() => {
  const overlay = document.getElementById('stockSpotlight');
  const search = document.getElementById('spotlightSearchInput');
  const results = document.getElementById('spotlightResults');
  const count = document.getElementById('spotlightResultCount');
  const goStock = document.getElementById('spotlightGoStock');
  if (!overlay || !search || !results || !goStock) return;

  const close = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('spotlight-open');
  };

  window.openStockSpotlight = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('spotlight-open');
    search.value = '';
    renderResults();
    requestAnimationFrame(() => search.focus());
  };

  const openInStock = (term = '') => {
    close();
    window.switchView('estoque');
    currentLocationFilter = 'Todos';
    document.querySelectorAll('#locationFilterGroup .btn-filter').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === 'Todos'));
    if (inputSearchStock) {
      inputSearchStock.value = term;
      inputSearchStock.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const makeText = (tag, className, value) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = value || '';
    return el;
  };

  function renderResults() {
    const term = normalizeText(search.value);
    const matches = stockData.filter(item => {
      if (!term) return false;
      return [item.modelo, item.imei1, item.imei2, item.sn].some(value => normalizeText(value || '').includes(term));
    }).slice(0, 30);

    results.replaceChildren();
    count.textContent = term ? `${matches.length} resultado(s)` : 'Digite para pesquisar';

    if (!term) {
      results.append(makeText('div', 'spotlight-empty', 'Comece digitando um modelo, IMEI ou número de série.'));
      return;
    }
    if (!matches.length) {
      results.append(makeText('div', 'spotlight-empty', 'Nenhum celular encontrado com esses dados.'));
      return;
    }

    matches.forEach(item => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'spotlight-result';
      row.addEventListener('click', () => openInStock(item.imei1 || item.imei2 || item.sn || item.modelo));

      const main = document.createElement('span');
      main.className = 'spotlight-result-main';
      main.append(makeText('strong', '', item.modelo || 'Modelo não informado'));
      const identifiers = document.createElement('span');
      identifiers.className = 'spotlight-identifiers';
      identifiers.textContent = [item.imei1 && `IMEI 1: ${item.imei1}`, item.imei2 && `IMEI 2: ${item.imei2}`, item.sn && `SN: ${item.sn}`].filter(Boolean).join('  •  ');
      main.append(identifiers);

      const meta = document.createElement('span');
      meta.className = 'spotlight-result-meta';
      meta.append(makeText('span', 'spotlight-status', item.status || 'Sem status'));
      meta.append(makeText('small', '', item.localidade || 'Sem localidade'));
      row.append(main, meta);
      results.append(row);
    });
  }

  search.addEventListener('input', renderResults);
  goStock.addEventListener('click', () => openInStock(search.value.trim()));
  overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) close();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      window.openStockSpotlight();
    }
  });
})();
