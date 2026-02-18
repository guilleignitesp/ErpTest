'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function getTeacherGroups() {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
        return { error: 'Not authenticated' }
    }

    try {
        const session = JSON.parse(sessionCookie.value)
        const userId = session.userId

        const groups = await prisma.group.findMany({
            where: {
                teachers: {
                    some: {
                        id: userId
                    }
                }
            },
            include: {
                school: {
                    select: { name: true }
                },
                _count: {
                    select: { students: true }
                }
            },
            orderBy: {
                dayOfWeek: 'asc' // Simple ordering for now
            }
        })

        return { success: true, data: groups }
    } catch (error) {
        console.error('Failed to fetch teacher groups:', error)
        return { success: false, error: 'Failed to fetch groups' }
    }
}
