import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, GraduationCap, Calendar } from 'lucide-react'
import AttendanceTab from './_components/AttendanceTab'
import TrackTab from './_components/TrackTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs' // Assuming we don't have this, I will implement a simple client tab switcher inline or use a simple HTML approach if shadcn not installed. Since I don't see shadcn components in file tree, I'll build a custom simple tab switcher.

const prisma = new PrismaClient()

// I'll create a Client Component for the Tabs layout to avoid huge file here
import GroupDetailClient from './_components/GroupDetailClient'

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
            track: {
                include: {
                    sessions: {
                        orderBy: { orderIndex: 'asc' }
                    }
                }
            },
            attendance: true, // Fetch all attendance to map to sessions
            sessionLogs: true // fetch all logs for this group to map them in TrackTab
        }
    })

    if (!group) return notFound()

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

            {(!group.trackId || !group.startDate) && (
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
                                    Este grupo no tiene asignado un <strong>Plan de Estudios (Track)</strong> o una <strong>Fecha de Inicio</strong>.
                                    Algunas funcionalidades como el seguimiento de sesiones no estarán disponibles hasta que un administrador lo configure.
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
                startDate={group.startDate}
                attendanceRecords={group.attendance.map(a => ({
                    studentId: a.studentId,
                    sessionId: a.sessionId || '', // should be present now
                    present: a.present
                }))}
                sessions={group.track?.sessions || []}
                sessionLogs={group.sessionLogs}
            />
        </div>
    )
}
