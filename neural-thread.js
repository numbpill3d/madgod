// Neural Thread - Edit History Visualization for CHIMERA
// This script implements the neural thread visualization of edit history

// Global variables
let threadIndicator = null;
let fileEditHistory = {}; // Tracks edits by file
let maxNodesInThread = 10;

// Initialize the Neural Thread
const initNeuralThread = () => {
  threadIndicator = document.getElementById('neural-thread-indicator');
  
  // Set up thread node click event delegation
  threadIndicator.addEventListener('click', (e) => {
    if (e.target.classList.contains('thread-node')) {
      handleThreadNodeClick(e.target);
    }
  });
  
  // Listen for editor changes
  window.addEventListener('editor-content-changed', (event) => {
    if (event.detail && event.detail.filePath) {
      addEditToThread(event.detail.filePath, event.detail.content);
    }
  });
  
  // Create initial thread nodes
  createInitialThread();
};

// Create the initial thread visualization
const createInitialThread = () => {
  // Clear existing nodes
  threadIndicator.innerHTML = '';
  
  // Create initial node (origin)
  const originNode = document.createElement('div');
  originNode.className = 'thread-node active';
  originNode.title = 'Current state';
  threadIndicator.appendChild(originNode);
};

// Add a new edit to the thread
const addEditToThread = (filePath, content) => {
  // Initialize file history if needed
  if (!fileEditHistory[filePath]) {
    fileEditHistory[filePath] = [];
  }
  
  // Add the edit to history
  fileEditHistory[filePath].push({
    timestamp: Date.now(),
    content: content
  });
  
  // Limit history size
  while (fileEditHistory[filePath].length > 50) {
    fileEditHistory[filePath].shift();
  }
  
  // Update the thread visualization
  updateThreadVisualization(filePath);
};

// Update the thread visualization for a file
const updateThreadVisualization = (filePath) => {
  // Do nothing if we don't have history for this file
  if (!fileEditHistory[filePath] || fileEditHistory[filePath].length === 0) {
    return;
  }
  
  // Clear existing nodes
  threadIndicator.innerHTML = '';
  
  // Get the edit history for this file
  const history = fileEditHistory[filePath];
  
  // Determine how many nodes to show
  const nodeCount = Math.min(history.length, maxNodesInThread);
  
  // Create nodes and connecting lines
  for (let i = 0; i < nodeCount; i++) {
    // Add connecting line before each node (except the first)
    if (i > 0) {
      const line = document.createElement('div');
      line.className = 'thread-line';
      if (i === nodeCount - 1) {
        // Add animation class to the last line
        line.classList.add('thread-line-connecting');
      }
      threadIndicator.appendChild(line);
    }
    
    // Create node
    const node = document.createElement('div');
    node.className = 'thread-node';
    
    // Make the most recent node active
    if (i === nodeCount - 1) {
      node.classList.add('active');
    }
    
    // Add data attributes for later retrieval
    node.setAttribute('data-file', filePath);
    node.setAttribute('data-index', history.length - nodeCount + i);
    
    // Add timestamp as title
    const timestamp = new Date(history[history.length - nodeCount + i].timestamp);
    node.title = `Edit at ${timestamp.toLocaleTimeString()}`;
    
    // Add the node to the thread
    threadIndicator.appendChild(node);
  }
  
  // Add neural pulse animation to active node
  const activeNode = threadIndicator.querySelector('.thread-node.active');
  if (activeNode) {
    activeNode.classList.add('neural-pulse');
  }
};

// Handle click on a thread node
const handleThreadNodeClick = (node) => {
  // Get file path and history index from the node
  const filePath = node.getAttribute('data-file');
  const index = parseInt(node.getAttribute('data-index'));
  
  // Do nothing if we don't have this history entry
  if (!fileEditHistory[filePath] || !fileEditHistory[filePath][index]) {
    return;
  }
  
  // Get the content at this history point
  const content = fileEditHistory[filePath][index].content;
  
  // Update the editor content
  if (window.chimeraEditor && window.chimeraEditor.getCurrentFilePath() === filePath) {
    // This is a placeholder - in a real app, we would have a method to set editor content
    // without triggering a new history event
    console.log('Would restore content to history point:', index);
    
    // Show message in the whisper tab
    const currentTheme = document.getElementById('theme-stylesheet').href.includes('lain') ? 'lain' : 'morrowind';
    
    if (currentTheme === 'lain') {
      window.chimeraWhisper.addMessage(`Neural thread traversed to previous state node. Temporal shift complete.`, 'from-ai');
    } else {
      window.chimeraWhisper.addMessage(`The ancestral memory has been recalled. Your scroll returns to a previous form.`, 'from-ai');
    }
    
    // Update active node
    const activeNodes = threadIndicator.querySelectorAll('.thread-node.active');
    activeNodes.forEach(n => n.classList.remove('active', 'neural-pulse'));
    
    node.classList.add('active', 'neural-pulse');
  }
};

// Expand or collapse the thread visualization
const toggleThreadExpansion = () => {
  const isExpanded = threadIndicator.classList.contains('expanded');
  
  if (isExpanded) {
    // Collapse thread
    threadIndicator.classList.remove('expanded');
    
    // Update thread to show fewer nodes
    maxNodesInThread = 5;
    
    // Update current file thread
    if (window.chimeraEditor) {
      const currentFile = window.chimeraEditor.getCurrentFilePath();
      if (currentFile) {
        updateThreadVisualization(currentFile);
      }
    }
  } else {
    // Expand thread
    threadIndicator.classList.add('expanded');
    
    // Update thread to show more nodes
    maxNodesInThread = 10;
    
    // Update current file thread
    if (window.chimeraEditor) {
      const currentFile = window.chimeraEditor.getCurrentFilePath();
      if (currentFile) {
        updateThreadVisualization(currentFile);
      }
    }
  }
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initNeuralThread();
  
  // Set up thread expansion toggling on the status bar center
  document.getElementById('status-center').addEventListener('click', toggleThreadExpansion);
  
  // Create a custom event for editor content changes
  // In a real app, this would be emitted by the editor component
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('editor-content-changed', {
        detail: {
          filePath: 'initial.js',
          content: '// Initial content'
        }
      }));
    }, 2000);
  });
  
  // Export API for use in other modules
  window.chimeraNeuralThread = {
    addEdit: addEditToThread,
    updateThread: updateThreadVisualization
  };
});
