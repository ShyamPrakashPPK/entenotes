import axios from './axios';
import { Note } from '@/app/store/note';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export interface ShareNotePayload {
    email: string;
    permission?: 'view' | 'edit';
}

// Auth API
export const authAPI = {
    login: (payload: LoginPayload) =>
        axios.post('/auth/login', payload),

    register: (payload: RegisterPayload) =>
        axios.post('/auth/register', payload),
};

// Notes API
export const notesAPI = {
    getNotes: () =>
        axios.get('/notes'),

    getNote: (id: string) =>
        axios.get(`/notes/${id}`),

    createNote: (payload: Partial<Note>) =>
        axios.post('/notes', payload),

    updateNote: (id: string, payload: Partial<Note>) =>
        axios.put(`/notes/${id}`, payload),

    deleteNote: (id: string) =>
        axios.delete(`/notes/${id}`),

    shareNote: (id: string, payload: ShareNotePayload) =>
        axios.post(`/notes/${id}/share`, payload),

    getStats: () =>
        axios.get('/notes/stats'),
}; 