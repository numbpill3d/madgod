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
  const body = document.body;
  const currentTheme = body.classList.contains('theme-lain') ? 'lain' : 'morrowind';

  // Only apply Neural UI for Lain theme
  if (currentTheme === 'lain') {
    activateNeuralUI();
  }

  // Observer for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const newTheme = body.classList.contains('theme-lain') ? 'lain' : 'morrowind';

        if (newTheme === 'lain' && !isActive) {
          activateNeuralUI();
        } else if (newTheme === 'morrowind' && isActive) {
          deactivateNeuralUI();
        }
      }
    });
  });

  observer.observe(body, { attributes: true });

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

// Add scan line effect
const addScanLineEffect = () => {
  // Remove any existing scan line
  removeScanLineEffect();

  // Create scan line element
  const scanLine = document.createElement('div');
  scanLine.id = 'scan-line-effect';
  scanLine.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: rgba(57, 255, 20, 0.15);
    z-index: 9992;
    pointer-events: none;
    animation: scan-line-move 5s linear infinite;
  `;

  // Add animation keyframes
  const style = document.createElement('style');
  style.id = 'scan-line-style';
  style.textContent = `
    @keyframes scan-line-move {
      0% { transform: translateY(-10px); }
      100% { transform: translateY(100vh); }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(scanLine);
};

// Remove scan line effect
const removeScanLineEffect = () => {
  const existingScanLine = document.getElementById('scan-line-effect');
  if (existingScanLine) {
    existingScanLine.remove();
  }

  const existingStyle = document.getElementById('scan-line-style');
  if (existingStyle) {
    existingStyle.remove();
  }
};

// Add neural pulse effects
const addNeuralPulseEffects = () => {
  // Set up observer for elements that should have neural pulse
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            // Add neural pulse to buttons
            if (node.classList.contains('daedric-btn')) {
              applyNeuralPulseToElement(node);
            }

            // Add to other elements
            if (node.classList.contains('file-item') ||
                node.classList.contains('editor-tab') ||
                node.classList.contains('whisper-message')) {
              applyNeuralPulseToElement(node);
            }

            // Also check children
            const elements = node.querySelectorAll('.daedric-btn, .file-item, .editor-tab, .whisper-message');
            elements.forEach(element => {
              applyNeuralPulseToElement(element);
            });
          }
        });
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Store observer for later cleanup
  window.neuralPulseObserver = observer;

  // Process existing elements
  const elements = document.querySelectorAll('.daedric-btn, .file-item, .editor-tab, .whisper-message');
  elements.forEach(element => {
    applyNeuralPulseToElement(element);
  });
};

// Apply neural pulse effect to an element
const applyNeuralPulseToElement = (element) => {
  // Skip if already processed
  if (element.hasAttribute('data-neural-pulse')) return;

  // Mark as processed
  element.setAttribute('data-neural-pulse', 'true');

  // Add hover handler
  element.addEventListener('mouseenter', triggerNeuralPulse);
};

// Trigger neural pulse effect on element
const triggerNeuralPulse = (event) => {
  // Only if we're in the Lain theme
  if (!isActive) return;

  const element = event.currentTarget;

  // Create pulse element
  const pulse = document.createElement('div');
  pulse.className = 'neural-pulse-effect';
  pulse.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(57, 255, 20, 0.1) 50%,
      rgba(0, 0, 0, 0) 100%);
    opacity: 0;
    pointer-events: none;
    z-index: 2;
    animation: neural-pulse-anim 0.6s ease-out;
  `;

  // Create animation if needed
  if (!document.querySelector('style#neural-pulse-style')) {
    const style = document.createElement('style');
    style.id = 'neural-pulse-style';
    style.textContent = `
      @keyframes neural-pulse-anim {
        0% { opacity: 0; transform: translateX(-100%); }
        50% { opacity: 1; }
        100% { opacity: 0; transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
  }

  // Ensure element has position
  if (window.getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }

  // Add pulse to element
  element.appendChild(pulse);

  // Clean up after animation
  setTimeout(() => {
    if (pulse.parentNode === element) {
      element.removeChild(pulse);
    }
  }, 600);

  // Add terminal log
  if (Math.random() < 0.3) {
    addTerminalLine(`> ELEMENT ACCESSED: ${element.tagName.toLowerCase()}#${element.id || 'unknown'}`);
  }

  // Dispatch glitch effect for sound
  document.dispatchEvent(new Event('glitch-effect'));
};

// Remove neural pulse effects
const removeNeuralPulseEffects = () => {
  // Remove pulse elements
  const pulseElements = document.querySelectorAll('.neural-pulse-effect');
  pulseElements.forEach(element => element.remove());

  // Remove event listeners
  const elements = document.querySelectorAll('[data-neural-pulse]');
  elements.forEach(element => {
    element.removeEventListener('mouseenter', triggerNeuralPulse);
    element.removeAttribute('data-neural-pulse');
  });

  // Disconnect observer
  if (window.neuralPulseObserver) {
    window.neuralPulseObserver.disconnect();
    window.neuralPulseObserver = null;
  }

  // Remove style
  const style = document.getElementById('neural-pulse-style');
  if (style) {
    style.remove();
  }
};

// Add LCD monitor effect
const addLCDEffect = () => {
  // Remove any existing LCD effect
  removeLCDEffect();

  // Create LCD overlay
  const lcdOverlay = document.createElement('div');
  lcdOverlay.id = 'lcd-effect-overlay';
  lcdOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(57, 255, 20, 0.03) 1px, transparent 1px);
    background-size: 3px 3px;
    pointer-events: none;
    z-index: 9989;
    opacity: 0.7;
  `;

  document.body.appendChild(lcdOverlay);
};

// Remove LCD effect
const removeLCDEffect = () => {
  const existingLCD = document.getElementById('lcd-effect-overlay');
  if (existingLCD) {
    existingLCD.remove();
  }
};

// Add Neural UI specific event handlers
const addNeuralEventHandlers = () => {
  // Log important events to terminal

  // File opened
  document.addEventListener('file-opened', (e) => {
    if (isActive && neuralOverlay) {
      const fileName = e.detail ? e.detail.fileName : 'unknown';
      addTerminalLine(`> FILE ACCESSED: ${fileName}`);
    }
  });

  // File saved
  document.addEventListener('file-saved', (e) => {
    if (isActive && neuralOverlay) {
      const fileName = e.detail ? e.detail.fileName : 'unknown';
      addTerminalLine(`> FILE COMMITTED: ${fileName}`);
    }
  });

  // Whisper message
  document.addEventListener('whisper-message', (e) => {
    if (isActive && neuralOverlay) {
      addTerminalLine('> NEURAL COMMUNICATION ACTIVE');
    }
  });
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initNeuralUI();

  // Export API for use in other modules
  window.chimeraNeuralUI = {
    activate: activateNeuralUI,
    deactivate: deactivateNeuralUI,
    addTerminalLine: addTerminalLine,
    triggerGlitchEffect: () => document.dispatchEvent(new Event('glitch-effect'))
  };
});
