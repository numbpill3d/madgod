// Monaco Editor Setup for CHIMERA
// This script initializes the Monaco Editor with custom themes and extensions

import * as monaco from '../lib/monaco/monaco-editor.min.js';

// Reference to the editor instance
let editor = null;
let currentModel = null;
let currentLanguage = '';
let currentFilePath = '';
let openFiles = new Map(); // Map of file paths to their models
let openFileTabs = new Set(); // Set of open file paths

// Custom Monaco Editor themes for Lain and Morrowind aesthetics
const createLainTheme = () => {
  monaco.editor.defineTheme('lain-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '0f880f', fontStyle: 'italic' },
      { token: 'keyword', foreground: '39ff14', fontStyle: 'bold' },
      { token: 'string', foreground: '33ff33' },
      { token: 'number', foreground: '00ff99' },
      { token: 'operator', foreground: '39ff14' },
      { token: 'function', foreground: '00ffff' },
      { token: 'variable', foreground: 'ffffff' },
      { token: 'type', foreground: '33cc33' },
      { token: 'regexp', foreground: 'ff3333' },
      { token: 'identifier', foreground: 'ffffff' },
      { token: 'delimiter', foreground: '39ff14' }
    ],
    colors: {
      'editor.background': '#000000',
      'editor.foreground': '#1d991d',
      'editorCursor.foreground': '#39ff14',
      'editor.lineHighlightBackground': '#0f220f',
      'editorLineNumber.foreground': '#0f880f',
      'editorLineNumber.activeForeground': '#39ff14',
      'editor.selectionBackground': '#0f4f0f80',
      'editor.inactiveSelectionBackground': '#0f4f0f40',
      'editorSuggestWidget.background': '#050505',
      'editorSuggestWidget.border': '#0f880f',
      'editorSuggestWidget.foreground': '#1d991d',
      'editorSuggestWidget.selectedBackground': '#0f4f0f',
      'editorSuggestWidget.highlightForeground': '#39ff14',
      'editor.wordHighlightBackground': '#0f4f0f50',
      'editorBracketMatch.background': '#39ff1420',
      'editorBracketMatch.border': '#39ff14',
      'editorOverviewRuler.border': '#000000',
      'editorGutter.background': '#050505',
      'editorError.foreground': '#ff3333',
      'editorWarning.foreground': '#ffaa00',
      'editorInfo.foreground': '#33aaff',
      'editorIndentGuide.background': '#0f4f0f50',
      'editorIndentGuide.activeBackground': '#39ff1450'
    }
  });
};

const createMorrowindTheme = () => {
  monaco.editor.defineTheme('morrowind-theme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '764c24', fontStyle: 'italic' },
      { token: 'keyword', foreground: '9b3b0a', fontStyle: 'bold' },
      { token: 'string', foreground: '719e07' },
      { token: 'number', foreground: 'a16946' },
      { token: 'operator', foreground: '8b4726' },
      { token: 'function', foreground: '6c3600' },
      { token: 'variable', foreground: '582500' },
      { token: 'type', foreground: 'b58900' },
      { token: 'regexp', foreground: 'cb4b16' },
      { token: 'identifier', foreground: '4a3321' },
      { token: 'delimiter', foreground: '7b3800' }
    ],
    colors: {
      'editor.background': '#251b14',
      'editor.foreground': '#d3b88c',
      'editorCursor.foreground': '#e8cb9a',
      'editor.lineHighlightBackground': '#35281d',
      'editorLineNumber.foreground': '#a77d46',
      'editorLineNumber.activeForeground': '#e8cb9a',
      'editor.selectionBackground': '#4a332180',
      'editor.inactiveSelectionBackground': '#4a332140',
      'editorSuggestWidget.background': '#2a1f16',
      'editorSuggestWidget.border': '#453b29',
      'editorSuggestWidget.foreground': '#d3b88c',
      'editorSuggestWidget.selectedBackground': '#4a3321',
      'editorSuggestWidget.highlightForeground': '#e8cb9a',
      'editor.wordHighlightBackground': '#4a332150',
      'editorBracketMatch.background': '#e8cb9a20',
      'editorBracketMatch.border': '#e8cb9a',
      'editorOverviewRuler.border': '#251b14',
      'editorGutter.background': '#211913',
      'editorError.foreground': '#cb4b16',
      'editorWarning.foreground': '#b58900',
      'editorInfo.foreground': '#268bd2',
      'editorIndentGuide.background': '#4a332150',
      'editorIndentGuide.activeBackground': '#e8cb9a50'
    }
  });
};

// Create editor with default settings
const initEditor = () => {
  const editorContainer = document.getElementById('monaco-editor');

  createLainTheme();
  createMorrowindTheme();

  editor = monaco.editor.create(editorContainer, {
    theme: 'lain-theme', // Default theme
    fontFamily: 'LainTerminal, monospace',
    fontSize: 14,
    lineHeight: 20,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    renderLineHighlight: 'all',
    cursorBlinking: 'phase',
    cursorSmoothCaretAnimation: true,
    smoothScrolling: true,
    links: true,
    contextmenu: true,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on',
    glyphMargin: true,
    lightbulb: { enabled: true },
    bracketPairColorization: { enabled: true },
    suggest: {
      snippetsPreventQuickSuggestions: false
    },
    formatOnType: true,
    formatOnPaste: true
  });

  // Event handling for cursor position updates
  editor.onDidChangeCursorPosition((e) => {
    updateCursorPosition(e.position);
  });

  // Event handling for content changes
  editor.onDidChangeModelContent((e) => {
    updateEditorState();
    triggerNeuralThreadUpdate();
  });

  // Set up a default empty model
  createEmptyEditor();

  // Handle window resize
  window.addEventListener('resize', () => {
    editor.layout();
  });
};

// Create an empty editor instance with welcome message
const createEmptyEditor = () => {
  currentModel = monaco.editor.createModel(
    `// Welcome to CHIMERA - The Cybernetic Hypertextual Interface for Modular Embedded Runtime Authoring
// 
// This code editor combines the cyberpunk aesthetics of Serial Experiments Lain 
// with the arcane, mystical elements of Morrowind.
// 
// Open a project from the scroll rack on the left to begin...
// Or commune with the whispers on the right for guidance...
//
// [Press Alt+T to toggle between Lain and Morrowind themes]`,
    'javascript'
  );
  
  editor.setModel(currentModel);
  currentFilePath = '';
  currentLanguage = 'javascript';
  updateStatusBar();
};

// Opens a file in the editor
const openFile = async (filePath) => {
  try {
    // If the file is already open, just switch to it
    if (openFiles.has(filePath)) {
      editor.setModel(openFiles.get(filePath));
      currentModel = openFiles.get(filePath);
      currentFilePath = filePath;
      currentLanguage = getLanguageFromFilePath(filePath);
      updateStatusBar();
      updateActiveTabs();
      return;
    }

    // Read the file content
    const content = await window.chimera.fileSystem.readFile(filePath);
    
    // Determine language based on file extension
    const language = getLanguageFromFilePath(filePath);
    
    // Create a new model for this file
    const model = monaco.editor.createModel(content, language);
    
    // Store the model in our map
    openFiles.set(filePath, model);
    openFileTabs.add(filePath);
    
    // Set the editor's model to this file
    editor.setModel(model);
    
    // Update current state
    currentModel = model;
    currentFilePath = filePath;
    currentLanguage = language;
    
    // Add a tab for this file
    addFileTab(filePath);
    
    // Update UI
    updateStatusBar();
    updateActiveTabs();
    
    // Trigger glitch effect for Lain theme or magical effect for Morrowind
    const currentTheme = document.getElementById('theme-stylesheet').href.includes('lain') 
      ? 'lain' 
      : 'morrowind';
    
    if (currentTheme === 'lain') {
      triggerGlitchEffect();
    } else {
      triggerMagicalEffect();
    }
    
    // Announce in whisper tab that the file has been opened
    const fileName = filePath.split('/').pop();
    addWhisperMessage(`File '${fileName}' has been divined from the realm.`, 'from-ai');
    
    return true;
  } catch (error) {
    console.error('Failed to open file:', error);
    addWhisperMessage(`Failed to divine file: ${error.message}`, 'from-ai');
    return false;
  }
};

// Save the current file
const saveFile = async () => {
  if (!currentFilePath) {
    // If no file is currently opened, can't save
    addWhisperMessage('No file to bind. Open or create a file first.', 'from-ai');
    return false;
  }
  
  try {
    const content = editor.getValue();
    await window.chimera.fileSystem.writeFile(currentFilePath, content);
    
    // Update status
    addWhisperMessage(`File '${currentFilePath.split('/').pop()}' bound to the realm.`, 'from-ai');
    
    // Trigger effects
    const currentTheme = document.getElementById('theme-stylesheet').href.includes('lain') 
      ? 'lain' 
      : 'morrowind';
    
    if (currentTheme === 'lain') {
      triggerSuccessPulse('#39ff14');
    } else {
      triggerSuccessPulse('#e8cb9a');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save file:', error);
    addWhisperMessage(`Failed to bind file: ${error.message}`, 'from-ai');
    return false;
  }
};

// Create a new file
const createNewFile = async (filePath, content = '') => {
  try {
    // Write the file to disk
    await window.chimera.fileSystem.writeFile(filePath, content);
    
    // Open the newly created file
    return await openFile(filePath);
  } catch (error) {
    console.error('Failed to create file:', error);
    addWhisperMessage(`Failed to create file: ${error.message}`, 'from-ai');
    return false;
  }
};

// Close a file
const closeFile = (filePath) => {
  if (openFiles.has(filePath)) {
    const model = openFiles.get(filePath);
    
    // If this is the current file, switch to another open file or empty editor
    if (currentFilePath === filePath) {
      const openPaths = Array.from(openFiles.keys());
      const index = openPaths.indexOf(filePath);
      
      if (openPaths.length > 1) {
        // Switch to another open file
        const nextIndex = index === openPaths.length - 1 ? index - 1 : index + 1;
        const nextPath = openPaths[nextIndex];
        editor.setModel(openFiles.get(nextPath));
        currentModel = openFiles.get(nextPath);
        currentFilePath = nextPath;
        currentLanguage = getLanguageFromFilePath(nextPath);
      } else {
        // Create empty editor if no other files are open
        createEmptyEditor();
      }
    }
    
    // Dispose of the model to free memory
    model.dispose();
    
    // Remove from our maps
    openFiles.delete(filePath);
    openFileTabs.delete(filePath);
    
    // Remove the tab
    removeFileTab(filePath);
    
    // Update UI
    updateStatusBar();
    updateActiveTabs();
    
    return true;
  }
  
  return false;
};

// Add a tab for a file
const addFileTab = (filePath) => {
  const fileName = filePath.split('/').pop();
  const tabsContainer = document.getElementById('editor-tabs');
  
  // Check if tab already exists
  const existingTab = document.querySelector(`.editor-tab[data-path="${filePath}"]`);
  if (existingTab) {
    return;
  }
  
  // Create a new tab
  const tab = document.createElement('div');
  tab.className = 'editor-tab';
  tab.setAttribute('data-path', filePath);
  tab.innerHTML = `
    <span class="tab-name">${fileName}</span>
    <span class="tab-close">×</span>
  `;
  
  // Add click handler to switch to this file
  tab.addEventListener('click', (e) => {
    if (!e.target.classList.contains('tab-close')) {
      openFile(filePath);
    }
  });
  
  // Add close handler
  tab.querySelector('.tab-close').addEventListener('click', (e) => {
    e.stopPropagation();
    closeFile(filePath);
  });
  
  // Add the tab to the container
  tabsContainer.appendChild(tab);
  
  // Update active tabs
  updateActiveTabs();
};

// Remove a file tab
const removeFileTab = (filePath) => {
  const tab = document.querySelector(`.editor-tab[data-path="${filePath}"]`);
  if (tab) {
    tab.remove();
  }
};

// Update which tab is active
const updateActiveTabs = () => {
  const tabs = document.querySelectorAll('.editor-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-path') === currentFilePath) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
};

// Update the status bar with current information
const updateStatusBar = () => {
  const statusMode = document.getElementById('status-mode');
  const cursorPosition = document.getElementById('cursor-position');
  const filetypeInfo = document.getElementById('filetype-info');
  const encodingInfo = document.getElementById('encoding-info');
  
  // Update mode (we'll use the magic schools from Morrowind)
  const mode = getEditingMode();
  statusMode.textContent = mode;
  
  // Update filetype info
  filetypeInfo.textContent = currentLanguage.toUpperCase();
  
  // Update encoding (always UTF-8)
  encodingInfo.textContent = 'UTF-8';
  
  // Initial cursor position
  updateCursorPosition(editor.getPosition());
};

// Update cursor position display
const updateCursorPosition = (position) => {
  const cursorPosition = document.getElementById('cursor-position');
  cursorPosition.textContent = `${position.lineNumber}:${position.column}`;
};

// Get editing mode based on current context (using Morrowind magic schools)
const getEditingMode = () => {
  const modes = {
    'javascript': 'ALTERATION',
    'typescript': 'ALTERATION',
    'html': 'CONJURATION',
    'css': 'ILLUSION',
    'json': 'MYSTICISM',
    'markdown': 'RESTORATION',
    'python': 'DESTRUCTION',
    'rust': 'DESTRUCTION',
    'c': 'DESTRUCTION',
    'cpp': 'DESTRUCTION'
  };
  
  return modes[currentLanguage] || 'ALTERATION';
};

// Get language ID from file path based on extension
const getLanguageFromFilePath = (filePath) => {
  const extension = filePath.split('.').pop().toLowerCase();
  
  const extensionMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'less': 'less',
    'json': 'json',
    'md': 'markdown',
    'markdown': 'markdown',
    'py': 'python',
    'rs': 'rust',
    'c': 'c',
    'cpp': 'cpp',
    'h': 'cpp',
    'hpp': 'cpp',
    'java': 'java',
    'go': 'go',
    'php': 'php',
    'rb': 'ruby',
    'sql': 'sql',
    'sh': 'shell',
    'bash': 'shell',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml'
  };
  
  return extensionMap[extension] || 'plaintext';
};

// Update the editor's theme
const updateEditorTheme = (theme) => {
  editor.updateOptions({ theme: theme });
};

// Switch between Lain and Morrowind themes
const toggleTheme = () => {
  const themeStylesheet = document.getElementById('theme-stylesheet');
  const currentTheme = themeStylesheet.href.includes('lain') ? 'morrowind' : 'lain';
  
  themeStylesheet.href = `app/styles/themes/${currentTheme}.css`;
  
  // Also update the editor theme
  if (currentTheme === 'lain') {
    monaco.editor.setTheme('lain-theme');
    addWhisperMessage('Connected to Layer 7: Neural Stream Interface', 'from-ai');
  } else {
    monaco.editor.setTheme('morrowind-theme');
    addWhisperMessage('The Scroll of the Sixth House unfolds before you...', 'from-ai');
  }
  
  // Apply theme transition effect
  document.body.classList.add('theme-transition');
  setTimeout(() => {
    document.body.classList.remove('theme-transition');
  }, 1000);
};

// Trigger effects based on current theme
const triggerGlitchEffect = () => {
  const editorElement = document.querySelector('.monaco-editor');
  editorElement.classList.add('error-shake');
  setTimeout(() => {
    editorElement.classList.remove('error-shake');
  }, 500);
};

const triggerMagicalEffect = () => {
  const editorElement = document.querySelector('.monaco-editor');
  editorElement.classList.add('magic-text');
  setTimeout(() => {
    editorElement.classList.remove('magic-text');
  }, 3000);
};

const triggerSuccessPulse = (color) => {
  const editorElement = document.querySelector('.monaco-editor');
  editorElement.style.boxShadow = `0 0 20px ${color}`;
  setTimeout(() => {
    editorElement.style.boxShadow = '';
  }, 1000);
};

// Update neural thread visualization
const triggerNeuralThreadUpdate = () => {
  const threadIndicator = document.getElementById('neural-thread-indicator');
  
  // Create a new node
  const newNode = document.createElement('div');
  newNode.className = 'thread-node active';
  
  // Create a new connecting line
  const newLine = document.createElement('div');
  newLine.className = 'thread-line thread-line-connecting';
  
  // Update existing nodes
  const existingNodes = threadIndicator.querySelectorAll('.thread-node');
  existingNodes.forEach(node => {
    node.classList.remove('active');
  });
  
  // Add new elements
  threadIndicator.appendChild(newLine);
  threadIndicator.appendChild(newNode);
  
  // Limit the number of nodes shown
  while (threadIndicator.children.length > 7) {
    threadIndicator.removeChild(threadIndicator.firstChild);
  }
};

// Add a message to the whisper tab
const addWhisperMessage = (message, className) => {
  const whisperMessages = document.getElementById('whisper-messages');
  const messageElement = document.createElement('div');
  messageElement.className = `whisper-message ${className} message-appear`;
  messageElement.textContent = message;
  whisperMessages.appendChild(messageElement);
  
  // Scroll to bottom
  whisperMessages.scrollTop = whisperMessages.scrollHeight;
};

// Update editor state and save to local storage
const updateEditorState = () => {
  // Only save if we have a current file path
  if (currentFilePath) {
    const fileState = {
      path: currentFilePath,
      content: editor.getValue(),
      language: currentLanguage,
      lastModified: new Date().getTime()
    };
    
    // Save to local storage
    const editorStates = JSON.parse(localStorage.getItem('chimeraEditorStates') || '{}');
    editorStates[currentFilePath] = fileState;
    localStorage.setItem('chimeraEditorStates', JSON.stringify(editorStates));
  }
};

// Register key commands
const registerKeyCommands = () => {
  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyS, () => {
    saveFile();
  });
  
  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyT, () => {
    toggleTheme();
  });
  
  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyN, () => {
    // Get project directory from user preferences
    const projectDir = localStorage.getItem('chimeraLastProject') || '';
    
    if (projectDir) {
      // Prompt for file name
      const fileName = prompt('Enter file name:');
      if (fileName) {
        const filePath = window.chimera.fileSystem.joinPaths(projectDir, fileName);
        createNewFile(filePath, '');
      }
    } else {
      addWhisperMessage('Open a project first before creating a file.', 'from-ai');
    }
  });
};

// Initialize the editor when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  initEditor();
  registerKeyCommands();
  
  // Set up theme toggle button
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // Export API for use in other modules
  window.chimeraEditor = {
    openFile,
    saveFile,
    createNewFile,
    closeFile,
    getCurrentFilePath: () => currentFilePath,
    getCurrentLanguage: () => currentLanguage,
    addWhisperMessage
  };
});
