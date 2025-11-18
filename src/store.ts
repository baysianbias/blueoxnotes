import { create } from 'zustand';
import { AppConfig, loadConfig, saveConfig } from './config';
import { welcomeNote } from './utils/createWelcomeNote';

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  collapsed: boolean;
}

interface AppStore {
  // Notes
  notes: Note[];
  currentNoteId: string | null;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (id: string | null) => void;

  // Folders
  folders: Folder[];
  addFolder: (folder: Omit<Folder, 'id'>) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;

  // Config
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;

  // UI State
  showSettings: boolean;
  showThemeEditor: boolean;
  devMode: boolean;
  setShowSettings: (show: boolean) => void;
  setShowThemeEditor: (show: boolean) => void;
  setDevMode: (enabled: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Load initial data
const loadNotes = (): Note[] => {
  const stored = localStorage.getItem('blueox-notes');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  // Create welcome note on first launch
  const hasLaunched = localStorage.getItem('blueox-launched');
  if (!hasLaunched) {
    localStorage.setItem('blueox-launched', 'true');
    return [
      {
        ...welcomeNote,
        id: 'welcome',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
  }
  return [];
};

const loadFolders = (): Folder[] => {
  const stored = localStorage.getItem('blueox-folders');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [{ id: 'root', name: 'Notes', parentId: null, collapsed: false }];
    }
  }
  return [{ id: 'root', name: 'Notes', parentId: null, collapsed: false }];
};

export const useStore = create<AppStore>((set) => ({
  // Notes
  notes: loadNotes(),
  currentNoteId: null,

  addNote: (note) => {
    const id = generateId();
    const newNote: Note = {
      ...note,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => {
      const notes = [...state.notes, newNote];
      localStorage.setItem('blueox-notes', JSON.stringify(notes));
      return { notes, currentNoteId: id };
    });
    return id;
  },

  updateNote: (id, updates) => {
    set((state) => {
      const notes = state.notes.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      );
      localStorage.setItem('blueox-notes', JSON.stringify(notes));
      return { notes };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const notes = state.notes.filter((note) => note.id !== id);
      localStorage.setItem('blueox-notes', JSON.stringify(notes));
      return {
        notes,
        currentNoteId: state.currentNoteId === id ? null : state.currentNoteId,
      };
    });
  },

  setCurrentNote: (id) => set({ currentNoteId: id }),

  // Folders
  folders: loadFolders(),

  addFolder: (folder) => {
    const id = generateId();
    set((state) => {
      const folders = [...state.folders, { ...folder, id }];
      localStorage.setItem('blueox-folders', JSON.stringify(folders));
      return { folders };
    });
  },

  updateFolder: (id, updates) => {
    set((state) => {
      const folders = state.folders.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      );
      localStorage.setItem('blueox-folders', JSON.stringify(folders));
      return { folders };
    });
  },

  deleteFolder: (id) => {
    set((state) => {
      const folders = state.folders.filter((folder) => folder.id !== id);
      localStorage.setItem('blueox-folders', JSON.stringify(folders));
      return { folders };
    });
  },

  // Config
  config: loadConfig(),

  updateConfig: (updates) => {
    set((state) => {
      const config = { ...state.config, ...updates };
      saveConfig(config);
      return { config };
    });
  },

  // UI State
  showSettings: false,
  showThemeEditor: false,
  devMode: localStorage.getItem('blueox-devmode') === 'true',

  setShowSettings: (show) => set({ showSettings: show }),
  setShowThemeEditor: (show) => set({ showThemeEditor: show }),
  setDevMode: (enabled) => {
    localStorage.setItem('blueox-devmode', enabled.toString());
    set({ devMode: enabled });
  },

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
