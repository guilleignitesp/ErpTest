'use client'

import { useState } from 'react'
import { markAttendance } from '@/app/actions/attendance'
import { CheckCircle2, ChevronDown, ChevronUp, Calendar, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

type Student = {
    id: string
    name: string
    username: string
}

type AttendanceRecord = {
    studentId: string
    sessionId: string
    present: boolean
}

type Session = {
    id: string
    title: string
    orderIndex: number
}

export default function AttendanceTab({
    groupId,
    students,
    attendanceRecords,
    startDate,
    sessions
}: {
    groupId: string
    students: Student[]
    attendanceRecords: AttendanceRecord[]
    startDate: Date | null
    sessions: Session[]
}) {
    const [expandedSessionId, setExpandedSessionId] = useState<string | null>(sessions.length > 0 ? sessions[0].id : null)
    const [pendingId, setPendingId] = useState<string | null>(null) // composite key "sessionId-studentId"
    const router = useRouter()

    async function handleToggle(studentId: string, sessionId: string, currentStatus: boolean, date: Date) {
        const compositeKey = `${sessionId}-${studentId}`
        setPendingId(compositeKey)
        const newStatus = !currentStatus
        await markAttendance(groupId, studentId, sessionId, date, newStatus)
        router.refresh()
        setPendingId(null)
    }

    if (!startDate || sessions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                La configuración del calendario no está completa.
            </div>
        )
    }

    const start = new Date(startDate)

    return (
        <div className="space-y-4">
            {sessions.map((session) => {
                const isExpanded = expandedSessionId === session.id
                // Calculate date: startDate + (orderIndex - 1) * 7 days
                const sessionDate = new Date(start)
                sessionDate.setDate(start.getDate() + (session.orderIndex - 1) * 7)

                // Check completion status (if any attendance record exists for this session)
                const sessionAtt = attendanceRecords.filter(r => r.sessionId === session.id)
                const isCompleted = sessionAtt.length > 0

                return (
                    <div key={session.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Header / Summary Card */}
                        <div
                            onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold border",
                                    isExpanded ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-gray-500 border-gray-200"
                                )}>
                                    <span className="uppercase">{sessionDate.toLocaleDateString('es-ES', { month: 'short' })}</span>
                                    <span className="text-lg">{sessionDate.getDate()}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-brand-navy">Sesión {session.orderIndex}: {session.title}</h4>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        {sessionDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={clsx(
                                    "text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide",
                                    isCompleted
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-500"
                                )}>
                                    {isCompleted ? "Completada" : "Pendiente"}
                                </span>
                                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </div>
                        </div>

                        {/* Expanded Student List */}
                        {isExpanded && (
                            <div className="border-t border-gray-100 p-4 bg-gray-50/50 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {students.map(student => {
                                    const record = sessionAtt.find(r => r.studentId === student.id)
                                    const isPresent = record?.present || false
                                    const compositeKey = `${session.id}-${student.id}`
                                    const isPending = pendingId === compositeKey

                                    return (
                                        <div
                                            key={student.id}
                                            onClick={() => !isPending && handleToggle(student.id, session.id, isPresent, sessionDate)}
                                            className={clsx(
                                                "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer bg-white",
                                                isPresent ? "border-green-200 ring-1 ring-green-100" : "border-gray-200 hover:border-brand-blue/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                                                    isPresent ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                                                )}>
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className={clsx("font-medium text-sm", isPresent ? "text-green-900" : "text-gray-700")}>
                                                    {student.name}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className={clsx(
                                                    "text-xs font-bold uppercase",
                                                    isPresent ? "text-green-600" : "text-gray-400"
                                                )}>
                                                    {isPresent ? "Presente" : "Ausente"}
                                                </span>
                                                <div className={clsx(
                                                    "w-10 h-5 rounded-full p-0.5 transition-colors relative",
                                                    isPresent ? "bg-green-500" : "bg-gray-300"
                                                )}>
                                                    <div className={clsx(
                                                        "w-4 h-4 bg-white rounded-full shadow-sm transition-transform transform",
                                                        isPresent ? "translate-x-5" : "translate-x-0"
                                                    )} />
                                                </div>
                                                {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                                            </div>
                                        </div>
                                    )
                                })}
                                {students.length === 0 && <p className="text-center text-sm text-gray-400 italic py-2">No hay alumnos.</p>}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
