'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// --- REASONS MANAGEMENT (Admin) ---

export async function getAbsenceReasons() {
    try {
        const reasons = await prisma.absenceReason.findMany({
            orderBy: { name: 'asc' }
        })
        return { success: true, data: reasons }
    } catch (error) {
        console.error("Failed to fetch absence reasons:", error)
        return { success: false, error: "Failed to fetch reasons" }
    }
}

export async function createAbsenceReason(name: string) {
    if (!name.trim()) return { success: false, error: "Name is required" }
    try {
        await prisma.absenceReason.create({
            data: { name: name.trim() }
        })
        revalidatePath('/admin/absences')
        return { success: true }
    } catch (error) {
        console.error("Failed to create reason:", error)
        return { success: false, error: "Failed to create reason or already exists" }
    }
}

export async function deleteAbsenceReason(id: string) {
    try {
        await prisma.absenceReason.delete({ where: { id } })
        revalidatePath('/admin/absences')
        return { success: true }
    } catch (error) {
        console.error("Failed to delete reason:", error)
        return { success: false, error: "Cannot delete reason (might be in use)" }
    }
}

// --- REQUESTS MANAGEMENT ---

export async function createAbsenceRequest(data: { teacherId: string, reasonId: string, description: string, startDate: Date, endDate: Date }) {
    try {
        await prisma.absenceRequest.create({
            data: {
                teacherId: data.teacherId,
                reasonId: data.reasonId,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                status: 'PENDING'
            }
        })
        revalidatePath('/teacher/absences')
        revalidatePath('/admin/absences')
        return { success: true }
    } catch (error) {
        console.error("Failed to create absence request:", error)
        return { success: false, error: "Failed to submit request" }
    }
}

export async function getTeacherAbsenceRequests(teacherId: string) {
    try {
        const requests = await prisma.absenceRequest.findMany({
            where: { teacherId },
            include: { reason: true },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: requests }
    } catch (error) {
        console.error("Failed to fetch teacher requests:", error)
        return { success: false, error: "Failed to fetch requests" }
    }
}

export async function getAdminAbsenceRequests() {
    try {
        const requests = await prisma.absenceRequest.findMany({
            include: {
                reason: true,
                teacher: {
                    select: { name: true, username: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: requests }
    } catch (error) {
        console.error("Failed to fetch all requests:", error)
        return { success: false, error: "Failed to fetch requests" }
    }
}

export async function updateAbsenceStatus(requestId: string, newStatus: 'APPROVED' | 'REJECTED') {
    try {
        await prisma.absenceRequest.update({
            where: { id: requestId },
            data: { status: newStatus }
        })
        revalidatePath('/admin/absences')
        revalidatePath('/teacher/absences')
        return { success: true }
    } catch (error) {
        console.error("Failed to update status:", error)
        return { success: false, error: "Failed to update status" }
    }
}
