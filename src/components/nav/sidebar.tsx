'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../app/store/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

interface User {
    _id: string;
    email: string;
}

interface SharedUser {
    user: User;
    permission: 'view' | 'edit';
    _id: string;
}

interface Note {
    _id: string;
    title: string;
    content: string;
    user: User;
    sharedWith: SharedUser[];
    lastEditedBy: string;
    lastEditedAt: string;
    createdAt: string;
    updatedAt: string;
    isOwner: boolean;
}

export default function Sidebar() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [shareEmail, setShareEmail] = useState('');
    const [sharingNoteId, setSharingNoteId] = useState<string | null>(null);
    const [shareError, setShareError] = useState('');
    const token = useAuthStore((state) => state.token);
    const router = useRouter();

    const fetchNotes = async () => {
        if (!token) return;
        try {
            const res = await axiosInstance.get('/notes');
            const data = res;
            setNotes(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load notes');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [token]);

    const handleDelete = async (noteId: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            await axiosInstance.delete(`/notes/${noteId}`);
            setNotes(notes => notes.filter(note => note._id !== noteId));
            router.push('/dashboard');
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Failed to delete note');
        }
    };

    const handleShare = async (noteId: string) => {
        setShareError('');
        if (!shareEmail.trim()) {
            setShareError('Please enter an email address');
            return;
        }

        try {
            const res = await axiosInstance.post(`/notes/${noteId}/share`, {
                email: shareEmail.trim()
            });

            // Refetch notes to get the updated sharedWith structure
            fetchNotes();

            setShareEmail('');
            setSharingNoteId(null);
            setShareError('');
        } catch (err: any) {
            console.error('Error sharing note:', err);
            setShareError(err.response?.data?.message || 'Failed to share note');
        }
    };

    const renderNotesList = (notes: Note[], isShared: boolean) => {
        const filteredNotes = notes.filter(note => isShared ? !note.isOwner : note.isOwner);
        if (filteredNotes.length === 0) {
            return (
                <div className="text-gray-400 text-center py-4">
                    {isShared ? 'No shared notes' : 'No notes yet'}
                </div>
            );
        }

        return filteredNotes.map((note) => (
            <div key={note._id} className="bg-gray-700 rounded-lg p-3 space-y-2">
                <Link
                    href={`/dashboard/editor/${note._id}`}
                    className="text-white hover:text-indigo-400 font-medium block"
                >
                    {note.title}
                </Link>
                <div className="text-xs text-gray-400">
                    {isShared ? (
                        <span>Owned by: {note.user.email}</span>
                    ) : (
                        <>
                            <div>Last updated: {new Date(note.updatedAt).toLocaleDateString()}</div>
                            <div>Last edited by: {note.user.email}</div>
                        </>
                    )}
                </div>
                {note.isOwner && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSharingNoteId(note._id)}
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Share
                        </button>
                        <button
                            onClick={() => handleDelete(note._id)}
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                )}
                {sharingNoteId === note._id && (
                    <div className="mt-2 space-y-2">
                        <input
                            type="email"
                            placeholder="Enter email to share"
                            value={shareEmail}
                            onChange={(e) => {
                                setShareEmail(e.target.value);
                                setShareError('');
                            }}
                            className="w-full px-2 py-1 text-sm bg-gray-600 text-white rounded border border-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        {shareError && (
                            <div className="text-xs text-red-400">{shareError}</div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleShare(note._id)}
                                className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Send
                            </button>
                            <button
                                onClick={() => {
                                    setSharingNoteId(null);
                                    setShareEmail('');
                                    setShareError('');
                                }}
                                className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        ));
    };

    return (
        <aside className="w-64  h-screen overflow-y-auto p-4 bg-[#151415] bg-opacity-70 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">My Notes</h2>
                <Link
                    href="/dashboard/editor"
                    className="px-2 py-1 text-sm bg-gradient-to-r from-red-500 to-gray-500 text-white rounded hover:bg-orange-500 transition-colors"
                >
                    New
                </Link>
            </div>

            {isLoading ? (
                <div className="text-gray-400 text-center py-4">
                    Loading notes...
                </div>
            ) : error ? (
                <div className="text-red-400 text-center py-4">
                    {error}
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-3">My Notes</h3>
                        <div className="space-y-3">
                            {renderNotesList(notes, false)}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-3">Shared With Me</h3>
                        <div className="space-y-3">
                            {renderNotesList(notes, true)}
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
