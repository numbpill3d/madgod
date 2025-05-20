const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const os = require('os');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('chimera', {
  // File system operations
  fileSystem: {
    openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
    writeFile: (filePath, content) => ipcRenderer.invoke('fs:writeFile', filePath, content),
    readDirectory: (dirPath) => ipcRenderer.invoke('fs:readDirectory', dirPath),
    getPathSeparator: () => path.sep,
    joinPaths: (...parts) => path.join(...parts),
    getBasename: (filePath) => path.basename(filePath),
    getDirname: (filePath) => path.dirname(filePath),
    getExtname: (filePath) => path.extname(filePath)
  },
  
  // App config and settings
  config: {
    getStoreValue: (key) => ipcRenderer.invoke('store:get', key),
    setStoreValue: (key, value) => ipcRenderer.invoke('store:set', key, value)
  },
  
  // Window controls
  window: {
    close: () => ipcRenderer.invoke('window:close'),
    minimize: () => ipcRenderer.invoke('window:minimize'),
    toggleMaximize: () => ipcRenderer.invoke('window:maximize')
  },
  
  // System info
  system: {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    memory: os.totalmem(),
    homedir: os.homedir()
  },
  
  // App events
  onFileChanged: (callback) => {
    ipcRenderer.on('file:changed', (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners('file:changed');
  },
  
  // Send logs to main process for debugging
  log: (level, message) => {
    ipcRenderer.invoke('log', level, message);
  }
});

// Inject startup theming
const injectStartupAnimation = () => {
  // Create a splash screen element
  const splash = document.createElement('div');
  splash.id = 'splash-screen';
  splash.innerHTML = `
    <div class="splash-content">
      <div class="loading-sigil"></div>
      <div class="loading-text">connecting to layer... initialize mnemonic host</div>
    </div>
  `;
  splash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    color: #1d991d;
    font-family: monospace;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 1s ease-in-out;
  `;
  
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(splash);
    
    // Simulate loading progress
    setTimeout(() => {
      const loadingText = splash.querySelector('.loading-text');
      loadingText.textContent = 'decoding psiband channel...';
      
      setTimeout(() => {
        loadingText.textContent = 'loading mnemonic workspace...';
        
        setTimeout(() => {
          splash.style.opacity = '0';
          setTimeout(() => {
            splash.parentNode.removeChild(splash);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  });
};

injectStartupAnimation();
