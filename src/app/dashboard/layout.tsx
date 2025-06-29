'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth';
import { showToast } from '@/components/ui/Toast';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    const { token, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated) {
            showToast('Please login to access the dashboard', 'error');
            router.replace('/login');
        }
    }, [isAuthenticated, router]);

    if (!mounted) {
        return null;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
} 