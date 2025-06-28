"use client"
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const baseClasses = "fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50";
    const typeClasses = {
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
        info: "bg-blue-600 text-white"
    };
    const visibilityClasses = isVisible
        ? "translate-y-0 opacity-100"
        : "translate-y-2 opacity-0";

    const icon = {
        success: (
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        )
    };

    return createPortal(
        <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`}>
            <div className="flex items-center gap-2">
                {icon[type]}
                <p className="text-sm font-medium">{message}</p>
            </div>
        </div>,
        document.body
    );
};

// Toast manager to handle multiple toasts
type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
};

let toastCount = 0;
const toastEventTarget = new EventTarget();
const TOAST_EVENT = 'show-toast';

export const showToast = (message: string, type: ToastType = 'info') => {
    const event = new CustomEvent(TOAST_EVENT, {
        detail: { message, type, id: ++toastCount }
    });
    toastEventTarget.dispatchEvent(event);
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        const handleToast = (event: Event) => {
            const { message, type, id } = (event as CustomEvent).detail;
            setToasts(prev => [...prev, { message, type, id }]);
        };

        toastEventTarget.addEventListener(TOAST_EVENT, handleToast);
        return () => toastEventTarget.removeEventListener(TOAST_EVENT, handleToast);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <>
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );
}; 