import React from 'react';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function Editor({ value, onChange, placeholder }: EditorProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const target = e.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;

            // Insert tab at cursor position
            const newValue = value.substring(0, start) + '    ' + value.substring(end);
            onChange(newValue);

            // Move cursor after tab
            setTimeout(() => {
                target.selectionStart = target.selectionEnd = start + 4;
            }, 0);
        }
    };

    return (
        <div className="editor-container">
            <div className="editor-toolbar bg-gray-800 border-b border-gray-700 p-2 flex items-center gap-2">
                <button
                    onClick={() => onChange(value + '# ')}
                    className="p-2 hover:bg-gray-700 rounded"
                    title="Heading"
                >
                    H
                </button>
                <button
                    onClick={() => onChange(value + '* ')}
                    className="p-2 hover:bg-gray-700 rounded"
                    title="Bullet List"
                >
                    •
                </button>
                <button
                    onClick={() => onChange(value + '1. ')}
                    className="p-2 hover:bg-gray-700 rounded"
                    title="Numbered List"
                >
                    1.
                </button>
                <button
                    onClick={() => onChange(value + '> ')}
                    className="p-2 hover:bg-gray-700 rounded"
                    title="Quote"
                >
                    "
                </button>
                <div className="h-4 w-px bg-gray-700 mx-1" />
                <button
                    onClick={() => onChange(value + '```\n\n```')}
                    className="p-2 hover:bg-gray-700 rounded"
                    title="Code Block"
                >
                    {'</>'}
                </button>
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full min-h-[500px] bg-transparent text-white p-6 resize-none focus:outline-none font-mono text-base leading-relaxed"
                placeholder={placeholder}
                spellCheck="false"
            />
        </div>
    );
} 