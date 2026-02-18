'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function getSchools() {
    try {
        const schools = await prisma.school.findMany({
            include: {
                groups: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return { success: true, data: schools }
    } catch (error) {
        console.error('Failed to fetch schools:', error)
        return { success: false, error: 'Failed to fetch schools' }
    }
}

export async function createSchool(formData: FormData) {
    const name = formData.get('name') as string

    if (!name || name.trim() === '') {
        return { error: 'Name is required' }
    }

    try {
        await prisma.school.create({
            data: {
                name,
            },
        })

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to create school:', error)
        return { error: 'Failed to create school' }
    }
}
