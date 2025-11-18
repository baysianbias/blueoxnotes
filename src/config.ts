// This config file can be modified through the UI!
// Changes made in the app will be written back here

export interface AppConfig {
  theme: string;
  sidebarWidth: number;
  editorFontSize: number;
  editorFontFamily: string;
  lineHeight: number;
  showLineNumbers: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
  vimMode: boolean;
  spellCheck: boolean;
  livePreview: boolean;
  defaultView: 'editor' | 'split' | 'preview';
}

export const defaultConfig: AppConfig = {
  theme: 'dark',
  sidebarWidth: 280,
  editorFontSize: 16,
  editorFontFamily: 'JetBrains Mono',
  lineHeight: 1.6,
  showLineNumbers: true,
  autoSave: true,
  autoSaveInterval: 2000,
  vimMode: false,
  spellCheck: true,
  livePreview: true,
  defaultView: 'split',
};

// Load config from localStorage (or use default)
export function loadConfig(): AppConfig {
  const stored = localStorage.getItem('blueox-config');
  if (stored) {
    try {
      return { ...defaultConfig, ...JSON.parse(stored) };
    } catch {
      return defaultConfig;
    }
  }
  return defaultConfig;
}

// Save config to localStorage
export function saveConfig(config: AppConfig): void {
  localStorage.setItem('blueox-config', JSON.stringify(config));
}
