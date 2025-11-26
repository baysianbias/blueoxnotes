import { useState, useRef, useEffect } from 'react';
import { X, GripVertical, Plus } from 'lucide-react';

export interface Widget {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

interface WidgetViewProps {
  widget: Widget;
  onUpdate: (id: string, updates: Partial<Widget>) => void;
  onDelete: (id: string) => void;
}

export function WidgetView({ widget, onUpdate, onDelete }: WidgetViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
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
        onUpdate(widget.id, {
          x: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - widget.width)),
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
  }, [isDragging, dragOffset, widget.id, widget.width, onUpdate]);

  return (
    <div
      ref={widgetRef}
      className="fixed z-50 rounded-lg border border-border bg-background shadow-2xl"
      style={{
        left: `${widget.x}px`,
        top: `${widget.y}px`,
        width: `${widget.width}px`,
        height: `${widget.height}px`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-border bg-secondary/10 px-3 py-2 cursor-grab active:cursor-grabbing rounded-t-lg"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="text-muted" size={14} />
          <span className="text-xs font-semibold text-foreground">{widget.title}</span>
        </div>
        <button
          onClick={() => onDelete(widget.id)}
          className="rounded p-1 text-muted hover:bg-muted/10 hover:text-foreground transition-colors"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <iframe
        src={widget.url}
        className="w-full h-[calc(100%-40px)] rounded-b-lg"
        title={widget.title}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}

interface WidgetManagerProps {
  onClose: () => void;
}

export function WidgetManager({ onClose }: WidgetManagerProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    const newWidget: Widget = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      url,
      width,
      height,
      x: 100,
      y: 100,
    };

    // Save to localStorage
    const widgets = JSON.parse(localStorage.getItem('blueox-widgets') || '[]');
    widgets.push(newWidget);
    localStorage.setItem('blueox-widgets', JSON.stringify(widgets));

    // Trigger re-render
    window.dispatchEvent(new CustomEvent('widgets-updated'));

    // Reset form
    setUrl('');
    setTitle('');
    setWidth(600);
    setHeight(400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Plus className="text-primary" size={20} />
            <h2 className="text-lg font-bold text-foreground">Add Widget</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-muted/10 hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Widget Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="My Figma Widget"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="https://figma.com/embed/..."
              required
            />
            <p className="mt-1 text-xs text-muted">
              💡 For Figma: Share → Copy embed code → Extract URL
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Width (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                min="200"
                max="1200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Height (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                min="200"
                max="1000"
              />
            </div>
          </div>

          <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
            <p className="text-xs text-foreground">
              <strong>🧪 Experimental Feature</strong>
            </p>
            <p className="mt-1 text-xs text-muted">
              Widgets let you embed external content (Figma, CodePen, etc.) in floating windows.
              Drag the header to move them around!
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-muted/10 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary/90 transition-colors"
            >
              Add Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
