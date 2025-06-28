import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false }
);

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: number;
}

type ViewMode = 'edit' | 'live' | 'preview';

export function MarkdownEditor({ value, onChange, placeholder, height = 500 }: MarkdownEditorProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('edit');

    return (
        <div className="markdown-editor-container w-full">
            {/* Custom toolbar */}
            <div className="flex items-center justify-between bg-gray-800 border border-gray-700 border-b-0 px-4 py-2 rounded-t-lg">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300 font-medium">View Mode:</span>
                    <button
                        onClick={() => setViewMode('edit')}
                        className={`px-3 py-1 text-xs rounded ${viewMode === 'edit'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setViewMode('live')}
                        className={`px-3 py-1 text-xs rounded ${viewMode === 'live'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Live
                    </button>
                    <button
                        onClick={() => setViewMode('preview')}
                        className={`px-3 py-1 text-xs rounded ${viewMode === 'preview'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        Preview
                    </button>
                </div>
                <div className="text-xs text-gray-400">
                    {value.length} characters
                </div>
            </div>

            <div data-color-mode="dark" className="w-full">
                <MDEditor
                    value={value}
                    onChange={(val) => onChange(val || '')}
                    preview={viewMode}
                    hideToolbar={false}
                    visibleDragbar={false}
                    textareaProps={{
                        placeholder: placeholder || 'Start writing your note with markdown...',
                        style: {
                            fontSize: 14,
                            lineHeight: 1.6,
                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace',
                        },
                    }}
                    height={height}
                    data-color-mode="dark"
                />
            </div>

            {/* Custom styles for dark theme */}
            <style jsx global>{`
                .markdown-editor-container .w-md-editor {
                    background-color: #1f2937 !important;
                    border: 1px solid #374151 !important;
                    border-top: none !important;
                    border-radius: 0 0 0.5rem 0.5rem !important;
                }
                
                .markdown-editor-container .w-md-editor-text-textarea,
                .markdown-editor-container .w-md-editor-text {
                    background-color: #111827 !important;
                    color: #f9fafb !important;
                    border: none !important;
                    font-size: 14px !important;
                    line-height: 1.6 !important;
                }
                
                .markdown-editor-container .w-md-editor-text-textarea::placeholder {
                    color: #9ca3af !important;
                }
                
                .markdown-editor-container .w-md-editor-bar {
                    background-color: #374151 !important;
                    border-bottom: 1px solid #4b5563 !important;
                }
                
                .markdown-editor-container .w-md-editor-bar svg {
                    color: #d1d5db !important;
                }
                
                .markdown-editor-container .w-md-editor-bar button {
                    color: #d1d5db !important;
                    background-color: transparent !important;
                }
                
                .markdown-editor-container .w-md-editor-bar button:hover {
                    background-color: #4b5563 !important;
                }
                
                .markdown-editor-container .w-md-editor-preview {
                    background-color: #111827 !important;
                    color: #f9fafb !important;
                    padding: 1rem !important;
                }
                
                .markdown-editor-container .wmde-markdown {
                    background-color: #111827 !important;
                    color: #f9fafb !important;
                }
                
                .markdown-editor-container .wmde-markdown h1,
                .markdown-editor-container .wmde-markdown h2,
                .markdown-editor-container .wmde-markdown h3,
                .markdown-editor-container .wmde-markdown h4,
                .markdown-editor-container .wmde-markdown h5,
                .markdown-editor-container .wmde-markdown h6 {
                    color: #f9fafb !important;
                    border-bottom-color: #4b5563 !important;
                }
                
                .markdown-editor-container .wmde-markdown code {
                    background-color: #374151 !important;
                    color: #f9fafb !important;
                    padding: 0.2rem 0.4rem !important;
                    border-radius: 0.25rem !important;
                }
                
                .markdown-editor-container .wmde-markdown pre {
                    background-color: #374151 !important;
                    border-radius: 0.5rem !important;
                    padding: 1rem !important;
                }
                
                .markdown-editor-container .wmde-markdown pre code {
                    background-color: transparent !important;
                    padding: 0 !important;
                }
                
                .markdown-editor-container .wmde-markdown blockquote {
                    border-left: 4px solid #6b7280 !important;
                    background-color: #1f2937 !important;
                    color: #d1d5db !important;
                    padding: 0.5rem 1rem !important;
                    margin: 1rem 0 !important;
                }
                
                .markdown-editor-container .wmde-markdown table {
                    border-collapse: collapse !important;
                    width: 100% !important;
                }
                
                .markdown-editor-container .wmde-markdown table th,
                .markdown-editor-container .wmde-markdown table td {
                    border: 1px solid #4b5563 !important;
                    padding: 0.5rem !important;
                }
                
                .markdown-editor-container .wmde-markdown table th {
                    background-color: #374151 !important;
                    font-weight: 600 !important;
                }
                
                .markdown-editor-container .wmde-markdown ul,
                .markdown-editor-container .wmde-markdown ol {
                    padding-left: 1.5rem !important;
                }
                
                .markdown-editor-container .wmde-markdown a {
                    color: #60a5fa !important;
                    text-decoration: underline !important;
                }
                
                .markdown-editor-container .wmde-markdown a:hover {
                    color: #93c5fd !important;
                }
                
                .markdown-editor-container .wmde-markdown hr {
                    border-color: #4b5563 !important;
                    margin: 1.5rem 0 !important;
                }
            `}</style>
        </div>
    );
} 