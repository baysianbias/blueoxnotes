import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Code, Database, Paintbrush, X, Copy, Check, GripVertical } from 'lucide-react';

type Tab = 'config' | 'state' | 'css';

export default function DevPanel() {
  const { setDevMode, config, notes } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('config');
  const [copied, setCopied] = useState(false);

  // Draggable state
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 400)),
          y: Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCSSVariables = () => {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const cssVars: Record<string, string> = {};

    // Get all custom properties
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        if (!sheet.cssRules) continue;

        for (let j = 0; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules[j];
          if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
            const style = rule.style;
            for (let k = 0; k < style.length; k++) {
              const prop = style[k];
              if (prop.startsWith('--color-')) {
                cssVars[prop] = styles.getPropertyValue(prop).trim();
              }
            }
          }
        }
      } catch (e) {
        // Skip stylesheets we can't access
      }
    }

    return cssVars;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'config':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Live Configuration
              </h3>
              <button
                onClick={() => handleCopy(JSON.stringify(config, null, 2))}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted hover:bg-muted/10 hover:text-foreground transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-auto rounded-lg bg-foreground/5 p-4 text-xs font-mono">
              {JSON.stringify(config, null, 2)}
            </pre>
            <div className="rounded-lg border border-border bg-accent/10 p-3">
              <p className="text-xs text-muted">
                💡 <strong>Tip:</strong> Changes made in Settings are reflected here
                instantly. This config is stored in localStorage and persists across
                sessions.
              </p>
            </div>
          </div>
        );

      case 'state':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Application State
              </h3>
              <button
                onClick={() =>
                  handleCopy(
                    JSON.stringify({ noteCount: notes.length, notes }, null, 2)
                  )
                }
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted hover:bg-muted/10 hover:text-foreground transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold text-primary">{notes.length}</div>
                <div className="text-xs text-muted">Total Notes</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold text-secondary">
                  {(
                    notes.reduce((acc, note) => acc + note.content.length, 0) / 1024
                  ).toFixed(1)}
                  kb
                </div>
                <div className="text-xs text-muted">Total Content</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
                Recent Notes
              </h4>
              <div className="space-y-2">
                {notes
                  .slice()
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .slice(0, 5)
                  .map((note) => (
                    <div
                      key={note.id}
                      className="rounded border border-border p-2 text-xs"
                    >
                      <div className="font-medium text-foreground">{note.title}</div>
                      <div className="text-muted">
                        {new Date(note.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <pre className="overflow-auto rounded-lg bg-foreground/5 p-4 text-xs font-mono">
              {JSON.stringify({ noteCount: notes.length }, null, 2)}
            </pre>
          </div>
        );

      case 'css':
        const cssVars = getCSSVariables();
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Active CSS Variables
              </h3>
              <button
                onClick={() =>
                  handleCopy(
                    Object.entries(cssVars)
                      .map(([key, value]) => `${key}: ${value};`)
                      .join('\n')
                  )
                }
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted hover:bg-muted/10 hover:text-foreground transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(cssVars).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded border border-border p-2"
                >
                  <code className="text-xs font-mono text-muted">{key}</code>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-foreground">{value}</code>
                    <div
                      className="h-6 w-6 rounded border border-border"
                      style={{ backgroundColor: value }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-accent/10 p-3">
              <p className="text-xs text-muted">
                💡 <strong>Tip:</strong> These CSS variables update live when you
                change themes. Open the Theme Editor (⌘⇧T) to modify them in
                real-time!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      ref={panelRef}
      className="fixed z-40 w-96 rounded-lg border border-border bg-background shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-border bg-primary/5 px-4 py-3 cursor-grab active:cursor-grabbing rounded-t-lg"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="text-muted" size={16} />
          <Code className="text-primary" size={18} />
          <span className="text-sm font-semibold text-foreground">Dev Panel</span>
        </div>
        <button
          onClick={() => setDevMode(false)}
          className="rounded p-1 text-muted hover:bg-muted/10 hover:text-foreground transition-colors"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
            activeTab === 'config'
              ? 'border-b-2 border-primary bg-primary/5 text-primary'
              : 'text-muted hover:bg-muted/5 hover:text-foreground'
          }`}
        >
          <Database size={14} />
          Config
        </button>
        <button
          onClick={() => setActiveTab('state')}
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
            activeTab === 'state'
              ? 'border-b-2 border-primary bg-primary/5 text-primary'
              : 'text-muted hover:bg-muted/5 hover:text-foreground'
          }`}
        >
          <Database size={14} />
          State
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
            activeTab === 'css'
              ? 'border-b-2 border-primary bg-primary/5 text-primary'
              : 'text-muted hover:bg-muted/5 hover:text-foreground'
          }`}
        >
          <Paintbrush size={14} />
          CSS
        </button>
      </div>

      {/* Content */}
      <div className="h-96 overflow-y-auto p-4 rounded-b-lg">{renderContent()}</div>
    </div>
  );
}
