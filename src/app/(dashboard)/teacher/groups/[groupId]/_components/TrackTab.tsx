'use client'

import { useState } from 'react'
import { saveSessionNote } from '@/app/actions/attendance'
import { BookOpen, ExternalLink, Save, Loader2, Check } from 'lucide-react'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

type Session = {
    id: string
    title: string
    link: string | null
    orderIndex: number
}

type SessionLog = {
    sessionId: string | null
    notes: string | null
}

export default function TrackTab({
    groupId,
    sessions,
    logs
}: {
    groupId: string
    sessions: Session[]
    logs: SessionLog[]
}) {
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
    const [noteDraft, setNoteDraft] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    async function handleSave(sessionId: string) {
        setIsSaving(true)
        await saveSessionNote(groupId, sessionId, noteDraft)
        router.refresh()
        setIsSaving(false)
        setEditingSessionId(null)
    }

    function startEditing(session: Session, existingNote: string) {
        setEditingSessionId(session.id)
        setNoteDraft(existingNote)
    }

    return (
        <div className="space-y-6">
            <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-blue" />
                Plan de Estudios
            </h3>

            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-8">
                {sessions.map((session, idx) => {
                    const log = logs.find(l => l.sessionId === session.id)
                    const existingNote = log?.notes || ''
                    const isEditing = editingSessionId === session.id

                    return (
                        <div key={session.id} className="ml-8 relative">
                            {/* Timeline Node */}
                            <div className={clsx(
                                "absolute -left-[41px] top-0 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center",
                                existingNote ? "bg-green-500 shadow-md shadow-green-200" : "bg-gray-200"
                            )}>
                                {existingNote && <Check className="w-3 h-3 text-white" />}
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-brand-navy text-lg">
                                        {idx + 1}. {session.title}
                                    </h4>
                                    {session.link && (
                                        <a
                                            href={session.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-brand-blue hover:underline text-sm flex items-center gap-1"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Recursos
                                        </a>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="mt-3 space-y-3 animate-in fade-in zoom-in duration-200">
                                        <textarea
                                            value={noteDraft}
                                            onChange={(e) => setNoteDraft(e.target.value)}
                                            placeholder="Escribe notas sobre cómo fue la sesión..."
                                            className="w-full p-3 border border-brand-blue/30 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none min-h-[100px] text-sm"
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditingSessionId(null)}
                                                className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-sm"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => handleSave(session.id)}
                                                disabled={isSaving}
                                                className="px-4 py-1.5 bg-brand-yellow text-brand-navy font-bold rounded-lg text-sm flex items-center gap-2 hover:bg-yellow-300 transition-colors"
                                            >
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => startEditing(session, existingNote)}
                                        className="mt-3 text-sm cursor-pointer group"
                                    >
                                        {existingNote ? (
                                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-gray-700 group-hover:border-yellow-200 transition-colors">
                                                <span className="font-bold text-yellow-800 block text-xs uppercase mb-1">Notas del Monitor:</span>
                                                {existingNote}
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 italic border border-dashed border-gray-200 rounded-lg p-3 group-hover:bg-gray-50 transition-colors flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Click para agregar notas de la sesión...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
                {sessions.length === 0 && (
                    <div className="text-center py-8 text-gray-400 italic ml-4">
                        Este track no tiene sesiones definidas.
                    </div>
                )}
            </div>
        </div>
    )
}
