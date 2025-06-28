import React from 'react';

interface SaveIndicatorProps {
    isSaving: boolean;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ isSaving }) => {
    if (!isSaving) return null;

    return (
        <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="h-4 w-4 relative">
                <div className="animate-spin absolute inset-0 border-2 border-gray-400 border-t-transparent rounded-full"></div>
            </div>
            <span>Saving...</span>
        </div>
    );
};

export default SaveIndicator; 