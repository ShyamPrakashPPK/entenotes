import React, { Suspense, ComponentType, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface LazyLoaderProps {
    fallback?: React.ReactNode;
    errorFallback?: React.ReactNode;
}

const DefaultLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
        </div>
    </div>
);

export const PageSkeleton = () => (
    <div className="min-h-screen bg-gray-900 animate-pulse">
        <div className="container mx-auto px-4 py-8">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
            <div className="mt-8 h-64 bg-gray-800 rounded"></div>
        </div>
    </div>
);

export const EditorSkeleton = () => (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden animate-pulse">
        <div className="h-12 bg-gray-700 border-b border-gray-600"></div>
        <div className="h-96 bg-gray-800"></div>
    </div>
);

export function withLazyLoading<P extends object>(
    importFunc: () => Promise<{ default: ComponentType<P> }>,
    options: LazyLoaderProps = {}
) {
    const LazyComponent = lazy(importFunc);

    return function LazyWrapper(props: P) {
        return (
            <ErrorBoundary fallback={options.errorFallback}>
                <Suspense fallback={options.fallback || <DefaultLoader />}>
                    <LazyComponent {...props} />
                </Suspense>
            </ErrorBoundary>
        );
    };
}

export function preloadComponent<P extends object>(
    importFunc: () => Promise<{ default: ComponentType<P> }>
) {
    return importFunc();
}

export function useProgressiveLoading() {
    const [loadedComponents, setLoadedComponents] = React.useState<Set<string>>(new Set());

    const markAsLoaded = (componentName: string) => {
        setLoadedComponents(prev => new Set(prev).add(componentName));
    };

    const isLoaded = (componentName: string) => {
        return loadedComponents.has(componentName);
    };

    return { markAsLoaded, isLoaded, loadedComponents };
}

export const LazyRoutes = {
    Dashboard: withLazyLoading(
        () => import('@/app/dashboard/page'),
        { fallback: <PageSkeleton /> }
    ),

    Editor: withLazyLoading(
        () => import('@/app/dashboard/editor/page'),
        { fallback: <EditorSkeleton /> }
    ),

    NoteEditor: withLazyLoading(
        () => import('@/app/dashboard/editor/[id]/page'),
        { fallback: <EditorSkeleton /> }
    ),

    Login: withLazyLoading(
        () => import('@/app/(auth)/login/page'),
        { fallback: <DefaultLoader /> }
    ),

    Register: withLazyLoading(
        () => import('@/app/(auth)/register/page'),
        { fallback: <DefaultLoader /> }
    ),

    About: withLazyLoading(
        () => import('@/app/about/page'),
        { fallback: <PageSkeleton /> }
    )
};

export function LazySection({
    children,
    threshold = 0.1,
    rootMargin = '50px'
}: {
    children: React.ReactNode;
    threshold?: number;
    rootMargin?: string;
}) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [hasLoaded, setHasLoaded] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasLoaded) {
                    setIsVisible(true);
                    setHasLoaded(true);
                }
            },
            { threshold, rootMargin }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold, rootMargin, hasLoaded]);

    return (
        <div ref={ref}>
            {isVisible ? children : <div className="h-64 bg-gray-800 animate-pulse rounded"></div>}
        </div>
    );
} 