'use server'

import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function getStudentDashboardData() {
    const sessionCookie = cookies().get('session')

    if (!sessionCookie || !sessionCookie.value) return null

    let session
    try {
        session = JSON.parse(sessionCookie.value)
    } catch (e) {
        return null
    }

    // FIX: Check for userId, not id
    if (!session || !session.userId) return null

    const user = await prisma.user.findUnique({
        where: { id: session.userId }, // FIX: Use session.userId
        include: {
            groupsAsStudent: {
                take: 1,
                include: {
                    school: true,
                    groupTracks: {
                        include: {
                            track: {
                                include: {
                                    sessions: true
                                }
                            }
                        },
                        orderBy: { startDate: 'desc' }
                    },
                    evaluations: {
                        where: { studentId: session.userId } // FIX: Use session.userId
                    },
                    attendance: {
                        where: { studentId: session.userId, present: true } // FIX: Use session.userId
                    }
                }
            }
        }
    })

    if (!user) return null

    const group = user.groupsAsStudent[0]
    const evaluation = group?.evaluations[0]

    // --- Calculate Mission Progress ---
    let totalSessions = 0
    let currentTrackName = "Sin Misión"

    if (group && group.groupTracks.length > 0) {
        currentTrackName = group.groupTracks[0].track.title
        group.groupTracks.forEach(gt => {
            totalSessions += gt.track.sessions.length
        })
    }

    const attendedSessions = group?.attendance.length || 0
    const progress = totalSessions > 0
        ? Math.round((attendedSessions / totalSessions) * 100)
        : 0

    // --- Calculate XP & Level ---
    const xp = evaluation?.xp || 0
    const level = Math.floor(xp / 1000) + 1
    const xpForCurrentLevel = xp % 1000
    const nextLevelProgress = (xpForCurrentLevel / 1000) * 100

    // --- Leaderboard ---
    let leaderboard = []
    if (group) {
        const groupStudents = await prisma.user.findMany({
            where: {
                groupsAsStudent: {
                    some: { id: group.id }
                }
            },
            select: {
                id: true,
                name: true,
                evaluations: {
                    where: { groupId: group.id },
                    select: { xp: true }
                }
            }
        })

        leaderboard = groupStudents
            .map(s => ({
                id: s.id,
                name: s.name,
                xp: s.evaluations[0]?.xp || 0,
                isCurrentUser: s.id === user.id
            }))
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 5)
            .map((s, index) => ({
                ...s,
                rank: index + 1
            }))
    }

    // --- Skills Data ---
    const skills = [
        { subject: 'Lógica', A: evaluation?.skillLogic || 0, fullMark: 10 },
        { subject: 'Creatividad', A: evaluation?.skillCreativity || 0, fullMark: 10 },
        { subject: 'Equipo', A: evaluation?.skillTeamwork || 0, fullMark: 10 },
        { subject: 'Resolución', A: evaluation?.skillProblemSolving || 0, fullMark: 10 },
        { subject: 'Autonomía', A: evaluation?.skillAutonomy || 0, fullMark: 10 },
        { subject: 'Comun.', A: evaluation?.skillCommunication || 0, fullMark: 10 },
    ]

    return {
        user: {
            name: user.name,
            username: user.username,
            initials: user.name.substring(0, 2).toUpperCase()
        },
        group: group ? { name: group.name } : null,
        xp,
        level,
        nextLevelProgress,
        mission: {
            trackName: currentTrackName,
            progress
        },
        skills,
        leaderboard
    }
}
