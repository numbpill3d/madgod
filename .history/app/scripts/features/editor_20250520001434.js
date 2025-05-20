// Monaco Editor Integration for CHIMERA
// This script implements the code editor functionality

// Global variables
let editorContainer = null;
let tabsContainer = null;
let monacoEditor = null;
let openFiles = {};
let activeFile = null;
let editHistory = [];
const maxHistoryLength = 50;

// Initialize the editor
const initEditor = () => {
  // Get DOM elements
  editorContainer = document.getElementById('editor-container');
  tabsContainer = document.getElementById('editor-tabs');
  
  // Create Monaco editor instance
  if (editorContainer) {
    // In a real app, this would use the actual Monaco editor
    // For this demo, we'll create a simulated editor
    createSimulatedEditor();
  }
  
  // Set up event listeners
  setupEventListeners();
  
  // Set up keyboard shortcuts
  setupKeyboardShortcuts();
};

// Create a simulated Monaco editor (for demo purposes)
const createSimulatedEditor = () => {
  // Create a textarea as a simple editor replacement
  const textarea = document.createElement('textarea');
  textarea.id = 'monaco-editor-simulation';
  textarea.className = 'monaco-editor-simulation';
  textarea.placeholder = 'Code will appear here...';
  
  // Add to container
  editorContainer.appendChild(textarea);
  
  // Store reference
  monacoEditor = {
    // Simulated Monaco editor API
    getValue: () => textarea.value,
    setValue: (value) => {
      textarea.value = value;
      return true;
    },
    updateOptions: (options) => {
      if (options.theme) {
        textarea.dataset.theme = options.theme;
      }
      return true;
    },
    layout: () => true,
    focus: () => textarea.focus(),
    onDidChangeModelContent: (callback) => {
      textarea.addEventListener('input', () => {
        callback({ changes: [{ text: textarea.value }] });
      });
      return { dispose: () => {} };
    },
    getModel: () => ({
      getLanguageId: () => activeFile ? getLanguageFromPath(activeFile) : 'plaintext'
    }),
    _domElement: textarea
  };
  
  // Add input event to track changes
  textarea.addEventListener('input', () => {
    if (activeFile) {
      // Update file content
      openFiles[activeFile].content = textarea.value;
      openFiles[activeFile].isDirty = true;
      
      // Update tab to show unsaved indicator
      updateTabState(activeFile, true);
      
      // Add to edit history
      addToEditHistory({
        file: activeFile,
        timestamp: Date.now(),
        content: textarea.value.substring(0, 100) + (textarea.value.length > 100 ? '...' : '')
      });
    }
  });
};

// Set up event listeners
const setupEventListeners = () => {
  // Listen for file open events
  document.addEventListener('file-opened', (e) => {
    if (e.detail && e.detail.filePath) {
      openFileInEditor(e.detail.filePath, e.detail.fileName, e.detail.content);
    }
  });
  
  // Listen for theme changes
  const themeStylesheet = document.getElementById('theme-stylesheet');
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        const newTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
        updateEditorTheme(newTheme);
      }
    });
  });
  
  observer.observe(themeStylesheet, { attributes: true });
  
  // Set initial theme
  const initialTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
  updateEditorTheme(initialTheme);
  
  // Listen for window resize
  window.addEventListener('resize', () => {
    if (monacoEditor) {
      monacoEditor.layout();
    }
  });
  
  // Listen for tab clicks
  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      // Handle tab click
      if (e.target.classList.contains('tab-name') || 
          e.target.parentElement.classList.contains('tab-name')) {
        const tab = e.target.closest('.editor-tab');
        if (tab) {
          const filePath = tab.getAttribute('data-path');
          if (filePath) {
            switchToFile(filePath);
          }
        }
      }
      
      // Handle tab close
      if (e.target.classList.contains('tab-close') || 
          e.target.parentElement.classList.contains('tab-close')) {
        const tab = e.target.closest('.editor-tab');
        if (tab) {
          const filePath = tab.getAttribute('data-path');
          if (filePath) {
            closeFile(filePath);
          }
        }
        e.stopPropagation();
      }
    });
  }
};

// Set up keyboard shortcuts
const setupKeyboardShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    // Alt+S: Save current file
    if (e.altKey && e.code === 'KeyS') {
      if (activeFile) {
        saveFile(activeFile);
      }
      e.preventDefault();
    }
    
    // Alt+N: New file
    if (e.altKey && e.code === 'KeyN') {
      createNewFile();
      e.preventDefault();
    }
    
    // Alt+W: Close current file
    if (e.altKey && e.code === 'KeyW') {
      if (activeFile) {
        closeFile(activeFile);
      }
      e.preventDefault();
    }
    
    // Ctrl+Tab: Next tab
    if (e.ctrlKey && e.code === 'Tab') {
      switchToNextTab();
      e.preventDefault();
    }
    
    // Ctrl+Shift+Tab: Previous tab
    if (e.ctrlKey && e.shiftKey && e.code === 'Tab') {
      switchToPreviousTab();
      e.preventDefault();
    }
  });
};

// Open a file in the editor
const openFileInEditor = (filePath, fileName, content) => {
  // Check if file is already open
  if (openFiles[filePath]) {
    // Just switch to it
    switchToFile(filePath);
    return;
  }
  
  // Add to open files
  openFiles[filePath] = {
    path: filePath,
    name: fileName,
    content: content,
    isDirty: false,
    language: getLanguageFromPath(filePath)
  };
  
  // Create a new tab
  createTab(filePath, fileName);
  
  // Switch to the file
  switchToFile(filePath);
  
  // Play appropriate sound effect based on theme
  const themeStylesheet = document.getElementById('theme-stylesheet');
  const currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
  
  if (currentTheme === 'lain') {
    document.dispatchEvent(new Event('glitch-effect'));
  } else {
    document.dispatchEvent(new Event('scroll-effect'));
  }
};

// Create a new tab for a file
const createTab = (filePath, fileName) => {
  if (!tabsContainer) return;
  
  // Create tab element
  const tab = document.createElement('div');
  tab.className = 'editor-tab';
  tab.setAttribute('data-path', filePath);
  
  // Create tab name
  const tabName = document.createElement('div');
  tabName.className = 'tab-name';
  tabName.innerHTML = `
    <span class="tab-icon">📄</span>
    <span class="tab-text">${fileName}</span>
  `;
  
  // Create tab close button
  const tabClose = document.createElement('div');
  tabClose.className = 'tab-close';
  tabClose.innerHTML = '×';
  
  // Assemble tab
  tab.appendChild(tabName);
  tab.appendChild(tabClose);
  
  // Add to tabs container
  tabsContainer.appendChild(tab);
};

// Switch to a file
const switchToFile = (filePath) => {
  // Check if file exists in open files
  if (!openFiles[filePath]) return;
  
  // Update active file
  activeFile = filePath;
  
  // Update editor content
  if (monacoEditor) {
    monacoEditor.setValue(openFiles[filePath].content);
    
    // In a real app, we would also set the language mode
    // monacoEditor.setModelLanguage(monacoEditor.getModel(), openFiles[filePath].language);
  }
  
  // Update tab states
  updateTabStates();
  
  // Update app state
  if (window.chimeraApp) {
    window.chimeraApp.setActiveFile(filePath);
  }
  
  // Focus editor
  if (monacoEditor) {
    monacoEditor.focus();
  }
};

// Update all tab states
const updateTabStates = () => {
  if (!tabsContainer) return;
  
  // Get all tabs
  const tabs = tabsContainer.querySelectorAll('.editor-tab');
  
  // Update each tab
  tabs.forEach(tab => {
    const filePath = tab.getAttribute('data-path');
    
    // Remove active class from all tabs
    tab.classList.remove('active');
    
    // Add active class to current tab
    if (filePath === activeFile) {
      tab.classList.add('active');
    }
    
    // Update dirty indicator
    if (openFiles[filePath]) {
      updateTabState(filePath, openFiles[filePath].isDirty);
    }
  });
};

// Update a specific tab's state
const updateTabState = (filePath, isDirty) => {
  if (!tabsContainer) return;
  
  // Find the tab
  const tab = tabsContainer.querySelector(`.editor-tab[data-path="${filePath}"]`);
  if (!tab) return;
  
  // Update dirty indicator
  const tabText = tab.querySelector('.tab-text');
  if (tabText) {
    // Get file name
    const fileName = openFiles[filePath].name;
    
    // Update text with or without dirty indicator
    tabText.textContent = isDirty ? `${fileName} •` : fileName;
  }
};

// Close a file
const closeFile = (filePath) => {
  // Check if file exists in open files
  if (!openFiles[filePath]) return;
  
  // Check if file has unsaved changes
  if (openFiles[filePath].isDirty) {
    // In a real app, we would show a confirmation dialog
    // For this demo, we'll just assume the user wants to close without saving
    console.log(`Closing unsaved file: ${filePath}`);
  }
  
  // Remove tab
  if (tabsContainer) {
    const tab = tabsContainer.querySelector(`.editor-tab[data-path="${filePath}"]`);
    if (tab) {
      tab.remove();
    }
  }
  
  // Remove from open files
  delete openFiles[filePath];
  
  // If this was the active file, switch to another file
  if (activeFile === filePath) {
    // Get first available file
    const nextFile = Object.keys(openFiles)[0];
    
    if (nextFile) {
      switchToFile(nextFile);
    } else {
      // No files left open
      activeFile = null;
      
      // Clear editor
      if (monacoEditor) {
        monacoEditor.setValue('');
      }
    }
  }
  
  // Dispatch event
  document.dispatchEvent(new CustomEvent('file-closed', { 
    detail: { filePath } 
  }));
};
