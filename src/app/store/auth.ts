import { create } from 'zustand';

interface User {
    name: string;
    email: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    setToken: (token) => {
        if (typeof window !== 'undefined') {
            token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
        }
        set({ token, isAuthenticated: !!token });
    },
    setUser: (user) => {
        if (typeof window !== 'undefined') {
            user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user');
        }
        set({ user });
    },
    isAuthenticated: !!(typeof window !== 'undefined' && localStorage.getItem('token')),
}));
