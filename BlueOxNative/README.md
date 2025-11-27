# BlueOx Notes - Native macOS App

A beautiful, native macOS note-taking app built with SwiftUI for **macOS Tahoe (26.0+)** with Liquid Glass design.

## Features

- ✅ **Native macOS Experience** - Built with SwiftUI + AppKit
- ✅ **Liquid Glass Design** - Reflective, refractive translucent materials (macOS 26)
- ✅ **Floating Panel** - Always-on-top quick notes (like Inkdrop)
- ✅ **Markdown Support** - Write in markdown, see live preview
- ✅ **Split View** - Editor and preview side-by-side with automatic Liquid Glass sidebar
- ✅ **iCloud Sync** - Your notes sync automatically via SwiftData + iCloud
- ✅ **Dark Mode** - Full dark mode support
- ✅ **Keyboard Shortcuts** - ⌘N for new note, ⌘, for settings
- ✅ **Auto-save** - Never lose your work

## Requirements

- **macOS 26.0 (Tahoe) or later**
- Xcode 26.0 or later
- Swift 6.0

## Liquid Glass

The app automatically adopts macOS Tahoe's Liquid Glass design:
- NavigationSplitView sidebar shows reflections and wallpaper patterns
- Floating panel uses glassEffect API for enhanced translucency
- All materials dynamically transform based on surroundings
- Simply built with Xcode 26 - Liquid Glass applied automatically!

## Building

1. Open `BlueOxNative.xcodeproj` in Xcode
2. Select your team in Signing & Capabilities
3. Build and run (⌘R)

## Project Structure

```
BlueOxNative/
├── BlueOxApp.swift          # App entry point
├── Models.swift             # SwiftData models
├── ContentView.swift        # Main split view
├── EditorView.swift         # Note editor with preview
├── FloatingPanel.swift      # Floating quick notes panel
├── SettingsView.swift       # App settings
└── Info.plist              # App configuration
```

## Key Technologies

- **SwiftUI** - Declarative UI framework
- **SwiftData** - Persistent storage with CloudKit sync
- **AppKit** - Floating panel implementation
- **NSPanel** - Always-on-top window behavior
- **NSVisualEffectView** - Frosted glass materials

## Floating Panel

The floating panel (⌘⇧F or via Settings) gives you quick note access that stays on top of all windows - perfect for:
- Quick thoughts while working
- Reference notes
- Temporary clipboard
- To-do items

## iCloud Sync

Notes automatically sync via iCloud using SwiftData. No configuration needed - just sign in with your Apple ID.

## Keyboard Shortcuts

- `⌘N` - New note
- `⌘,` - Settings
- `⌘⇧F` - Toggle floating panel
- `⌘W` - Close window
- `⌘Q` - Quit app

## Deployment

To deploy to your Scaleway Mac mini:

1. Archive the app in Xcode
2. Export for Mac distribution
3. SCP to Scaleway:
   ```bash
   scp -r BlueOxNative.app user@your-mac-mini:/Applications/
   ```

Or run directly on the mini by cloning and building there.

## Next Steps

- [ ] Full markdown rendering with syntax highlighting
- [ ] Tags and folders
- [ ] Full-text search
- [ ] Themes
- [ ] App Intents for Shortcuts
- [ ] WidgetKit widgets
- [ ] Share extension

## License

MIT
