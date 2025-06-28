import axios from 'axios';
import { useAuthStore } from '@/app/store/auth';

const API_URL = 'http://localhost:3052/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log(token," asdflkasdjflksdajf");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth state and redirect to login
            useAuthStore.getState().setToken(null);
            useAuthStore.getState().setUser(null);
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
    }
);

export default axiosInstance; 