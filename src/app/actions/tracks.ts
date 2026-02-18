'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getTracks() {
    try {
        const tracks = await prisma.track.findMany({
            orderBy: {
                title: 'asc',
            },
            include: {
                _count: {
                    select: { sessions: true },
                },
            },
        })
        return { success: true, data: tracks }
    } catch (error) {
        console.error('Failed to fetch tracks:', error)
        return { success: false, error: 'Failed to fetch tracks' }
    }
}

export async function createTrack(formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!title) {
        return { error: 'Title is required' }
    }

    try {
        await prisma.track.create({
            data: {
                title,
                description,
            },
        })

        revalidatePath('/admin/tracks')
        return { success: true }
    } catch (error) {
        console.error('Failed to create track:', error)
        return { error: 'Failed to create track' }
    }
}

export async function getTrackById(trackId: string) {
    try {
        const track = await prisma.track.findUnique({
            where: { id: trackId },
            include: {
                sessions: {
                    orderBy: {
                        orderIndex: 'asc',
                    },
                },
            },
        })
        return { success: true, data: track }
    } catch (error) {
        console.error('Failed to fetch track:', error)
        return { success: false, error: 'Failed to fetch track' }
    }
}

export async function addSession(formData: FormData) {
    const trackId = formData.get('trackId') as string
    const title = formData.get('title') as string
    const link = formData.get('link') as string

    if (!trackId || !title) {
        return { error: 'Track ID and Title are required' }
    }

    try {
        // Find current max orderIndex
        const lastSession = await prisma.session.findFirst({
            where: { trackId },
            orderBy: { orderIndex: 'desc' },
        })

        const newOrderIndex = lastSession ? lastSession.orderIndex + 1 : 1

        await prisma.session.create({
            data: {
                trackId,
                title,
                link,
                orderIndex: newOrderIndex,
            },
        })

        revalidatePath(`/admin/tracks/${trackId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to add session:', error)
        return { error: 'Failed to add session' }
    }
}

export async function deleteSession(sessionId: string, trackId: string) {
    try {
        await prisma.session.delete({
            where: { id: sessionId },
        })

        revalidatePath(`/admin/tracks/${trackId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to delete session:', error)
        return { success: false, error: 'Failed to delete session' }
    }
}
