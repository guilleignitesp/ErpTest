'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function markAttendance(groupId: string, studentId: string, sessionId: string, date: Date, present: boolean) {
    try {
        // We now track attendance per session, so we ignore the exact time of day and trust the passed date/sessionId

        // Find existing record
        const existing = await prisma.attendance.findFirst({
            where: {
                groupId,
                studentId,
                sessionId
            }
        })

        if (existing) {
            await prisma.attendance.update({
                where: { id: existing.id },
                data: { present, date } // Update date too in case it changed (unlikely for session but good for data integrity)
            })
        } else {
            await prisma.attendance.create({
                data: {
                    groupId,
                    studentId,
                    sessionId,
                    date,
                    present
                }
            })
        }

        revalidatePath(`/teacher/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to mark attendance:', error)
        return { success: false, error: 'Failed to mark attendance' }
    }
}

export async function saveSessionNote(groupId: string, sessionId: string, notes: string) {
    try {
        // We want one log per session per group. 
        // If it exists, update it. If not, create it.
        const existing = await prisma.sessionLog.findFirst({
            where: {
                groupId,
                sessionId
            }
        })

        if (existing) {
            await prisma.sessionLog.update({
                where: { id: existing.id },
                data: { notes }
            })
        } else {
            await prisma.sessionLog.create({
                data: {
                    groupId,
                    sessionId,
                    notes,
                    date: new Date()
                }
            })
        }

        revalidatePath(`/teacher/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to save session note:', error)
        return { success: false, error: 'Failed to save session note' }
    }
}
