import { useEffect, useState } from 'react';
import { useStore } from '../store';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return '';
  },
});

export default function Preview() {
  const { notes, currentNoteId } = useStore();
  const [html, setHtml] = useState('');

  const currentNote = notes.find((n) => n.id === currentNoteId);

  useEffect(() => {
    if (currentNote) {
      setHtml(md.render(currentNote.content));
    }
  }, [currentNote?.content]);

  if (!currentNote) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted">No note selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Preview header */}
      <div className="border-b border-border p-4">
        <h2 className="text-xl font-bold text-foreground">Preview</h2>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="prose prose-lg max-w-none p-6 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            colorScheme: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
