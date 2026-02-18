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

export async function assignTrackToGroup(groupId: string, trackId: string, startDate: Date | null) {
    try {
        await prisma.group.update({
            where: { id: groupId },
            data: {
                trackId: trackId,
                startDate: startDate
            },
        })
        revalidatePath(`/admin/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to assign track:', error)
        return { success: false, error: 'Failed to assign track' }
    }
}
