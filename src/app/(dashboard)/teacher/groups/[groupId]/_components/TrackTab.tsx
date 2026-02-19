'use client'

import { useState } from 'react'
import { saveSessionNote } from '@/app/actions/attendance'
import { BookOpen, ExternalLink, Save, Loader2, FileText, Calendar, Link as LinkIcon, Check } from 'lucide-react'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

type Session = {
    id: string
    title: string
    orderIndex: number
    link: string | null
    // We need to pass the pre-calculated date down from allSessions if possible, 
    // or we calculate it here based on track.startDate
}

type GroupTrack = {
    id: string
    startDate: Date
    track: {
        id: string
        title: string
        sessions: Session[]
    }
}

type SessionLog = {
    sessionId: string | null
    notes: string | null
    date: Date
}

type TrackTabProps = {
    groupId: string
    groupTracks: GroupTrack[]
    sessionLogs: SessionLog[]
}

export default function TrackTab({ groupId, groupTracks, sessionLogs }: TrackTabProps) {
    const [notes, setNotes] = useState<{ [key: string]: string }>({})
    const [saving, setSaving] = useState<{ [key: string]: boolean }>({})
    const router = useRouter()

    const handleSaveLog = async (sessionId: string) => {
        const content = notes[sessionId]
        if (!content) return

        setSaving(prev => ({ ...prev, [sessionId]: true }))
        await saveSessionNote(groupId, sessionId, content)
        router.refresh()
        setSaving(prev => ({ ...prev, [sessionId]: false }))
    }

    const getLogForSession = (sessionId: string) => {
        return sessionLogs.find(l => l.sessionId === sessionId)
    }

    if (groupTracks.length === 0) {
        return (
            <div className="p-12 text-center bg-white/50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">Sin Plan de Estudios</h3>
                <p className="text-gray-500">No hay tracks asignados a este grupo actualmente.</p>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            {groupTracks.map((gt, trackIndex) => (
                <div key={gt.id} className="relative">
                    {/* Track Header - Tech Style */}
                    <div className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-md pb-4 pt-2">
                        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-brand-blue/20 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)]">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 flex flex-col items-center justify-center text-white shadow-inner">
                                <span className="text-[10px] font-bold uppercase opacity-80">Misión</span>
                                <span className="text-lg font-black leading-none">{trackIndex + 1}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-brand-navy tracking-tight">{gt.track.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-brand-blue text-xs font-semibold border border-blue-100">
                                        <Calendar className="w-3 h-3" />
                                        Inicio: {new Date(gt.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sessions Timeline */}
                    <div className="ml-6 border-l-2 border-brand-blue/20 space-y-6 py-4">
                        {gt.track.sessions.map((session, index) => {
                            const log = getLogForSession(session.id)
                            const currentNote = notes[session.id] !== undefined ? notes[session.id] : (log?.notes || '')

                            // Calculate exact date based on track startDate and session order
                            const sessionDate = new Date(gt.startDate);
                            const weeksToAdd = session.orderIndex > 0 ? session.orderIndex - 1 : 0;
                            sessionDate.setDate(sessionDate.getDate() + (weeksToAdd * 7));

                            return (
                                <div key={session.id} className="relative pl-8 pr-2 transition-all group">
                                    {/* Timeline dot */}
                                    <div className="absolute left-[-9px] top-4 w-4 h-4 rounded-full bg-white border-4 border-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-125 transition-transform" />

                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group-hover:border-brand-blue/30">
                                        {/* Session Header */}
                                        <div className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-50">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-black text-brand-blue bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                                        S{session.orderIndex}
                                                    </span>
                                                    <h4 className="font-bold text-gray-900 text-lg">{session.title}</h4>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium pl-1">
                                                    <Calendar className="w-4 h-4 text-brand-yellow" />
                                                    {sessionDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </div>
                                            </div>

                                            {/* Resource Link Button */}
                                            {session.link && (
                                                <a
                                                    href={session.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm active:scale-95"
                                                >
                                                    <LinkIcon className="w-4 h-4 text-brand-yellow" />
                                                    Ver Recurso
                                                    <ExternalLink className="w-3 h-3 opacity-50" />
                                                </a>
                                            )}
                                        </div>

                                        {/* Teacher Notes Area */}
                                        <div className="p-5 bg-slate-50/50">
                                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                                <FileText className="w-4 h-4" />
                                                Bitácora del Profesor
                                            </label>

                                            <div className="relative group/textarea">
                                                <textarea
                                                    value={currentNote}
                                                    onChange={(e) => setNotes(prev => ({ ...prev, [session.id]: e.target.value }))}
                                                    placeholder="Apunta aquí cómo ha ido la clase, dudas de los alumnos, etc..."
                                                    className="w-full min-h-[100px] p-4 text-sm bg-white border border-gray-200 rounded-xl resize-none outline-none text-gray-700 placeholder:text-gray-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all shadow-inner"
                                                />

                                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                                    {log && currentNote === log.notes && (
                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                                                            <Check className="w-3 h-3" /> Guardado
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handleSaveLog(session.id)}
                                                        disabled={saving[session.id] || currentNote === (log?.notes || '')}
                                                        className={clsx(
                                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                                            saving[session.id] || currentNote === (log?.notes || '')
                                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-0 group-focus-within/textarea:opacity-100"
                                                                : "bg-brand-yellow text-brand-navy hover:bg-yellow-400 shadow-md active:scale-95 opacity-100"
                                                        )}
                                                    >
                                                        {saving[session.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                        {saving[session.id] ? 'Guardando...' : 'Guardar Bitácora'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
