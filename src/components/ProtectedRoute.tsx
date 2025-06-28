import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '@/app/store/auth';
import { showToast } from './ui/Toast';
import ErrorBoundary from './ErrorBoundary';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
    fallback?: ReactNode;
    roles?: string[];
}

const ProtectedRoute = ({
    children,
    requireAuth = true,
    redirectTo = '/login',
    fallback,
    roles = []
}: ProtectedRouteProps) => {
    const { token, user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!requireAuth) {
                    setIsAuthorized(true);
                    setIsLoading(false);
                    return;
                }

                if (!isAuthenticated || !token) {
                    showToast('Please login to access this page', 'error');
                    router.replace(redirectTo);
                    setIsLoading(false);
                    return;
                }

                if (roles.length > 0 && user) {
                    const userRole = (user as any).role || 'user';
                    if (!roles.includes(userRole)) {
                        showToast('You do not have permission to access this page', 'error');
                        router.replace('/dashboard');
                        setIsLoading(false);
                        return;
                    }
                }
                if (token) {
                    try {
                        setIsAuthorized(true);
                    } catch (error) {
                        console.error('Token validation failed:', error);
                        showToast('Session expired. Please login again.', 'error');
                        useAuthStore.getState().logout();
                        router.replace(redirectTo);
                    }
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsLoading(false);
                router.replace(redirectTo);
            }
        };

        checkAuth();
    }, [isAuthenticated, token, user, requireAuth, roles, router, redirectTo]);

    if (isLoading) {
        return fallback || (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (requireAuth && !isAuthorized) {
        return null;
    }

    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    );
};

export default ProtectedRoute;

export function withProtectedRoute<P extends object>(
    Component: React.ComponentType<P>,
    options: Omit<ProtectedRouteProps, 'children'> = {}
) {
    return function ProtectedComponent(props: P) {
        return (
            <ProtectedRoute {...options}>
                <Component {...props} />
            </ProtectedRoute>
        );
    };
}

export function useAuthGuard(requireAuth = true, roles: string[] = []) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();

    const checkPermission = (requiredRoles: string[] = roles) => {
        if (!requireAuth) return true;
        if (!isAuthenticated) return false;

        if (requiredRoles.length === 0) return true;

        const userRole = (user as any)?.role || 'user';
        return requiredRoles.includes(userRole);
    };

    const redirectIfUnauthorized = (redirectTo = '/login') => {
        if (!checkPermission()) {
            router.replace(redirectTo);
            return false;
        }
        return true;
    };

    return {
        isAuthenticated,
        user,
        checkPermission,
        redirectIfUnauthorized,
        hasPermission: checkPermission()
    };
} 