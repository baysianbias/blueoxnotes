import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';

export default function Editor() {
  const { notes, currentNoteId, updateNote, config } = useStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localContent, setLocalContent] = useState('');
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const currentNote = notes.find((n) => n.id === currentNoteId);

  useEffect(() => {
    if (currentNote) {
      setLocalContent(currentNote.content);
    }
  }, [currentNote?.id]);

  useEffect(() => {
    if (!currentNote) return;

    if (config.autoSave) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        if (localContent !== currentNote.content) {
          updateNote(currentNote.id, { content: localContent });

          // Update title from first heading
          const firstLine = localContent.split('\n')[0];
          const title = firstLine.replace(/^#\s*/, '').trim() || 'Untitled Note';
          if (title !== currentNote.title) {
            updateNote(currentNote.id, { title });
          }
        }
      }, config.autoSaveInterval);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [localContent, currentNote, config.autoSave, config.autoSaveInterval]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
  };

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setLocalContent(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  if (!currentNote) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted">Select a note to start editing</p>
          <p className="mt-2 text-sm text-muted">Or create a new one from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Editor header */}
      <div className="border-b border-border p-4">
        <input
          type="text"
          value={currentNote.title}
          onChange={(e) => updateNote(currentNote.id, { title: e.target.value })}
          className="w-full bg-transparent text-2xl font-bold text-foreground placeholder-muted focus:outline-none"
          placeholder="Untitled Note"
        />
        <div className="mt-2 text-xs text-muted">
          Last edited {new Date(currentNote.updatedAt).toLocaleString()}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="h-full w-full resize-none bg-background p-6 font-mono text-foreground focus:outline-none"
          style={{
            fontSize: `${config.editorFontSize}px`,
            lineHeight: config.lineHeight,
            fontFamily: config.editorFontFamily,
          }}
          placeholder="Start writing..."
          spellCheck={config.spellCheck}
        />
      </div>
    </div>
  );
}
