// Ambient Sound System for CHIMERA
// This script implements background audio and sound effects

// Import Howler for audio management
// Note: In a real application, we would use a proper import statement or script tag
//       This code assumes Howler is available via window.Howler

// Global variables
let isSoundEnabled = true;
let ambientSound = null;
let currentTheme = 'lain';
let volume = 0.3; // Default volume (0-1)

// Sound configuration
const sounds = {
  lain: {
    ambient: {
      url: 'app/assets/audio/ambient/lain_hum.mp3',
      volume: 0.3,
      loop: true,
      fade: 2000
    },
    effects: {
      glitch: 'app/assets/audio/effects/glitch.mp3',
      keypress: 'app/assets/audio/effects/key.mp3',
      save: 'app/assets/audio/effects/save_lain.mp3',
      error: 'app/assets/audio/effects/error_lain.mp3',
      whisper: 'app/assets/audio/effects/message_lain.mp3',
      open: 'app/assets/audio/effects/open_lain.mp3',
      close: 'app/assets/audio/effects/close_lain.mp3'
    }
  },
  morrowind: {
    ambient: {
      url: 'app/assets/audio/ambient/morrowind_wind.mp3',
      volume: 0.3,
      loop: true,
      fade: 2000
    },
    effects: {
      magic: 'app/assets/audio/effects/magic.mp3',
      scroll: 'app/assets/audio/effects/scroll.mp3',
      save: 'app/assets/audio/effects/save_morrowind.mp3',
      error: 'app/assets/audio/effects/error_morrowind.mp3',
      whisper: 'app/assets/audio/effects/message_morrowind.mp3',
      open: 'app/assets/audio/effects/open_morrowind.mp3',
      close: 'app/assets/audio/effects/close_morrowind.mp3'
    }
  }
};

// Sound effect instances - will be created on demand
const effectInstances = {};

// Initialize the sound system
const initSoundSystem = () => {
  // Check if sound is enabled in user preferences
  isSoundEnabled = localStorage.getItem('chimeraSoundEnabled') !== 'false';
  
  // Get stored volume or use default
  volume = parseFloat(localStorage.getItem('chimeraSoundVolume') || '0.3');
  
  // Set up sound toggle keyboard shortcut (Alt+M)
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyM') {
      toggleSound();
    }
  });
  
  // Set up volume control shortcuts
  document.addEventListener('keydown', (e) => {
    // Alt+Up arrow to increase volume
    if (e.altKey && e.code === 'ArrowUp') {
      changeVolume(0.05);
    }
    // Alt+Down arrow to decrease volume
    else if (e.altKey && e.code === 'ArrowDown') {
      changeVolume(-0.05);
    }
  });
  
  // Set up theme change listener
  const themeStylesheet = document.getElementById('theme-stylesheet');
  currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
  
  // Start ambient sound for current theme
  if (isSoundEnabled) {
    startAmbientSound();
  }
  
  // Observer for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        const newTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
        
        if (newTheme !== currentTheme) {
          currentTheme = newTheme;
          
          // Change ambient sound when theme changes
          if (isSoundEnabled && ambientSound) {
            fadeAmbientSound();
            setTimeout(() => startAmbientSound(), 1000);
          }
        }
      }
    });
  });
  
  observer.observe(themeStylesheet, { attributes: true });
  
  // Set up event listeners for app interactions
  setupSoundEvents();
  
  // Notify system once audio is ready
  window.dispatchEvent(new Event('audio-ready'));
};

// Start the ambient background sound
const startAmbientSound = () => {
  // Don't start if sound is disabled
  if (!isSoundEnabled) return;
  
  // Stop any existing ambient sound
  if (ambientSound) {
    ambientSound.stop();
  }
  
  // Create new ambient sound
  const config = sounds[currentTheme].ambient;
  
  // For demonstration, log that we would play the sound
  // In a real app with assets available, we would use Howler.js
  console.log(`Playing ambient sound: ${config.url}`);
  
  /* 
  In a real implementation with actual sound files:
  
  ambientSound = new Howl({
    src: [config.url],
    loop: config.loop,
    volume: 0,
  });
  
  ambientSound.play();
  ambientSound.fade(0, config.volume * volume, config.fade);
  */
  
  // Simulated sound for demonstration
  ambientSound = {
    isPlaying: true,
    stop: () => {
      console.log('Stopping ambient sound');
      ambientSound.isPlaying = false;
    },
    fade: (fromVolume, toVolume, duration) => {
      console.log(`Fading ambient sound from ${fromVolume} to ${toVolume} over ${duration}ms`);
    }
  };
};

// Fade out the ambient sound
const fadeAmbientSound = () => {
  if (ambientSound && ambientSound.isPlaying) {
    const config = sounds[currentTheme].ambient;
    
    // In a real implementation with Howler:
    // ambientSound.fade(config.volume * volume, 0, config.fade / 2);
    
    console.log(`Fading out ambient sound: ${config.url}`);
  }
};

// Toggle sound on/off
const toggleSound = () => {
  isSoundEnabled = !isSoundEnabled;
  
  // Save preference
  localStorage.setItem('chimeraSoundEnabled', isSoundEnabled);
  
  if (isSoundEnabled) {
    startAmbientSound();
    
    // Notify in whisper tab
    if (window.chimeraWhisper) {
      const message = currentTheme === 'lain' ? 
        'Audio channels enabled. Signal transmission active.' : 
        'The whispers of the ancestors now reach your ears.';
      
      window.chimeraWhisper.addMessage(message, 'from-ai');
    }
  } else {
    if (ambientSound) {
      ambientSound.stop();
    }
    
    // Notify in whisper tab
    if (window.chimeraWhisper) {
      const message = currentTheme === 'lain' ? 
        'Audio channels disabled. Signal transmission terminated.' : 
        'The voices of the ancestors fade to silence.';
      
      window.chimeraWhisper.addMessage(message, 'from-ai');
    }
  }
};

// Change the master volume
const changeVolume = (delta) => {
  // Adjust volume (keep within 0-1 range)
  volume = Math.max(0, Math.min(1, volume + delta));
  
  // Save preference
  localStorage.setItem('chimeraSoundVolume', volume.toString());
  
  // Apply to ambient sound if playing
  if (isSoundEnabled && ambientSound && ambientSound.isPlaying) {
    // In a real implementation with Howler:
    // ambientSound._volume = sounds[currentTheme].ambient.volume * volume;
    
    console.log(`Changed ambient volume to: ${sounds[currentTheme].ambient.volume * volume}`);
  }
  
  // Notify in whisper tab
  if (window.chimeraWhisper) {
    // Only notify for significant changes (to avoid spam)
    if (delta !== 0 && Math.abs(delta) >= 0.05) {
      const volumePercent = Math.round(volume * 100);
      
      const message = currentTheme === 'lain' ? 
        `Audio amplitude adjusted to ${volumePercent}%.` : 
        `The volume of arcane sounds is now ${volumePercent}%.`;
      
      window.chimeraWhisper.addMessage(message, 'from-ai');
    }
  }
};
