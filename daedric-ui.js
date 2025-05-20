// Daedric UI Components for CHIMERA
// This script implements the Morrowind-inspired UI elements

// Global variables
const daedricRunes = {
  a: 'α', b: 'β', c: 'χ', d: 'δ', e: 'ε', f: 'φ', g: 'γ', h: 'η', i: 'ι', j: 'ϕ',
  k: 'κ', l: 'λ', m: 'μ', n: 'ν', o: 'ο', p: 'π', q: 'ψ', r: 'ρ', s: 'σ', t: 'τ',
  u: 'υ', v: 'ω', w: 'ξ', x: 'ζ', y: 'θ', z: 'Ξ'
};

let isActive = false;

// Initialize Daedric UI elements
const initDaedricUI = () => {
  // Monitor theme changes
  const themeStylesheet = document.getElementById('theme-stylesheet');
  const currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
  
  // Only apply Daedric UI for Morrowind theme
  if (currentTheme === 'morrowind') {
    activateDaedricUI();
  }
  
  // Observer for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        const newTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
        
        if (newTheme === 'morrowind' && !isActive) {
          activateDaedricUI();
        } else if (newTheme === 'lain' && isActive) {
          deactivateDaedricUI();
        }
      }
    });
  });
  
  observer.observe(themeStylesheet, { attributes: true });
  
  // Add custom event handlers
  addDaedricEventHandlers();
};

// Activate Daedric UI elements
const activateDaedricUI = () => {
  isActive = true;
  
  // Apply Daedric styling
  applyDaedricStyling();
  
  // Add dust particles
  createDustParticles();
  
  // Add scroll unfurl transitions
  addScrollTransitions();
  
  // Replace buttons with Daedric buttons
  enhanceDaedricButtons();
  
  // Add ambient paper texture
  addPaperTexture();
  
  // Daedric hover effects
  addDaedricHoverEffects();
};

// Deactivate Daedric UI elements
const deactivateDaedricUI = () => {
  isActive = false;
  
  // Remove dust particles
  removeDustParticles();
  
  // Remove scroll transitions
  removeScrollTransitions();
  
  // Restore buttons
  restoreButtons();
  
  // Remove paper texture
  removePaperTexture();
  
  // Remove hover effects
  removeDaedricHoverEffects();
};

// Apply Daedric styling to UI elements
const applyDaedricStyling = () => {
  // Convert headings to Daedric-style text
  const headings = document.querySelectorAll('.tool-header, #scroll-header, #whisper-header');
  
  headings.forEach(heading => {
    // Skip if already processed
    if (heading.hasAttribute('data-daedric-styled')) return;
    
    // Mark as processed
    heading.setAttribute('data-daedric-styled', 'true');
    
    // Store original text
    heading.setAttribute('data-original-text', heading.textContent);
    
    // Apply daedric effect - convert some letters to daedric runes
    heading.textContent = daedricizeText(heading.textContent);
    
    // Add magical glow effect
    heading.classList.add('magic-text');
  });
  
  // Add scroll decorations to panels
  addScrollDecorations();
};

// Convert text to partial Daedric runes (for a mystical effect)
const daedricizeText = (text) => {
  // Only convert about 30% of characters to maintain readability
  return text.split('').map(char => {
    const lower = char.toLowerCase();
    
    // If it's a letter and random chance hits, convert to daedric
    if (daedricRunes[lower] && Math.random() < 0.3) {
      return daedricRunes[lower];
    }
    
    return char;
  }).join('');
};

// Add scroll decorations to panels
const addScrollDecorations = () => {
  // Add scroll corners to each panel
  const panels = document.querySelectorAll('.panel');
  
  panels.forEach(panel => {
    // Skip if already processed
    if (panel.hasAttribute('data-scroll-decorated')) return;
    
    // Mark as processed
    panel.setAttribute('data-scroll-decorated', 'true');
    
    // Create scroll corners
    const topLeft = document.createElement('div');
    topLeft.className = 'scroll-corner top-left';
    panel.appendChild(topLeft);
    
    const topRight = document.createElement('div');
    topRight.className = 'scroll-corner top-right';
    panel.appendChild(topRight);
    
    const bottomLeft = document.createElement('div');
    bottomLeft.className = 'scroll-corner bottom-left';
    panel.appendChild(bottomLeft);
    
    const bottomRight = document.createElement('div');
    bottomRight.className = 'scroll-corner bottom-right';
    panel.appendChild(bottomRight);
    
    // Add scroll styles
    const style = document.createElement('style');
    style.textContent = `
      .scroll-corner {
        position: absolute;
        width: 20px;
        height: 20px;
        background-color: rgba(167, 125, 70, 0.5);
        z-index: 10;
      }
      
      .top-left {
        top: 0;
        left: 0;
        border-bottom-right-radius: 10px;
      }
      
      .top-right {
        top: 0;
        right: 0;
        border-bottom-left-radius: 10px;
      }
      
      .bottom-left {
        bottom: 0;
        left: 0;
        border-top-right-radius: 10px;
      }
      
      .bottom-right {
        bottom: 0;
        right: 0;
        border-top-left-radius: 10px;
      }
    `;
    
    document.head.appendChild(style);
  });
};

// Create dust particles floating effect
const createDustParticles = () => {
  // Remove any existing dust container
  removeDustParticles();
  
  // Create container for dust particles
  const dustContainer = document.createElement('div');
  dustContainer.id = 'dust-particles';
  dustContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10000;
    overflow: hidden;
  `;
  
  // Add particles
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    
    // Random properties for varied effect
    const size = Math.random() * 4 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const opacity = Math.random() * 0.5 + 0.3;
    const duration = Math.random() * 60 + 30;
    const delay = Math.random() * 15;
    
    particle.className = 'dust-particle';
    particle.style.cssText = `
      position: absolute;
      left: ${posX}%;
      top: ${posY}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background-color: rgba(232, 203, 154, ${opacity});
      box-shadow: 0 0 ${size + 2}px rgba(232, 203, 154, 0.3);
      animation: float-dust ${duration}s ease-in-out ${delay}s infinite;
    `;
    
    dustContainer.appendChild(particle);
  }
  
  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-dust {
      0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0.2;
      }
      25% {
        transform: translateY(-${Math.random() * 100 + 50}px) translateX(${Math.random() * 50 - 25}px);
        opacity: 0.5;
      }
      50% {
        transform: translateY(-${Math.random() * 150 + 100}px) translateX(${Math.random() * 100 - 50}px);
        opacity: 0.3;
      }
      75% {
        transform: translateY(-${Math.random() * 100 + 150}px) translateX(${Math.random() * 50 - 25}px);
        opacity: 0.4;
      }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(dustContainer);
};

// Remove dust particles
const removeDustParticles = () => {
  const existingDust = document.getElementById('dust-particles');
  if (existingDust) {
    existingDust.remove();
  }
  
  // Also remove any associated styles
  const styles = document.querySelectorAll('style');
  styles.forEach(style => {
    if (style.textContent.includes('float-dust')) {
      style.remove();
    }
  });
};

// Add scroll unfurl transitions for panels
const addScrollTransitions = () => {
  // Add scroll unfurl effect to file explorer items
  const fileExplorer = document.getElementById('file-explorer');
  
  if (fileExplorer) {
    // Create a mutation observer to watch for new file items
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              // Add scroll unfurl class to new elements
              if (node.classList.contains('file-item') || node.classList.contains('directory')) {
                if (!node.classList.contains('scroll-unfurl')) {
                  node.classList.add('scroll-unfurl');
                }
              }
              
              // Also check children
              const items = node.querySelectorAll('.file-item, .directory');
              items.forEach(item => {
                if (!item.classList.contains('scroll-unfurl')) {
                  item.classList.add('scroll-unfurl');
                }
              });
            }
          });
        }
      });
    });
    
    // Start observing
    observer.observe(fileExplorer, { 
      childList: true,
      subtree: true
    });
    
    // Store the observer for later cleanup
    window.daedricFileObserver = observer;
  }
  
  // Add unfurl effect to whisper messages
  const whisperMessages = document.getElementById('whisper-messages');
  
  if (whisperMessages) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList.contains('whisper-message')) {
              if (!node.classList.contains('scroll-unfurl')) {
                node.classList.add('scroll-unfurl');
                
                // Play scroll sound effect
                document.dispatchEvent(new Event('scroll-effect'));
              }
            }
          });
        }
      });
    });
    
    // Start observing
    observer.observe(whisperMessages, { 
      childList: true
    });
    
    // Store the observer for later cleanup
    window.daedricWhisperObserver = observer;
  }
};

// Remove scroll transitions
const removeScrollTransitions = () => {
  // Remove transition classes
  const items = document.querySelectorAll('.scroll-unfurl');
  items.forEach(item => {
    item.classList.remove('scroll-unfurl');
  });
  
  // Disconnect observers
  if (window.daedricFileObserver) {
    window.daedricFileObserver.disconnect();
    window.daedricFileObserver = null;
  }
  
  if (window.daedricWhisperObserver) {
    window.daedricWhisperObserver.disconnect();
    window.daedricWhisperObserver = null;
  }
};

// Enhance buttons with Daedric styling
const enhanceDaedricButtons = () => {
  const buttons = document.querySelectorAll('button.daedric-btn');
  
  buttons.forEach(button => {
    // Skip if already processed
    if (button.hasAttribute('data-daedric-styled')) return;
    
    // Mark as processed
    button.setAttribute('data-daedric-styled', 'true');
    
    // Store original text
    button.setAttribute('data-original-text', button.textContent);
    
    // Apply daedric effect
    button.textContent = daedricizeText(button.textContent);
    
    // Add rune border to button
    button.style.borderImage = 'url(app/assets/images/ui/button-border.png) 4 4 4 4 stretch';
    button.style.borderImageWidth = '4px';
    button.style.borderStyle = 'solid';
    button.style.borderImageRepeat = 'stretch';
    
    // Add click effect
    button.addEventListener('click', triggerButtonEffect);
  });
};

// Restore buttons to original styling
const restoreButtons = () => {
  const buttons = document.querySelectorAll('button[data-daedric-styled]');
  
  buttons.forEach(button => {
    // Restore original text
    if (button.hasAttribute('data-original-text')) {
      button.textContent = button.getAttribute('data-original-text');
    }
    
    // Remove daedric styling
    button.style.borderImage = '';
    button.style.borderImageWidth = '';
    button.style.borderStyle = '';
    button.style.borderImageRepeat = '';
    
    // Remove attributes
    button.removeAttribute('data-daedric-styled');
    button.removeAttribute('data-original-text');
    
    // Remove event listener
    button.removeEventListener('click', triggerButtonEffect);
  });
};

// Add paper texture overlay
const addPaperTexture = () => {
  // Remove any existing paper texture
  removePaperTexture();
  
  // Create texture overlay
  const textureOverlay = document.createElement('div');
  textureOverlay.id = 'paper-texture-overlay';
  textureOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('app/assets/images/backgrounds/paper-grain.png');
    background-repeat: repeat;
    background-size: 200px;
    opacity: 0.03;
    pointer-events: none;
    z-index: 9999;
  `;
  
  document.body.appendChild(textureOverlay);
};

// Remove paper texture
const removePaperTexture = () => {
  const existingTexture = document.getElementById('paper-texture-overlay');
  if (existingTexture) {
    existingTexture.remove();
  }
};

// Add hover effects for Daedric UI
const addDaedricHoverEffects = () => {
  // Add effect to file items
  const fileItems = document.querySelectorAll('.file-item');
  
  fileItems.forEach(item => {
    if (!item.hasAttribute('data-daedric-hover')) {
      item.setAttribute('data-daedric-hover', 'true');
      item.addEventListener('mouseenter', triggerItemHoverEffect);
    }
  });
  
  // Set up observer to add effect to new items
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.classList.contains('file-item') && !node.hasAttribute('data-daedric-hover')) {
              node.setAttribute('data-daedric-hover', 'true');
              node.addEventListener('mouseenter', triggerItemHoverEffect);
            }
            
            // Also check children
            const items = node.querySelectorAll('.file-item');
            items.forEach(item => {
              if (!item.hasAttribute('data-daedric-hover')) {
                item.setAttribute('data-daedric-hover', 'true');
                item.addEventListener('mouseenter', triggerItemHoverEffect);
              }
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
  
  // Store the observer for later cleanup
  window.daedricHoverObserver = observer;
};

// Remove Daedric hover effects
const removeDaedricHoverEffects = () => {
  // Remove effect from file items
  const fileItems = document.querySelectorAll('[data-daedric-hover]');
  
  fileItems.forEach(item => {
    item.removeEventListener('mouseenter', triggerItemHoverEffect);
    item.removeAttribute('data-daedric-hover');
  });
  
  // Disconnect observer
  if (window.daedricHoverObserver) {
    window.daedricHoverObserver.disconnect();
    window.daedricHoverObserver = null;
  }
};

// Trigger effect when hovering over file items
const triggerItemHoverEffect = (event) => {
  // Create a subtle magical rune flash effect
  const element = event.currentTarget;
  
  // Create glow element
  const glow = document.createElement('div');
  glow.className = 'daedric-hover-glow';
  glow.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, rgba(232, 203, 154, 0.3) 0%, rgba(232, 203, 154, 0) 70%);
    opacity: 0;
    pointer-events: none;
    z-index: 5;
    animation: hover-glow 0.5s ease-out;
  `;
  
  // Create animation if needed
  if (!document.querySelector('style#daedric-hover-style')) {
    const style = document.createElement('style');
    style.id = 'daedric-hover-style';
    style.textContent = `
      @keyframes hover-glow {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Position element
  element.style.position = 'relative';
  
  // Add glow to element
  element.appendChild(glow);
  
  // Remove after animation completes
  setTimeout(() => {
    if (glow.parentNode === element) {
      element.removeChild(glow);
    }
  }, 500);
  
  // Dispatch magic effect event for sound
  document.dispatchEvent(new Event('magic-effect'));
};

// Trigger effect when clicking Daedric buttons
const triggerButtonEffect = (event) => {
  const button = event.currentTarget;
  
  // Add pulse animation
  button.classList.add('button-click');
  
  // Create magical pulse
  const pulse = document.createElement('div');
  pulse.className = 'daedric-button-pulse';
  pulse.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(232, 203, 154, 0.7);
    box-shadow: 0 0 10px rgba(232, 203, 154, 0.7);
    opacity: 0.7;
    pointer-events: none;
    z-index: 10;
    animation: button-pulse 0.6s ease-out;
  `;
  
  // Create animation if needed
  if (!document.querySelector('style#daedric-button-style')) {
    const style = document.createElement('style');
    style.id = 'daedric-button-style';
    style.textContent = `
      @keyframes button-pulse {
        0% { width: 5px; height: 5px; opacity: 0.7; }
        100% { width: 50px; height: 50px; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Position button if needed
  if (window.getComputedStyle(button).position === 'static') {
    button.style.position = 'relative';
  }
  
  // Add pulse to button
  button.appendChild(pulse);
  
  // Remove animation and pulse after completion
  setTimeout(() => {
    button.classList.remove('button-click');
    if (pulse.parentNode === button) {
      button.removeChild(pulse);
    }
  }, 600);
  
  // Play magic sound effect
  document.dispatchEvent(new Event('magic-effect'));
};

// Add Daedric-specific event handlers
const addDaedricEventHandlers = () => {
  // Add event handler for file open to trigger scroll effect
  document.addEventListener('file-opened', () => {
    if (isActive) {
      document.dispatchEvent(new Event('scroll-effect'));
    }
  });
  
  // Add event handler for save to trigger magic effect
  document.addEventListener('file-saved', () => {
    if (isActive) {
      document.dispatchEvent(new Event('magic-effect'));
    }
  });
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initDaedricUI();
  
  // Export API for use in other modules
  window.chimeraDaedricUI = {
    activate: activateDaedricUI,
    deactivate: deactivateDaedricUI,
    daedricizeText: daedricizeText,
    triggerMagicEffect: () => document.dispatchEvent(new Event('magic-effect')),
    triggerScrollEffect: () => document.dispatchEvent(new Event('scroll-effect'))
  };
});
