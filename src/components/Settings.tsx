import { useStore } from '../store';
import { X, Sliders } from 'lucide-react';

export default function Settings() {
  const { setShowSettings, config, updateConfig } = useStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <Sliders className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="rounded-lg p-2 text-muted hover:bg-muted/10 hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* Editor Settings */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Editor
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Font Size: {config.editorFontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={config.editorFontSize}
                  onChange={(e) =>
                    updateConfig({ editorFontSize: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Line Height: {config.lineHeight}
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="2.0"
                  step="0.1"
                  value={config.lineHeight}
                  onChange={(e) =>
                    updateConfig({ lineHeight: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Font Family
                </label>
                <select
                  value={config.editorFontFamily}
                  onChange={(e) => updateConfig({ editorFontFamily: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="JetBrains Mono">JetBrains Mono</option>
                  <option value="Fira Code">Fira Code</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Consolas">Consolas</option>
                  <option value="monospace">System Monospace</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Default View
                </label>
                <select
                  value={config.defaultView}
                  onChange={(e) =>
                    updateConfig({
                      defaultView: e.target.value as 'editor' | 'split' | 'preview',
                    })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="editor">Editor Only</option>
                  <option value="split">Split View</option>
                  <option value="preview">Preview Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Sidebar
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Width: {config.sidebarWidth}px
                </label>
                <input
                  type="range"
                  min="200"
                  max="400"
                  value={config.sidebarWidth}
                  onChange={(e) =>
                    updateConfig({ sidebarWidth: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Behavior Settings */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Behavior
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Auto Save</span>
                <input
                  type="checkbox"
                  checked={config.autoSave}
                  onChange={(e) => updateConfig({ autoSave: e.target.checked })}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                />
              </label>

              {config.autoSave && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Auto Save Interval: {config.autoSaveInterval / 1000}s
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="1000"
                    value={config.autoSaveInterval}
                    onChange={(e) =>
                      updateConfig({ autoSaveInterval: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              )}

              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Spell Check</span>
                <input
                  type="checkbox"
                  checked={config.spellCheck}
                  onChange={(e) => updateConfig({ spellCheck: e.target.checked })}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Vim Mode</span>
                <input
                  type="checkbox"
                  checked={config.vimMode}
                  onChange={(e) => updateConfig({ vimMode: e.target.checked })}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                />
              </label>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2 rounded-lg border border-border p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Settings</span>
                <kbd className="rounded bg-muted/20 px-2 py-1 font-mono text-xs text-foreground">
                  ⌘ ,
                </kbd>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Theme Editor</span>
                <kbd className="rounded bg-muted/20 px-2 py-1 font-mono text-xs text-foreground">
                  ⌘ ⇧ T
                </kbd>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Dev Mode</span>
                <kbd className="rounded bg-muted/20 px-2 py-1 font-mono text-xs text-foreground">
                  ⌘ ⇧ D
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-border p-6">
          <button
            onClick={() => setShowSettings(false)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
