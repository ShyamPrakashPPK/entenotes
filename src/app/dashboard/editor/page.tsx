'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth';
import BackgroundGradient from '@/components/ui/BackgroundGradient';
import { Editor } from '@/components/ui/Editor';
import axiosInstance from '@/lib/axios';
import { showToast } from '@/components/ui/Toast';

interface Note {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export default function NewNotePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('<p>Start writing your note here...</p>');
    const [error, setError] = useState('');
    const token = useAuthStore((state) => state.token);
    const router = useRouter();

    const handleChange = (newContent: string) => {
        setContent(newContent);
        setError('');
    };

    const handlePublish = async () => {
        if (!token) return;

        if (!title.trim()) {
            showToast('Please enter a title for your note', 'error');
            return;
        }

        if (!content.trim() || content === '<p>Start writing your note here...</p>') {
            showToast('Please add some content to your note', 'error');
            return;
        }

        try {
            const payload = {
                title: title.trim() || 'Untitled Note',
                content: content.trim()
            };

            const response = await axiosInstance.post<Note>('/notes', payload);
            const savedNote = response as unknown as Note;

            if (savedNote._id) {
                showToast('Note published successfully', 'success');
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Error publishing note:', error);
            showToast(error.response?.data?.message || 'Failed to publish note', 'error');
        }
    };

    return (
        <div className="min-h-screen">
            <BackgroundGradient />
            <div className="mx-auto max-w-4xl px-6 py-8">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Untitled Note"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setError('');
                            }}
                            className="bg-transparent text-2xl font-semibold text-white border-none outline-none placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1 w-full max-w-md"
                        />
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePublish}
                                className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
                    <Editor
                        value={content}
                        onChange={handleChange}
                        placeholder="Start writing here..."
                    />
                </div>
            </div>
        </div>
    );
} 