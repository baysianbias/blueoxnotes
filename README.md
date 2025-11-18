# BlueOx Notes 📝

> The cross-platform, ever-changing note-taking and productivity application you didn't know you needed

A beautiful, themeable, and self-modifying note-taking app built with **immediate mode programming** principles. Customize the UI and it changes the code. No rebuilds required.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎨 **Gorgeous Themes**
- 8+ built-in themes (Dark, Light, Midnight, Nord, Catppuccin, Dracula, Tokyo Night, Solarized)
- **Live theme editor** - customize colors in real-time
- Create and save custom themes
- Smooth transitions between themes

### ⚡ **Immediate Mode**
- Change the UI, change the code
- Live CSS variable editing
- Dev mode to inspect internals
- Config changes persist automatically

### 📝 **Powerful Editor**
- Full markdown support with live preview
- Syntax highlighting for code blocks
- Split view (editor + preview)
- Auto-save (configurable)
- Customizable fonts, sizes, and spacing

### 🔍 **Organization**
- Fast search across all notes
- Folders and tags (coming soon)
- Sort by date, title, or custom order

### ⌨️ **Keyboard-First**
- Extensive keyboard shortcuts
- Vim mode (optional)
- Quick note creation
- Fast theme switching

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Usage

### Creating Notes

1. Click the **+** button in the sidebar
2. Start typing - notes auto-save
3. First line with `#` becomes the title

### Customizing Themes

**Keyboard:** Press `⌘⇧T` (Cmd+Shift+T)
**UI:** Click the palette icon in the sidebar

1. Select a preset theme
2. Or customize colors with the color pickers
3. Changes apply instantly
4. Click "Save Custom Theme" to persist

### Settings

**Keyboard:** Press `⌘,` (Cmd+Comma)
**UI:** Click the settings icon

Customize:
- Editor font size (12-24px)
- Line height (1.2-2.0)
- Font family (JetBrains Mono, Fira Code, etc.)
- Sidebar width (200-400px)
- Auto-save interval
- Default view (editor/split/preview)
- Spell check, Vim mode

### Dev Mode

**Keyboard:** Press `⌘⇧D` (Cmd+Shift+D)
**UI:** Click the code icon

Peek under the hood:
- **Config** - Live configuration JSON
- **State** - Application state and note data
- **CSS** - Active CSS variables with color previews

This is where the "immediate mode" magic happens - see how your UI changes affect the underlying data structures in real-time.

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Settings | `⌘,` |
| Theme Editor | `⌘⇧T` |
| Dev Mode | `⌘⇧D` |
| New Note | Click `+` in sidebar |
| Search | Click search bar |

## 🎨 Available Themes

- **Light** - Clean, minimal light theme
- **Dark** - Easy on the eyes dark theme
- **Midnight** - Deep purple and pink
- **Nord** - Arctic, north-bluish color palette
- **Catppuccin** - Soothing pastel theme
- **Dracula** - Famous purple theme
- **Tokyo Night** - Inspired by Tokyo's neon lights
- **Solarized** - Precision colors for precision work

## 🏗️ Architecture

Built with modern web technologies:

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Markdown-it** - Markdown parsing
- **Highlight.js** - Syntax highlighting

### Immediate Mode Philosophy

BlueOx embraces immediate mode programming:

1. **Direct manipulation** - UI changes directly modify state
2. **Live persistence** - Changes save to localStorage instantly
3. **No rebuilds** - Theme and config changes apply immediately
4. **Transparency** - Dev mode shows you the internals
5. **Self-documenting** - The app teaches you how it works

## 🗂️ Project Structure

```
blueoxnotes/
├── src/
│   ├── components/        # React components
│   │   ├── Sidebar.tsx
│   │   ├── Editor.tsx
│   │   ├── Preview.tsx
│   │   ├── ThemeEditor.tsx
│   │   ├── Settings.tsx
│   │   └── DevPanel.tsx
│   ├── utils/
│   │   └── createWelcomeNote.ts
│   ├── App.tsx           # Main app component
│   ├── store.ts          # Zustand state management
│   ├── config.ts         # App configuration
│   ├── index.css         # Global styles + themes
│   └── main.tsx          # Entry point
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Type checking
npm run build

# Lint code
npm run lint
```

## 🔮 Roadmap

- [ ] Export notes (Markdown, PDF, HTML)
- [ ] Import from other apps (Obsidian, Notion, etc.)
- [ ] Tags and advanced filtering
- [ ] Nested folders
- [ ] Note linking (wiki-style)
- [ ] Dark mode for code editor
- [ ] Plugin system
- [ ] Cloud sync (optional)
- [ ] Mobile apps
- [ ] Desktop app (Electron/Tauri)

## 🤝 Contributing

This is a personal project, but contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this however you want!

## 🙏 Acknowledgments

Inspired by:
- Obsidian - for showing notes can be beautiful
- Notion - for proving customization matters
- Dear ImGui - for immediate mode philosophy
- All the productivity apps that almost got it right

---

**Made with ❤️ for people who love both aesthetics and functionality**

Start taking beautiful notes: `npm run dev`
