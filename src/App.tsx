import { useEffect, useState } from 'react';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ThemeEditor from './components/ThemeEditor';
import Settings from './components/Settings';
import DevPanel from './components/DevPanel';
import { Widget, WidgetView } from './components/Widget';

function App() {
  const { config, showThemeEditor, showSettings, devMode } = useStore();
  const [widgets, setWidgets] = useState<Widget[]>([]);

  // Load widgets
  useEffect(() => {
    const loadWidgets = () => {
      const stored = localStorage.getItem('blueox-widgets');
      if (stored) {
        try {
          setWidgets(JSON.parse(stored));
        } catch {
          setWidgets([]);
        }
      }
    };

    loadWidgets();

    // Listen for widget updates
    const handleWidgetUpdate = () => loadWidgets();
    window.addEventListener('widgets-updated', handleWidgetUpdate);
    return () => window.removeEventListener('widgets-updated', handleWidgetUpdate);
  }, []);

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, ...updates } : w));
    setWidgets(updated);
    localStorage.setItem('blueox-widgets', JSON.stringify(updated));
  };

  const deleteWidget = (id: string) => {
    const updated = widgets.filter((w) => w.id !== id);
    setWidgets(updated);
    localStorage.setItem('blueox-widgets', JSON.stringify(updated));
  };

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.className = '';

    if (config.theme === 'dark') {
      root.classList.add('dark');
    } else if (config.theme !== 'light') {
      root.classList.add(`theme-${config.theme}`);
    }

    // Apply custom CSS variables from config
    root.style.setProperty('--sidebar-width', `${config.sidebarWidth}px`);
    root.style.setProperty('--editor-font-size', `${config.editorFontSize}px`);
    root.style.setProperty('--line-height', config.lineHeight.toString());
  }, [config]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + , for settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        useStore.getState().setShowSettings(true);
      }

      // Cmd/Ctrl + Shift + T for theme editor
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        useStore.getState().setShowThemeEditor(!showThemeEditor);
      }

      // Cmd/Ctrl + Shift + D for dev mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        useStore.getState().setDevMode(!devMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showThemeEditor, devMode]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar />

      <div className="flex flex-1 overflow-hidden">
        {config.defaultView === 'split' ? (
          <>
            <div className="flex-1 overflow-hidden">
              <Editor />
            </div>
            <div className="flex-1 overflow-hidden border-l border-border">
              <Preview />
            </div>
          </>
        ) : config.defaultView === 'editor' ? (
          <div className="flex-1 overflow-hidden">
            <Editor />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <Preview />
          </div>
        )}
      </div>

      {/* Modals and overlays */}
      {showThemeEditor && <ThemeEditor />}
      {showSettings && <Settings />}
      {devMode && <DevPanel />}

      {/* Widgets */}
      {widgets.map((widget) => (
        <WidgetView
          key={widget.id}
          widget={widget}
          onUpdate={updateWidget}
          onDelete={deleteWidget}
        />
      ))}
    </div>
  );
}

export default App;
