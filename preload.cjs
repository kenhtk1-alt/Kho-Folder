const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  hideFolder: (path) => ipcRenderer.invoke('hide-folder', path),
  unhideFolder: (path) => ipcRenderer.invoke('unhide-folder', path),
  lockFolder: (path) => ipcRenderer.invoke('lock-folder', path),
  unlockFolder: (path) => ipcRenderer.invoke('unlock-folder', path),
});
