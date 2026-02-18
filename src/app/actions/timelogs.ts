'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export type TimeLogWithUser = {
    id: string
    type: string
    timestamp: Date
    user: {
        name: string
        role: string
    }
}

export async function getAllTimeLogs(filters?: { name?: string; date?: string }) {
    try {
        const where: any = {}

        if (filters?.name) {
            where.user = {
                name: {
                    contains: filters.name
                }
            }
        }

        if (filters?.date) {
            const startOfDay = new Date(filters.date)
            const endOfDay = new Date(filters.date)
            endOfDay.setDate(endOfDay.getDate() + 1)

            where.timestamp = {
                gte: startOfDay,
                lt: endOfDay
            }
        }

        const logs = await prisma.timeLog.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                timestamp: 'desc',
            },
        })

        return { success: true, data: logs }
    } catch (error) {
        console.error('Failed to fetch time logs:', error)
        return { success: false, error: 'Failed to fetch time logs' }
    }
}

// Teacher Specific Actions

export async function getTeacherLogs() {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) return { error: 'Not authenticated' }

    try {
        const session = JSON.parse(sessionCookie.value)
        const userId = session.userId

        const logs = await prisma.timeLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' }
        })

        return { success: true, data: logs }
    } catch (error) {
        console.error('Failed to fetch teacher logs:', error)
        return { success: false, error: 'Failed to fetch teacher logs' }
    }
}

export async function logTeacherTime(type: 'CLOCK_IN' | 'CLOCK_OUT') {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) return { error: 'Not authenticated' }

    try {
        const session = JSON.parse(sessionCookie.value)
        const userId = session.userId

        await prisma.timeLog.create({
            data: {
                type,
                userId,
                timestamp: new Date()
            }
        })

        revalidatePath('/teacher/timelog')
        revalidatePath('/admin/timelog')
        return { success: true }
    } catch (error) {
        console.error('Failed to log time:', error)
        return { success: false, error: 'Failed to log time' }
    }
}
