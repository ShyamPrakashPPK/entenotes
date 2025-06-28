import { create } from 'zustand';

export interface Note {
    _id: string;
    title: string;
    content: string;
    updatedAt: string;
}

interface NoteStore {
    notes: Note[];
    selectedNote: Note | null;
    setNotes: (notes: Note[]) => void;
    setSelectedNote: (note: Note | null) => void;
    updateSelectedContent: (content: string) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
    notes: [],
    selectedNote: null,
    setNotes: (notes) => set({ notes }),
    setSelectedNote: (note) => set({ selectedNote: note }),
    updateSelectedContent: (content) =>
        set((state) => ({
            selectedNote: state.selectedNote
                ? { ...state.selectedNote, content, updatedAt: new Date().toISOString() }
                : null,
        })),
}));
