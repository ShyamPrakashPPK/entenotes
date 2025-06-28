import React, { Component, ErrorInfo, ReactNode } from 'react';
import { showToast } from './ui/Toast';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        showToast('Something went wrong. Please try refreshing the page.', 'error');
        this.props.onError?.(error, errorInfo);
        if (process.env.NODE_ENV === 'production') {
            console.error('Production error:', { error, errorInfo });
        }
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                    <div className="max-w-md w-full mx-4">
                        <div className="bg-gray-800 rounded-lg p-6 text-center">
                            <div className="mb-4">
                                <svg
                                    className="mx-auto h-12 w-12 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                Oops! Something went wrong
                            </h2>
                            <p className="text-gray-400 mb-6">
                                We encountered an unexpected error. Please try again or refresh the page.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={this.handleReset}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
                                >
                                    Refresh Page
                                </button>
                            </div>
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mt-4 text-left">
                                    <summary className="text-sm text-gray-400 cursor-pointer">
                                        Error Details (Development)
                                    </summary>
                                    <pre className="mt-2 text-xs text-red-400 bg-gray-900 p-2 rounded overflow-auto">
                                        {this.state.error.stack}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 