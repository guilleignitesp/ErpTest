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
        // Check if username already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        })

        if (existingUser) {
            return { error: 'Username already exists' }
        }

        // Create User and connect to Group
        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                password, // Storing plain text as per MVP requirements
                role: 'STUDENT',
                groupsAsStudent: {
                    connect: { id: groupId },
                },
            },
        })

        // Create empty Evaluation for this student/group
        await prisma.evaluation.create({
            data: {
                studentId: newUser.id,
                groupId: groupId,
                xp: 0,
            },
        })

        revalidatePath(`/admin/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to create student:', error)
        return { error: 'Failed to create student' }
    }
}

export async function removeStudentFromGroup(groupId: string, studentId: string) {
    try {
        await prisma.group.update({
            where: { id: groupId },
            data: {
                students: {
                    disconnect: { id: studentId },
                },
            },
        })

        // Optionally delete evaluation logic could go here, but keeping it simple for now (keep history)

        revalidatePath(`/admin/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to remove student:', error)
        return { success: false, error: 'Failed to remove student' }
    }
}
