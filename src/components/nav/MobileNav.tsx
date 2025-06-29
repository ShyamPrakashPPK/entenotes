'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
    _id: string;
    username: string;
    email: string;
}

interface MobileNavProps {
    isLoggedIn: boolean;
    user: User | null;
    onLogout: () => void;
}

export default function MobileNav({ isLoggedIn, user, onLogout }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="lg:hidden">
            <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="sr-only">Open main menu</span>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setIsOpen(false)}>
                                <span className="sr-only">Notes App</span>
                                <Image
                                    src="/file.svg"
                                    alt="Notes App Logo"
                                    width={32}
                                    height={32}
                                    className="h-8 w-auto text-white"
                                />
                            </Link>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-700">
                                <div className="space-y-2 py-6">
                                    {isLoggedIn ? (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/simple"
                                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Simple Notes
                                            </Link>
                                            <Link
                                                href="/test"
                                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Test Editor
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/features"
                                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Features
                                            </Link>
                                            <Link
                                                href="/pricing"
                                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Pricing
                                            </Link>
                                            <Link
                                                href="/about"
                                                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                About
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <div className="py-6">
                                    {isLoggedIn ? (
                                        <>
                                            {user && (
                                                <div className="px-3 py-2 mb-3 border-b border-gray-700">
                                                    <div className="text-sm text-gray-300">Welcome,</div>
                                                    <div className="text-base font-semibold text-white">{user.username || user.email}</div>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => {
                                                    onLogout();
                                                    setIsOpen(false);
                                                }}
                                                className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                            >
                                                Log out
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 