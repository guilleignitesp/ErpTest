'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getAllTeachers() {
    try {
        const teachers = await prisma.user.findMany({
            where: { role: 'TEACHER' },
            include: {
                groupsAsTeacher: {
                    select: {
                        id: true,
                        name: true,
                        dayOfWeek: true,
                        timeSlot: true,
                        school: {
                            select: { name: true }
                        }
                    },
                },
            },
            orderBy: { name: 'asc' },
        })
        return { success: true, data: teachers }
    } catch (error) {
        console.error('Failed to fetch teachers:', error)
        return { success: false, error: 'Failed to fetch teachers' }
    }
}

export async function createTeacher(formData: FormData) {
    const name = formData.get('name') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!name || !username || !password) {
        return { error: 'All fields are required' }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        })

        if (existingUser) {
            return { error: 'Username already exists' }
        }

        await prisma.user.create({
            data: {
                name,
                username,
                password, // Plain text for MVP
                role: 'TEACHER',
            },
        })

        revalidatePath('/admin/teachers')
        return { success: true }
    } catch (error) {
        console.error('Failed to create teacher:', error)
        return { error: 'Failed to create teacher' }
    }
}
