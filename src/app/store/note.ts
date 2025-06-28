import { create } from 'zustand';
import { useReducer } from 'react';

export interface Note {
    _id: string;
    title: string;
    content: string;
    updatedAt: string;
    createdAt: string;
    tags?: string[];
    isShared?: boolean;
    collaborators?: string[];
}

interface NoteStore {
    notes: Note[];
    selectedNote: Note | null;
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    sortBy: 'updatedAt' | 'createdAt' | 'title';
    sortOrder: 'asc' | 'desc';

    // Actions
    setNotes: (notes: Note[]) => void;
    addNote: (note: Note) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    setSelectedNote: (note: Note | null) => void;
    updateSelectedContent: (content: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSearchQuery: (query: string) => void;
    setSortBy: (sortBy: 'updatedAt' | 'createdAt' | 'title') => void;
    setSortOrder: (order: 'asc' | 'desc') => void;
    filteredNotes: () => Note[];
    sortedNotes: () => Note[];
}

export const useNoteStore = create<NoteStore>((set, get) => ({
    notes: [],
    selectedNote: null,
    isLoading: false,
    error: null,
    searchQuery: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',

    setNotes: (notes) => set({ notes, error: null }),

    addNote: (note) =>
        set((state) => ({
            notes: [note, ...state.notes],
            error: null
        })),

    updateNote: (id, updates) =>
        set((state) => ({
            notes: state.notes.map(note =>
                note._id === id
                    ? { ...note, ...updates, updatedAt: new Date().toISOString() }
                    : note
            ),
            selectedNote: state.selectedNote?._id === id
                ? { ...state.selectedNote, ...updates, updatedAt: new Date().toISOString() }
                : state.selectedNote,
            error: null
        })),

    deleteNote: (id) =>
        set((state) => ({
            notes: state.notes.filter(note => note._id !== id),
            selectedNote: state.selectedNote?._id === id ? null : state.selectedNote,
            error: null
        })),

    setSelectedNote: (note) => set({ selectedNote: note }),

    updateSelectedContent: (content) =>
        set((state) => ({
            selectedNote: state.selectedNote
                ? { ...state.selectedNote, content, updatedAt: new Date().toISOString() }
                : null,
        })),

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (sortOrder) => set({ sortOrder }),

    filteredNotes: () => {
        const { notes, searchQuery } = get();
        if (!searchQuery.trim()) return notes;

        const query = searchQuery.toLowerCase();
        return notes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags?.some(tag => tag.toLowerCase().includes(query))
        );
    },

    sortedNotes: () => {
        const { filteredNotes, sortBy, sortOrder } = get();
        const notes = filteredNotes();

        return [...notes].sort((a, b) => {
            let aValue: string | Date;
            let bValue: string | Date;

            switch (sortBy) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                case 'updatedAt':
                default:
                    aValue = new Date(a.updatedAt);
                    bValue = new Date(b.updatedAt);
                    break;
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }
}));

export type NoteFormAction =
    | { type: 'SET_TITLE'; payload: string }
    | { type: 'SET_CONTENT'; payload: string }
    | { type: 'ADD_TAG'; payload: string }
    | { type: 'REMOVE_TAG'; payload: string }
    | { type: 'SET_TAGS'; payload: string[] }
    | { type: 'TOGGLE_SHARED'; }
    | { type: 'ADD_COLLABORATOR'; payload: string }
    | { type: 'REMOVE_COLLABORATOR'; payload: string }
    | { type: 'RESET_FORM'; }
    | { type: 'LOAD_NOTE'; payload: Note }
    | { type: 'SET_VALIDATION_ERROR'; payload: { field: string; message: string } }
    | { type: 'CLEAR_VALIDATION_ERRORS'; };

export interface NoteFormState {
    title: string;
    content: string;
    tags: string[];
    isShared: boolean;
    collaborators: string[];
    validationErrors: Record<string, string>;
    isDirty: boolean;
}

export const initialNoteFormState: NoteFormState = {
    title: '',
    content: '',
    tags: [],
    isShared: false,
    collaborators: [],
    validationErrors: {},
    isDirty: false
};

export function noteFormReducer(state: NoteFormState, action: NoteFormAction): NoteFormState {
    switch (action.type) {
        case 'SET_TITLE':
            return {
                ...state,
                title: action.payload,
                isDirty: true,
                validationErrors: { ...state.validationErrors, title: '' }
            };

        case 'SET_CONTENT':
            return {
                ...state,
                content: action.payload,
                isDirty: true,
                validationErrors: { ...state.validationErrors, content: '' }
            };

        case 'ADD_TAG':
            if (!action.payload.trim() || state.tags.includes(action.payload)) {
                return state;
            }
            return {
                ...state,
                tags: [...state.tags, action.payload.trim()],
                isDirty: true
            };

        case 'REMOVE_TAG':
            return {
                ...state,
                tags: state.tags.filter(tag => tag !== action.payload),
                isDirty: true
            };

        case 'SET_TAGS':
            return {
                ...state,
                tags: action.payload,
                isDirty: true
            };

        case 'TOGGLE_SHARED':
            return {
                ...state,
                isShared: !state.isShared,
                isDirty: true
            };

        case 'ADD_COLLABORATOR':
            if (!action.payload.trim() || state.collaborators.includes(action.payload)) {
                return state;
            }
            return {
                ...state,
                collaborators: [...state.collaborators, action.payload.trim()],
                isDirty: true
            };

        case 'REMOVE_COLLABORATOR':
            return {
                ...state,
                collaborators: state.collaborators.filter(collab => collab !== action.payload),
                isDirty: true
            };

        case 'RESET_FORM':
            return initialNoteFormState;

        case 'LOAD_NOTE':
            return {
                title: action.payload.title,
                content: action.payload.content,
                tags: action.payload.tags || [],
                isShared: action.payload.isShared || false,
                collaborators: action.payload.collaborators || [],
                validationErrors: {},
                isDirty: false
            };

        case 'SET_VALIDATION_ERROR':
            return {
                ...state,
                validationErrors: {
                    ...state.validationErrors,
                    [action.payload.field]: action.payload.message
                }
            };

        case 'CLEAR_VALIDATION_ERRORS':
            return {
                ...state,
                validationErrors: {}
            };

        default:
            return state;
    }
}

export function useNoteForm(initialNote?: Note) {
    const [state, dispatch] = useReducer(
        noteFormReducer,
        initialNote ? {
            title: initialNote.title,
            content: initialNote.content,
            tags: initialNote.tags || [],
            isShared: initialNote.isShared || false,
            collaborators: initialNote.collaborators || [],
            validationErrors: {},
            isDirty: false
        } : initialNoteFormState
    );

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!state.title.trim()) {
            errors.title = 'Title is required';
        } else if (state.title.length > 100) {
            errors.title = 'Title must be less than 100 characters';
        }

        if (!state.content.trim()) {
            errors.content = 'Content is required';
        }

        if (state.isShared && state.collaborators.length === 0) {
            errors.collaborators = 'At least one collaborator is required for shared notes';
        }

        Object.entries(errors).forEach(([field, message]) => {
            dispatch({ type: 'SET_VALIDATION_ERROR', payload: { field, message } });
        });

        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        dispatch({ type: 'RESET_FORM' });
    };

    const loadNote = (note: Note) => {
        dispatch({ type: 'LOAD_NOTE', payload: note });
    };

    return {
        state,
        dispatch,
        validateForm,
        resetForm,
        loadNote,
        isValid: Object.keys(state.validationErrors).length === 0
    };
}
