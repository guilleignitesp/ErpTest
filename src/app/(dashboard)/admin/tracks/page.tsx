'use client'

import { useState, useEffect } from 'react'
import { getTracks, createTrack } from '@/app/actions/tracks'
import Link from 'next/link'
import { Plus, Book, ArrowRight, Loader2, Save } from 'lucide-react'
import clsx from 'clsx'

type TrackWithCount = {
    id: string
    title: string
    description: string | null
    _count: {
        sessions: number
    }
}

export default function TracksPage() {
    const [tracks, setTracks] = useState<TrackWithCount[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Create Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    useEffect(() => {
        loadTracks()
    }, [])

    async function loadTracks() {
        setIsLoading(true)
        const res = await getTracks()
        if (res.success && res.data) {
            setTracks(res.data)
        }
        setIsLoading(false)
    }

    async function handleCreate(formData: FormData) {
        setIsCreating(true)
        const res = await createTrack(formData)
        setIsCreating(false)

        if (res.success) {
            setIsModalOpen(false)
            loadTracks() // Reload list
        } else {
            alert("Error creating track")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy">Gestión de Tracks</h1>
                    <p className="text-gray-600">Define los planes de estudio y sus sesiones.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-brand-navy font-bold rounded-lg hover:bg-yellow-300 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Track</span>
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                </div>
            ) : tracks.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tracks.map((track) => (
                        <Link
                            key={track.id}
                            href={`/admin/tracks/${track.id}`}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-brand-blue/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Book className="w-20 h-20 text-brand-blue" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-blue transition-colors">
                                    {track.title}
                                </h3>
                                <p className="text-gray-500 mb-4 line-clamp-2 h-10 text-sm">
                                    {track.description || 'Sin descripción'}
                                </p>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        {track._count.sessions} Sesiones
                                    </span>
                                    <div className="flex items-center gap-1 text-brand-blue text-sm font-medium">
                                        Ver sesiones
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Book className="w-12 h-12 mb-3 opacity-20" />
                    <p>No hay tracks definidos.</p>
                </div>
            )}

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in duration-200">
                        <h2 className="text-xl font-bold text-brand-navy mb-4">Crear Nuevo Track</h2>
                        <form action={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input name="title" required autoFocus className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Ej. Masterclass Python" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea name="description" rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Breve descripción del curso..." />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                <button type="submit" disabled={isCreating} className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                    {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Crear Track
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
