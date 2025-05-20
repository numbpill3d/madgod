// Whisper AI Assistant for CHIMERA
// This script implements the themed AI assistant functionality

// Global variables
let messageContainer = null;
let messageInput = null;
let currentTheme = 'lain';
let messageHistory = [];
const maxHistoryLength = 50;

// Initialize the Whisper assistant
const initWhisper = () => {
  // Get DOM elements
  messageContainer = document.getElementById('whisper-messages');
  messageInput = document.getElementById('whisper-query');
  
  // Set up theme detection
  const themeStylesheet = document.getElementById('theme-stylesheet');
  currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
  
  // Observer for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
      }
    });
  });
  
  observer.observe(themeStylesheet, { attributes: true });
  
  // Load message history from localStorage
  loadMessageHistory();
  
  // Display welcome message
  const welcomeMessage = currentTheme === 'lain' 
    ? 'Neural interface established. How may I assist your coding session?' 
    : 'The scrolls have been unfurled. What knowledge do you seek, outlander?';
  
  addMessage(welcomeMessage, 'from-ai');
};

// Add a message to the whisper panel
const addMessage = (text, type = 'from-user') => {
  if (!messageContainer) return;
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `whisper-message ${type}`;
  
  // Add appropriate icon based on message type and theme
  const iconSpan = document.createElement('span');
  iconSpan.className = 'message-icon';
  
  if (type === 'from-user') {
    iconSpan.textContent = '👤';
  } else {
    // AI icon depends on theme
    iconSpan.textContent = currentTheme === 'lain' ? '🖥️' : '📜';
  }
  
  // Create message text element
  const textSpan = document.createElement('span');
  textSpan.className = 'message-text';
  textSpan.textContent = text;
  
  // Assemble message
  messageElement.appendChild(iconSpan);
  messageElement.appendChild(textSpan);
  
  // Add to container
  messageContainer.appendChild(messageElement);
  
  // Scroll to bottom
  messageContainer.scrollTop = messageContainer.scrollHeight;
  
  // Add to history
  addToMessageHistory(text, type);
  
  // Dispatch event for sound effects and animations
  document.dispatchEvent(new CustomEvent('whisper-message', { 
    detail: { text, from: type === 'from-user' ? 'user' : 'ai' } 
  }));
  
  return messageElement;
};

// Add message to history and save to localStorage
const addToMessageHistory = (text, type) => {
  // Add to history array
  messageHistory.push({ text, type, timestamp: Date.now() });
  
  // Limit history length
  if (messageHistory.length > maxHistoryLength) {
    messageHistory.shift();
  }
  
  // Save to localStorage
  saveMessageHistory();
};

// Save message history to localStorage
const saveMessageHistory = () => {
  try {
    localStorage.setItem('chimeraWhisperHistory', JSON.stringify(messageHistory));
  } catch (error) {
    console.error('Failed to save whisper history:', error);
  }
};

// Load message history from localStorage
const loadMessageHistory = () => {
  try {
    const savedHistory = localStorage.getItem('chimeraWhisperHistory');
    if (savedHistory) {
      messageHistory = JSON.parse(savedHistory);
      
      // Display last few messages (max 5)
      const recentMessages = messageHistory.slice(-5);
      
      if (recentMessages.length > 0) {
        // Add a separator
        const separator = document.createElement('div');
        separator.className = 'history-separator';
        separator.textContent = '--- Previous Conversation ---';
        messageContainer.appendChild(separator);
        
        // Add the messages
        recentMessages.forEach(msg => {
          addMessage(msg.text, msg.type);
        });
        
        // Add another separator
        const endSeparator = document.createElement('div');
        endSeparator.className = 'history-separator';
        endSeparator.textContent = '--- New Conversation ---';
        messageContainer.appendChild(endSeparator);
      }
    }
  } catch (error) {
    console.error('Failed to load whisper history:', error);
    messageHistory = [];
  }
};

// Process a user query and generate a response
const processQuery = (query) => {
  // In a real app, this would connect to an AI service
  // For now, we'll generate themed responses based on keywords
  
  // Add user message to the UI
  addMessage(query, 'from-user');
  
  // Simulate thinking time
  setTimeout(() => {
    // Generate response based on theme and query
    const response = generateThemedResponse(query);
    
    // Add AI response to the UI
    addMessage(response, 'from-ai');
  }, 1000);
};

// Generate a themed response based on the query
const generateThemedResponse = (query) => {
  // Convert query to lowercase for easier matching
  const lowerQuery = query.toLowerCase();
  
  // Check for common keywords
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi ')) {
    return currentTheme === 'lain' 
      ? 'Greetings, user. Neural connection established.' 
      : 'Well met, outlander. The scrolls acknowledge your presence.';
  }
  
  if (lowerQuery.includes('help')) {
    return currentTheme === 'lain' 
      ? 'I am programmed to assist with your coding tasks. What protocol shall we execute?' 
      : 'The ancient knowledge is at your disposal. What wisdom do you seek?';
  }
  
  if (lowerQuery.includes('theme')) {
    return currentTheme === 'lain' 
      ? 'Current interface: Neural Protocol. Toggle with Alt+T to access the Arcane Protocol.' 
      : 'The scrolls are currently in Daedric form. Use Alt+T to switch to the Digital Realm.';
  }
  
  if (lowerQuery.includes('save') || lowerQuery.includes('file')) {
    return currentTheme === 'lain' 
      ? 'Files can be saved with Alt+S. Data persistence is critical for system integrity.' 
      : 'Your scrolls can be preserved with Alt+S. The ancient texts must be maintained.';
  }
  
  if (lowerQuery.includes('open') || lowerQuery.includes('project')) {
    return currentTheme === 'lain' 
      ? 'Projects can be accessed with Alt+O. Which data structure would you like to navigate?' 
      : 'New realms can be explored with Alt+O. Which domain shall we venture into?';
  }
  
  // If no specific keywords, return a generic themed response
  return getRandomThemedResponse();
};

// Get a random themed response
const getRandomThemedResponse = () => {
  const lainResponses = [
    "Protocol unclear. Please specify your request parameters.",
    "The Wired contains the answer you seek. We must dive deeper.",
    "Your query has been processed. The system responds with uncertainty.",
    "Digital pathways are forming. The code speaks through me.",
    "Neural connection fluctuating. Please reformulate your input sequence.",
    "I exist in the layer between human and machine. Your question resonates there.",
    "The protocol suggests multiple solutions. Which shall we implement?",
    "Data analysis complete. The answer lies in the pattern recognition.",
    "Your consciousness and mine overlap in this digital space.",
    "The network remembers what you have forgotten."
  ];
  
  const morrowindResponses = [
    "The scrolls are silent on this matter. Perhaps we should consult a different tome.",
    "As the ancestors would say: 'The code is merely a shadow of intent.'",
    "The Tribunal of Logic has considered your question. The answer is shrouded in mystery.",
    "Your query echoes in the halls of ancient knowledge.",
    "The runes suggest caution when treading this path of inquiry.",
    "Even the wisest of the Telvanni would ponder deeply on this matter.",
    "The strands of fate are woven into your code. I see patterns within patterns.",
    "The scrolls whisper of similar questions asked in ages past.",
    "By the Three, your question touches on the very fabric of creation!",
    "The answer you seek may lie in the dreams of the Godhead."
  ];
  
  // Select appropriate response set based on theme
  const responses = currentTheme === 'lain' ? lainResponses : morrowindResponses;
  
  // Return a random response
  return responses[Math.floor(Math.random() * responses.length)];
};

// Clear the message history
const clearHistory = () => {
  // Clear the UI
  if (messageContainer) {
    messageContainer.innerHTML = '';
  }
  
  // Clear the history array
  messageHistory = [];
  
  // Update localStorage
  saveMessageHistory();
  
  // Add a fresh welcome message
  const welcomeMessage = currentTheme === 'lain' 
    ? 'Memory buffer cleared. Neural interface reset.' 
    : 'The scrolls have been wiped clean. A new chapter begins.';
  
  addMessage(welcomeMessage, 'from-ai');
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initWhisper();
  
  // Export API for use in other modules
  window.chimeraWhisper = {
    addMessage,
    processQuery,
    clearHistory
  };
});
