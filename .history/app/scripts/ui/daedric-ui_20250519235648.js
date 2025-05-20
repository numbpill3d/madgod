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
