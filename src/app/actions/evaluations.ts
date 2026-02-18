'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export type StudentEnrollment = {
    userId: string
    groupId: string
    name: string
    username: string
    groupName: string
    schoolName: string
    teachers: string[]
    evaluation: {
        id: string
        xp: number
        skillLogic: number
        skillCreativity: number
        skillTeamwork: number
        skillProblemSolving: number
        skillAutonomy: number
        skillCommunication: number
    } | null
}

export async function getStudentEnrollments(query?: string) {
    try {
        const students = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                OR: query ? [
                    { name: { contains: query } }, // Case insensitive usually depends on DB collation
                    { username: { contains: query } }
                ] : undefined
            },
            include: {
                groupsAsStudent: {
                    include: {
                        school: true,
                        teachers: true,
                        evaluations: true // We need to filter this manually to match the student
                    }
                }
            },
            orderBy: { name: 'asc' }
        })

        // Flatten the structure: One row per Group Enrollment
        const enrollments: StudentEnrollment[] = []

        for (const student of students) {
            for (const group of student.groupsAsStudent) {
                // Find the evaluation for THIS student in THIS group
                const evaluation = group.evaluations.find(e => e.studentId === student.id) || null

                enrollments.push({
                    userId: student.id,
                    groupId: group.id,
                    name: student.name,
                    username: student.username,
                    groupName: group.name,
                    schoolName: group.school.name,
                    teachers: group.teachers.map(t => t.name),
                    evaluation: evaluation ? {
                        id: evaluation.id,
                        xp: evaluation.xp,
                        skillLogic: evaluation.skillLogic,
                        skillCreativity: evaluation.skillCreativity,
                        skillTeamwork: evaluation.skillTeamwork,
                        skillProblemSolving: evaluation.skillProblemSolving,
                        skillAutonomy: evaluation.skillAutonomy,
                        skillCommunication: evaluation.skillCommunication
                    } : null
                })
            }
        }

        return { success: true, data: enrollments }
    } catch (error) {
        console.error('Failed to fetch enrollments:', error)
        return { success: false, error: 'Failed to fetch enrollments' }
    }
}

export type EvaluationData = {
    xp: number
    skillLogic: number
    skillCreativity: number
    skillTeamwork: number
    skillProblemSolving: number
    skillAutonomy: number
    skillCommunication: number
}

export async function updateEvaluation(groupId: string, studentId: string, data: EvaluationData) {
    try {
        await prisma.evaluation.upsert({
            where: {
                groupId_studentId: {
                    groupId,
                    studentId
                }
            },
            create: {
                groupId,
                studentId,
                xp: data.xp,
                skillLogic: data.skillLogic,
                skillCreativity: data.skillCreativity,
                skillTeamwork: data.skillTeamwork,
                skillProblemSolving: data.skillProblemSolving,
                skillAutonomy: data.skillAutonomy,
                skillCommunication: data.skillCommunication
            },
            update: {
                xp: data.xp,
                skillLogic: data.skillLogic,
                skillCreativity: data.skillCreativity,
                skillTeamwork: data.skillTeamwork,
                skillProblemSolving: data.skillProblemSolving,
                skillAutonomy: data.skillAutonomy,
                skillCommunication: data.skillCommunication
            }
        })

        revalidatePath(`/teacher/groups/${groupId}`)
        revalidatePath('/admin/students')
        return { success: true }
    } catch (error) {
        console.error('Failed to update evaluation:', error)
        return { success: false, error: 'Failed to update evaluation' }
    }
}
