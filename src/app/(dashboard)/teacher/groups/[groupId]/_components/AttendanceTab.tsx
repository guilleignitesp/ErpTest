'use client'

import { useState, useTransition } from 'react'
import { markAttendance } from '@/app/actions/attendance'
import { Check, X, Loader2, Calendar } from 'lucide-react'
import clsx from 'clsx'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Student = {
    id: string
    name: string
}

type Session = {
    id: string
    title: string
    orderIndex: number
    date: Date
    trackTitle?: string
}

type AttendanceRecord = {
    studentId: string
    sessionId: string
    present: boolean
}

type AttendanceTabProps = {
    groupId: string
    students: Student[]
    sessions: Session[]
    attendanceRecords: AttendanceRecord[]
}

export default function AttendanceTab({ groupId, students, sessions, attendanceRecords }: AttendanceTabProps) {
    const [isPending, startTransition] = useTransition()

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                        <tr>
                            <th className="p-4 min-w-[200px] sticky left-0 bg-gray-50 z-10">Estudiante</th>
                            {sessions.map((session) => (
                                <th key={session.id} className="p-4 min-w-[120px] text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        {session.trackTitle && (
                                            <span className="text-xs text-brand-blue font-bold">{session.trackTitle}</span>
                                        )}
                                        <span className="font-bold">{session.title}</span>
                                        <span className="text-xs text-gray-400 font-normal normal-case flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(session.date), 'd MMM', { locale: es })}
                                        </span>
                                    </div>
                                </th>
                            ))}
                            <th className="p-4 min-w-[100px] text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map((student) => {
                            // Calculate total attendance for this student
                            const presentCount = attendanceRecords.filter(r => r.studentId === student.id && r.present).length
                            const totalSessions = sessions.length
                            const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0

                            return (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                        {student.name}
                                    </td>
                                    {sessions.map((session) => {
                                        const record = attendanceRecords.find(r => r.studentId === student.id && r.sessionId === session.id)
                                        const isPresent = record?.present || false

                                        return (
                                            <td key={session.id} className="p-4 text-center">
                                                <button
                                                    onClick={() => {
                                                        startTransition(async () => {
                                                            await markAttendance(groupId, student.id, session.id, session.date, !isPresent)
                                                        })
                                                    }}
                                                    disabled={isPending}
                                                    className={clsx(
                                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                                        isPresent
                                                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                                                            : "bg-gray-100 text-gray-300 hover:bg-gray-200"
                                                    )}
                                                >
                                                    {isPresent ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                </button>
                                            </td>
                                        )
                                    })}
                                    <td className="p-4 text-center font-bold text-brand-navy">
                                        {percentage}%
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
