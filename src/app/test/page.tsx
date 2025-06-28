'use client';

export default function TestPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind Test</h1>
                <p className="text-gray-600">If you can see this styled, Tailwind is working!</p>
                <div className="mt-4 space-y-2">
                    <div className="bg-red-100 text-red-800 p-2 rounded">Red</div>
                    <div className="bg-blue-100 text-blue-800 p-2 rounded">Blue</div>
                    <div className="bg-green-100 text-green-800 p-2 rounded">Green</div>
                </div>
            </div>
        </div>
    );
} 