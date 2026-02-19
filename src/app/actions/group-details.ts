'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getGroupById(groupId: string) {
    try {
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: {
                school: true,
                teachers: true,
                students: true,
                // Include the new relation for Multi-Tracks
                groupTracks: {
                    include: {
                        track: {
                            include: {
                                sessions: {
                                    orderBy: { orderIndex: 'asc' }
                                }
                            }
                        }
                    },
                    orderBy: { startDate: 'asc' }
                }
            },
        })
        return { success: true, data: group }
    } catch (error) {
        console.error('Failed to fetch group:', error)
        return { success: false, error: 'Failed to fetch group' }
    }
}

export async function getAvailableTeachers() {
    try {
        const teachers = await prisma.user.findMany({
            where: { role: 'TEACHER' },
            orderBy: { name: 'asc' },
        })
        return { success: true, data: teachers }
    } catch (error) {
        console.error('Failed to fetch teachers:', error)
        return { success: false, error: 'Failed to fetch teachers' }
    }
}

export async function getAvailableTracks() {
    try {
        const tracks = await prisma.track.findMany({
            orderBy: { title: 'asc' }
        })
        return { success: true, data: tracks }
    } catch (error) {
        console.error('Failed to fetch tracks:', error)
        return { success: false, error: 'Failed to fetch tracks' }
    }
}

// Add a track to a group (Multi-track support)
export async function addTrackToGroup(groupId: string, trackId: string, startDate: Date) {
    try {
        await prisma.groupTrack.create({
            data: {
                groupId,
                trackId,
                startDate
            }
        })

        revalidatePath(`/admin/groups/${groupId}`)
        revalidatePath(`/teacher/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to add track to group:', error)
        return { success: false, error: 'Failed to add track to group' }
    }
}

// Remove a track from a group
export async function removeTrackFromGroup(groupTrackId: string, groupId: string) {
    try {
        await prisma.groupTrack.delete({
            where: { id: groupTrackId }
        })

        revalidatePath(`/admin/groups/${groupId}`)
        revalidatePath(`/teacher/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to remove track from group:', error)
        return { success: false, error: 'Failed to remove track from group' }
    }
}

export async function assignTeacher(groupId: string, teacherId: string) {
    try {
        await prisma.group.update({
            where: { id: groupId },
            data: {
                teachers: {
                    connect: { id: teacherId },
                },
            },
        })
        revalidatePath(`/admin/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to assign teacher:', error)
        return { success: false, error: 'Failed to assign teacher' }
    }
}

export async function removeTeacher(groupId: string, teacherId: string) {
    try {
        await prisma.group.update({
            where: { id: groupId },
            data: {
                teachers: {
                    disconnect: { id: teacherId },
                },
            },
        })
        revalidatePath(`/admin/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to remove teacher:', error)
        return { success: false, error: 'Failed to remove teacher' }
    }
}
