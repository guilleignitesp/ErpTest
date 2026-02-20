'use server'

import { PrismaClient, EnrollmentLog } from '@prisma/client'

const prisma = new PrismaClient()

export async function getEnrollmentDashboardData() {
    try {
        const logs = await prisma.enrollmentLog.findMany({
            orderBy: { date: 'desc' }
        })

        // Current total active students (Unique students currently in groups)
        const totalActiveStudents = await prisma.user.count({
            where: {
                role: 'STUDENT',
                groupsAsStudent: { some: {} }
            }
        })

        const totalAltas = logs.filter((l: EnrollmentLog) => l.type === 'ALTA').length
        const totalBajas = logs.filter((l: EnrollmentLog) => l.type === 'BAJA').length

        // Group by School
        const bySchool = logs.reduce((acc: Record<string, { ALTA: number, BAJA: number }>, log: EnrollmentLog) => {
            if (!acc[log.schoolName]) acc[log.schoolName] = { ALTA: 0, BAJA: 0 }
            acc[log.schoolName][log.type as 'ALTA' | 'BAJA'] += 1
            return acc
        }, {})

        // Group by Teacher
        const byTeacher = logs.reduce((acc: Record<string, { ALTA: number, BAJA: number }>, log: EnrollmentLog) => {
            const teacher = log.teacherNames || 'Sin Profesor'
            if (!acc[teacher]) acc[teacher] = { ALTA: 0, BAJA: 0 }
            acc[teacher][log.type as 'ALTA' | 'BAJA'] += 1
            return acc
        }, {})

        // Group by Month (YYYY-MM)
        const byMonth = logs.reduce((acc: Record<string, { ALTA: number, BAJA: number }>, log: EnrollmentLog) => {
            const month = log.date.toISOString().substring(0, 7) // "2024-03"
            if (!acc[month]) acc[month] = { ALTA: 0, BAJA: 0 }
            acc[month][log.type as 'ALTA' | 'BAJA'] += 1
            return acc
        }, {})

        return {
            success: true,
            data: {
                totalActiveStudents,
                totalAltas,
                totalBajas,
                logs,
                aggregations: {
                    bySchool: Object.entries(bySchool).map(([name, data]) => ({ name, ...data })),
                    byTeacher: Object.entries(byTeacher).map(([name, data]) => ({ name, ...data })),
                    byMonth: Object.entries(byMonth).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.name.localeCompare(a.name))
                }
            }
        }
    } catch (error) {
        console.error("Failed to fetch enrollment data:", error)
        return { success: false, error: "Failed to fetch data" }
    }
}
