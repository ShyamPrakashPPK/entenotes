'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useNoteStore } from '@/app/store/note';
import { getSocket } from '@/lib/socket';
import { useAutoSave } from '@/hooks/use-auto-save';
import { useAuthStore } from '@/app/store/auth';
import SaveIndicator from '@/components/ui/SaveIndicator';

export default function Editor() {
    const { selectedNote, updateSelectedContent } = useNoteStore();
    const token = useAuthStore((state) => state.token);
    const socket = getSocket();

    const handleSave = async (content: string) => {
        if (!token || !selectedNote?._id) return;

        try {
            const res = await fetch(`http://localhost:3052/api/notes/${selectedNote._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: selectedNote.title,
                    content
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to save note');
            }

            const updatedNote = await res.json();
            updateSelectedContent(content);

            // Emit socket update after successful save
            socket.emit('note-update', {
                noteId: selectedNote._id,
                content
            });

            return updatedNote;
        } catch (err) {
            console.error('Error saving note:', err);
            throw err;
        }
    };

    const { isSaving } = useAutoSave({
        onSave: handleSave,
        content: selectedNote?.content || '',
        delay: 2000
    });

    const editor = useEditor({
        extensions: [StarterKit],
        content: selectedNote?.content || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            updateSelectedContent(html);
        },
    });

    // Connect + join room
    useEffect(() => {
        if (!selectedNote?._id) return;

        // Ensure we're connected
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('join-note', selectedNote._id);

        // Listen for updates
        socket.on('note-update', (update: { content: string; userId: string; timestamp: string }) => {
            if (editor && update.content !== editor.getHTML()) {
                editor.commands.setContent(update.content);
                updateSelectedContent(update.content);
            }
        });

        // Handle errors
        socket.on('error', (error: { message: string }) => {
            console.error('Socket error:', error);
        });

        return () => {
            socket.off('note-update');
            socket.off('error');
            socket.disconnect();
        };
    }, [selectedNote?._id, editor]);

    if (!selectedNote) return <p className="text-gray-500">Select or create a note to begin.</p>;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{selectedNote.title}</h2>
                <SaveIndicator isSaving={isSaving} />
            </div>
            <div className="border rounded  p-4">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
