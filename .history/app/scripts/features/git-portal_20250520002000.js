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

// Commit changes
const commitChanges = (message) => {
  // In a real app, this would use Git commands
  // For this demo, we'll simulate it

  // Start portal animation
  startPortalAnimation('commit');

  // Simulate commit process
  setTimeout(() => {
    // Update git status
    gitStatus.staged = [];
    gitStatus.ahead += 1;

    // Update UI
    updateGitStatusUI();

    // End animation
    endPortalAnimation();

    // Show success message
    if (window.chimeraWhisper) {
      const successMsg = currentTheme === 'lain'
        ? `Changes committed to the network. Message: "${message}"`
        : `Your incantations have been bound to the scroll. The words of power: "${message}"`;

      window.chimeraWhisper.addMessage(successMsg, 'from-ai');
    }
  }, 2000);
};

// Push changes
const pushChanges = () => {
  // Check if there are changes to push
  if (gitStatus.ahead === 0) {
    if (window.chimeraWhisper) {
      const message = currentTheme === 'lain'
        ? 'No changes to transmit to the network.'
        : 'The scrolls are already in harmony with the distant archives.';

      window.chimeraWhisper.addMessage(message, 'from-ai');
    }
    return;
  }

  // Start portal animation
  startPortalAnimation('push');

  // Simulate push process
  setTimeout(() => {
    // Update git status
    gitStatus.ahead = 0;

    // Update UI
    updateGitStatusUI();

    // End animation
    endPortalAnimation();

    // Show success message
    if (window.chimeraWhisper) {
      const successMsg = currentTheme === 'lain'
        ? 'Changes transmitted to the network. Connection successful.'
        : 'Your scrolls have been sent forth to the distant archives.';

      window.chimeraWhisper.addMessage(successMsg, 'from-ai');
    }
  }, 3000);
};

// Pull changes
const pullChanges = () => {
  // Start portal animation
  startPortalAnimation('pull');

  // Simulate pull process
  setTimeout(() => {
    // Update git status
    gitStatus.behind = 0;

    // Simulate receiving new changes
    const newChanges = Math.floor(Math.random() * 3);
    if (newChanges > 0) {
      // Show message about new changes
      if (window.chimeraWhisper) {
        const message = currentTheme === 'lain'
          ? `Received ${newChanges} new change(s) from the network.`
          : `${newChanges} new inscription(s) have been received from the distant archives.`;

        window.chimeraWhisper.addMessage(message, 'from-ai');
      }
    }

    // Update UI
    updateGitStatusUI();

    // End animation
    endPortalAnimation();

    // Show success message
    if (window.chimeraWhisper) {
      const successMsg = currentTheme === 'lain'
        ? 'Network synchronization complete.'
        : 'The scrolls have been harmonized with the distant archives.';

      window.chimeraWhisper.addMessage(successMsg, 'from-ai');
    }
  }, 3000);
};

// Start portal animation
const startPortalAnimation = (type) => {
  // Add active class to portal
  if (portalCanvas) {
    portalCanvas.classList.add('active');
    portalCanvas.dataset.animationType = type;
  }

  // Play appropriate sound effect based on theme
  if (currentTheme === 'lain') {
    document.dispatchEvent(new Event('glitch-effect'));
  } else {
    document.dispatchEvent(new Event('magic-effect'));
  }
};

// End portal animation
const endPortalAnimation = () => {
  // Remove active class from portal
  if (portalCanvas) {
    portalCanvas.classList.remove('active');
    delete portalCanvas.dataset.animationType;
  }
};

// Refresh Git status
const refreshGitStatus = () => {
  // In a real app, this would fetch the current Git status
  // For this demo, we'll simulate it
  simulateGitStatus();

  // Show message
  if (window.chimeraWhisper) {
    const message = currentTheme === 'lain'
      ? 'Repository status refreshed.'
      : 'The scrolls have been examined anew.';

    window.chimeraWhisper.addMessage(message, 'from-ai');
  }
};

// Update Git status UI
const updateGitStatusUI = () => {
  // Update modified files list
  const modifiedList = document.getElementById('modified-files');
  if (modifiedList) {
    modifiedList.innerHTML = '';

    if (gitStatus.modified.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.className = 'git-file-item empty';
      emptyItem.textContent = currentTheme === 'lain' ? 'No modified files' : 'No altered scrolls';
      modifiedList.appendChild(emptyItem);
    } else {
      gitStatus.modified.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'git-file-item';
        fileItem.textContent = file;

        // Add stage button
        const stageBtn = document.createElement('button');
        stageBtn.className = 'stage-btn';
        stageBtn.textContent = currentTheme === 'lain' ? 'Stage' : 'Seal';
        stageBtn.addEventListener('click', () => stageFile(file));

        fileItem.appendChild(stageBtn);
        modifiedList.appendChild(fileItem);
      });
    }
  }

  // Update staged files list
  const stagedList = document.getElementById('staged-files');
  if (stagedList) {
    stagedList.innerHTML = '';

    if (gitStatus.staged.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.className = 'git-file-item empty';
      emptyItem.textContent = currentTheme === 'lain' ? 'No staged files' : 'No sealed scrolls';
      stagedList.appendChild(emptyItem);
    } else {
      gitStatus.staged.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'git-file-item';
        fileItem.textContent = file;

        // Add unstage button
        const unstageBtn = document.createElement('button');
        unstageBtn.className = 'unstage-btn';
        unstageBtn.textContent = currentTheme === 'lain' ? 'Unstage' : 'Unseal';
        unstageBtn.addEventListener('click', () => unstageFile(file));

        fileItem.appendChild(unstageBtn);
        stagedList.appendChild(fileItem);
      });
    }
  }

  // Update branch display
  const branchDisplay = document.getElementById('branch-display');
  if (branchDisplay) {
    branchDisplay.textContent = gitStatus.branch;
  }

  // Update ahead/behind indicators
  const aheadDisplay = document.getElementById('ahead-display');
  if (aheadDisplay) {
    aheadDisplay.textContent = gitStatus.ahead;
  }

  const behindDisplay = document.getElementById('behind-display');
  if (behindDisplay) {
    behindDisplay.textContent = gitStatus.behind;
  }

  // Redraw portal
  drawPortal();
};

// Stage a file
const stageFile = (file) => {
  // Remove from modified
  gitStatus.modified = gitStatus.modified.filter(f => f !== file);

  // Add to staged
  gitStatus.staged.push(file);

  // Update UI
  updateGitStatusUI();

  // Play appropriate sound effect based on theme
  if (currentTheme === 'lain') {
    document.dispatchEvent(new Event('glitch-effect'));
  } else {
    document.dispatchEvent(new Event('scroll-effect'));
  }
};

// Unstage a file
const unstageFile = (file) => {
  // Remove from staged
  gitStatus.staged = gitStatus.staged.filter(f => f !== file);

  // Add to modified
  gitStatus.modified.push(file);

  // Update UI
  updateGitStatusUI();

  // Play appropriate sound effect based on theme
  if (currentTheme === 'lain') {
    document.dispatchEvent(new Event('glitch-effect'));
  } else {
    document.dispatchEvent(new Event('scroll-effect'));
  }
};

// Simulate Git status for demo
const simulateGitStatus = () => {
  // Generate random Git status
  gitStatus.isRepo = true;
  gitStatus.branch = ['main', 'develop', 'feature/new-ui', 'bugfix/issue-42'][Math.floor(Math.random() * 4)];

  // Generate random modified files
  const possibleFiles = [
    'index.html',
    'main.js',
    'app/scripts/main.js',
    'app/styles/main.css',
    'app/scripts/effects/glitch.js',
    'app/scripts/ui/neural-ui.js',
    'app/scripts/features/whisper.js',
    'readme.txt'
  ];

  // Random number of modified files (0-3)
  const modifiedCount = Math.floor(Math.random() * 4);
  gitStatus.modified = [];

  for (let i = 0; i < modifiedCount; i++) {
    const randomFile = possibleFiles[Math.floor(Math.random() * possibleFiles.length)];

    // Avoid duplicates
    if (!gitStatus.modified.includes(randomFile)) {
      gitStatus.modified.push(randomFile);
    }
  }

  // Random number of staged files (0-2)
  const stagedCount = Math.floor(Math.random() * 3);
  gitStatus.staged = [];

  for (let i = 0; i < stagedCount; i++) {
    const randomFile = possibleFiles[Math.floor(Math.random() * possibleFiles.length)];

    // Avoid duplicates and files that are already modified
    if (!gitStatus.staged.includes(randomFile) && !gitStatus.modified.includes(randomFile)) {
      gitStatus.staged.push(randomFile);
    }
  }

  // Random ahead/behind counts
  gitStatus.ahead = Math.floor(Math.random() * 3);
  gitStatus.behind = Math.floor(Math.random() * 3);

  // Update UI
  updateGitStatusUI();
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initGitPortal();

  // Export API for use in other modules
  window.chimeraGitPortal = {
    refreshStatus: refreshGitStatus,
    commitChanges,
    pushChanges,
    pullChanges
  };
});
