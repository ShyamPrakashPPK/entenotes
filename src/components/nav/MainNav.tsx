'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';

export default function MainNav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Check if user is logged in by looking for token in localStorage
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
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

                <MobileNav isLoggedIn={isLoggedIn} onLogout={handleLogout} />

                <div className="hidden lg:flex lg:items-center lg:space-x-8 flex-grow justify-center">
                    {isLoggedIn ? (
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

                <div className="hidden lg:flex lg:items-center">
                    {isLoggedIn ? (
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