// Whisper Tab - AI Assistant for CHIMERA
// This script implements the mystical AI assistant that speaks in riddles

// Global variables
let whisperContent = null;
let whisperMessages = null;
let whisperQuery = null;
let whisperSend = null;
let currentTheme = 'lain';
let aiName = 'The Wired'; // Default name for Lain theme
let waitingForResponse = false;

// Lain theme AI responses use technical, digital terminology
const lainResponses = {
  greeting: [
    "Connection established. Protocol initialized.",
    "Layer recognized. Begin transmission.",
    "Data link open. Present query parameters.",
    "Terminal interface active. Memory buffers clear.",
    "Neural pathway connected. Input accepted."
  ],
  help: [
    "Protocol guide: [Alt+S] to save file. [Alt+T] to shift layers. [Alt+N] to create new file.",
    "Codebase navigation facilitated through scroll rack indexing system.",
    "Syntax anomalies detected through pattern recognition algorithms.",
    "Project architecture visualized through neural thread matrix.",
    "Commit changes to layer through Git portal integration."
  ],
  error: [
    "Connection error. Protocol violation detected.",
    "Memory address invalid. Verify data structure.",
    "Buffer overflow potential. Syntax requires verification.",
    "Process terminated unexpectedly. Retry transmission.",
    "Packet corruption detected. Data integrity compromised."
  ],
  success: [
    "Process completed. Return value validated.",
    "Operation executed. Buffer state preserved.",
    "Function call resolved successfully. Output verified.",
    "Task execution complete. System state stable.",
    "Protocol completed within expected parameters."
  ],
  thinking: [
    "Processing input stream...",
    "Analyzing data structures...",
    "Compiling response matrix...",
    "Calculating optimal solution path...",
    "Resolving reference pointers..."
  ],
  fileTypes: {
    js: "JavaScript protocol detected. Built-in asynchronous functionality available.",
    html: "HTML structure layer identified. DOM interface accessible.",
    css: "CSS styling matrix present. Visual parameters configurable.",
    json: "JSON data structure located. Parse-ready format confirmed.",
    md: "Markdown documentation file identified. Human-readable formatting intact."
  },
  general: [
    "All systems operational. Network layer stable.",
    "Memory allocation optimal. Processing resources available.",
    "Connection strength at nominal levels. Latency minimal.",
    "Interface protocols responding within parameters.",
    "Background processes maintaining expected functionality."
  ]
};

// Morrowind theme AI responses use mystical, arcane terminology
const morrowindResponses = {
  greeting: [
    "The scroll unfurls at your touch, outlander.",
    "The ancestors guide your quill this day.",
    "Your sigil is recognized by the elder scripts.",
    "The Telvanni towers watch as you weave your spells.",
    "The threads of code are yours to bind, serjo."
  ],
  help: [
    "The sacred bindings: [Alt+S] commits your spell. [Alt+T] shifts between realms. [Alt+N] forges new scrolls.",
    "The rack of scrolls holds your tomes, categorized by the ancient system.",
    "Errors in your incantations will be revealed by glowing sigils in the margin.",
    "Your path through the code is tracked by soul gems in the thread below.",
    "Bind your changes to the ancestral repository through the Dwemer portal."
  ],
  error: [
    "The scroll rejects your incantation. The syntax lacks proper form.",
    "Your spell falters. The runes are misaligned.",
    "The ancestral spirits cannot interpret this command.",
    "The binding fails. There is a curse upon these words.",
    "Your magicka is insufficient for this ritual."
  ],
  success: [
    "Your spell takes form. The code accepts your will.",
    "The scroll is bound successfully. Your changes manifest.",
    "The runes glow with acceptance. Your script lives.",
    "As you command, so it becomes. The function completes.",
    "The spirits of the code acknowledge your wisdom."
  ],
  thinking: [
    "Consulting the elder scrolls...",
    "Communing with the ancestors...",
    "Divining the proper incantation...",
    "Seeking wisdom in the dreaming sleeve...",
    "Tracing the threads of prophecy..."
  ],
  fileTypes: {
    js: "A scroll of JavaScript conjuration. Powerful for summoning asynchronous entities.",
    html: "A tome of structural HTML magic. The foundation of visible forms.",
    css: "An illusion scroll of CSS. The appearance of elements bends to its will.",
    json: "A lexicon of JSON knowledge. Data bound in readable patterns.",
    md: "Parchment of Markdown lore. For recording wisdom in readable form."
  },
  general: [
    "The temple of code stands ready for your offerings.",
    "The three moons align favorably for coding today.",
    "The ancestral wisdom flows through your fingertips.",
    "Your quill is sharp, your ink flows true.",
    "The sacred geometry of your algorithms pleases the ancestors."
  ]
};

// Initialize the Whisper Tab
const initWhisperTab = () => {
  whisperContent = document.getElementById('whisper-content');
  whisperMessages = document.getElementById('whisper-messages');
  whisperQuery = document.getElementById('whisper-query');
  whisperSend = document.getElementById('whisper-send');
  
  // Set up event listeners
  whisperSend.addEventListener('click', sendWhisperQuery);
  whisperQuery.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendWhisperQuery();
    }
  });
  
  // Monitor theme changes
  const themeStylesheet = document.getElementById('theme-stylesheet');
  currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
  aiName = currentTheme === 'lain' ? 'The Wired' : 'Elder Scroll';
  
  // Observer for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
        currentTheme = themeStylesheet.href.includes('lain') ? 'lain' : 'morrowind';
        aiName = currentTheme === 'lain' ? 'The Wired' : 'Elder Scroll';
      }
    });
  });
  
  observer.observe(themeStylesheet, { attributes: true });
  
  // Add initial greeting
  const responses = currentTheme === 'lain' ? lainResponses : morrowindResponses;
  const greeting = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  
  setTimeout(() => {
    addWhisperMessage(greeting, 'from-ai');
  }, 2000);
};

// Send a query to the whisper tab
const sendWhisperQuery = () => {
  const query = whisperQuery.value.trim();
  
  if (!query || waitingForResponse) return;
  
  // Add user message
  addWhisperMessage(query, 'from-user');
  
  // Clear input
  whisperQuery.value = '';
  
  // Set waiting flag
  waitingForResponse = true;
  
  // Add thinking message
  const responses = currentTheme === 'lain' ? lainResponses : morrowindResponses;
  const thinking = responses.thinking[Math.floor(Math.random() * responses.thinking.length)];
  
  const thinkingMessage = addWhisperMessage(thinking, 'from-ai');
  
  // Process the query
  setTimeout(() => {
    // Remove thinking message
    if (thinkingMessage && thinkingMessage.parentNode) {
      thinkingMessage.parentNode.removeChild(thinkingMessage);
    }
    
    // Generate AI response
    const response = generateAIResponse(query);
    
    // Add AI response
    addWhisperMessage(response, 'from-ai');
    
    // Reset waiting flag
    waitingForResponse = false;
  }, 1500);
};

// Add a message to the whisper tab
const addWhisperMessage = (message, className) => {
  const messageElement = document.createElement('div');
  messageElement.className = `whisper-message ${className} message-appear`;
  messageElement.textContent = message;
  
  whisperMessages.appendChild(messageElement);
  
  // Scroll to bottom
  whisperContent.scrollTop = whisperContent.scrollHeight;
  
  return messageElement;
};

// Generate an AI response based on the query
const generateAIResponse = (query) => {
  const responses = currentTheme === 'lain' ? lainResponses : morrowindResponses;
  const queryLower = query.toLowerCase();
  
  // Check for help-related queries
  if (queryLower.includes('help') || queryLower.includes('how') || queryLower.includes('?')) {
    return responses.help[Math.floor(Math.random() * responses.help.length)];
  }
  
  // Check for file type questions
  for (const [fileType, response] of Object.entries(responses.fileTypes)) {
    if (queryLower.includes(fileType)) {
      return response;
    }
  }
  
  // Check for greetings
  if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower === 'hey') {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  // Check for error-related queries
  if (queryLower.includes('error') || queryLower.includes('bug') || queryLower.includes('fix') || 
      queryLower.includes('wrong') || queryLower.includes('issue')) {
    return responses.error[Math.floor(Math.random() * responses.error.length)];
  }
  
  // Check for success-related queries
  if (queryLower.includes('good') || queryLower.includes('works') || queryLower.includes('success') || 
      queryLower.includes('fixed') || queryLower.includes('done')) {
    return responses.success[Math.floor(Math.random() * responses.success.length)];
  }
  
  // Handle specific function queries
  if (queryLower.includes('save')) {
    window.chimeraEditor.saveFile();
    return responses.success[Math.floor(Math.random() * responses.success.length)];
  }
  
  if (queryLower.includes('open project') || queryLower.includes('load project')) {
    window.chimeraFileExplorer.openProject();
    return "Seeking new realms to bind to your consciousness...";
  }
  
  if (queryLower.includes('new file') || queryLower.includes('create file')) {
    // Extract file name if provided
    const fileName = query.split(' ').filter(word => word.includes('.')).pop();
    
    if (fileName) {
      window.chimeraFileExplorer.createNewFile(fileName, '');
      return `Forming new scroll named '${fileName}' from the void...`;
    } else {
      return "To create a new scroll, speak its name with extension (e.g. 'create file index.js')";
    }
  }
  
  if (queryLower.includes('toggle theme') || queryLower.includes('switch theme') || 
      queryLower.includes('change theme')) {
    document.getElementById('theme-toggle').click();
    return "Shifting between layers of reality...";
  }
  
  // Default to general responses
  return responses.general[Math.floor(Math.random() * responses.general.length)];
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initWhisperTab();
  
  // Export API for use in other modules
  window.chimeraWhisper = {
    addMessage: addWhisperMessage
  };
});
