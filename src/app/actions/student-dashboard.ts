'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export type StudentDashboardData = {
    user: {
        name: string
        username: string
        initials: string
    }
    group: {
        name: string
    } | null
    xp: number
    level: number
    nextLevelProgress: number // 0-100
    skills: {
        subject: string
        A: number
        fullMark: number
    }[]
    mission: {
        trackName: string
        progress: number // 0-100
    } | null
    leaderboard: {
        rank: number
        name: string
        xp: number
        isCurrentUser: boolean
    }[]
}

export async function getStudentDashboardData(): Promise<StudentDashboardData | null> {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie || !sessionCookie.value) {
        return null
    }

    let session
    try {
        session = JSON.parse(sessionCookie.value)
    } catch (e) {
        return null
    }

    const userId = session.userId

    // Fetch Student with Group, Track, Evaluation
    const student = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            groupsAsStudent: {
                take: 1, // Focus on the first group for now
                include: {
                    school: true,
                    track: {
                        include: {
                            sessions: true
                        }
                    },
                    evaluations: true, // This returns all evaluations for this group (which should be just one per student-group pair, but relation is 1-N from Group side? No, User-Evaluation is 1-N. Group-Evaluation is 1-N. We need to filter by studentId in the relation or just find relation)
                    // Actually, let's fetch specific evaluation separately or filter in memory if easier.
                    // The relation `evaluations` in Group model includes ALL students' evaluations. That's too much.
                    // The relation `evaluations` in User model includes evaluations for ALL groups.
                }
            },
            evaluations: true, // Fetch user's evaluations
            attendance: true
        }
    })

    if (!student) return null

    const group = student.groupsAsStudent[0]
    if (!group) {
        // Fallback if no group
        return {
            user: {
                name: student.name,
                username: student.username,
                initials: student.name.substring(0, 2).toUpperCase()
            },
            group: null,
            xp: 0,
            level: 1,
            nextLevelProgress: 0,
            skills: [],
            mission: null,
            leaderboard: []
        }
    }

    // 1. Evaluations & XP
    // Find evaluation for this specific group
    const evaluation = student.evaluations.find(e => e.groupId === group.id)

    const xp = evaluation?.xp || 0
    const level = Math.floor(xp / 1000) + 1
    const nextLevelProgress = (xp % 1000) / 10 // (Remainder / 1000) * 100

    // Skills Mapping for Radar Chart
    const skills = [
        { subject: 'Logic', A: evaluation?.skillLogic || 0, fullMark: 10 },
        { subject: 'Creativity', A: evaluation?.skillCreativity || 0, fullMark: 10 },
        { subject: 'Teamwork', A: evaluation?.skillTeamwork || 0, fullMark: 10 },
        { subject: 'Problem Solving', A: evaluation?.skillProblemSolving || 0, fullMark: 10 },
        { subject: 'Autonomy', A: evaluation?.skillAutonomy || 0, fullMark: 10 },
        { subject: 'Communication', A: evaluation?.skillCommunication || 0, fullMark: 10 },
    ]

    // 2. Mission Progress (Track)
    let mission = null
    if (group.track) {
        const totalSessions = group.track.sessions.length
        // Count distinct sessions attended for this group
        // Attendance records for this student in this group where present is true
        // and sessionId is associated with the track
        // Simplified: Count attendance where group works and present=true. 
        // Ideally we match sessions, but count is a good proxy.
        // Let's filter attendance by groupId and present=true
        const attendedSessions = student.attendance.filter(a => a.groupId === group.id && a.present).length

        const progress = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0

        mission = {
            trackName: group.track.title,
            progress: Math.min(progress, 100)
        }
    }

    // 3. Leaderboard
    // Fetch all evaluations for this group, ordered by XP desc
    const groupEvaluations = await prisma.evaluation.findMany({
        where: { groupId: group.id },
        include: { student: true },
        orderBy: { xp: 'desc' },
        take: 5
    })

    const leaderboard = groupEvaluations.map((evalRecord, index) => ({
        rank: index + 1,
        name: evalRecord.student.name,
        xp: evalRecord.xp,
        isCurrentUser: evalRecord.studentId === userId
    }))

    return {
        user: {
            name: student.name,
            username: student.username,
            initials: student.name.substring(0, 2).toUpperCase()
        },
        group: {
            name: group.name
        },
        xp,
        level,
        nextLevelProgress,
        skills,
        mission,
        leaderboard
    }
}
