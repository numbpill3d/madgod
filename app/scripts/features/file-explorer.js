// File Explorer for CHIMERA
// This script implements the file explorer functionality

// Global variables
let fileExplorerContainer = null;
let currentProjectPath = null;
let fileStructure = null;
let searchInput = null;

// Initialize the file explorer
const initFileExplorer = () => {
  // Get DOM elements
  fileExplorerContainer = document.getElementById('file-explorer');
  searchInput = document.getElementById('file-search');

  // Set up search functionality
  if (searchInput) {
    searchInput.addEventListener('input', handleFileSearch);
  }

  // Set up event delegation for file explorer interactions
  if (fileExplorerContainer) {
    fileExplorerContainer.addEventListener('click', handleFileExplorerClick);
  }

  // Try to load last opened project
  const lastProject = localStorage.getItem('chimeraLastProject');
  if (lastProject) {
    loadProject(lastProject).catch(() => {
      // Clear invalid project path
      localStorage.removeItem('chimeraLastProject');
    });
  }
};

// Handle clicks within the file explorer
const handleFileExplorerClick = (event) => {
  const target = event.target;

  // Handle directory toggle
  if (target.classList.contains('directory-name') ||
      target.parentElement.classList.contains('directory-name')) {

    const directoryItem = target.closest('.directory');
    if (directoryItem) {
      toggleDirectory(directoryItem);
    }

    event.preventDefault();
    return;
  }

  // Handle file click
  if (target.classList.contains('file-name') ||
      target.parentElement.classList.contains('file-name')) {

    const fileItem = target.closest('.file-item');
    if (fileItem) {
      const filePath = fileItem.getAttribute('data-path');
      if (filePath) {
        openFile(filePath);
      }
    }

    event.preventDefault();
    return;
  }
};

// Toggle directory open/closed
const toggleDirectory = (directoryElement) => {
  // Toggle expanded class
  directoryElement.classList.toggle('expanded');

  // Find the content container
  const contentContainer = directoryElement.querySelector('.directory-content');
  if (!contentContainer) return;

  // If it's now expanded and empty, load the contents
  if (directoryElement.classList.contains('expanded') && contentContainer.children.length === 0) {
    const dirPath = directoryElement.getAttribute('data-path');
    if (dirPath) {
      loadDirectoryContents(dirPath, contentContainer);
    }
  }

  // Play appropriate sound effect based on theme
  const themeStylesheet = document.getElementById('theme-stylesheet');
  const currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';

  if (currentTheme === 'lain') {
    document.dispatchEvent(new Event('glitch-effect'));
  } else {
    document.dispatchEvent(new Event('scroll-effect'));
  }
};

// Load a project directory
const loadProject = async (projectPath) => {
  try {
    // Store the project path
    currentProjectPath = projectPath;

    // Save as last opened project
    localStorage.setItem('chimeraLastProject', projectPath);

    // Clear existing content
    if (fileExplorerContainer) {
      fileExplorerContainer.innerHTML = '';
    }

    // Create project root element
    const projectName = projectPath.split(/[/\\]/).pop();
    const projectElement = document.createElement('div');
    projectElement.className = 'directory expanded project-root';
    projectElement.setAttribute('data-path', projectPath);

    // Create project header
    const projectHeader = document.createElement('div');
    projectHeader.className = 'directory-name';
    projectHeader.innerHTML = `
      <span class="icon">📁</span>
      <span class="name">${projectName}</span>
    `;

    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'directory-content';

    // Assemble project element
    projectElement.appendChild(projectHeader);
    projectElement.appendChild(contentContainer);

    // Add to explorer
    fileExplorerContainer.appendChild(projectElement);

    // Load directory contents
    await loadDirectoryContents(projectPath, contentContainer);

    // Dispatch event
    document.dispatchEvent(new CustomEvent('project-loaded', {
      detail: { projectPath, projectName }
    }));

    return true;
  } catch (error) {
    console.error('Failed to load project:', error);

    // Show error in whisper tab
    if (window.chimeraWhisper) {
      const message = `Failed to open project: ${error.message}`;
      window.chimeraWhisper.addMessage(message, 'from-ai');
    }

    return false;
  }
};

// Load directory contents
const loadDirectoryContents = async (dirPath, containerElement) => {
  try {
    // In a real app, this would use Electron's fs module to read the directory
    // For this demo, we'll simulate it with a mock file structure

    // Get directory contents
    const contents = await getDirectoryContents(dirPath);

    // Sort contents: directories first, then files, both alphabetically
    contents.sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });

    // Create elements for each item
    contents.forEach(item => {
      if (item.type === 'directory') {
        // Create directory element
        const dirElement = createDirectoryElement(item.name, `${dirPath}/${item.name}`);
        containerElement.appendChild(dirElement);
      } else {
        // Create file element
        const fileElement = createFileElement(item.name, `${dirPath}/${item.name}`);
        containerElement.appendChild(fileElement);
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to load directory contents:', error);

    // Add error message to container
    containerElement.innerHTML = '<div class="error-message">Failed to load contents</div>';

    return false;
  }
};

// Create a directory element
const createDirectoryElement = (name, path) => {
  const element = document.createElement('div');
  element.className = 'directory';
  element.setAttribute('data-path', path);

  // Create directory header
  const header = document.createElement('div');
  header.className = 'directory-name';
  header.innerHTML = `
    <span class="icon">📁</span>
    <span class="name">${name}</span>
  `;

  // Create content container
  const content = document.createElement('div');
  content.className = 'directory-content';

  // Assemble directory element
  element.appendChild(header);
  element.appendChild(content);

  return element;
};

// Create a file element
const createFileElement = (name, path) => {
  const element = document.createElement('div');
  element.className = 'file-item';
  element.setAttribute('data-path', path);

  // Determine file icon based on extension
  const extension = name.split('.').pop().toLowerCase();
  let icon = '📄'; // Default file icon

  // Set icon based on file type
  if (['js', 'ts', 'jsx', 'tsx'].includes(extension)) {
    icon = '📜'; // Script files
  } else if (['html', 'htm', 'xml'].includes(extension)) {
    icon = '🌐'; // Web files
  } else if (['css', 'scss', 'sass', 'less'].includes(extension)) {
    icon = '🎨'; // Style files
  } else if (['json', 'yaml', 'yml', 'toml'].includes(extension)) {
    icon = '⚙️'; // Config files
  } else if (['md', 'txt', 'rtf'].includes(extension)) {
    icon = '📝'; // Text files
  } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
    icon = '🖼️'; // Image files
  }

  // Create file name element
  const fileName = document.createElement('div');
  fileName.className = 'file-name';
  fileName.innerHTML = `
    <span class="icon">${icon}</span>
    <span class="name">${name}</span>
  `;

  // Add to file element
  element.appendChild(fileName);

  return element;
};

// Open a file
const openFile = async (filePath) => {
  try {
    // In a real app, this would use Electron's fs module to read the file
    // For this demo, we'll simulate it

    // Get file contents
    const content = await getFileContents(filePath);

    // Get file name
    const fileName = filePath.split(/[/\\]/).pop();

    // Dispatch file opened event
    document.dispatchEvent(new CustomEvent('file-opened', {
      detail: { filePath, fileName, content }
    }));

    // Update active file in app state
    if (window.chimeraApp) {
      window.chimeraApp.setActiveFile(filePath);
    }

    return true;
  } catch (error) {
    console.error('Failed to open file:', error);

    // Show error in whisper tab
    if (window.chimeraWhisper) {
      const message = `Failed to open file: ${error.message}`;
      window.chimeraWhisper.addMessage(message, 'from-ai');
    }

    return false;
  }
};

// Handle file search
const handleFileSearch = (event) => {
  const searchTerm = event.target.value.toLowerCase();

  // Get all file and directory items
  const items = fileExplorerContainer.querySelectorAll('.file-item, .directory');

  // If search is empty, show all items
  if (!searchTerm) {
    items.forEach(item => {
      item.style.display = '';
    });
    return;
  }

  // Filter items based on search term
  items.forEach(item => {
    const nameElement = item.querySelector('.name');
    if (!nameElement) return;

    const name = nameElement.textContent.toLowerCase();

    if (name.includes(searchTerm)) {
      item.style.display = '';

      // If it's inside a directory, expand all parent directories
      let parent = item.parentElement;
      while (parent) {
        if (parent.classList.contains('directory-content')) {
          const parentDir = parent.parentElement;
          if (parentDir && parentDir.classList.contains('directory')) {
            parentDir.classList.add('expanded');
          }
        }
        parent = parent.parentElement;
      }
    } else {
      // Only hide files, keep directories visible
      if (item.classList.contains('file-item')) {
        item.style.display = 'none';
      }
    }
  });
};

// Mock file system functions
// In a real app, these would use Electron's fs module

// Get directory contents
const getDirectoryContents = async (dirPath) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Mock file structure for demo
  if (!fileStructure) {
    fileStructure = {
      'app': {
        type: 'directory',
        contents: {
          'scripts': {
            type: 'directory',
            contents: {
              'main.js': { type: 'file', content: '// Main application code' },
              'effects': {
                type: 'directory',
                contents: {
                  'glitch.js': { type: 'file', content: '// Glitch effect implementation' },
                  'ambient-sound.js': { type: 'file', content: '// Sound system implementation' },
                  'three-setup.js': { type: 'file', content: '// Three.js background setup' }
                }
              },
              'ui': {
                type: 'directory',
                contents: {
                  'neural-ui.js': { type: 'file', content: '// Neural UI components' },
                  'daedric-ui.js': { type: 'file', content: '// Daedric UI components' }
                }
              },
              'features': {
                type: 'directory',
                contents: {
                  'whisper.js': { type: 'file', content: '// Whisper AI assistant' },
                  'file-explorer.js': { type: 'file', content: '// File explorer implementation' },
                  'editor.js': { type: 'file', content: '// Monaco editor integration' },
                  'git-portal.js': { type: 'file', content: '// Git integration' },
                  'task-runner.js': { type: 'file', content: '// Task runner implementation' }
                }
              }
            }
          },
          'styles': {
            type: 'directory',
            contents: {
              'main.css': { type: 'file', content: '/* Main application styles */' },
              'themes': {
                type: 'directory',
                contents: {
                  'lain.css': { type: 'file', content: '/* Lain theme styles */' },
                  'morrowind.css': { type: 'file', content: '/* Morrowind theme styles */' }
                }
              }
            }
          },
          'assets': {
            type: 'directory',
            contents: {
              'images': {
                type: 'directory',
                contents: {
                  'logo.png': { type: 'file', content: '[Binary image data]' },
                  'backgrounds': {
                    type: 'directory',
                    contents: {
                      'lain-bg.jpg': { type: 'file', content: '[Binary image data]' },
                      'morrowind-bg.jpg': { type: 'file', content: '[Binary image data]' }
                    }
                  },
                  'ui': {
                    type: 'directory',
                    contents: {
                      'button-border.png': { type: 'file', content: '[Binary image data]' },
                      'scroll-corner.png': { type: 'file', content: '[Binary image data]' }
                    }
                  }
                }
              },
              'audio': {
                type: 'directory',
                contents: {
                  'ambient': {
                    type: 'directory',
                    contents: {
                      'lain_hum.mp3': { type: 'file', content: '[Binary audio data]' },
                      'morrowind_wind.mp3': { type: 'file', content: '[Binary audio data]' }
                    }
                  },
                  'effects': {
                    type: 'directory',
                    contents: {
                      'glitch.mp3': { type: 'file', content: '[Binary audio data]' },
                      'magic.mp3': { type: 'file', content: '[Binary audio data]' }
                    }
                  }
                }
              },
              'fonts': {
                type: 'directory',
                contents: {
                  'lain-terminal.ttf': { type: 'file', content: '[Binary font data]' },
                  'daedric.ttf': { type: 'file', content: '[Binary font data]' }
                }
              }
            }
          }
        }
      },
      'index.html': { type: 'file', content: '<!DOCTYPE html>...' },
      'main.js': { type: 'file', content: '// Electron main process' },
      'preload.js': { type: 'file', content: '// Electron preload script' },
      'package.json': { type: 'file', content: '{ "name": "chimera", ... }' },
      'readme.txt': { type: 'file', content: '# CHIMERA Code Editor\n...' }
    };
  }

  // Parse the path to navigate the file structure
  const pathParts = dirPath.split(/[/\\]/).filter(Boolean);

  // Start at the root
  let current = fileStructure;

  // Navigate to the requested directory
  for (const part of pathParts) {
    if (current[part] && current[part].type === 'directory') {
      current = current[part].contents;
    } else {
      throw new Error(`Directory not found: ${part}`);
    }
  }

  // Convert the contents to an array format
  return Object.entries(current).map(([name, info]) => ({
    name,
    type: info.type
  }));
};

// Get file contents
const getFileContents = async (filePath) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));

  // Parse the path to navigate the file structure
  const pathParts = filePath.split(/[/\\]/).filter(Boolean);
  const fileName = pathParts.pop();

  // Start at the root
  let current = fileStructure;

  // Navigate to the containing directory
  for (const part of pathParts) {
    if (current[part] && current[part].type === 'directory') {
      current = current[part].contents;
    } else {
      throw new Error(`Path not found: ${part}`);
    }
  }

  // Get the file
  if (current[fileName] && current[fileName].type === 'file') {
    return current[fileName].content;
  } else {
    throw new Error(`File not found: ${fileName}`);
  }
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initFileExplorer();

  // Export API for use in other modules
  window.chimeraFileExplorer = {
    loadProject,
    openFile
  };
});
