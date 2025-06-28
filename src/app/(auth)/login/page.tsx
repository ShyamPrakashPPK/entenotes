"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/auth';
import Link from 'next/link';
import BackgroundGradient from '@/components/ui/BackgroundGradient';
import { authAPI } from '@/lib/api';
import { showToast } from '@/components/ui/Toast';
import { loginSchema, type LoginInput } from '@/app/utils/validation';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const router = useRouter();
    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);
    const [errors, setErrors] = useState<Partial<LoginInput>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Clear previous errors
            setErrors({});

            // Validate form data
            const validatedData = loginSchema.safeParse(formData);

            if (!validatedData.success) {
                // Handle Zod validation errors
                const validationErrors: Partial<LoginInput> = {};
                validatedData.error.errors.forEach((err) => {
                    const path = err.path[0];
                    validationErrors[path as keyof LoginInput] = err.message;
                });
                setErrors(validationErrors);
                showToast('Please fix the form errors', 'error');
                return;
            }

            const response = await authAPI.login(validatedData.data);
            console.log(response, "response");

            // Access the nested data property from the response
            const { token, user } = response.data;

            setToken(token);
            setUser(user);
            showToast('Login successful', 'success');
            router.push('/dashboard');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            showToast(errorMessage, 'error');
        }
    };

    return (
        <div className=" mt-8">
            <BackgroundGradient />
            <div className="h-full container px-4 mx-auto flex items-center justify-center">
                <div className="mx-auto">
                    <div className="max-w-md mx-auto px-8 py-6 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold text-white mb-4">Login</h2>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-4">
                                <label className="block text-white mb-1" htmlFor="email">Email Address</label>
                                <input
                                    className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'} transition duration-300`}
                                    placeholder="Enter your email"
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        // Clear error when user starts typing
                                        if (errors.email) {
                                            setErrors(prev => ({ ...prev, email: undefined }));
                                        }
                                    }}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-white mb-1" htmlFor="password">Password</label>
                                <div className="relative">
                                    <input
                                        className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'ring-2 ring-red-500' : 'focus:ring-blue-500'} transition duration-300`}
                                        placeholder="Enter your password"
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) => {
                                            setFormData({ ...formData, password: e.target.value });
                                            // Clear error when user starts typing
                                            if (errors.password) {
                                                setErrors(prev => ({ ...prev, password: undefined }));
                                            }
                                        }}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                    )}
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <button
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                type="submit"
                            >
                                Sign In
                            </button>
                        </form>
                        <p className="mt-4 text-center text-gray-400">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-blue-500 hover:text-blue-400">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
