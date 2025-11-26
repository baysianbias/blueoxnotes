import { useState } from 'react';
import { useStore } from '../store';
import { FileText, Plus, Search, Settings, Palette, Code, Boxes } from 'lucide-react';
import { WidgetManager } from './Widget';

export default function Sidebar() {
  const {
    notes,
    currentNoteId,
    addNote,
    setCurrentNote,
    searchQuery,
    setSearchQuery,
    setShowSettings,
    setShowThemeEditor,
    devMode,
    setDevMode,
  } = useStore();

  const [localSearch, setLocalSearch] = useState('');
  const [showWidgetManager, setShowWidgetManager] = useState(false);

  const handleSearch = (query: string) => {
    setLocalSearch(query);
    setSearchQuery(query);
  };

  const handleNewNote = () => {
    const id = addNote({
      title: 'Untitled Note',
      content: '# New Note\n\nStart writing...',
      folder: 'root',
      tags: [],
    });
    setCurrentNote(id);
  };

  const filteredNotes = notes.filter((note) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div
      className="flex h-full flex-col border-r border-border bg-background"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground">BlueOx</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowWidgetManager(true)}
            className="rounded p-1.5 hover:bg-accent/20 text-muted hover:text-accent transition-colors"
            title="Widgets 🧪"
          >
            <Boxes size={18} />
          </button>
          <button
            onClick={() => setShowThemeEditor(true)}
            className="rounded p-1.5 hover:bg-primary/10 text-muted hover:text-primary transition-colors"
            title="Theme Editor (⌘⇧T)"
          >
            <Palette size={18} />
          </button>
          <button
            onClick={() => setDevMode(!devMode)}
            className={`rounded p-1.5 transition-colors ${
              devMode
                ? 'bg-accent text-background'
                : 'hover:bg-primary/10 text-muted hover:text-primary'
            }`}
            title="Dev Mode (⌘⇧D)"
          >
            <Code size={18} />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="rounded p-1.5 hover:bg-primary/10 text-muted hover:text-primary transition-colors"
            title="Settings (⌘,)"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            size={16}
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground placeholder-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Notes ({filteredNotes.length})
          </span>
          <button
            onClick={handleNewNote}
            className="rounded p-1 hover:bg-primary/10 text-muted hover:text-primary transition-colors"
            title="New Note"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setCurrentNote(note.id)}
              className={`w-full rounded-lg p-3 text-left transition-all ${
                currentNoteId === note.id
                  ? 'bg-primary text-background shadow-md'
                  : 'hover:bg-muted/10'
              }`}
            >
              <div className="flex items-start gap-2">
                <FileText
                  size={16}
                  className={`mt-0.5 flex-shrink-0 ${
                    currentNoteId === note.id ? 'text-background' : 'text-muted'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={`truncate text-sm font-medium ${
                      currentNoteId === note.id ? 'text-background' : 'text-foreground'
                    }`}
                  >
                    {note.title}
                  </div>
                  <div
                    className={`mt-1 truncate text-xs ${
                      currentNoteId === note.id
                        ? 'text-background/70'
                        : 'text-muted'
                    }`}
                  >
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="mt-8 text-center">
            <FileText className="mx-auto mb-2 text-muted" size={48} />
            <p className="text-sm text-muted">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleNewNote}
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-primary/90 transition-colors"
              >
                Create your first note
              </button>
            )}
          </div>
        )}
      </div>

      {/* Widget Manager Modal */}
      {showWidgetManager && <WidgetManager onClose={() => setShowWidgetManager(false)} />}
    </div>
  );
}
