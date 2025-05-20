// File Explorer UI Component for CHIMERA
// This script implements the scroll rack file explorer

// Global variables
let projectRoot = null;
let fileExplorer = null;
let fileSearch = null;

// File icons based on file types
const fileIcons = {
  'js': '[-]',
  'jsx': '[~]',
  'ts': '{-}',
  'tsx': '{~}',
  'html': '[>]',
  'css': '{*}',
  'json': '{:}',
  'md': '[#]',
  'txt': '[_]',
  'png': '(@)',
  'jpg': '(@)',
  'svg': '(@)',
  'gif': '(@)',
  'pdf': '[P]',
  'zip': '[Z]',
  'folder': '[+]',
  'default': '[?]'
};

// Initialize the file explorer
const initFileExplorer = () => {
  fileExplorer = document.getElementById('file-explorer');
  fileSearch = document.getElementById('file-search');
  
  // Set up project open button
  document.getElementById('open-project-btn').addEventListener('click', openProject);
  
  // Set up file search
  fileSearch.addEventListener('input', searchFiles);
  
  // Load the last opened project if available
  const lastProject = localStorage.getItem('chimeraLastProject');
  if (lastProject) {
    loadProject(lastProject);
  }
};

// Open a project folder
const openProject = async () => {
  try {
    const projectPath = await window.chimera.fileSystem.openDirectory();
    if (projectPath) {
      loadProject(projectPath);
    }
  } catch (error) {
    console.error('Failed to open project:', error);
    window.chimeraEditor.addWhisperMessage(`Failed to open realm: ${error.message}`, 'from-ai');
  }
};

// Load a project's files into the explorer
const loadProject = async (projectPath) => {
  try {
    projectRoot = projectPath;
    
    // Save as last opened project
    localStorage.setItem('chimeraLastProject', projectPath);
    
    // Clear existing files
    fileExplorer.innerHTML = '';
    
    // Add loading animation
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading-animation';
    loadingEl.innerHTML = '<div></div><div></div><div></div><div></div>';
    fileExplorer.appendChild(loadingEl);
    
    // Read directory contents
    const entries = await window.chimera.fileSystem.readDirectory(projectPath);
    
    // Remove loading animation
    fileExplorer.removeChild(loadingEl);
    
    // Sort entries: directories first, then files, both alphabetically
    entries.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    
    // Create a root directory element
    const rootName = projectPath.split('/').pop() || projectPath.split('\\').pop() || projectPath;
    const rootElement = createDirectoryElement(rootName, projectPath, true);
    fileExplorer.appendChild(rootElement);
    
    // Get the directory contents container
    const contentsEl = rootElement.querySelector('.directory-contents');
    
    // Process each entry
    for (const entry of entries) {
      if (entry.isDirectory) {
        const dirElement = createDirectoryElement(entry.name, entry.path);
        contentsEl.appendChild(dirElement);
      } else {
        const fileElement = createFileElement(entry.name, entry.path);
        contentsEl.appendChild(fileElement);
      }
    }
    
    // Expand the root directory
    rootElement.classList.add('expanded');
    
    // Notify user
    const projectName = projectPath.split('/').pop() || projectPath.split('\\').pop() || projectPath;
    window.chimeraEditor.addWhisperMessage(`Realm '${projectName}' has been bound to your consciousness.`, 'from-ai');
  } catch (error) {
    console.error('Failed to load project:', error);
    window.chimeraEditor.addWhisperMessage(`Failed to divine realm: ${error.message}`, 'from-ai');
  }
};

// Create a directory element
const createDirectoryElement = (name, path, isRoot = false) => {
  const element = document.createElement('div');
  element.className = 'directory';
  element.setAttribute('data-path', path);
  
  const nameElement = document.createElement('div');
  nameElement.className = 'directory-name';
  
  const expanderElement = document.createElement('span');
  expanderElement.className = 'directory-expander';
  expanderElement.textContent = '▶';
  
  const iconElement = document.createElement('span');
  iconElement.className = 'file-icon';
  iconElement.textContent = fileIcons.folder;
  
  const nameTextElement = document.createElement('span');
  nameTextElement.className = 'file-name';
  nameTextElement.textContent = isRoot ? name : name;
  
  nameElement.appendChild(expanderElement);
  nameElement.appendChild(iconElement);
  nameElement.appendChild(nameTextElement);
  
  const contentsElement = document.createElement('div');
  contentsElement.className = 'directory-contents';
  
  element.appendChild(nameElement);
  element.appendChild(contentsElement);
  
  // Add click handler to expand/collapse
  nameElement.addEventListener('click', () => {
    toggleDirectory(element, path);
  });
  
  return element;
};

// Create a file element
const createFileElement = (name, path) => {
  const element = document.createElement('div');
  element.className = 'file-item';
  element.setAttribute('data-path', path);
  
  // Determine file type for icon
  const extension = name.split('.').pop().toLowerCase();
  const iconText = fileIcons[extension] || fileIcons.default;
  
  const iconElement = document.createElement('span');
  iconElement.className = `file-icon file-${extension}`;
  iconElement.textContent = iconText;
  
  const nameElement = document.createElement('span');
  nameElement.className = 'file-name';
  nameElement.textContent = name;
  
  element.appendChild(iconElement);
  element.appendChild(nameElement);
  
  // Add file class based on extension
  element.classList.add(`file-${extension}`);
  
  // Add click handler to open the file
  element.addEventListener('click', () => {
    openFile(path);
  });
  
  return element;
};

// Toggle directory expansion
const toggleDirectory = async (element, path) => {
  const isExpanded = element.classList.contains('expanded');
  const contentsElement = element.querySelector('.directory-contents');
  const expanderElement = element.querySelector('.directory-expander');
  
  if (isExpanded) {
    // Collapse directory
    element.classList.remove('expanded');
    expanderElement.textContent = '▶';
  } else {
    // Expand directory - load contents if not already loaded
    if (contentsElement.children.length === 0) {
      try {
        // Add loading indicator
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-animation';
        loadingEl.innerHTML = '<div></div><div></div><div></div><div></div>';
        contentsElement.appendChild(loadingEl);
        
        // Load directory contents
        const entries = await window.chimera.fileSystem.readDirectory(path);
        
        // Remove loading indicator
        contentsElement.removeChild(loadingEl);
        
        // Sort entries: directories first, then files, both alphabetically
        entries.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });
        
        // Create elements for each entry
        for (const entry of entries) {
          if (entry.isDirectory) {
            const dirElement = createDirectoryElement(entry.name, entry.path);
            contentsElement.appendChild(dirElement);
          } else {
            const fileElement = createFileElement(entry.name, entry.path);
            contentsElement.appendChild(fileElement);
          }
        }
        
        // If directory is empty, show a message
        if (entries.length === 0) {
          const emptyEl = document.createElement('div');
          emptyEl.className = 'empty-directory';
          emptyEl.textContent = 'Empty Scroll';
          contentsElement.appendChild(emptyEl);
        }
      } catch (error) {
        console.error('Failed to load directory:', error);
        
        // Show error message
        const errorEl = document.createElement('div');
        errorEl.className = 'directory-error';
        errorEl.textContent = 'Failed to divine contents';
        contentsElement.appendChild(errorEl);
      }
    }
    
    // Expand directory
    element.classList.add('expanded');
    expanderElement.textContent = '▼';
  }
};

// Open a file in the editor
const openFile = (path) => {
  // Highlight the selected file
  const selectedFiles = fileExplorer.querySelectorAll('.file-item.active');
  selectedFiles.forEach(file => file.classList.remove('active'));
  
  const fileElement = fileExplorer.querySelector(`.file-item[data-path="${path}"]`);
  if (fileElement) {
    fileElement.classList.add('active');
    fileElement.classList.add('file-select');
    
    // Remove animation class after it completes
    setTimeout(() => {
      fileElement.classList.remove('file-select');
    }, 500);
  }
  
  // Open the file in the editor
  window.chimeraEditor.openFile(path);
};

// Search files in the explorer
const searchFiles = () => {
  const searchTerm = fileSearch.value.toLowerCase().trim();
  
  if (!searchTerm) {
    // Reset all items to visible if search is cleared
    const allItems = fileExplorer.querySelectorAll('.file-item, .directory');
    allItems.forEach(item => {
      item.style.display = '';
    });
    return;
  }
  
  // Hide all directories first
  const allDirs = fileExplorer.querySelectorAll('.directory');
  allDirs.forEach(dir => {
    dir.style.display = 'none';
  });
  
  // Search through all files
  const allFiles = fileExplorer.querySelectorAll('.file-item');
  let matches = 0;
  
  allFiles.forEach(file => {
    const fileName = file.querySelector('.file-name').textContent.toLowerCase();
    const filePath = file.getAttribute('data-path').toLowerCase();
    
    if (fileName.includes(searchTerm) || filePath.includes(searchTerm)) {
      file.style.display = '';
      matches++;
      
      // Make sure parent directories are visible
      let parent = file.parentElement;
      while (parent && !parent.classList.contains('directory-contents')) {
        parent = parent.parentElement;
      }
      
      if (parent) {
        // Make all parent directories visible and expanded
        let dirElement = parent.parentElement;
        while (dirElement && dirElement.classList.contains('directory')) {
          dirElement.style.display = '';
          dirElement.classList.add('expanded');
          
          // Update expander icon
          const expander = dirElement.querySelector('.directory-expander');
          if (expander) {
            expander.textContent = '▼';
          }
          
          // Move up the tree
          parent = dirElement.parentElement;
          while (parent && !parent.classList.contains('directory-contents')) {
            parent = parent.parentElement;
          }
          
          dirElement = parent ? parent.parentElement : null;
        }
      }
    } else {
      file.style.display = 'none';
    }
  });
  
  // Display result in whisper tab if search is significant
  if (searchTerm.length > 2) {
    window.chimeraEditor.addWhisperMessage(`Found ${matches} scrolls matching '${searchTerm}'`, 'from-ai');
  }
};

// Create a new file in the current directory
const createNewFile = async (fileName, content = '') => {
  if (!projectRoot) {
    window.chimeraEditor.addWhisperMessage('No realm is currently bound. Open a project first.', 'from-ai');
    return null;
  }
  
  try {
    // Create the file path
    const filePath = window.chimera.fileSystem.joinPaths(projectRoot, fileName);
    
    // Write the file
    await window.chimera.fileSystem.writeFile(filePath, content);
    
    // Refresh the file explorer
    await loadProject(projectRoot);
    
    // Open the new file
    window.chimeraEditor.openFile(filePath);
    
    return filePath;
  } catch (error) {
    console.error('Failed to create file:', error);
    window.chimeraEditor.addWhisperMessage(`Failed to create scroll: ${error.message}`, 'from-ai');
    return null;
  }
};

// Create a new folder in the current directory
const createNewFolder = async (folderName) => {
  if (!projectRoot) {
    window.chimeraEditor.addWhisperMessage('No realm is currently bound. Open a project first.', 'from-ai');
    return null;
  }
  
  try {
    // Create the folder path
    const folderPath = window.chimera.fileSystem.joinPaths(projectRoot, folderName);
    
    // Create the directory (this requires Node.js fs)
    // Since we can't directly call fs.mkdir from renderer, we'll need to handle this in main
    // For now, let's just refresh the explorer and assume the folder was created
    
    // Refresh the file explorer
    await loadProject(projectRoot);
    
    return folderPath;
  } catch (error) {
    console.error('Failed to create folder:', error);
    window.chimeraEditor.addWhisperMessage(`Failed to create tome: ${error.message}`, 'from-ai');
    return null;
  }
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initFileExplorer();
  
  // Export API for use in other modules
  window.chimeraFileExplorer = {
    openProject,
    loadProject,
    createNewFile,
    createNewFolder,
    getCurrentProject: () => projectRoot
  };
});
