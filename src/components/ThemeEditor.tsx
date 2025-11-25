import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { X, Save, Palette, Eye } from 'lucide-react';

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
}

const presetThemes: Record<string, ThemeColors> = {
  light: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    muted: '#6b7280',
    border: '#e5e7eb',
  },
  dark: {
    background: '#0a0a0a',
    foreground: '#fafafa',
    primary: '#60a5fa',
    secondary: '#a78bfa',
    accent: '#22d3ee',
    muted: '#9ca3af',
    border: '#27272a',
  },
  midnight: {
    background: '#0f0f1e',
    foreground: '#e0e0ff',
    primary: '#7c3aed',
    secondary: '#ec4899',
    accent: '#f59e0b',
    muted: '#a1a1c8',
    border: '#1e1e3f',
  },
  solarized: {
    background: '#fdf6e3',
    foreground: '#657b83',
    primary: '#268bd2',
    secondary: '#6c71c4',
    accent: '#2aa198',
    muted: '#93a1a1',
    border: '#eee8d5',
  },
  nord: {
    background: '#2e3440',
    foreground: '#eceff4',
    primary: '#88c0d0',
    secondary: '#b48ead',
    accent: '#a3be8c',
    muted: '#d8dee9',
    border: '#3b4252',
  },
  catppuccin: {
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    primary: '#89b4fa',
    secondary: '#cba6f7',
    accent: '#94e2d5',
    muted: '#a6adc8',
    border: '#313244',
  },
  dracula: {
    background: '#282a36',
    foreground: '#f8f8f2',
    primary: '#bd93f9',
    secondary: '#ff79c6',
    accent: '#8be9fd',
    muted: '#6272a4',
    border: '#44475a',
  },
  tokyonight: {
    background: '#1a1b26',
    foreground: '#c0caf5',
    primary: '#7aa2f7',
    secondary: '#bb9af7',
    accent: '#7dcfff',
    muted: '#565f89',
    border: '#24283b',
  },
};

export default function ThemeEditor() {
  const { setShowThemeEditor, updateConfig, config } = useStore();
  const [customColors, setCustomColors] = useState<ThemeColors>(
    presetThemes[config.theme] || presetThemes.dark
  );

  // Apply custom colors live to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(customColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [customColors]);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setCustomColors((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (themeName: string) => {
    setCustomColors(presetThemes[themeName]);
    updateConfig({ theme: themeName });
  };

  const saveCustomTheme = () => {
    // Save to localStorage for persistence
    localStorage.setItem('blueox-custom-theme', JSON.stringify(customColors));
    updateConfig({ theme: 'custom' });
  };

  const colorInputs: Array<{ key: keyof ThemeColors; label: string }> = [
    { key: 'background', label: 'Background' },
    { key: 'foreground', label: 'Foreground' },
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'muted', label: 'Muted' },
    { key: 'border', label: 'Border' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <Palette className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Theme Editor</h2>
          </div>
          <button
            onClick={() => setShowThemeEditor(false)}
            className="rounded-lg p-2 text-muted hover:bg-muted/10 hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {/* Preset themes */}
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Preset Themes
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {Object.keys(presetThemes).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => applyPreset(themeName)}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    config.theme === themeName
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="mb-2 flex gap-1">
                    {Object.values(presetThemes[themeName])
                      .slice(0, 5)
                      .map((color, i) => (
                        <div
                          key={i}
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                  <div className="text-xs font-medium capitalize text-foreground">
                    {themeName}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom colors */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Customize Colors
            </h3>
            <div className="space-y-4">
              {colorInputs.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={customColors[key]}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="#000000"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-10 w-10 rounded-lg border border-border"
                      style={{ backgroundColor: customColors[key] }}
                    />
                    <input
                      type="color"
                      value={customColors[key]}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded-lg border border-border"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
              <Eye size={16} />
              Live Preview
            </h3>
            <div className="rounded-lg border border-border p-4">
              <div className="mb-2 text-lg font-bold text-foreground">
                Sample Note Title
              </div>
              <div className="mb-4 text-sm text-muted">
                This is how your notes will look with the current theme
              </div>
              <div className="space-y-2">
                <div className="text-foreground">
                  Regular text with <span className="text-primary">primary</span>,{' '}
                  <span className="text-secondary">secondary</span>, and{' '}
                  <span className="text-accent">accent</span> colors.
                </div>
                <div className="rounded bg-muted/20 p-2 font-mono text-sm">
                  Code block example
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-6">
          <button
            onClick={() => setShowThemeEditor(false)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveCustomTheme}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary/90 transition-colors"
          >
            <Save size={16} />
            Save Custom Theme
          </button>
        </div>
      </div>
    </div>
  );
}
