import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Since we're using localStorage, which is client-side only,
// we'll only protect the routes and let the client-side code handle the auth
export function middleware(request: NextRequest) {
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register')

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/register'
    ]
} 