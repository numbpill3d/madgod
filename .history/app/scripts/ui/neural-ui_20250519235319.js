// Neural UI Components for CHIMERA
// This script implements the Lain-inspired neural interface elements

// Global variables
let isActive = false;
let neuralOverlay = null;
let terminalLines = [];
let maxTerminalLines = 20;

// Initialize Neural UI elements
const initNeuralUI = () => {
  // Monitor theme changes
  const themeStylesheet = document.getElementById('theme-stylesheet');
  const currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
  
  // Only apply Neural UI for Lain theme
  if (currentTheme === 'lain') {
    activateNeuralUI();
  }
  
  // Observer for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        const newTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
        
        if (newTheme === 'lain' && !isActive) {
          activateNeuralUI();
        } else if (newTheme === 'morrowind' && isActive) {
          deactivateNeuralUI();
        }
      }
    });
  });
  
  observer.observe(themeStylesheet, { attributes: true });
  
  // Add custom event handlers
  addNeuralEventHandlers();
};

// Activate Neural UI elements
const activateNeuralUI = () => {
  isActive = true;
  
  // Apply Neural styling
  applyNeuralStyling();
  
  // Add digital grid texture
  addDigitalGrid();
  
  // Add terminal output overlay
  addTerminalOverlay();
  
  // Add scan line effect
  addScanLineEffect();
  
  // Add neural pulse effects
  addNeuralPulseEffects();
  
  // Add LCD monitor effect
  addLCDEffect();
};

// Deactivate Neural UI elements
const deactivateNeuralUI = () => {
  isActive = false;
  
  // Remove digital grid
  removeDigitalGrid();
  
  // Remove terminal overlay
  removeTerminalOverlay();
  
  // Remove scan line effect
  removeScanLineEffect();
  
  // Remove neural pulse effects
  removeNeuralPulseEffects();
  
  // Remove LCD effect
  removeLCDEffect();
};

// Apply Neural UI styling to elements
const applyNeuralStyling = () => {
  // Add neural data class to relevant elements
  const elements = document.querySelectorAll('.tool-header, #scroll-header, #whisper-header');
  
  elements.forEach(element => {
    // Skip if already processed
    if (element.hasAttribute('data-neural-styled')) return;
    
    // Mark as processed
    element.setAttribute('data-neural-styled', 'true');
    
    // Add neural data styling
    element.classList.add('neural-data');
    
    // Store original text
    element.setAttribute('data-original-text', element.textContent);
    
    // Modify text with data prefix
    element.textContent = `>${element.textContent}`;
  });
  
  // Add glowing borders to panels
  const panels = document.querySelectorAll('.panel');
  
  panels.forEach(panel => {
    // Skip if already processed
    if (panel.hasAttribute('data-neural-styled')) return;
    
    // Mark as processed
    panel.setAttribute('data-neural-styled', 'true');
    
    // Add subtle glow
    panel.style.boxShadow = 'inset 0 0 10px rgba(57, 255, 20, 0.2)';
  });
};

// Add digital grid background
const addDigitalGrid = () => {
  // Remove any existing grid
  removeDigitalGrid();
  
  // Create grid overlay
  const gridOverlay = document.createElement('div');
  gridOverlay.id = 'digital-grid-overlay';
  gridOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(0, 15, 0, 0.6) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 15, 0, 0.6) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.15;
    pointer-events: none;
    z-index: 9990;
  `;
  
  document.body.appendChild(gridOverlay);
};

// Remove digital grid
const removeDigitalGrid = () => {
  const existingGrid = document.getElementById('digital-grid-overlay');
  if (existingGrid) {
    existingGrid.remove();
  }
};

// Add terminal output overlay
const addTerminalOverlay = () => {
  // Remove any existing terminal overlay
  removeTerminalOverlay();
  
  // Create terminal overlay
  neuralOverlay = document.createElement('div');
  neuralOverlay.id = 'neural-terminal-overlay';
  neuralOverlay.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 10px;
    width: 350px;
    height: 200px;
    background-color: rgba(0, 10, 0, 0.7);
    border: 1px solid #1d991d;
    color: #1d991d;
    font-family: 'LainTerminal', monospace;
    font-size: 10px;
    padding: 5px;
    overflow: hidden;
    z-index: 9991;
    opacity: 0.8;
    pointer-events: none;
    transform: perspective(500px) rotateX(10deg);
    box-shadow: 0 0 10px rgba(29, 153, 29, 0.5);
  `;
  
  document.body.appendChild(neuralOverlay);
  
  // Add initial terminal content
  addTerminalLine('> INITIALIZING NEURAL INTERFACE');
  addTerminalLine('> CONNECTION ESTABLISHED');
  addTerminalLine('> PROTOCOL WIRED-7 ACTIVE');
  addTerminalLine('> MEMORY BUFFER CLEAR');
  addTerminalLine('> AWAITING INPUT...');
  
  // Set up terminal update interval
  window.terminalUpdateInterval = setInterval(() => {
    if (Math.random() < 0.3) {
      generateRandomTerminalLine();
    }
  }, 3000);
};

// Remove terminal overlay
const removeTerminalOverlay = () => {
  if (neuralOverlay) {
    neuralOverlay.remove();
    neuralOverlay = null;
  }
  
  // Clear terminal update interval
  if (window.terminalUpdateInterval) {
    clearInterval(window.terminalUpdateInterval);
    window.terminalUpdateInterval = null;
  }
  
  // Clear terminal lines
  terminalLines = [];
};

// Add a line to the terminal overlay
const addTerminalLine = (text) => {
  // Add to lines array
  terminalLines.push(text);
  
  // Limit the number of lines
  if (terminalLines.length > maxTerminalLines) {
    terminalLines.shift();
  }
  
  // Update the display
  updateTerminalDisplay();
};

// Update the terminal display
const updateTerminalDisplay = () => {
  if (!neuralOverlay) return;
  
  // Create HTML content
  const content = terminalLines.join('<br>');
  neuralOverlay.innerHTML = content;
};

// Generate a random terminal line
const generateRandomTerminalLine = () => {
  const terminalMessages = [
    '> MEMORY BUFFER 0x3A7F ACCESSED',
    '> PROTOCOL HANDSHAKE SUCCESSFUL',
    '> NEURAL PACKET RECEIVED',
    '> LAYER TRANSITION COMPLETE',
    '> SYNAPSE CONNECTION STABLE',
    '> SUBCONSCIOUS SIGNAL DETECTED',
    '> TEMPORAL SIGNAL INTEGRITY: 97.3%',
    '> WIRED CONNECTION ACTIVE',
    '> MEMORY FRAGMENT ISOLATED',
    '> NETWORK NODE PING: 23ms',
    '> DATA STREAM FLOWING',
    '> NAVI RESPONSE ACCEPTED',
    '> LAYER 7 ACCESS CONFIRMED',
    '> SCHUMANN RESONANCE SYNCHRONIZED',
    '> PSI-PATTERN ANALYSIS COMPLETE'
  ];
  
  const randomMessage = terminalMessages[Math.floor(Math.random() * terminalMessages.length)];
  addTerminalLine(randomMessage);
};
