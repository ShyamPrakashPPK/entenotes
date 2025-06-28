import { useState, useEffect } from 'react';

interface UseAutoSaveProps {
    onSave: (content: any) => Promise<void>;
    content: any;
    delay?: number;
}

export const useAutoSave = ({ onSave, content, delay = 2000 }: UseAutoSaveProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedContent, setLastSavedContent] = useState(content);

    useEffect(() => {
        // If content hasn't changed, don't do anything
        if (content === lastSavedContent) {
            return;
        }

        setIsSaving(true);
        const timeoutId = setTimeout(async () => {
            try {
                await onSave(content);
                setLastSavedContent(content);
            } catch (error) {
                console.error('Error saving:', error);
            } finally {
                setIsSaving(false);
            }
        }, delay);

        // Cleanup timeout on content change or unmount
        return () => clearTimeout(timeoutId);
    }, [content, delay, onSave, lastSavedContent]);

    return { isSaving };
}; 