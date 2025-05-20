const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const Store = require('electron-store');
const store = new Store();

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window with themed startup
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#000000', // Black background for Lain-style startup
    show: false, // Don't show until ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true
    },
    frame: false, // Custom frame for the themed UI
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'app/assets/images/icons/app-icon.png')
  });

  // Load the index.html of the app
  mainWindow.loadFile('index.html');

  // Show the window when ready with a fade effect
  mainWindow.once('ready-to-show', () => {
    // Simulate mystical startup experience
    setTimeout(() => {
      mainWindow.show();
    }, 1000);
  });

  // Open DevTools in development mode
  if (process.argv.includes('--debug')) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Create a minimal menu
  const template = [
    {
      label: 'CHIMERA',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC File Operations
ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});

ipcMain.handle('fs:readFile', async (event, filePath) => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
});

ipcMain.handle('fs:writeFile', async (event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, 'utf8');
    return true;
  } catch (error) {
    throw new Error(`Failed to write file: ${error.message}`);
  }
});

ipcMain.handle('fs:readDirectory', async (event, dirPath) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.map(entry => {
      return {
        name: entry.name,
        isDirectory: entry.isDirectory(),
        path: path.join(dirPath, entry.name)
      };
    });
  } catch (error) {
    throw new Error(`Failed to read directory: ${error.message}`);
  }
});

ipcMain.handle('store:get', (event, key) => {
  return store.get(key);
});

ipcMain.handle('store:set', (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('window:close', () => {
  mainWindow.close();
});

ipcMain.handle('window:minimize', () => {
  mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

// Log handler
ipcMain.handle('log', (event, level, message) => {
  console[level](`[Renderer] ${message}`);
});

// App lifecycle events
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
