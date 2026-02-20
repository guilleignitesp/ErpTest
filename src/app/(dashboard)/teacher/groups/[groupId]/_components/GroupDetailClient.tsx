'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserCheck, BookOpen, BarChart2 } from 'lucide-react'
import AttendanceTab from './AttendanceTab'
import TrackTab from './TrackTab'
import EvaluationTab from './EvaluationTab'

type Session = {
    id: string
    title: string
    orderIndex: number
    date: Date | string
    trackTitle?: string
    link: string | null
}

type GroupTrack = {
    id: string
    startDate: Date
    track: {
        id: string
        title: string
        sessions: {
            id: string
            title: string
            orderIndex: number
            link: string | null
        }[]
    }
}

type SessionLog = {
    sessionId: string | null
    notes: string | null
    date: Date
}

type GroupDetailClientProps = {
    groupId: string
    students: any[]
    groupTracks: GroupTrack[]
    sessions?: Session[] // New prop, optional for compatibility but expected now
    attendanceRecords: any[]
    sessionLogs: SessionLog[]
    startDate?: Date | null
}

export default function GroupDetailClient({
    groupId,
    students,
    groupTracks,
    sessions,
    attendanceRecords,
    sessionLogs
}: GroupDetailClientProps) {
    const [activeTab, setActiveTab] = useState('attendance')

    // Use passed sessions or fallback (though page.tsx should provide them now)
    // We convert string dates back to Date objects if needed because AttendanceTab expects Date or checks with new Date()
    const allSessions = (sessions || []).map(s => ({
        ...s,
        date: typeof s.date === 'string' ? new Date(s.date) : s.date
    }))

    return (
        <div className="space-y-6">
            <Tabs defaultValue="attendance" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 p-1 rounded-xl">
                    <TabsTrigger value="attendance" className="data-[state=active]:bg-brand-yellow data-[state=active]:text-brand-navy text-gray-400 font-medium py-2 rounded-lg transition-all">
                        <div className="flex items-center justify-center gap-2">
                            <UserCheck className="w-4 h-4" />
                            Asistencia
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="track" className="data-[state=active]:bg-brand-blue data-[state=active]:text-white text-gray-400 font-medium py-2 rounded-lg transition-all">
                        <div className="flex items-center justify-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Plan de Estudios
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="evaluations" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-400 font-medium py-2 rounded-lg transition-all">
                        <div className="flex items-center justify-center gap-2">
                            <BarChart2 className="w-4 h-4" />
                            Evaluaciones
                        </div>
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="attendance" className="m-0 focus-visible:outline-none">
                        <AttendanceTab
                            groupId={groupId}
                            students={students}
                            sessions={allSessions} // Pass consolidated sessions
                            attendanceRecords={attendanceRecords}
                        />
                    </TabsContent>

                    <TabsContent value="track" className="m-0 focus-visible:outline-none">
                        <TrackTab
                            groupId={groupId}
                            groupTracks={groupTracks} // Pass all tracks
                            sessionLogs={sessionLogs}
                        />
                    </TabsContent>

                    <TabsContent value="evaluations" className="m-0 focus-visible:outline-none">
                        <EvaluationTab
                            groupId={groupId}
                            students={students}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
