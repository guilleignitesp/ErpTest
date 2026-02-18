'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function login(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
        return { error: 'Missing credentials' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        })

        if (!user || user.password !== password) {
            return { error: 'Invalid credentials' }
        }

        // Create session object
        const session = {
            userId: user.id,
            role: user.role,
            name: user.name,
        }

        // Store in HTTP-only cookie
        cookies().set('session', JSON.stringify(session), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        return { success: true, role: user.role }
    } catch (error) {
        console.error('Login error:', error)
        return { error: 'Internal server error' }
    }
}

import { redirect } from 'next/navigation'

export async function logout() {
    cookies().delete('session')
    redirect('/login')
}
