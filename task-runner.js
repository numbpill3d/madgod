// Task Runner - Constellation Navigator for CHIMERA
// This script implements the task/script runner visualized as a constellation

// Global variables
let taskSelect = null;
let runTaskBtn = null;
let currentProject = null;
let taskConfig = null;

// Initialize the Task Runner
const initTaskRunner = () => {
  taskSelect = document.getElementById('task-select');
  runTaskBtn = document.getElementById('run-task');
  
  // Set up event listeners
  runTaskBtn.addEventListener('click', runSelectedTask);
  taskSelect.addEventListener('change', updateTaskDescription);
  
  // Listen for project changes
  window.addEventListener('project-opened', (event) => {
    if (event.detail && event.detail.path) {
      loadProjectTasks(event.detail.path);
    }
  });
  
  // Load tasks for the current project if available
  const currentProject = localStorage.getItem('chimeraLastProject');
  if (currentProject) {
    loadProjectTasks(currentProject);
  }
};

// Load tasks from package.json or other config files in the project
const loadProjectTasks = async (projectPath) => {
  try {
    currentProject = projectPath;
    
    // Clear existing tasks
    while (taskSelect.options.length > 1) {
      taskSelect.remove(1);
    }
    
    // Add loading option
    const loadingOption = document.createElement('option');
    loadingOption.text = 'Loading rituals...';
    loadingOption.value = '';
    loadingOption.disabled = true;
    taskSelect.add(loadingOption);
    taskSelect.selectedIndex = taskSelect.options.length - 1;
    
    // Temporarily disable the run button
    runTaskBtn.disabled = true;
    
    // Look for package.json in the project
    const packageJsonPath = window.chimera.fileSystem.joinPaths(projectPath, 'package.json');
    
    try {
      const packageJsonContent = await window.chimera.fileSystem.readFile(packageJsonPath);
      const packageJson = JSON.parse(packageJsonContent);
      
      if (packageJson.scripts) {
        // Store task config
        taskConfig = {
          type: 'npm',
          scripts: packageJson.scripts
        };
        
        // Remove loading option
        taskSelect.remove(taskSelect.options.length - 1);
        
        // Add npm scripts
        for (const [name, script] of Object.entries(packageJson.scripts)) {
          const option = document.createElement('option');
          option.text = name;
          option.value = name;
          option.title = script;
          taskSelect.add(option);
        }
        
        // Enable the run button
        runTaskBtn.disabled = false;
        
        // Notify user
        window.chimeraWhisper.addMessage(`Discovered ${Object.keys(packageJson.scripts).length} npm rituals in the constellation.`, 'from-ai');
        
        return;
      }
    } catch (error) {
      // No package.json or invalid one - continue to other task files
      console.log('No valid package.json found, checking other task files');
    }
    
    // Try to find a Makefile
    const makefilePath = window.chimera.fileSystem.joinPaths(projectPath, 'Makefile');
    
    try {
      const makefileContent = await window.chimera.fileSystem.readFile(makefilePath);
      
      // Simple regex to extract make targets
      const targetRegex = /^([a-zA-Z0-9_-]+):/gm;
      const targets = [];
      let match;
      
      while ((match = targetRegex.exec(makefileContent)) !== null) {
        targets.push(match[1]);
      }
      
      if (targets.length > 0) {
        // Store task config
        taskConfig = {
          type: 'make',
          scripts: Object.fromEntries(targets.map(target => [target, `make ${target}`]))
        };
        
        // Remove loading option
        taskSelect.remove(taskSelect.options.length - 1);
        
        // Add make targets
        for (const target of targets) {
          const option = document.createElement('option');
          option.text = target;
          option.value = target;
          option.title = `make ${target}`;
          taskSelect.add(option);
        }
        
        // Enable the run button
        runTaskBtn.disabled = false;
        
        // Notify user
        window.chimeraWhisper.addMessage(`Discovered ${targets.length} Make rituals in the constellation.`, 'from-ai');
        
        return;
      }
    } catch (error) {
      // No Makefile or invalid one - continue to other task files
      console.log('No valid Makefile found, checking other task files');
    }
    
    // No tasks found
    taskConfig = null;
    
    // Replace loading option with 'No tasks found'
    taskSelect.remove(taskSelect.options.length - 1);
    const noTasksOption = document.createElement('option');
    noTasksOption.text = 'No rituals found';
    noTasksOption.value = '';
    noTasksOption.disabled = true;
    taskSelect.add(noTasksOption);
    taskSelect.selectedIndex = taskSelect.options.length - 1;
    
    // Keep the run button disabled
    runTaskBtn.disabled = true;
    
    // Notify user
    window.chimeraWhisper.addMessage(`No rituals discovered in this realm. Create scripts in package.json or Makefile.`, 'from-ai');
  } catch (error) {
    console.error('Failed to load project tasks:', error);
    window.chimeraWhisper.addMessage(`Failed to divine rituals: ${error.message}`, 'from-ai');
    
    // Replace loading option with error
    taskSelect.remove(taskSelect.options.length - 1);
    const errorOption = document.createElement('option');
    errorOption.text = 'Error loading rituals';
    errorOption.value = '';
    errorOption.disabled = true;
    taskSelect.add(errorOption);
    taskSelect.selectedIndex = taskSelect.options.length - 1;
    
    // Keep the run button disabled
    runTaskBtn.disabled = true;
  }
};

// Update task description when a task is selected
const updateTaskDescription = () => {
  const selectedTask = taskSelect.value;
  
  if (!selectedTask || !taskConfig) {
    return;
  }
  
  const taskScript = taskConfig.scripts[selectedTask];
  
  // Show task description in whisper tab
  if (taskConfig.type === 'npm') {
    window.chimeraWhisper.addMessage(`npm ritual '${selectedTask}' will perform: ${taskScript}`, 'from-ai');
  } else if (taskConfig.type === 'make') {
    window.chimeraWhisper.addMessage(`Make ritual '${selectedTask}' selected.`, 'from-ai');
  }
};

// Run the selected task
const runSelectedTask = async () => {
  const selectedTask = taskSelect.value;
  
  if (!selectedTask || !taskConfig || !currentProject) {
    window.chimeraWhisper.addMessage('No ritual selected or no project open.', 'from-ai');
    return;
  }
  
  try {
    // Create a constellation animation effect
    createConstellationEffect(selectedTask);
    
    // This is a placeholder - in a real app, we would call to the main process
    // to execute the task using child_process or similar
    
    // For demonstration, let's simulate running the task
    window.chimeraWhisper.addMessage(`Invoking ritual '${selectedTask}'...`, 'from-ai');
    
    // Disable controls during task execution
    taskSelect.disabled = true;
    runTaskBtn.disabled = true;
    
    // Simulate task output
    let taskSuccessful = true;
    
    // Fake task output based on the type
    if (taskConfig.type === 'npm') {
      await simulateNpmTaskOutput(selectedTask);
    } else if (taskConfig.type === 'make') {
      await simulateMakeTaskOutput(selectedTask);
    }
    
    // Re-enable controls
    taskSelect.disabled = false;
    runTaskBtn.disabled = false;
    
    // Show completion message
    if (taskSuccessful) {
      const currentTheme = document.getElementById('theme-stylesheet').href.includes('lain') ? 'lain' : 'morrowind';
      
      if (currentTheme === 'lain') {
        window.chimeraWhisper.addMessage(`Task '${selectedTask}' execution complete. Return code: 0`, 'from-ai');
      } else {
        window.chimeraWhisper.addMessage(`The ritual '${selectedTask}' has been completed. The stars align favorably.`, 'from-ai');
      }
    } else {
      window.chimeraWhisper.addMessage(`Ritual '${selectedTask}' failed. The constellation pattern is broken.`, 'from-ai');
    }
  } catch (error) {
    console.error('Failed to run task:', error);
    window.chimeraWhisper.addMessage(`Failed to invoke ritual: ${error.message}`, 'from-ai');
    
    // Re-enable controls
    taskSelect.disabled = false;
    runTaskBtn.disabled = false;
  }
};

// Create a constellation effect animation for the task
const createConstellationEffect = (taskName) => {
  // Create a canvas element for the constellation
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '999';
  canvas.style.pointerEvents = 'none';
  
  // Append to body
  document.body.appendChild(canvas);
  
  // Get 2D context
  const ctx = canvas.getContext('2d');
  
  // Stars array
  const stars = [];
  
  // Determine color based on current theme
  const currentTheme = document.getElementById('theme-stylesheet').href.includes('lain') ? 'lain' : 'morrowind';
  const starColor = currentTheme === 'lain' ? '#1d991d' : '#e8cb9a';
  const lineColor = currentTheme === 'lain' ? 'rgba(29, 153, 29, 0.5)' : 'rgba(232, 203, 154, 0.5)';
  
  // Create random stars
  const starCount = 30 + Math.floor(Math.random() * 20);
  
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.8 + 0.2
    });
  }
  
  // Connections between stars (constellation lines)
  const connections = [];
  
  // Create connections - each star connects to 1-3 nearest stars
  for (let i = 0; i < stars.length; i++) {
    const source = stars[i];
    
    // Get 1-3 closest stars
    const connectionCount = Math.floor(Math.random() * 3) + 1;
    const distances = [];
    
    for (let j = 0; j < stars.length; j++) {
      if (i === j) continue;
      
      const target = stars[j];
      const dx = source.x - target.x;
      const dy = source.y - target.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      distances.push({ index: j, distance });
    }
    
    // Sort by distance
    distances.sort((a, b) => a.distance - b.distance);
    
    // Connect to closest stars
    for (let j = 0; j < Math.min(connectionCount, distances.length); j++) {
      // Make sure we don't add duplicate connections
      const targetIndex = distances[j].index;
      
      if (!connections.some(c => 
        (c.source === i && c.target === targetIndex) || 
        (c.source === targetIndex && c.target === i)
      )) {
        connections.push({
          source: i,
          target: targetIndex,
          alpha: 0
        });
      }
    }
  }
  
  // Animation variables
  let frameCount = 0;
  const maxFrames = 180;
  let animationId;
  
  // Animation function
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections with increasing alpha
    ctx.lineWidth = 1;
    ctx.strokeStyle = lineColor;
    
    for (const connection of connections) {
      const sourceGrow = Math.min(1, frameCount / 60);
      connection.alpha = Math.min(1, connection.alpha + 0.02);
      
      ctx.globalAlpha = connection.alpha * sourceGrow;
      ctx.beginPath();
      ctx.moveTo(stars[connection.source].x, stars[connection.source].y);
      ctx.lineTo(stars[connection.target].x, stars[connection.target].y);
      ctx.stroke();
    }
    
    // Draw stars with pulsing effect
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      
      // Stars grow over time
      const starGrow = Math.min(1, frameCount / 60);
      
      // Pulsing effect
      const pulse = 0.2 * Math.sin(frameCount * 0.05 + i) + 0.8;
      
      ctx.globalAlpha = star.alpha * pulse * starGrow;
      ctx.fillStyle = starColor;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * pulse, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw task name in the center
    if (frameCount > 30) {
      const textAlpha = Math.min(1, (frameCount - 30) / 30);
      ctx.globalAlpha = textAlpha;
      ctx.font = 'bold 24px DaedricFont, serif';
      ctx.fillStyle = starColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(taskName, canvas.width / 2, canvas.height / 2);
    }
    
    frameCount++;
    
    if (frameCount < maxFrames) {
      animationId = requestAnimationFrame(animate);
    } else {
      // Fade out
      const fadeOut = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const fadeAlpha = Math.max(0, 1 - (frameCount - maxFrames) / 30);
        
        if (fadeAlpha <= 0) {
          cancelAnimationFrame(animationId);
          document.body.removeChild(canvas);
          return;
        }
        
        // Draw connections
        ctx.lineWidth = 1;
        ctx.strokeStyle = lineColor;
        
        for (const connection of connections) {
          ctx.globalAlpha = connection.alpha * fadeAlpha;
          ctx.beginPath();
          ctx.moveTo(stars[connection.source].x, stars[connection.source].y);
          ctx.lineTo(stars[connection.target].x, stars[connection.target].y);
          ctx.stroke();
        }
        
        // Draw stars
        for (const star of stars) {
          ctx.globalAlpha = star.alpha * fadeAlpha;
          ctx.fillStyle = starColor;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw task name
        ctx.globalAlpha = fadeAlpha;
        ctx.font = 'bold 24px DaedricFont, serif';
        ctx.fillStyle = starColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(taskName, canvas.width / 2, canvas.height / 2);
        
        frameCount++;
        animationId = requestAnimationFrame(fadeOut);
      };
      
      fadeOut();
    }
  };
  
  // Start animation
  animationId = requestAnimationFrame(animate);
};

// Simulate npm task output (for demonstration)
const simulateNpmTaskOutput = async (taskName) => {
  // Add a 2-second delay to simulate task execution
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Sample output messages based on common npm scripts
  const outputMessages = {
    'start': [
      'Starting development server...',
      'Compiled successfully!',
      'You can now view the app in the browser.'
    ],
    'build': [
      'Creating optimized production build...',
      'Compiled successfully.',
      'File sizes after gzip:',
      'The build folder is ready to be deployed.'
    ],
    'test': [
      'Running tests...',
      'PASS src/__tests__/main.test.js',
      'Test Suites: 1 passed, 1 total',
      'Tests: 4 passed, 4 total'
    ],
    'lint': [
      'Linting files...',
      'No lint errors found!',
      'All files pass linting rules.'
    ]
  };
  
  // Default output if no specific messages for this task
  const defaultOutput = [
    `Executing npm task: ${taskName}`,
    'Processing...',
    'Task completed successfully.'
  ];
  
  // Get appropriate messages
  const messages = outputMessages[taskName] || defaultOutput;
  
  // Output each message with a delay
  for (const message of messages) {
    window.chimeraWhisper.addMessage(message, 'from-ai');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

// Simulate make task output (for demonstration)
const simulateMakeTaskOutput = async (taskName) => {
  // Add a 2-second delay to simulate task execution
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Sample output messages
  const messages = [
    `make: Entering directory '${currentProject}'`,
    `g++ -c src/main.cpp -o build/main.o`,
    `g++ -c src/utils.cpp -o build/utils.o`,
    `g++ build/main.o build/utils.o -o bin/program`,
    `make: Leaving directory '${currentProject}'`
  ];
  
  // Output each message with a delay
  for (const message of messages) {
    window.chimeraWhisper.addMessage(message, 'from-ai');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initTaskRunner();
  
  // Export API for use in other modules
  window.chimeraTaskRunner = {
    loadProjectTasks,
    runTask: runSelectedTask
  };
});
