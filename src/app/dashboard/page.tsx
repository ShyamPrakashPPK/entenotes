'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import BackgroundGradient from '@/components/ui/BackgroundGradient';
import Link from 'next/link';

interface Stats {
    totalNotes: number;
    sharedNotes: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({ totalNotes: 0, sharedNotes: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;

            try {
                const res = await fetch('http://localhost:3052/api/notes/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch stats');

                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    return (
        <div className="min-h-screen relative isolate">
            
            <BackgroundGradient />
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                    <Link
                        href="/dashboard/editor"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Create New Note
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
                            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                            <div className="h-10 bg-gray-700 rounded w-1/4"></div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
                            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                            <div className="h-10 bg-gray-700 rounded w-1/4"></div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-red-400 bg-red-400/10 rounded-lg p-4">
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-300 mb-2">
                                Total Notes
                            </h2>
                            <p className="text-3xl font-bold text-white">
                                {stats.totalNotes}
                            </p>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-300 mb-2">
                                Shared Notes
                            </h2>
                            <p className="text-3xl font-bold text-white">
                                {stats.sharedNotes}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
