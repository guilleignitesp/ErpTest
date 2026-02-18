'use client'

import { useState } from 'react'
import { UserCheck, BookOpen, Trophy } from 'lucide-react'
import clsx from 'clsx'
import AttendanceTab from './AttendanceTab'
import TrackTab from './TrackTab'
import EvaluationTab from './EvaluationTab'

// Types needed
type Student = {
    id: string
    name: string
    username: string
    evaluation?: {
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
type Session = { id: string; title: string; link: string | null; orderIndex: number }
type SessionLog = { sessionId: string | null; notes: string | null }
type AttendanceRecord = { studentId: string; sessionId: string; present: boolean }

export default function GroupDetailClient({
    groupId,
    students,
    attendanceRecords,
    sessions,
    sessionLogs,
    startDate
}: {
    groupId: string
    students: Student[]
    attendanceRecords: AttendanceRecord[]
    sessions: Session[]
    sessionLogs: SessionLog[]
    startDate: Date | null
}) {
    const [activeTab, setActiveTab] = useState<'attendance' | 'track' | 'eval'>('attendance')

    return (
        <div className="space-y-6">
            {/* Tabs Header */}
            <div className="flex p-1 bg-gray-100 rounded-xl">
                <button
                    onClick={() => setActiveTab('attendance')}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all",
                        activeTab === 'attendance'
                            ? "bg-white text-brand-navy shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <UserCheck className="w-4 h-4" />
                    Asistencia
                </button>
                <button
                    onClick={() => setActiveTab('track')}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all",
                        activeTab === 'track'
                            ? "bg-white text-brand-navy shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <BookOpen className="w-4 h-4" />
                    Plan de Estudios
                </button>
                <button
                    onClick={() => setActiveTab('eval')}
                    className={clsx(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all",
                        activeTab === 'eval'
                            ? "bg-white text-brand-navy shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Trophy className="w-4 h-4" />
                    Evaluación
                </button>
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                {activeTab === 'attendance' && (
                    <AttendanceTab
                        groupId={groupId}
                        students={students}
                        attendanceRecords={attendanceRecords}
                        startDate={startDate}
                        sessions={sessions}
                    />
                )}

                {activeTab === 'track' && (
                    <TrackTab
                        groupId={groupId}
                        sessions={sessions}
                        logs={sessionLogs}
                    />
                )}

                {activeTab === 'eval' && (
                    <EvaluationTab
                        groupId={groupId}
                        students={students}
                    />
                )}
            </div>
        </div>
    )
}
