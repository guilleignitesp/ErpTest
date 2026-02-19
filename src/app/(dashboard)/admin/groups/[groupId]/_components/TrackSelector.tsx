'use client'

import { useState, useTransition } from 'react'
import { addTrackToGroup, removeTrackFromGroup } from '@/app/actions/group-details'
import { Trash2, Plus, Calendar, BookOpen, Loader2 } from 'lucide-react'
import clsx from 'clsx'

type GroupTrack = {
    id: string
    startDate: Date
    track: {
        title: string
    }
}

type AvailableTrack = {
    id: string
    title: string
}

type TrackSelectorProps = {
    groupId: string
    groupTracks: GroupTrack[]
    availableTracks: AvailableTrack[]
}

export default function TrackSelector({ groupId, groupTracks, availableTracks }: TrackSelectorProps) {
    const [isPending, startTransition] = useTransition()
    const [selectedTrackId, setSelectedTrackId] = useState('')
    // Default to today's date YYYY-MM-DD
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])

    async function handleAddTrack() {
        if (!selectedTrackId || !startDate) return

        startTransition(async () => {
            const dateObj = new Date(startDate)
            await addTrackToGroup(groupId, selectedTrackId, dateObj)
            setSelectedTrackId('')
            // Keep date as is or reset, keeping as is is usually better for bulk entry
        })
    }

    async function handleRemoveTrack(groupTrackId: string) {
        if (!confirm('¿Estás seguro de quitar este track del grupo?')) return

        startTransition(async () => {
            await removeTrackFromGroup(groupTrackId, groupId)
        })
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="p-1 rounded bg-blue-100 text-blue-600">
                    <BookOpen className="w-4 h-4" />
                </span>
                Plan de Estudios (Tracks)
            </h2>

            {/* List of Assigned Tracks */}
            <div className="space-y-3 mb-6">
                {groupTracks.length === 0 ? (
                    <p className="text-gray-500 italic text-sm bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
                        No hay tracks asignados a este grupo.
                    </p>
                ) : (
                    groupTracks.map((gt) => (
                        <div key={gt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                            <div>
                                <p className="font-bold text-brand-navy">{gt.track.title}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Inicio: {new Date(gt.startDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveTrack(gt.id)}
                                disabled={isPending}
                                className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar track"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add New Track Form */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Añadir Track
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                        value={selectedTrackId}
                        onChange={(e) => setSelectedTrackId(e.target.value)}
                        className="p-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                    >
                        <option value="">Seleccionar Track...</option>
                        {availableTracks.map(track => (
                            <option key={track.id} value={track.id}>
                                {track.title}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="flex-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                        />
                        <button
                            onClick={handleAddTrack}
                            disabled={isPending || !selectedTrackId || !startDate}
                            className={clsx(
                                "flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-bold transition-all shadow-sm",
                                isPending || !selectedTrackId || !startDate
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-brand-blue text-white hover:bg-blue-600 hover:shadow-md active:scale-95"
                            )}
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Añadir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
