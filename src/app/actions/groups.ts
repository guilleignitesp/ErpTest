'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function createGroup(formData: FormData) {
    const schoolId = formData.get('schoolId') as string
    const name = formData.get('name') as string
    const dayOfWeek = formData.get('dayOfWeek') as string
    const timeSlot = formData.get('timeSlot') as string
    const subject = formData.get('subject') as string
    const ageRange = formData.get('ageRange') as string

    if (!schoolId || !name || !dayOfWeek || !timeSlot || !subject || !ageRange) {
        return { error: 'All fields are required' }
    }

    try {
        await prisma.group.create({
            data: {
                schoolId,
                name,
                dayOfWeek,
                timeSlot,
                subject,
                ageRange,
            },
        })

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to create group:', error)
        return { error: 'Failed to create group' }
    }
}
