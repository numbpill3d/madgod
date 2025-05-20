// Git Integration for CHIMERA
// This script implements Git operations visualized as wormholes

// Import the simple-git module
// Note: This is a placeholder - in a real application, we would need to integrate with electron's main process
//       since git operations would need Node.js access which is restricted in the renderer process.

// Global variables
let gitPortal = null;
let portalStatus = null;
let gitCommitBtn = null;
let gitPushBtn = null;
let currentRepo = null;
let isGitAvailable = false;

// Initialize Git integration
const initGitIntegration = () => {
  gitPortal = document.getElementById('git-portal');
  portalStatus = document.querySelector('.portal-status');
  gitCommitBtn = document.getElementById('git-commit');
  gitPushBtn = document.getElementById('git-push');
  
  // Set up event listeners
  gitCommitBtn.addEventListener('click', commitChanges);
  gitPushBtn.addEventListener('click', pushChanges);
  
  // Check if we can use git via IPC
  checkGitAvailability();
  
  // Listen for project changes
  window.addEventListener('project-opened', (event) => {
    if (event.detail && event.detail.path) {
      checkIsGitRepository(event.detail.path);
    }
  });
};

// Check if git is available through our IPC bridge
const checkGitAvailability = async () => {
  // For now, we'll just assume it's available
  // In a real implementation, we would check with the main process
  isGitAvailable = true;
  
  // Also check if current project is a git repo
  const currentProject = localStorage.getItem('chimeraLastProject');
  if (currentProject) {
    checkIsGitRepository(currentProject);
  }
};

// Check if a path is a git repository
const checkIsGitRepository = async (path) => {
  try {
    // This is a placeholder - in a real app, we would call to the main process
    // to execute git commands like `git -C ${path} rev-parse --is-inside-work-tree`
    
    // For demonstration, let's simulate finding a git repo
    const isRepo = true; // Placeholder
    
    if (isRepo) {
      currentRepo = path;
      updatePortalStatus('clean');
      window.chimeraWhisper.addMessage(`Git repository detected. Portal connected.`, 'from-ai');
      
      // Enable the git buttons
      gitCommitBtn.disabled = false;
      gitPushBtn.disabled = false;
      
      // Start periodic status checks
      startStatusChecks();
    } else {
      currentRepo = null;
      updatePortalStatus(null);
      window.chimeraWhisper.addMessage(`No git portal detected in this realm.`, 'from-ai');
      
      // Disable the git buttons
      gitCommitBtn.disabled = true;
      gitPushBtn.disabled = true;
    }
  } catch (error) {
    console.error('Failed to check git repository:', error);
    currentRepo = null;
    updatePortalStatus('error');
    window.chimeraWhisper.addMessage(`Failed to connect to git portal: ${error.message}`, 'from-ai');
    
    // Disable the git buttons
    gitCommitBtn.disabled = true;
    gitPushBtn.disabled = true;
  }
};

// Start periodic git status checks
const startStatusChecks = () => {
  // Clear any existing interval
  if (window.gitStatusInterval) {
    clearInterval(window.gitStatusInterval);
  }
  
  // Set up new interval - check every 10 seconds
  window.gitStatusInterval = setInterval(checkGitStatus, 10000);
  
  // Also check immediately
  checkGitStatus();
};

// Check the current git status
const checkGitStatus = async () => {
  if (!currentRepo || !isGitAvailable) return;
  
  try {
    // This is a placeholder - in a real app, we would call to the main process
    // to execute git commands like `git -C ${currentRepo} status --porcelain`
    
    // For demonstration, let's simulate a status response
    const statusCode = Math.floor(Math.random() * 3); // 0 = clean, 1 = modified, 2 = staged
    
    switch (statusCode) {
      case 0:
        updatePortalStatus('clean');
        break;
      case 1:
        updatePortalStatus('modified');
        break;
      case 2:
        updatePortalStatus('staged');
        break;
      default:
        updatePortalStatus('clean');
    }
  } catch (error) {
    console.error('Failed to check git status:', error);
    updatePortalStatus('error');
  }
};

// Update the portal status visualization
const updatePortalStatus = (status) => {
  // Remove existing status classes
  portalStatus.classList.remove('clean', 'modified', 'staged', 'error');
  
  if (!status) {
    portalStatus.style.display = 'none';
    return;
  }
  
  // Add new status class
  portalStatus.classList.add(status);
  portalStatus.style.display = 'block';
  
  // Update animation based on status
  switch (status) {
    case 'clean':
      portalStatus.classList.add('portal-spinning');
      break;
    case 'modified':
      portalStatus.classList.add('portal-spinning');
      portalStatus.style.animationDuration = '3s';
      break;
    case 'staged':
      portalStatus.classList.add('portal-spinning');
      portalStatus.style.animationDuration = '2s';
      break;
    case 'error':
      portalStatus.classList.remove('portal-spinning');
      break;
  }
};

// Commit changes to the repository
const commitChanges = async () => {
  if (!currentRepo || !isGitAvailable) {
    window.chimeraWhisper.addMessage('No git portal connected.', 'from-ai');
    return;
  }
  
  try {
    // First save the current file
    window.chimeraEditor.saveFile();
    
    // Show portal opening animation
    const portalAnimation = document.createElement('div');
    portalAnimation.className = 'portal-opening portal-spinning';
    portalAnimation.style.position = 'fixed';
    portalAnimation.style.top = '50%';
    portalAnimation.style.left = '50%';
    portalAnimation.style.width = '200px';
    portalAnimation.style.height = '200px';
    portalAnimation.style.marginLeft = '-100px';
    portalAnimation.style.marginTop = '-100px';
    portalAnimation.style.borderRadius = '50%';
    portalAnimation.style.background = 'radial-gradient(circle, rgba(167,125,70,0.8) 0%, rgba(167,125,70,0) 70%)';
    portalAnimation.style.boxShadow = '0 0 40px rgba(167,125,70,0.6)';
    portalAnimation.style.zIndex = '1000';
    
    // Append to body
    document.body.appendChild(portalAnimation);
    
    // Prompt for commit message
    const commitMessage = prompt('Enter commit message:');
    
    if (!commitMessage) {
      // Remove animation if cancelled
      document.body.removeChild(portalAnimation);
      return;
    }
    
    // This is a placeholder - in a real app, we would call to the main process
    // to execute git commands like `git -C ${currentRepo} add . && git -C ${currentRepo} commit -m "${commitMessage}"`
    
    // For demonstration, let's simulate a successful commit
    setTimeout(() => {
      // Remove animation
      document.body.removeChild(portalAnimation);
      
      // Update status
      updatePortalStatus('staged');
      
      // Show success message
      const currentTheme = document.getElementById('theme-stylesheet').href.includes('lain') ? 'lain' : 'morrowind';
      
      if (currentTheme === 'lain') {
        window.chimeraWhisper.addMessage(`Changes committed to data layer. Hash signature generated.`, 'from-ai');
      } else {
        window.chimeraWhisper.addMessage(`Your changes have been bound to the ancestral record. The scroll awaits transport.`, 'from-ai');
      }
    }, 2000);
  } catch (error) {
    console.error('Failed to commit changes:', error);
    window.chimeraWhisper.addMessage(`Failed to bind changes: ${error.message}`, 'from-ai');
  }
};

// Push changes to the remote repository
const pushChanges = async () => {
  if (!currentRepo || !isGitAvailable) {
    window.chimeraWhisper.addMessage('No git portal connected.', 'from-ai');
    return;
  }
  
  try {
    // Show portal opening animation
    const portalAnimation = document.createElement('div');
    portalAnimation.className = 'portal-opening portal-spinning';
    portalAnimation.style.position = 'fixed';
    portalAnimation.style.top = '50%';
    portalAnimation.style.left = '50%';
    portalAnimation.style.width = '300px';
    portalAnimation.style.height = '300px';
    portalAnimation.style.marginLeft = '-150px';
    portalAnimation.style.marginTop = '-150px';
    portalAnimation.style.borderRadius = '50%';
    portalAnimation.style.background = 'radial-gradient(circle, rgba(167,125,70,0.9) 0%, rgba(167,125,70,0) 70%)';
    portalAnimation.style.boxShadow = '0 0 60px rgba(167,125,70,0.7)';
    portalAnimation.style.zIndex = '1000';
    
    // Create inner swirl
    const innerSwirl = document.createElement('div');
    innerSwirl.style.position = 'absolute';
    innerSwirl.style.top = '50px';
    innerSwirl.style.left = '50px';
    innerSwirl.style.width = '200px';
    innerSwirl.style.height = '200px';
    innerSwirl.style.borderRadius = '50%';
    innerSwirl.style.border = '3px solid rgba(232,203,154,0.7)';
    innerSwirl.style.animation = 'portal-spin 3s linear infinite reverse';
    
    portalAnimation.appendChild(innerSwirl);
    
    // Append to body
    document.body.appendChild(portalAnimation);
    
    // This is a placeholder - in a real app, we would call to the main process
    // to execute git commands like `git -C ${currentRepo} push`
    
    // For demonstration, let's simulate a successful push
    setTimeout(() => {
      // Remove animation
      document.body.removeChild(portalAnimation);
      
      // Update status
      updatePortalStatus('clean');
      
      // Show success message
      const currentTheme = document.getElementById('theme-stylesheet').href.includes('lain') ? 'lain' : 'morrowind';
      
      if (currentTheme === 'lain') {
        window.chimeraWhisper.addMessage(`Data pushed to remote repository. Network nodes synchronized.`, 'from-ai');
      } else {
        window.chimeraWhisper.addMessage(`Your scrolls have crossed the void to the ancestral library. The elder records are updated.`, 'from-ai');
      }
    }, 3000);
  } catch (error) {
    console.error('Failed to push changes:', error);
    window.chimeraWhisper.addMessage(`Failed to send forth changes: ${error.message}`, 'from-ai');
  }
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initGitIntegration();
  
  // Export API for use in other modules
  window.chimeraGit = {
    commitChanges,
    pushChanges,
    checkIsGitRepository
  };
});
