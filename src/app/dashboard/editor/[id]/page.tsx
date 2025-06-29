'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth';
import { getSocket } from '@/lib/socket';
import SaveIndicator from '@/components/ui/SaveIndicator';
import BackgroundGradient from '@/components/ui/BackgroundGradient';
import { MarkdownEditor } from '@/components/ui/MarkdownEditor';
import axiosInstance from '@/lib/axios';

interface User {
    _id: string;
    email: string;
    username: string;
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
    lastEditedBy?: User;
    lastEditedAt?: string;
    isOwner: boolean;
}

let saveTimeout: NodeJS.Timeout;

export default function EditorPage() {
    const { id } = useParams();
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const [activeUsers, setActiveUsers] = useState<User[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [note, setNote] = useState<Note | null>(null);
    const [content, setContent] = useState('');
    const [userPermission, setUserPermission] = useState<'owner' | 'edit' | 'view' | null>(null);
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
                if (noteData.isOwner) {
                    setUserPermission('owner');
                } else {
                    const sharedUser = noteData.sharedWith.find(
                        share => share.user._id === user?._id
                    );
                    setUserPermission(sharedUser ? sharedUser.permission : null);
                }
            } catch (err) {
                setError('Failed to load note');
                console.error('Fetch error:', err);
            }
        };
        fetchNote();
    }, [id, token, user]);

    console.log(note, "note");
    console.log(userPermission, "userPermission");
    console.log(user, "current user");

    // Socket 
    useEffect(() => {
        if (!socket || !id) return;
        socket.connect();
        socket.emit('note:join', { noteId: id });
        socket.on('note:updated', (data) => {
            console.log('Received real-time update:', data);
            if (data.userId !== socket.id) {
                setContent(data.content);
            }
        });

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
        if (userPermission === 'view') {
            return;
        }

        setContent(newContent);

        if (socket && socket.connected) {
            socket.emit('note:update', {
                noteId: id,
                content: newContent
            });
        }

        if (saveTimeout) clearTimeout(saveTimeout);
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

    const canEdit = userPermission === 'owner' || userPermission === 'edit';
    console.log(canEdit, "canEdit");
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
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">{note.title}</h1>
                            {userPermission && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full ${userPermission === 'owner'
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : userPermission === 'edit'
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                        }`}>
                                        {userPermission === 'owner' ? 'Owner' :
                                            userPermission === 'edit' ? 'Can Edit' : 'View Only'}
                                    </span>
                                    {!canEdit && (
                                        <span className="text-xs text-yellow-400">
                                            Read-only mode - Live updates enabled
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {activeUsers.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {activeUsers.map((user) => (
                                            <div
                                                key={user._id}
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
                            {canEdit && <SaveIndicator isSaving={isSaving} />}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                        <span>Owner: {note.user.email}</span>
                        {note.sharedWith.length > 0 && (
                            <>
                                <span>•</span>
                                <span>
                                    Shared with: {note.sharedWith.map(share =>
                                        `${share.user.email} (${share.permission})`
                                    ).join(', ')}
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
                <div className={`bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border ${canEdit ? 'border-gray-700' : 'border-yellow-500/30'
                    }`}>
                    {!canEdit && (
                        <div className="bg-yellow-500/10 text-yellow-400 text-sm px-4 py-2 border-b border-yellow-500/30">
                            <span>📖 You have view-only access to this note • Live updates from other editors enabled</span>
                        </div>
                    )}
                    <MarkdownEditor
                        value={content}
                        onChange={canEdit ? handleChange : () => { }}
                        placeholder={canEdit ? "Start writing your markdown note here..." : "This note is read-only - you can see live updates from other editors"}
                        height={600}
                    />
                </div>
            </div>
        </div>
    );
} 