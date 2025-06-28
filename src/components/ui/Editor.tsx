import React from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false }
);

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function Editor({ value, onChange, placeholder }: EditorProps) {
    return (
        <div className="editor-container w-full">
            <div data-color-mode="dark" className="w-full">
                <MDEditor
                    value={value}
                    onChange={(val) => onChange(val || '')}
                    preview="edit"
                    hideToolbar={false}
                    visibleDragbar={false}
                    textareaProps={{
                        placeholder: placeholder || 'Start writing your note...',
                        style: {
                            fontSize: 14,
                            lineHeight: 1.6,
                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace',
                        },
                    }}
                    height={500}
                    data-color-mode="dark"
                />
            </div>

            {/* Custom styles for dark theme */}
            <style jsx global>{`
                .w-md-editor {
                    background-color: #1f2937 !important;
                    border: 1px solid #374151 !important;
                }
                
                .w-md-editor-text-textarea,
                .w-md-editor-text {
                    background-color: #111827 !important;
                    color: #f9fafb !important;
                    border: none !important;
                }
                
                .w-md-editor-text-textarea::placeholder {
                    color: #9ca3af !important;
                }
                
                .w-md-editor-bar {
                    background-color: #374151 !important;
                    border-bottom: 1px solid #4b5563 !important;
                }
                
                .w-md-editor-bar svg {
                    color: #d1d5db !important;
                }
                
                .w-md-editor-bar button {
                    color: #d1d5db !important;
                    background-color: transparent !important;
                }
                
                .w-md-editor-bar button:hover {
                    background-color: #4b5563 !important;
                }
                
                .w-md-editor-preview {
                    background-color: #111827 !important;
                    color: #f9fafb !important;
                }
                
                .wmde-markdown {
                    background-color: #111827 !important;
                    color: #f9fafb !important;
                }
                
                .wmde-markdown h1,
                .wmde-markdown h2,
                .wmde-markdown h3,
                .wmde-markdown h4,
                .wmde-markdown h5,
                .wmde-markdown h6 {
                    color: #f9fafb !important;
                    border-bottom-color: #4b5563 !important;
                }
                
                .wmde-markdown code {
                    background-color: #374151 !important;
                    color: #f9fafb !important;
                }
                
                .wmde-markdown pre {
                    background-color: #374151 !important;
                }
                
                .wmde-markdown blockquote {
                    border-left-color: #6b7280 !important;
                    color: #d1d5db !important;
                }
                
                .wmde-markdown table th,
                .wmde-markdown table td {
                    border-color: #4b5563 !important;
                }
                
                .wmde-markdown table th {
                    background-color: #374151 !important;
                }
            `}</style>
        </div>
    );
} 