const { app, BrowserWindow, dialog, ipcMain, session } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

let mainWindow;
let dataDirectory = null;

function settingsFilePath() {
  return path.join(app.getPath('userData'), 'settings.json');
}

async function loadSavedDirectory() {
  try {
    const settings = JSON.parse(await fs.readFile(settingsFilePath(), 'utf8'));
    const candidate = settings.dataDirectory;
    if (typeof candidate === 'string' && (await fs.stat(candidate)).isDirectory()) {
      dataDirectory = path.resolve(candidate);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Could not restore the data directory:', error);
  }
}

function resolveDataPath(relativePath) {
  if (!dataDirectory) throw new Error('Selecione uma pasta de dados primeiro.');
  if (typeof relativePath !== 'string' || path.isAbsolute(relativePath)) {
    throw new Error('Caminho de arquivo inválido.');
  }

  const segments = relativePath.replace(/\\/g, '/').split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..')) {
    throw new Error('Caminho de arquivo inválido.');
  }

  const fullPath = path.resolve(dataDirectory, ...segments);
  if (!fullPath.startsWith(`${dataDirectory}${path.sep}`)) {
    throw new Error('Caminho fora da pasta de dados.');
  }
  return fullPath;
}

function registerDataHandler(channel, handler) {
  ipcMain.handle(channel, async (_event, ...args) => {
    try {
      return { ok: true, value: await handler(...args) };
    } catch (error) {
      return {
        ok: false,
        error: { name: error.name, code: error.code, message: error.message }
      };
    }
  });
}

function registerDataHandlers() {
  registerDataHandler('data:choose-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    });
    if (result.canceled || !result.filePaths[0]) return null;

    dataDirectory = path.resolve(result.filePaths[0]);
    await fs.mkdir(app.getPath('userData'), { recursive: true });
    await fs.writeFile(settingsFilePath(), JSON.stringify({ dataDirectory }, null, 2));
    return { name: path.basename(dataDirectory) };
  });

  registerDataHandler('data:get-saved-directory', () => (
    dataDirectory ? { name: path.basename(dataDirectory) } : null
  ));

  registerDataHandler('data:ensure-file', async relativePath => {
    const fullPath = resolveDataPath(relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    const file = await fs.open(fullPath, 'a');
    await file.close();
  });

  registerDataHandler('data:ensure-directory', relativePath => (
    fs.mkdir(resolveDataPath(relativePath), { recursive: true })
  ));

  registerDataHandler('data:read-file', async relativePath => {
    const fullPath = resolveDataPath(relativePath);
    const [contents, stats] = await Promise.all([fs.readFile(fullPath), fs.stat(fullPath)]);
    return { contents: Uint8Array.from(contents), lastModified: stats.mtimeMs };
  });

  registerDataHandler('data:write-file', async (relativePath, contents) => {
    const fullPath = resolveDataPath(relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    const data = contents instanceof Uint8Array
      ? Buffer.from(contents)
      : contents instanceof ArrayBuffer
        ? Buffer.from(contents)
        : contents;
    if (typeof data !== 'string' && !Buffer.isBuffer(data)) {
      throw new Error('Conteúdo de arquivo inválido.');
    }
    await fs.writeFile(fullPath, data);
  });

  registerDataHandler('data:remove-file', relativePath => (
    fs.rm(resolveDataPath(relativePath), { force: true })
  ));

  registerDataHandler('data:move-file', async (sourcePath, destinationPath) => {
    const source = resolveDataPath(sourcePath);
    const destination = resolveDataPath(destinationPath);
    await fs.rename(source, destination);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 960,
    minHeight: 680,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'celular.rubertt.html'));
}

app.whenReady().then(async () => {
  await loadSavedDirectory();
  registerDataHandlers();
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
    const isCameraRequest = permission === 'media' && details.mediaTypes?.includes('video');
    callback(isCameraRequest && webContents.getURL().startsWith('file://'));
  });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});