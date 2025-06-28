'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import MobileNav from './MobileNav';
import { useAuthStore } from '@/app/store/auth';
import { showToast } from '@/components/ui/Toast';

export default function MainNav() {
    const { isAuthenticated, logout } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        showToast('Logged out successfully', 'success');
        router.push('/login');
    };

    return (
        <header className="z-50 bg-[#151415] bg-opacity-70 backdrop-blur-sm">
            <nav className="container mx-auto flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex-shrink-0">
                    <Link href="/">
                        <h1 className='text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-gray-500 hover:text-white transition-colors duration-300 ease-in-out font-extrabold'>
                            ente notes
                        </h1>
                    </Link>
                </div>

                <MobileNav isLoggedIn={isAuthenticated} onLogout={handleLogout} />

                <div className="hidden lg:flex lg:gap-x-12">
                    {isAuthenticated ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-semibold text-white hover:text-gray-300">
                                Dashboard
                            </Link>
                            <Link href="/simple" className="text-sm font-semibold text-white hover:text-gray-300">
                                Simple Notes
                            </Link>
                            <Link href="/test" className="text-sm font-semibold text-white hover:text-gray-300">
                                Test Editor
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/features" className="text-sm font-semibold text-white hover:text-gray-300">
                                Features
                            </Link>
                            <Link href="/pricing" className="text-sm font-semibold text-white hover:text-gray-300">
                                Pricing
                            </Link>
                            <Link href="/about" className="text-sm font-semibold text-white hover:text-gray-300">
                                About
                            </Link>
                        </>
                    )}
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="text-sm font-semibold text-white hover:text-gray-300"
                        >
                            Log out <span aria-hidden="true">&rarr;</span>
                        </button>
                    ) : (
                        pathname !== '/login' && pathname !== '/register' && (
                            <Link href="/login" className="text-sm font-semibold text-white hover:text-gray-300">
                                Log in <span aria-hidden="true">&rarr;</span>
                            </Link>
                        )
                    )}
                </div>
            </nav>
        </header>
    );
} 