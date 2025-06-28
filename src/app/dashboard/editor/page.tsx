'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth';
import BackgroundGradient from '@/components/ui/BackgroundGradient';
import { Editor } from '@/components/ui/Editor';
import SaveIndicator from '@/components/ui/SaveIndicator';
import { useAutoSave } from '@/hooks/use-auto-save';
import { getSocket } from '@/lib/socket';

export default function NewNotePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('<p>Start writing your note here...</p>');
    const [error, setError] = useState('');
    const [noteId, setNoteId] = useState<string | null>(null);
    const token = useAuthStore((state) => state.token);
    const router = useRouter();
    const socket = getSocket();

    const handleSave = async (newContent: string) => {
        if (!token) return;
        if (!title.trim() && newContent === '<p>Start writing your note here...</p>') return;

        try {
            const method = noteId ? 'PUT' : 'POST';
            const url = noteId
                ? `http://localhost:3052/api/notes/${noteId}`
                : 'http://localhost:3052/api/notes';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title.trim() || 'Untitled Note',
                    content: newContent.trim()
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to save note');
            }

            const savedNote = await res.json();

            // Set the note ID if this was the first save
            if (!noteId) {
                setNoteId(savedNote._id);
                // Connect to socket room after first save
                socket.connect();
                socket.emit('join-note', savedNote._id);
            } else {
                // Emit update for existing note
                socket.emit('note-update', {
                    noteId: savedNote._id,
                    content: newContent
                });
            }

            return savedNote;
        } catch (error) {
            console.error('Error saving note:', error);
            throw error;
        }
    };

    let handleChange = (newContent: string) => {
        setContent(newContent);
        setError('');
    }

    const { isSaving } = useAutoSave({
        onSave: handleSave,
        content,
        delay: 2000
    });

    const handlePublish = async () => {
        if (!title.trim()) {
            setError('Please enter a title for your note');
            return;
        }

        if (!content.trim() || content === '<p>Start writing your note here...</p>') {
            setError('Please add some content to your note');
            return;
        }

        try {
            const savedNote = await handleSave(content);
            if (savedNote) {
                router.push('/dashboard');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to save note. Please try again.');
        }
    };

    return (
        <div className="min-h-screen ">
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
                            <SaveIndicator isSaving={isSaving} />
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