const { contextBridge, ipcRenderer } = require('electron');

async function request(channel, ...args) {
  const result = await ipcRenderer.invoke(channel, ...args);
  if (!result.ok) {
    const error = new Error(result.error.message);
    error.name = result.error.code === 'ENOENT'
      ? 'NotFoundError'
      : result.error.name || 'Error';
    error.code = result.error.code;
    throw error;
  }
  return result.value;
}

contextBridge.exposeInMainWorld('desktopFiles', {
  chooseDirectory: () => request('data:choose-directory'),
  getSavedDirectory: () => request('data:get-saved-directory'),
  ensureFile: relativePath => request('data:ensure-file', relativePath),
  ensureDirectory: relativePath => request('data:ensure-directory', relativePath),
  readFile: relativePath => request('data:read-file', relativePath),
  writeFile: (relativePath, contents) => request('data:write-file', relativePath, contents),
  removeFile: relativePath => request('data:remove-file', relativePath),
  moveFile: (sourcePath, destinationPath) => request('data:move-file', sourcePath, destinationPath)
});