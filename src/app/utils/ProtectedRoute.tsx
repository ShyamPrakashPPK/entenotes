import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthStore } from '@/app/store/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { token, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.replace('/login');
        }
    }, [token]);

    return token ? <>{children}</> : null;
};

export default ProtectedRoute;
