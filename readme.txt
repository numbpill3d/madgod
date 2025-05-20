# CHIMERA Code Editor

**CHIMERA** (**C**ybernetic **H**ypertextual **I**nterface for **M**odular **E**mbedded **R**untime **A**uthoring) is a fully-functional VSCode replacement with a unique thematic aesthetic that combines the cyberpunk neural interface of Serial Experiments Lain with the arcane, mystical elements of Morrowind.

![CHIMERA Screenshot](app/assets/images/screenshot.png)

## Features

### 🧠 Dual Thematic Interfaces

- **Neural Interface** (Lain Theme): Digital, cyberpunk aesthetics with neural connections, glitch effects, and terminal-inspired design
- **Arcane Scrolls** (Morrowind Theme): Mystical, daedric-inspired UI with scroll elements, dust particles, and magical effects

### 📜 Core Editor Features

- Monaco Editor integration (same core as VSCode)
- Full syntax highlighting for all major languages
- Multi-file editing with tabs
- File explorer with folder structure
- Project management
- Theming system with hot-swappable styles

### 🌀 Unique Visual Elements

- **Neural Thread View**: Edit history visualized as a connected thread of nodes
- **Git Integration as Wormholes**: Visualize Git operations as portals between realms
- **Task Runner as Constellation Navigator**: Run scripts by activating star patterns
- **Whisper Tab**: An AI assistant that speaks in theme-appropriate riddles
- **Three.js Background Effects**: Dynamic particle systems that change with the theme

### 🔊 Immersive Experience

- Ambient background audio for each theme
- Interactive sound effects for all actions
- Glitch/Magic effects tied to user interactions
- Custom animations and transitions

## Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chimera-code-editor.git
cd chimera-code-editor
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the application:
```bash
npm start
# or
yarn start
```

## Usage

### Keyboard Shortcuts

- `Alt+S`: Save current file
- `Alt+T`: Toggle between Lain and Morrowind themes
- `Alt+N`: Create new file
- `Alt+O`: Open project
- `Alt+R`: Run selected task
- `Alt+G`: Show Git panel
- `Alt+W`: Focus on whisper input
- `Alt+M`: Toggle sound on/off
- `Alt+Up/Down`: Increase/decrease volume

### Navigating the Interface

#### File Explorer (Scroll Rack)

The left panel displays your project files as a scroll rack. You can:
- Click on files to open them
- Expand/collapse directories
- Search for files using the search box

#### Editor Area (Dream Bubbles)

The central area is the Monaco editor where you'll write your code. You can:
- Edit multiple files in tabs
- Use standard Monaco editor features
- Track your edit history in the Neural Thread below

#### Whisper Tab (AI Assistant)

The right panel contains the Whisper Tab, an AI assistant that speaks in riddles:
- Ask coding questions
- Get guidance about the editor
- Receive mystical/technical responses based on your current theme

#### Git Portal

The Git integration visualizes repositories as wormholes:
- Commit changes with the "Bind Change" button
- Push to remote with the "Send Forth" button
- Watch the portal animations during Git operations

#### Constellation Navigator (Task Runner)

The Task Runner displays scripts from your package.json as a constellation:
- Select a task from the dropdown
- Click "Invoke" to run the task
- Watch the constellation animation during execution

### Themes

CHIMERA offers two distinct themes that completely transform the interface:

#### Lain Theme (Neural Interface)

- Green-on-black terminal aesthetic
- Glitch effects and scanlines
- Neural connections and digital motifs
- Cyberpunk terminal overlay with live output

#### Morrowind Theme (Arcane Scrolls)

- Parchment and amber color scheme
- Dust particles and magical runes
- Scroll decorations and magical effects
- Daedric styling throughout the interface

Toggle between themes with `Alt+T` to completely change your coding experience.

## Customization

### Creating Custom Themes

1. Add a new CSS file in `app/styles/themes/`
2. Follow the pattern in existing theme files
3. Modify the theme-toggling code in `main.js` to include your theme

### Extending Features

CHIMERA is built with a modular structure to make extensions easy:
- Add new features in `app/scripts/features/`
- Create new UI components in `app/scripts/ui/`
- Add visual effects in `app/scripts/effects/`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

CHIMERA was created as a creative coding experiment to combine functional developer tools with immersive thematic elements. Inspired by:

- Serial Experiments Lain
- The Elder Scrolls III: Morrowind
- TempleOS
- Various cyberpunk and arcane aesthetics

---

*"The Code is not Code, but a Matrix of Dreams..."*