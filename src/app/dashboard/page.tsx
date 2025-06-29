'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import BackgroundGradient from '@/components/ui/BackgroundGradient';
import Link from 'next/link';
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
    lastEditedBy: User;
    lastEditedAt: string;
    createdAt: string;
    updatedAt: string;
    isOwner: boolean;
}

interface Stats {
    totalNotes: number;
    sharedNotes: number;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface NotesResponse {
    notes: Note[];
    pagination: Pagination;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({ totalNotes: 0, sharedNotes: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = useAuthStore((state) => state.token);
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'my' | 'shared'>('all');
    const [shareEmail, setShareEmail] = useState('');
    const [sharingNoteId, setSharingNoteId] = useState<string | null>(null);
    const [shareError, setShareError] = useState('');
    const [sharePermission, setSharePermission] = useState('view');
    const [managingNoteId, setManagingNoteId] = useState<string | null>(null);
    const [editingShareId, setEditingShareId] = useState<string | null>(null);
    const [editingPermission, setEditingPermission] = useState<string>('');
    const [sortBy, setSortBy] = useState('updatedAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 1
    });
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();

    const fetchNotes = async (page = currentPage) => {
        try {
            const response = (await axiosInstance.get('/notes', {
                params: {
                    search: searchQuery,
                    filter: filterType,
                    sortBy,
                    sortOrder,
                    page,
                    limit: pagination.limit
                }
            })) as unknown as NotesResponse;
            console.log(response, "response-----");
            setNotes(response.notes);
            setPagination(response.pagination);
        } catch (err) {
            console.error('Error fetching notes:', err);
            setError('Failed to load notes');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const [statsResponse] = await Promise.all([
                    axiosInstance.get<Stats>('/notes/stats'),
                ]);
                setStats(statsResponse as unknown as Stats);
                await fetchNotes(1); // Fetch first page of notes
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const timeout = setTimeout(() => {
            setCurrentPage(1);
            fetchNotes(1);
        }, 300);

        setSearchTimeout(timeout);

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
        fetchNotes(1);
    }, [filterType, sortBy, sortOrder]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        fetchNotes(newPage);
    };

    const handleDelete = async (noteId: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            await axiosInstance.delete(`/notes/${noteId}`);
            await fetchNotes();
            const statsResponse = await axiosInstance.get<Stats>('/notes/stats');
            setStats(statsResponse as unknown as Stats);
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
            await axiosInstance.post(`/notes/${noteId}/share`, {
                email: shareEmail.trim(),
                permission: sharePermission
            });

            await fetchNotes();
            setShareEmail('');
            setSharingNoteId(null);
            setShareError('');
            setSharePermission('view');
            setManagingNoteId(null);
            setEditingShareId(null);
            setEditingPermission('');
        } catch (err: any) {
            console.error('Error sharing note:', err);
            setShareError(err.response?.data?.message || 'Failed to share note');
        }
    };

    const handleUpdatePermission = async (noteId: string, shareId: string, newPermission: string) => {
        try {
            await axiosInstance.put(`/notes/${noteId}/share/${shareId}`, {
                permission: newPermission
            });

            await fetchNotes();
            setEditingShareId(null);
            setEditingPermission('');
        } catch (err: any) {
            console.error('Error updating permission:', err);
            alert(err.response?.data?.message || 'Failed to update permission');
        }
    };

    const handleRemoveSharedUser = async (noteId: string, shareId: string) => {
        if (!confirm('Are you sure you want to remove this user from sharing?')) return;

        try {
            await axiosInstance.delete(`/notes/${noteId}/share/${shareId}`);
            await fetchNotes();
        } catch (err: any) {
            console.error('Error removing shared user:', err);
            alert(err.response?.data?.message || 'Failed to remove shared user');
        }
    };

    return (
        <div className="min-h-screen ">
            <BackgroundGradient />
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                    <Link
                        href="/dashboard/editor"
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
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
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

                        <div className="mb-6">
                            <div className="flex gap-4 items-center">
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as 'all' | 'my' | 'shared')}
                                    className="w-32 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Notes</option>
                                    <option value="my">My Notes</option>
                                    <option value="shared">Shared Notes</option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-40 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="updatedAt">Last Updated</option>
                                    <option value="createdAt">Created Date</option>
                                    <option value="title">Title</option>
                                </select>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="w-36 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="desc">Newest First</option>
                                    <option value="asc">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {notes.map((note) => (
                                <div key={note._id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 space-y-4">
                                    <Link
                                        href={`/dashboard/editor/${note._id}`}
                                        className="text-white hover:text-indigo-400 font-medium block text-lg"
                                    >
                                        {note.title}
                                    </Link>
                                    <div className="text-sm text-gray-400">
                                        {note.isOwner ? (
                                            <>
                                                <div>Last updated: {new Date(note.updatedAt).toLocaleDateString()}</div>
                                                <div>Last edited by: {note.lastEditedBy.email}</div>
                                            </>
                                        ) : (
                                            <div>Owned by: {note.user.email}</div>
                                        )}
                                    </div>

                                    {/* Sharing Info Section */}
                                    {note.isOwner && note.sharedWith.length > 0 && (
                                        <div className="border-t border-gray-700 pt-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-sm font-medium text-gray-300">Shared with ({note.sharedWith.length})</h4>
                                                <button
                                                    onClick={() => setManagingNoteId(managingNoteId === note._id ? null : note._id)}
                                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                                >
                                                    {managingNoteId === note._id ? 'Hide' : 'Manage'}
                                                </button>
                                            </div>

                                            {managingNoteId === note._id ? (
                                                <div className="space-y-2">
                                                    {note.sharedWith.map((share) => (
                                                        <div key={share._id} className="flex items-center justify-between bg-gray-700/30 rounded p-2">
                                                            <div className="flex-1">
                                                                <div className="text-xs text-gray-300">{share.user.email}</div>
                                                                {editingShareId === share._id ? (
                                                                    <select
                                                                        value={editingPermission}
                                                                        onChange={(e) => setEditingPermission(e.target.value)}
                                                                        className="text-xs bg-gray-600 text-white rounded px-1 py-0.5 mt-1"
                                                                    >
                                                                        <option value="view">View Only</option>
                                                                        <option value="edit">Edit</option>
                                                                    </select>
                                                                ) : (
                                                                    <div className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${share.permission === 'edit'
                                                                        ? 'bg-blue-500/20 text-blue-400'
                                                                        : 'bg-gray-500/20 text-gray-400'
                                                                        }`}>
                                                                        {share.permission === 'edit' ? 'Can Edit' : 'View Only'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-1">
                                                                {editingShareId === share._id ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleUpdatePermission(note._id, share._id, editingPermission)}
                                                                            className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingShareId(null);
                                                                                setEditingPermission('');
                                                                            }}
                                                                            className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingShareId(share._id);
                                                                                setEditingPermission(share.permission);
                                                                            }}
                                                                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleRemoveSharedUser(note._id, share._id)}
                                                                            className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-400">
                                                    {note.sharedWith.map(share => share.user.email).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {note.isOwner && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSharingNoteId(note._id)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                            >
                                                {note.sharedWith.length > 0 ? 'Add More' : 'Share'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(note._id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}

                                    {/* New Sharing Form */}
                                    {sharingNoteId === note._id && (
                                        <div className="border-t border-gray-700 pt-3 space-y-2">
                                            <h4 className="text-sm font-medium text-gray-300">Share with new user</h4>
                                            <input
                                                type="email"
                                                placeholder="Enter email to share"
                                                value={shareEmail}
                                                onChange={(e) => {
                                                    setShareEmail(e.target.value);
                                                    setShareError('');
                                                }}
                                                className="w-full px-3 py-2 text-sm bg-gray-700 text-white rounded border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            />
                                            <select
                                                value={sharePermission}
                                                onChange={(e) => setSharePermission(e.target.value)}
                                                className="w-full px-3 py-2 text-sm bg-gray-700 text-white rounded border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            >
                                                <option value="view">View Only</option>
                                                <option value="edit">Edit</option>
                                            </select>
                                            {shareError && (
                                                <div className="text-sm text-red-400">{shareError}</div>
                                            )}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleShare(note._id)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                                >
                                                    Share
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSharingNoteId(null);
                                                        setShareEmail('');
                                                        setShareError('');
                                                        setSharePermission('view');
                                                        setManagingNoteId(null);
                                                        setEditingShareId(null);
                                                        setEditingPermission('');
                                                    }}
                                                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded text-sm ${currentPage === page
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
