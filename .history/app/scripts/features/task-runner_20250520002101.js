// Task Runner for CHIMERA
// This script implements the constellation-based task runner

// Global variables
let taskContainer = null;
let constellationCanvas = null;
let constellationCtx = null;
let constellationAnimationId = null;
let currentTheme = 'lain';
let taskRunning = false;
let currentTask = null;
let taskOutput = '';
let tasks = [];

// Initialize the Task Runner
const initTaskRunner = () => {
  // Get DOM elements
  taskContainer = document.getElementById('task-runner');
  constellationCanvas = document.getElementById('constellation-canvas');
  
  // Set up canvas
  if (constellationCanvas) {
    constellationCanvas.width = constellationCanvas.offsetWidth;
    constellationCanvas.height = constellationCanvas.offsetHeight;
    constellationCtx = constellationCanvas.getContext('2d');
  }
  
  // Set up theme detection
  const themeStylesheet = document.getElementById('theme-stylesheet');
  currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
  
  // Observer for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
        
        // Update constellation visualization
        drawConstellation();
      }
    });
  });
  
  observer.observe(themeStylesheet, { attributes: true });
  
  // Set up event listeners
  setupEventListeners();
  
  // Initial constellation drawing
  drawConstellation();
  
  // Load tasks
  loadTasks();
};

// Set up event listeners
const setupEventListeners = () => {
  // Handle window resize
  window.addEventListener('resize', () => {
    if (constellationCanvas) {
      constellationCanvas.width = constellationCanvas.offsetWidth;
      constellationCanvas.height = constellationCanvas.offsetHeight;
      drawConstellation();
    }
  });
  
  // Handle run button
  const runBtn = document.getElementById('run-task-btn');
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const taskSelect = document.getElementById('task-select');
      if (taskSelect && taskSelect.value) {
        runTask(taskSelect.value);
      } else {
        // Show error in whisper tab
        if (window.chimeraWhisper) {
          const message = currentTheme === 'lain' 
            ? 'Error: No task selected for execution.' 
            : 'You must select a star pattern to invoke its power.';
          
          window.chimeraWhisper.addMessage(message, 'from-ai');
        }
      }
    });
  }
  
  // Handle stop button
  const stopBtn = document.getElementById('stop-task-btn');
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      stopTask();
    });
  }
  
  // Handle clear button
  const clearBtn = document.getElementById('clear-output-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearTaskOutput();
    });
  }
};

// Draw the constellation visualization
const drawConstellation = () => {
  if (!constellationCtx) return;
  
  // Clear canvas
  constellationCtx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);
  
  // Draw based on theme
  if (currentTheme === 'lain') {
    drawDigitalConstellation();
  } else {
    drawMysticalConstellation();
  }
};

// Draw digital constellation (Lain theme)
const drawDigitalConstellation = () => {
  const ctx = constellationCtx;
  const width = constellationCanvas.width;
  const height = constellationCanvas.height;
  
  // Draw background grid
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
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
  
  // Create star nodes for each task
  const starNodes = createStarNodes();
  
  // Draw connections between nodes
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < starNodes.length; i++) {
    for (let j = i + 1; j < starNodes.length; j++) {
      // Only connect some nodes (based on distance)
      const dx = starNodes[i].x - starNodes[j].x;
      const dy = starNodes[i].y - starNodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        ctx.beginPath();
        ctx.moveTo(starNodes[i].x, starNodes[i].y);
        ctx.lineTo(starNodes[j].x, starNodes[j].y);
        ctx.stroke();
      }
    }
  }
  
  // Draw nodes
  for (let i = 0; i < starNodes.length; i++) {
    const node = starNodes[i];
    
    // Draw node
    ctx.fillStyle = node.isActive ? 'rgba(0, 255, 0, 0.8)' : 'rgba(0, 255, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw node label
    ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(node.name, node.x, node.y + node.size + 12);
  }
  
  // If a task is running, animate the constellation
  if (taskRunning) {
    // Add pulsing effect to active nodes
    const time = Date.now() / 1000;
    
    // Cancel previous animation
    if (constellationAnimationId) {
      cancelAnimationFrame(constellationAnimationId);
    }
    
    // Schedule next frame
    constellationAnimationId = requestAnimationFrame(() => {
      drawDigitalConstellation();
    });
  }
};

// Draw mystical constellation (Morrowind theme)
const drawMysticalConstellation = () => {
  const ctx = constellationCtx;
  const width = constellationCanvas.width;
  const height = constellationCanvas.height;
  
  // Draw starry background
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 1.5 + 0.5;
    const opacity = Math.random() * 0.5 + 0.3;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Create star nodes for each task
  const starNodes = createStarNodes();
  
  // Draw connections between nodes
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < starNodes.length; i++) {
    for (let j = i + 1; j < starNodes.length; j++) {
      // Only connect some nodes (based on distance)
      const dx = starNodes[i].x - starNodes[j].x;
      const dy = starNodes[i].y - starNodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        ctx.beginPath();
        ctx.moveTo(starNodes[i].x, starNodes[i].y);
        ctx.lineTo(starNodes[j].x, starNodes[j].y);
        ctx.stroke();
      }
    }
  }
  
  // Draw nodes
  for (let i = 0; i < starNodes.length; i++) {
    const node = starNodes[i];
    
    // Draw glow
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 2);
    gradient.addColorStop(0, node.isActive ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 215, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw star
    ctx.fillStyle = node.isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw node label
    ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
    ctx.font = '10px serif';
    ctx.textAlign = 'center';
    ctx.fillText(node.name, node.x, node.y + node.size + 12);
  }
  
  // If a task is running, animate the constellation
  if (taskRunning) {
    // Add pulsing effect to active nodes
    const time = Date.now() / 1000;
    
    // Cancel previous animation
    if (constellationAnimationId) {
      cancelAnimationFrame(constellationAnimationId);
    }
    
    // Schedule next frame
    constellationAnimationId = requestAnimationFrame(() => {
      drawMysticalConstellation();
    });
  }
};
