'use client'

import { useState, useEffect } from 'react'
import { getTrackById, addSession, deleteSession } from '@/app/actions/tracks'
import Link from 'next/link'
import { ChevronLeft, Plus, Trash2, ExternalLink, PlayCircle, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'

// Initial dummy type, populated by fetch
type TrackDetail = {
    id: string
    title: string
    description: string | null
    sessions: {
        id: string
        title: string
        link: string | null
        orderIndex: number
    }[]
}

export default function TrackDetailPage({ params }: { params: { trackId: string } }) {
    const [track, setTrack] = useState<TrackDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Add Session State
    const [isAdding, setIsAdding] = useState(false)

    useEffect(() => {
        loadTrack()
    }, [])

    async function loadTrack() {
        setIsLoading(true) // Keep loading true explicitly if needed, but we might just re-fetch in background
        const res = await getTrackById(params.trackId)
        if (res.success && res.data) {
            setTrack(res.data)
        } else {
            // Handle not found
        }
        setIsLoading(false)
    }

    async function handleAddSession(formData: FormData) {
        setIsAdding(true)
        formData.append('trackId', params.trackId)
        await addSession(formData)
        setIsAdding(false)
        loadTrack() // Refresh list

        // Reset form manually since we are client side
        const form = document.getElementById('add-session-form') as HTMLFormElement
        if (form) form.reset()
    }

    async function handleDelete(sessionId: string) {
        if (!confirm("¿Eliminar sesión?")) return
        await deleteSession(sessionId, params.trackId)
        loadTrack()
    }

    if (isLoading && !track) {
        return <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-blue" /></div>
    }

    if (!track && !isLoading) return <div className="text-center p-12">Track no encontrado</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <Link
                    href="/admin/tracks"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-brand-blue mb-4 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Volver a Tracks
                </Link>
                <h1 className="text-3xl font-bold text-brand-navy">{track?.title}</h1>
                <p className="text-lg text-gray-600 mt-2">{track?.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-brand-navy mb-6 flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-brand-yellow" />
                    Sesiones del Track
                </h3>

                <div className="space-y-4 mb-8">
                    {track?.sessions.length === 0 ? (
                        <p className="text-gray-400 italic text-center py-4">No hay sesiones creadas aún.</p>
                    ) : (
                        track?.sessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-brand-blue/30 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-gray-400 font-bold text-lg w-8">#{session.orderIndex}</span>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{session.title}</h4>
                                        {session.link && (
                                            <a href={session.link} target="_blank" rel="noreferrer" className="text-xs text-brand-blue hover:underline flex items-center gap-1 mt-0.5">
                                                {session.link} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(session.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">Añadir Nueva Sesión</h4>
                    <form id="add-session-form" action={handleAddSession} className="grid md:grid-cols-2 gap-4 items-end">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Título de la Sesión</label>
                            <input name="title" required placeholder="Ej. Introducción a Variables" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Link (Opcional)</label>
                            <input name="link" placeholder="https://..." className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <button disabled={isAdding} className="w-full md:w-auto px-6 py-2 bg-brand-yellow text-brand-navy font-bold rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2">
                                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                Añadir Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
