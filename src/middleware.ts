import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session')
    const { pathname } = request.nextUrl

    // 1. Check if user is logged in
    if (!sessionCookie) {
        // If accessing protected routes, redirect to login
        if (
            pathname.startsWith('/admin') ||
            pathname.startsWith('/teacher') ||
            pathname.startsWith('/student')
        ) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    }

    // 2. Parse session
    let session
    try {
        session = JSON.parse(sessionCookie.value)
    } catch (e) {
        // Invalid cookie, clear and redirect
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('session')
        return response
    }

    // 3. Handle Login Page Redirect (if already logged in)
    if (pathname === '/login') {
        if (session.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
        if (session.role === 'TEACHER') return NextResponse.redirect(new URL('/teacher', request.url))
        if (session.role === 'STUDENT') return NextResponse.redirect(new URL('/student', request.url))
    }

    // 4. Role-based Protection
    if (pathname.startsWith('/admin') && session.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname.startsWith('/teacher') && session.role !== 'TEACHER') {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (pathname.startsWith('/student') && session.role !== 'STUDENT') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
