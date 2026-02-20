'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function createAndAssignStudent(formData: FormData) {
    const groupId = formData.get('groupId') as string
    const name = formData.get('name') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!groupId || !name || !username || !password) {
        return { error: 'All fields are required' }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        })

        if (existingUser) {
            return { error: 'Username already exists' }
        }

        // Fetch group context for the log
        const groupContext = await prisma.group.findUnique({
            where: { id: groupId },
            include: { school: true, teachers: true }
        })

        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                password,
                role: 'STUDENT',
                groupsAsStudent: {
                    connect: { id: groupId },
                },
            },
        })

        await prisma.evaluation.create({
            data: {
                studentId: newUser.id,
                groupId: groupId,
                xp: 0,
            },
        })

        // --- NEW: LOG ALTA ---
        if (groupContext) {
            const teacherNames = groupContext.teachers.map(t => t.name).join(', ')
            await prisma.enrollmentLog.create({
                data: {
                    type: 'ALTA',
                    studentId: newUser.id,
                    studentName: newUser.name,
                    groupId: groupContext.id,
                    groupName: groupContext.name,
                    schoolName: groupContext.school.name,
                    teacherNames: teacherNames || 'Sin profesor'
                }
            })
        }

        revalidatePath(`/admin/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to create student:', error)
        return { error: 'Failed to create student' }
    }
}

export async function removeStudentFromGroup(groupId: string, studentId: string) {
    try {
        // Fetch context BEFORE removing
        const groupContext = await prisma.group.findUnique({
            where: { id: groupId },
            include: { school: true, teachers: true }
        })
        const studentContext = await prisma.user.findUnique({
            where: { id: studentId }
        })

        await prisma.group.update({
            where: { id: groupId },
            data: {
                students: {
                    disconnect: { id: studentId },
                },
            },
        })

        // --- NEW: LOG BAJA ---
        if (groupContext && studentContext) {
            const teacherNames = groupContext.teachers.map(t => t.name).join(', ')
            await prisma.enrollmentLog.create({
                data: {
                    type: 'BAJA',
                    studentId: studentContext.id,
                    studentName: studentContext.name,
                    groupId: groupContext.id,
                    groupName: groupContext.name,
                    schoolName: groupContext.school.name,
                    teacherNames: teacherNames || 'Sin profesor'
                }
            })
        }

        revalidatePath(`/admin/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to remove student:', error)
        return { success: false, error: 'Failed to remove student' }
    }
}
