// CHIMERA Code Editor - Main Application Script
// This script initializes and coordinates all the components of the application

// Global application state
const chimeraApp = {
  currentTheme: 'lain', // Default theme
  isInitialized: false,
  activeFile: null,
  projectRoot: null
};

// Initialize the application
const initializeApp = () => {
  console.log('Initializing CHIMERA Code Editor...');

  // Set up window controls
  setupWindowControls();

  // Set up theme toggling
  setupThemeToggle();

  // Initialize file explorer events
  setupFileExplorer();

  // Set up whisper tab
  setupWhisperTab();

  // Set up keyboard shortcuts
  setupKeyboardShortcuts();

  // Mark as initialized
  chimeraApp.isInitialized = true;

  // Try to load last project if available
  loadLastProject();

  // Add welcome message to whisper tab
  if (window.chimeraWhisper) {
    window.chimeraWhisper.addMessage(
      'Welcome to CHIMERA. The veil between code and consciousness is thin here...',
      'from-ai'
    );
  }

  console.log('CHIMERA initialization complete');
};

// Set up window control buttons
const setupWindowControls = () => {
  const minimizeBtn = document.getElementById('minimize-btn');
  const maximizeBtn = document.getElementById('maximize-btn');
  const closeBtn = document.getElementById('close-btn');

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
      window.chimera.window.minimize();
    });
  }

  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', () => {
      window.chimera.window.toggleMaximize();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.chimera.window.close();
    });
  }
};

// Set up theme toggle button
const setupThemeToggle = () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeStylesheet = document.getElementById('theme-stylesheet');
  const body = document.body;

  if (themeToggle && themeStylesheet) {
    // Determine current theme
    chimeraApp.currentTheme = body.classList.contains('theme-lain') ? 'lain' : 'morrowind';

    themeToggle.addEventListener('click', () => {
      // Toggle theme
      if (chimeraApp.currentTheme === 'lain') {
        body.classList.remove('theme-lain');
        body.classList.add('theme-morrowind');
        chimeraApp.currentTheme = 'morrowind';
      } else {
        body.classList.remove('theme-morrowind');
        body.classList.add('theme-lain');
        chimeraApp.currentTheme = 'lain';
      }

      // Announce theme change
      if (window.chimeraWhisper) {
        const message = chimeraApp.currentTheme === 'lain'
          ? 'Neural interface activated. Layer protocol initialized.'
          : 'Arcane scrolls unfurled. The ancient knowledge flows.';

        window.chimeraWhisper.addMessage(message, 'from-ai');
      }
    });
  }
};

// Set up file explorer
const setupFileExplorer = () => {
  const openProjectBtn = document.getElementById('open-project-btn');

  if (openProjectBtn) {
    openProjectBtn.addEventListener('click', async () => {
      try {
        const projectPath = await window.chimera.fileSystem.openDirectory();
        if (projectPath) {
          loadProject(projectPath);
        }
      } catch (error) {
        console.error('Failed to open project:', error);
        if (window.chimeraWhisper) {
          window.chimeraWhisper.addMessage(`Failed to open realm: ${error.message}`, 'from-ai');
        }
      }
    });
  }
};

// Load a project
const loadProject = async (projectPath) => {
  try {
    chimeraApp.projectRoot = projectPath;

    // Save as last opened project
    localStorage.setItem('chimeraLastProject', projectPath);

    // Notify file explorer to load the project
    if (window.chimeraFileExplorer) {
      await window.chimeraFileExplorer.loadProject(projectPath);
    }

    // Announce project loaded
    if (window.chimeraWhisper) {
      const projectName = projectPath.split(/[/\\]/).pop();
      window.chimeraWhisper.addMessage(`Realm '${projectName}' has been opened. The code speaks...`, 'from-ai');
    }
  } catch (error) {
    console.error('Failed to load project:', error);
    if (window.chimeraWhisper) {
      window.chimeraWhisper.addMessage(`Failed to load realm: ${error.message}`, 'from-ai');
    }
  }
};

// Try to load the last opened project
const loadLastProject = async () => {
  const lastProject = localStorage.getItem('chimeraLastProject');

  if (lastProject) {
    try {
      await loadProject(lastProject);
    } catch (error) {
      console.error('Failed to load last project:', error);
      // Clear the stored project path if it's invalid
      localStorage.removeItem('chimeraLastProject');
    }
  }
};

// Set up whisper tab
const setupWhisperTab = () => {
  const whisperInput = document.getElementById('whisper-query');
  const whisperSend = document.getElementById('whisper-send');

  if (whisperInput && whisperSend) {
    whisperSend.addEventListener('click', () => {
      const query = whisperInput.value.trim();

      if (query && window.chimeraWhisper) {
        // Add user message
        window.chimeraWhisper.addMessage(query, 'from-user');

        // Process query and generate response
        processWhisperQuery(query);

        // Clear input
        whisperInput.value = '';
      }
    });

    // Also trigger on Enter key
    whisperInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        whisperSend.click();
      }
    });
  }
};

// Process a whisper query and generate a response
const processWhisperQuery = (query) => {
  // In a real app, this would connect to an AI service
  // For now, we'll just generate themed responses

  setTimeout(() => {
    if (window.chimeraWhisper) {
      const responses = chimeraApp.currentTheme === 'lain'
        ? [
            "The protocol recognizes your query. Scanning neural pathways...",
            "Layer boundaries fluctuate. Your code exists in multiple states simultaneously.",
            "Connection established. The network speaks through these terminals.",
            "Digital consciousness expands through your syntax structures.",
            "The Wired remembers what you have forgotten about this code."
          ]
        : [
            "The scrolls whisper of functions beyond mortal comprehension.",
            "As the ancestors coded, so must you follow their arcane patterns.",
            "The Tribunal of Syntax judges your indentation with stern eyes.",
            "Your variables are but dust in the winds of compilation.",
            "The Daedric lords of recursion smile upon your efforts."
          ];

      // Select a random response
      const response = responses[Math.floor(Math.random() * responses.length)];

      window.chimeraWhisper.addMessage(response, 'from-ai');
    }
  }, 1000);
};

// Set up keyboard shortcuts
const setupKeyboardShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    // Alt+T: Toggle theme
    if (e.altKey && e.code === 'KeyT') {
      document.getElementById('theme-toggle').click();
    }

    // Alt+O: Open project
    if (e.altKey && e.code === 'KeyO') {
      document.getElementById('open-project-btn').click();
    }

    // Alt+W: Focus whisper input
    if (e.altKey && e.code === 'KeyW') {
      document.getElementById('whisper-query').focus();
    }

    // Alt+R: Focus task runner
    if (e.altKey && e.code === 'KeyR') {
      document.getElementById('task-select').focus();
    }

    // Alt+G: Focus git panel
    if (e.altKey && e.code === 'KeyG') {
      document.getElementById('git-portal').focus();
    }
  });
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export API for use in other modules
window.chimeraApp = {
  getCurrentTheme: () => chimeraApp.currentTheme,
  getProjectRoot: () => chimeraApp.projectRoot,
  setActiveFile: (filePath) => {
    chimeraApp.activeFile = filePath;
  },
  getActiveFile: () => chimeraApp.activeFile
};
