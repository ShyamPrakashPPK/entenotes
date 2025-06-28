'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth';
import Sidebar from './sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    const token = useAuthStore((state) => state.token);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (!token) {
            router.push('/login');
        }
    }, [token, router]);

    // Don't render anything until after hydration
    if (!mounted) {
        return null;
    }

    if (!token) {
        return null;
    }

    return (
        <div className="flex min-h-screen ">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
} 