// Git Portal for CHIMERA
// This script implements the Git integration with wormhole visualization

// Global variables
let gitContainer = null;
let portalCanvas = null;
let portalCtx = null;
let portalAnimationId = null;
let currentTheme = 'lain';
let gitStatus = {
  branch: 'main',
  modified: [],
  staged: [],
  ahead: 0,
  behind: 0,
  isRepo: false
};

// Initialize the Git Portal
const initGitPortal = () => {
  // Get DOM elements
  gitContainer = document.getElementById('git-portal');
  portalCanvas = document.getElementById('portal-canvas');
  
  // Set up canvas
  if (portalCanvas) {
    portalCanvas.width = portalCanvas.offsetWidth;
    portalCanvas.height = portalCanvas.offsetHeight;
    portalCtx = portalCanvas.getContext('2d');
  }
  
  // Set up theme detection
  const themeStylesheet = document.getElementById('theme-stylesheet');
  currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
  
  // Observer for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
        
        // Update portal visualization
        drawPortal();
      }
    });
  });
  
  observer.observe(themeStylesheet, { attributes: true });
  
  // Set up event listeners
  setupEventListeners();
  
  // Initial portal drawing
  drawPortal();
  
  // Simulate Git status update
  simulateGitStatus();
};

// Set up event listeners
const setupEventListeners = () => {
  // Handle window resize
  window.addEventListener('resize', () => {
    if (portalCanvas) {
      portalCanvas.width = portalCanvas.offsetWidth;
      portalCanvas.height = portalCanvas.offsetHeight;
      drawPortal();
    }
  });
  
  // Handle commit button
  const commitBtn = document.getElementById('commit-btn');
  if (commitBtn) {
    commitBtn.addEventListener('click', () => {
      const commitMsg = document.getElementById('commit-message');
      if (commitMsg && commitMsg.value.trim()) {
        commitChanges(commitMsg.value);
        commitMsg.value = '';
      } else {
        // Show error in whisper tab
        if (window.chimeraWhisper) {
          const message = currentTheme === 'lain' 
            ? 'Error: Commit message required for data binding.' 
            : 'The scrolls cannot be sealed without words of power.';
          
          window.chimeraWhisper.addMessage(message, 'from-ai');
        }
      }
    });
  }
  
  // Handle push button
  const pushBtn = document.getElementById('push-btn');
  if (pushBtn) {
    pushBtn.addEventListener('click', () => {
      pushChanges();
    });
  }
  
  // Handle pull button
  const pullBtn = document.getElementById('pull-btn');
  if (pullBtn) {
    pullBtn.addEventListener('click', () => {
      pullChanges();
    });
  }
  
  // Handle refresh button
  const refreshBtn = document.getElementById('git-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshGitStatus();
    });
  }
};

// Draw the Git portal visualization
const drawPortal = () => {
  if (!portalCtx) return;
  
  // Clear canvas
  portalCtx.clearRect(0, 0, portalCanvas.width, portalCanvas.height);
  
  // Draw based on theme
  if (currentTheme === 'lain') {
    drawDigitalPortal();
  } else {
    drawMagicalPortal();
  }
};

// Draw digital wormhole portal (Lain theme)
const drawDigitalPortal = () => {
  const ctx = portalCtx;
  const width = portalCanvas.width;
  const height = portalCanvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Draw digital portal background
  const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width / 2);
  gradient.addColorStop(0, 'rgba(0, 30, 0, 0.9)');
  gradient.addColorStop(0.5, 'rgba(0, 20, 0, 0.7)');
  gradient.addColorStop(1, 'rgba(0, 10, 0, 0.1)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, width / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw grid lines
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
  ctx.lineWidth = 1;
  
  // Horizontal grid lines
  for (let i = 0; i < height; i += 20) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }
  
  // Vertical grid lines
  for (let i = 0; i < width; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  
  // Draw data streams
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
  ctx.lineWidth = 2;
  
  const time = Date.now() / 1000;
  const streamCount = 8;
  
  for (let i = 0; i < streamCount; i++) {
    const angle = (i / streamCount) * Math.PI * 2 + time * 0.2;
    const innerRadius = 20;
    const outerRadius = width / 2;
    
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * innerRadius,
      centerY + Math.sin(angle) * innerRadius
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * outerRadius,
      centerY + Math.sin(angle) * outerRadius
    );
    ctx.stroke();
  }
  
  // Draw center circle
  ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw binary data
  ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
  ctx.font = '12px monospace';
  
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * (width / 2 - 30) + 30;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y);
  }
  
  // Add branch name
  ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
  ctx.font = '14px monospace';
  ctx.fillText(`BRANCH: ${gitStatus.branch}`, 10, 20);
  
  // Add status indicators
  ctx.fillText(`MODIFIED: ${gitStatus.modified.length}`, 10, 40);
  ctx.fillText(`STAGED: ${gitStatus.staged.length}`, 10, 60);
  ctx.fillText(`AHEAD: ${gitStatus.ahead}`, 10, 80);
  ctx.fillText(`BEHIND: ${gitStatus.behind}`, 10, 100);
  
  // Animate portal
  if (portalAnimationId) {
    cancelAnimationFrame(portalAnimationId);
  }
  
  portalAnimationId = requestAnimationFrame(() => {
    drawDigitalPortal();
  });
};

// Draw magical portal (Morrowind theme)
const drawMagicalPortal = () => {
  const ctx = portalCtx;
  const width = portalCanvas.width;
  const height = portalCanvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Draw magical portal background
  const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width / 2);
  gradient.addColorStop(0, 'rgba(255, 215, 0, 0.7)');
  gradient.addColorStop(0.5, 'rgba(180, 120, 0, 0.5)');
  gradient.addColorStop(1, 'rgba(100, 60, 0, 0.1)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, width / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw magical runes
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
  ctx.lineWidth = 2;
  
  // Inner circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
  ctx.stroke();
  
  // Outer circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, width / 2 - 10, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw rune symbols
  ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
  ctx.font = '16px serif';
  
  const time = Date.now() / 1000;
  const runeCount = 8;
  
  for (let i = 0; i < runeCount; i++) {
    const angle = (i / runeCount) * Math.PI * 2 + time * 0.1;
    const radius = width / 3;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    // Use Greek letters as runes
    const runes = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ'];
    const runeIndex = Math.floor(i % runes.length);
    
    ctx.fillText(runes[runeIndex], x, y);
  }
  
  // Draw magical particles
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * (width / 2 - 20);
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    const size = Math.random() * 3 + 1;
    
    ctx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.5 + 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add branch name in daedric style
  ctx.fillStyle = 'rgba(180, 120, 0, 0.9)';
  ctx.font = '16px serif';
  ctx.fillText(`Scroll: ${gitStatus.branch}`, 10, 25);
  
  // Add status indicators
  ctx.fillText(`Alterations: ${gitStatus.modified.length}`, 10, 50);
  ctx.fillText(`Sealed: ${gitStatus.staged.length}`, 10, 75);
  ctx.fillText(`Ahead: ${gitStatus.ahead}`, 10, 100);
  ctx.fillText(`Behind: ${gitStatus.behind}`, 10, 125);
  
  // Animate portal
  if (portalAnimationId) {
    cancelAnimationFrame(portalAnimationId);
  }
  
  portalAnimationId = requestAnimationFrame(() => {
    drawMagicalPortal();
  });
};
