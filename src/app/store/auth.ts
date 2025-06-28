import { create } from 'zustand';

interface User {
    _id: string;
    username: string;
    email: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    logout: () => void;
}

// Initialize state from localStorage
const getInitialState = () => {
    if (typeof window === 'undefined') {
        return {
            token: null,
            user: null,
            isAuthenticated: false
        };
    }

    const token = localStorage.getItem('token');
    let user = null;
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            user = JSON.parse(userStr);
        }
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
    }

    return {
        token,
        user,
        isAuthenticated: !!token
    };
};

export const useAuthStore = create<AuthState>((set) => ({
    ...getInitialState(),
    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        set({ token, isAuthenticated: !!token });
    },
    setUser: (user) => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        set({ user });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null, isAuthenticated: false });
    }
}));
