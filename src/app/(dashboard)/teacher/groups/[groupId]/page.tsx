import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, GraduationCap, Calendar, Clock } from 'lucide-react'
import { addWeeks } from 'date-fns'
import GroupDetailClient from './_components/GroupDetailClient'

const prisma = new PrismaClient()

export default async function TeacherGroupPage({ params }: { params: { groupId: string } }) {
    const group = await prisma.group.findUnique({
        where: { id: params.groupId },
        include: {
            school: true,
            students: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    evaluations: {
                        where: { groupId: params.groupId },
                        take: 1
                    }
                },
                orderBy: { name: 'asc' }
            },
            // Fetch the new Multi-Track relation
            groupTracks: {
                include: {
                    track: {
                        include: {
                            sessions: {
                                orderBy: { orderIndex: 'asc' },
                                select: {
                                    id: true,
                                    title: true,
                                    orderIndex: true,
                                    link: true
                                }
                            }
                        }
                    }
                },
                orderBy: { startDate: 'asc' }
            },
            attendance: true, // Fetch attendance
            sessionLogs: true
        }
    })

    if (!group) return notFound()

    // --- DATA TRANSFORMATION FOR MULTI-TRACK ---
    // We need to flatten sessions from all tracks into a single timeline
    // and calculate the specific date for each session.

    let allSessions: any[] = []

    if (group.groupTracks.length > 0) {
        allSessions = group.groupTracks.flatMap(gt => {
            return gt.track.sessions.map(session => {
                // Logic: Session Date = Track Start Date + (OrderIndex - 1) weeks
                // Assuming orderIndex starts at 1. If starts at 0, remove the -1.
                // Usually orderIndex 1 is the first session (week 0).
                const weeksToAdd = session.orderIndex > 0 ? session.orderIndex - 1 : 0
                const sessionDate = addWeeks(new Date(gt.startDate), weeksToAdd)

                return {
                    ...session,
                    date: sessionDate.toISOString(), // Pass as string to Client Component
                    trackTitle: gt.track.title // Useful to show which track it belongs to
                }
            })
        })

        // Sort all sessions by date chronologically
        allSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    // Determine a "primary" start date just for the header display (use the first track's date or null)
    const displayStartDate = group.groupTracks.length > 0 ? group.groupTracks[0].startDate : null

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/teacher" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-brand-navy">{group.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {group.school.name}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {group.dayOfWeek} {group.timeSlot}</span>
                    </div>
                </div>
            </div>

            {group.groupTracks.length === 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0">
                            <Clock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Configuración Incompleta
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    Este grupo no tiene asignado ningún <strong>Plan de Estudios (Track)</strong>.
                                    Contacta con el administrador para que asigne los tracks y fechas de inicio.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <GroupDetailClient
                groupId={group.id}
                students={group.students.map((s: any) => ({
                    ...s,
                    evaluation: s.evaluations[0] || null
                }))}
                // Pass null if no tracks, otherwise the first track date, 
                // BUT the important part is the `sessions` array which now has dates.
                startDate={displayStartDate}
                attendanceRecords={group.attendance.map(a => ({
                    studentId: a.studentId,
                    sessionId: a.sessionId || '',
                    present: a.present
                }))}
                sessions={allSessions}
                sessionLogs={group.sessionLogs}
                groupTracks={group.groupTracks}
            />
        </div>
    )
}
