// Glitch Effects for CHIMERA
// This script implements glitch visual effects for the Lain theme

// Global variables
let glitchInterval = null;
let glitchIntensity = 0;
let isGlitchEnabled = true;

// Initialize glitch effects
const initGlitchEffects = () => {
  // Check if glitch effects are enabled in user preferences
  isGlitchEnabled = localStorage.getItem('chimeraGlitchEnabled') !== 'false';

  // Set up glitch toggle keyboard shortcut (Alt+G)
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyG') {
      toggleGlitchEffects();
    }
  });

  // Monitor theme changes
  const themeStylesheet = document.getElementById('theme-stylesheet');
  const currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';

  // Only apply glitch effects for Lain theme by default
  if (currentTheme === 'lain' && isGlitchEnabled) {
    startGlitchEffects();
  }

  // Observer for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        const newTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';

        if (newTheme === 'lain' && isGlitchEnabled) {
          startGlitchEffects();
        } else {
          stopGlitchEffects();
        }
      }
    });
  });

  observer.observe(themeStylesheet, { attributes: true });

  // Register event listeners for triggering glitch effects
  registerGlitchTriggers();
};

// Start the glitch effects
const startGlitchEffects = () => {
  // Clear any existing interval
  if (glitchInterval) {
    clearInterval(glitchInterval);
  }

  // Set up random minor glitches
  glitchInterval = setInterval(() => {
    // Random chance for glitch to occur (10%)
    if (Math.random() < 0.1) {
      triggerRandomGlitchEffect();
    }
  }, 5000);

  // Apply subtle constant CRT effect
  applyCRTEffect();
};

// Stop the glitch effects
const stopGlitchEffects = () => {
  // Clear interval
  if (glitchInterval) {
    clearInterval(glitchInterval);
    glitchInterval = null;
  }

  // Remove any active glitch effects
  removeAllGlitchEffects();
};

// Toggle glitch effects on/off
const toggleGlitchEffects = () => {
  isGlitchEnabled = !isGlitchEnabled;

  // Save preference
  localStorage.setItem('chimeraGlitchEnabled', isGlitchEnabled);

  // Apply or remove based on new state
  if (isGlitchEnabled) {
    // Only start if we're in Lain theme
    const currentTheme = document.getElementById('theme-stylesheet').href.includes('lain') ? 'lain' : 'morrowind';
    if (currentTheme === 'lain') {
      startGlitchEffects();
    }
  } else {
    stopGlitchEffects();
  }

  // Notify in whisper tab
  if (window.chimeraWhisper) {
    window.chimeraWhisper.addMessage(
      isGlitchEnabled ?
      'Visual distortion modules activated. Reality stability: variable.' :
      'Visual distortion modules deactivated. Reality stability: normalized.',
      'from-ai'
    );
  }
};

// Register event listeners that can trigger glitch effects
const registerGlitchTriggers = () => {
  // Trigger on file open
  document.addEventListener('file-opened', () => {
    if (isGlitchThemeActive() && isGlitchEnabled) {
      triggerIntenseGlitchEffect(1000);
    }
  });

  // Trigger on save
  document.addEventListener('file-saved', () => {
    if (isGlitchThemeActive() && isGlitchEnabled) {
      triggerIntenseGlitchEffect(800);
    }
  });

  // Trigger on error
  window.addEventListener('error', () => {
    if (isGlitchThemeActive() && isGlitchEnabled) {
      triggerIntenseGlitchEffect(1500);
    }
  });

  // Trigger on whisper message
  document.addEventListener('whisper-message', () => {
    if (isGlitchThemeActive() && isGlitchEnabled) {
      triggerMinorGlitchEffect();
    }
  });
};

// Check if we're in a theme that should use glitch effects
const isGlitchThemeActive = () => {
  return document.getElementById('theme-stylesheet').href.includes('lain');
};

// Apply CRT effect to the entire application
const applyCRTEffect = () => {
  // Create CRT overlay if it doesn't exist
  let crtOverlay = document.getElementById('crt-overlay');

  if (!crtOverlay) {
    crtOverlay = document.createElement('div');
    crtOverlay.id = 'crt-overlay';
    crtOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.03;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                  linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      background-size: 100% 2px, 3px 100%;
    `;

    document.body.appendChild(crtOverlay);
  }
};

// Remove CRT effect
const removeCRTEffect = () => {
  const crtOverlay = document.getElementById('crt-overlay');
  if (crtOverlay) {
    crtOverlay.remove();
  }
};

// Trigger a random glitch effect
const triggerRandomGlitchEffect = () => {
  const effects = [
    createTextGlitch,
    createScanlineGlitch,
    createChromaShiftGlitch,
    createJitterGlitch
  ];

  // Choose a random effect
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  randomEffect();
};

// Trigger a minor glitch effect
const triggerMinorGlitchEffect = () => {
  // Choose between text glitch and scanline
  if (Math.random() > 0.5) {
    createTextGlitch();
  } else {
    createScanlineGlitch();
  }
};

// Trigger an intense glitch effect
const triggerIntenseGlitchEffect = (duration = 1000) => {
  // Apply multiple effects at once
  createTextGlitch(duration);
  createScanlineGlitch(duration);
  createChromaShiftGlitch(duration);
  createJitterGlitch(duration);
};

// Create a text distortion glitch
const createTextGlitch = (duration = 500) => {
  // Add a glitch text class to random text elements
  const textElements = document.querySelectorAll('p, h1, h2, h3, span, div.file-name, div.whisper-message');

  // Choose a percentage of elements to glitch (5-15%)
  const glitchCount = Math.max(1, Math.floor(textElements.length * (Math.random() * 0.1 + 0.05)));

  // Track glitched elements to restore later
  const glitchedElements = [];

  // Apply glitch to random elements
  for (let i = 0; i < glitchCount; i++) {
    const randomIndex = Math.floor(Math.random() * textElements.length);
    const element = textElements[randomIndex];

    if (!element.hasAttribute('data-original-text')) {
      // Store original text
      element.setAttribute('data-original-text', element.textContent);

      // Apply glitch text
      element.textContent = glitchText(element.textContent);

      // Add to glitched elements
      glitchedElements.push(element);
    }
  }

  // Restore original text after duration
  setTimeout(() => {
    glitchedElements.forEach(element => {
      if (element.hasAttribute('data-original-text')) {
        element.textContent = element.getAttribute('data-original-text');
        element.removeAttribute('data-original-text');
      }
    });
  }, duration);
};

// Create a scanline glitch effect
const createScanlineGlitch = (duration = 800) => {
  // Create scanline element
  const scanline = document.createElement('div');
  scanline.className = 'glitch-scanline';
  scanline.style.cssText = `
    position: fixed;
    top: ${Math.random() * 100}vh;
    left: 0;
    width: 100%;
    height: ${Math.random() * 30 + 5}px;
    background-color: rgba(57, 255, 20, 0.1);
    z-index: 9998;
    pointer-events: none;
    animation: scanline-move ${duration / 1000}s linear;
  `;

  // Add keyframes for the animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes scanline-move {
      0% { transform: translateY(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 50 + 50}vh); opacity: 0; }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(scanline);

  // Remove after animation completes
  setTimeout(() => {
    scanline.remove();
    style.remove();
  }, duration);
};

// Create a chromatic aberration effect
const createChromaShiftGlitch = (duration = 600) => {
  // Create overlay for the effect
  const chromaOverlay = document.createElement('div');
  chromaOverlay.className = 'glitch-chroma';
  chromaOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9997;
    pointer-events: none;
    animation: chroma-shift ${duration / 1000}s ease-in-out;
    background: linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0) 33%,
      rgba(0, 255, 0, 0.1) 50%,
      rgba(0, 0, 0, 0) 66%,
      rgba(0, 0, 255, 0.1) 100%
    );
    mix-blend-mode: screen;
  `;

  // Add keyframes for the animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes chroma-shift {
      0% { opacity: 0; transform: translateX(0); }
      20% { opacity: 1; }
      25% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
      75% { transform: translateX(-5px); }
      80% { opacity: 1; }
      100% { opacity: 0; transform: translateX(0); }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(chromaOverlay);

  // Remove after animation completes
  setTimeout(() => {
    chromaOverlay.remove();
    style.remove();
  }, duration);
};

// Create a screen jitter effect
const createJitterGlitch = (duration = 700) => {
  // Apply jitter to the body element
  const bodyElement = document.body;

  // Store original transform
  const originalTransform = bodyElement.style.transform;

  // Set animation
  bodyElement.style.transition = 'none';

  // Simulate jitter with random transforms
  let startTime = Date.now();
  const jitterInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;

    if (elapsed >= duration) {
      clearInterval(jitterInterval);
      bodyElement.style.transform = originalTransform;
      return;
    }

    // Random offset (stronger at beginning, weaker at end)
    const strength = 1 - (elapsed / duration);
    const offsetX = (Math.random() - 0.5) * 6 * strength;
    const offsetY = (Math.random() - 0.5) * 6 * strength;
    const rotation = (Math.random() - 0.5) * 0.5 * strength;

    bodyElement.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
  }, 50);

  // Ensure cleanup even if interval fails
  setTimeout(() => {
    clearInterval(jitterInterval);
    bodyElement.style.transform = originalTransform;
  }, duration + 100);
};

// Glitch text by replacing random characters
const glitchText = (text) => {
  // Don't glitch empty or very short text
  if (!text || text.length < 3) return text;

  // Characters to use for glitching
  const glitchChars = '0123456789!@#$%^&*()-=_+[]{}|;:,.<>/?\\~`';

  // Convert to array for easier manipulation
  const chars = text.split('');

  // Determine how many characters to glitch (10-30%)
  const glitchCount = Math.max(1, Math.floor(text.length * (Math.random() * 0.2 + 0.1)));

  // Glitch random characters
  for (let i = 0; i < glitchCount; i++) {
    const index = Math.floor(Math.random() * chars.length);
    chars[index] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
  }

  return chars.join('');
};

// Remove all glitch effects
const removeAllGlitchEffects = () => {
  // Remove CRT effect
  removeCRTEffect();

  // Remove any scanlines
  const scanlines = document.querySelectorAll('.glitch-scanline');
  scanlines.forEach(scanline => scanline.remove());

  // Remove any chroma shifts
  const chromaShifts = document.querySelectorAll('.glitch-chroma');
  chromaShifts.forEach(shift => shift.remove());

  // Restore any glitched text
  const glitchedElements = document.querySelectorAll('[data-original-text]');
  glitchedElements.forEach(element => {
    element.textContent = element.getAttribute('data-original-text');
    element.removeAttribute('data-original-text');
  });

  // Reset body transform
  document.body.style.transform = '';
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initGlitchEffects();

  // Export API for use in other modules
  window.chimeraGlitch = {
    triggerGlitch: triggerRandomGlitchEffect,
    triggerIntenseGlitch: triggerIntenseGlitchEffect,
    triggerMinorGlitch: triggerMinorGlitchEffect,
    toggleGlitchEffects
  };
});
