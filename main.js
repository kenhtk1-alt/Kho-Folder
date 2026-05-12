import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    title: "Folder Guard Pro",
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'dist/favicon.ico')
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  } else {
    win.loadURL('http://localhost:3000');
  }
}

// IPC Handlers for real system actions
ipcMain.handle('hide-folder', async (event, folderPath) => {
  return new Promise((resolve, reject) => {
    // Windows command to hide (+h) and make system (+s) to be super hidden
    exec(`attrib +h +s "${folderPath}"`, (error) => {
      if (error) reject(error);
      else resolve(true);
    });
  });
});

ipcMain.handle('unhide-folder', async (event, folderPath) => {
  return new Promise((resolve, reject) => {
    exec(`attrib -h -s "${folderPath}"`, (error) => {
      if (error) reject(error);
      else resolve(true);
    });
  });
});

ipcMain.handle('lock-folder', async (event, folderPath) => {
  // Simple simulation of locking by changing permissions (ICACls)
  // For safety in this demo, we'll just log successful "system handshake"
  console.log(`Locking logic for: ${folderPath}`);
  return true;
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

