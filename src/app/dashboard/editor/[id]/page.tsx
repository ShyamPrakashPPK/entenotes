'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth';
import { getSocket } from '@/lib/socket';
import SaveIndicator from '@/components/ui/SaveIndicator';
import BackgroundGradient from '@/components/ui/BackgroundGradient';
import { Editor } from '@/components/ui/Editor';
import axiosInstance from '@/lib/axios';

interface User {
    id: string;
    username: string;
}

interface Note {
    _id: string;
    title: string;
    content: string;
    user: User;
    sharedWith: User[];
    lastEditedBy?: User;
    lastEditedAt?: string;
}

let saveTimeout: NodeJS.Timeout;

export default function EditorPage() {
    const { id } = useParams();
    const token = useAuthStore((state) => state.token);
    const [activeUsers, setActiveUsers] = useState<User[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [note, setNote] = useState<Note | null>(null);
    const [content, setContent] = useState('');
    const socket = getSocket();

    // Initial note fetch
    useEffect(() => {
        const fetchNote = async () => {
            if (!token || !id) return;
            try {
                const response = await axiosInstance.get<Note>(`/notes/${id}`);
                const noteData = response as unknown as Note;
                setNote(noteData);
                setContent(noteData.content || '');
            } catch (err) {
                setError('Failed to load note');
                console.error('Fetch error:', err);
            }
        };
        fetchNote();
    }, [id, token]);

    // Socket setup
    useEffect(() => {
        if (!socket || !id) return;

        // Connect socket
        socket.connect();

        // Join room
        socket.emit('note:join', { noteId: id });

        // Listen for updates
        socket.on('note:updated', (data) => {
            console.log('Received update:', data);
            if (data.userId !== socket.id) {
                setContent(data.content);
            }
        });

        // Listen for active users
        socket.on('note:users', (users) => {
            console.log('Active users:', users);
            setActiveUsers(users);
        });

        return () => {
            socket.emit('note:leave', { noteId: id });
            socket.off('note:updated');
            socket.off('note:users');
            socket.disconnect();
            if (saveTimeout) clearTimeout(saveTimeout);
        };
    }, [id]);

    const handleChange = async (newContent: string) => {
        setContent(newContent);

        // Emit to socket immediately
        if (socket && socket.connected) {
            socket.emit('note:update', {
                noteId: id,
                content: newContent
            });
        }

        // Clear existing timeout
        if (saveTimeout) clearTimeout(saveTimeout);

        // Set new timeout for saving
        setIsSaving(true);
        saveTimeout = setTimeout(async () => {
            try {
                await axiosInstance.put(`/notes/${id}`, {
                    content: newContent
                });
            } catch (err) {
                console.error('Save error:', err);
                setError('Failed to save changes');
            } finally {
                setIsSaving(false);
            }
        }, 1000);
    };

    if (error) {
        return (
            <div className="min-h-screen">
                <BackgroundGradient />
                <div className="mx-auto max-w-4xl px-6 py-8">
                    <div className="text-red-400 bg-red-400/10 rounded-lg p-4 text-center">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="min-h-screen">
                <BackgroundGradient />
                <div className="mx-auto max-w-4xl px-6 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
                        <div className="h-64 bg-gray-800 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <BackgroundGradient />
            <div className="mx-auto max-w-4xl px-6 py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-white">{note.title}</h1>
                        <div className="flex items-center gap-4">
                            {/* Active users */}
                            {activeUsers.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {activeUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm border-2 border-gray-900"
                                                title={user.username}
                                            >
                                                {user.username[0].toUpperCase()}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {activeUsers.length} active
                                    </span>
                                </div>
                            )}
                            <SaveIndicator isSaving={isSaving} />
                        </div>
                    </div>

                    {/* Note info */}
                    <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                        <span>Owner: {note.user.username}</span>
                        {note.sharedWith.length > 0 && (
                            <>
                                <span>•</span>
                                <span>
                                    Shared with: {note.sharedWith.map(user => user.username).join(', ')}
                                </span>
                            </>
                        )}
                        {note.lastEditedBy && (
                            <>
                                <span>•</span>
                                <span>
                                    Last edited by: {note.lastEditedBy.username} at{' '}
                                    {new Date(note.lastEditedAt!).toLocaleString()}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Editor */}
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-gray-700">
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