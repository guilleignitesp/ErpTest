'use client'

import { useState } from 'react'
import { assignTrackToGroup } from '@/app/actions/group-details'
import { BookOpen, Check, Edit2, Loader2, Save, Calendar } from 'lucide-react'
import clsx from 'clsx'

type SimpleTrack = {
    id: string
    title: string
}

export default function TrackSelector({
    groupId,
    currentTrack,
    currentStartDate,
    availableTracks,
}: {
    groupId: string
    currentTrack: SimpleTrack | null
    currentStartDate: Date | null
    availableTracks: SimpleTrack[]
}) {
    const [isEditing, setIsEditing] = useState(!currentTrack)
    const [selectedTrackId, setSelectedTrackId] = useState(currentTrack?.id || '')
    // Default to current start date or today (YYYY-MM-DD for input)
    const defaultDate = currentStartDate
        ? new Date(currentStartDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]

    const [startDate, setStartDate] = useState(defaultDate)
    const [isPending, setIsPending] = useState(false)

    async function handleSave() {
        if (!selectedTrackId) return
        setIsPending(true)
        const dateObj = startDate ? new Date(startDate) : null
        const res = await assignTrackToGroup(groupId, selectedTrackId, dateObj)
        if (res.success) {
            setIsEditing(false)
        }
        setIsPending(false)
    }

    if (!isEditing && currentTrack) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-brand-yellow" />
                        Plan de Estudios Asignado
                    </h3>
                    <div className="mt-2 text-gray-600 space-y-1">
                        <p>Track: <span className="font-semibold text-brand-blue">{currentTrack.title}</span></p>
                        {currentStartDate && (
                            <p className="flex items-center gap-1 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                Inicio: {new Date(currentStartDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                >
                    <Edit2 className="w-4 h-4" />
                    Cambiar
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-400" />
                Configuración Académica
            </h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seleccionar Track
                    </label>
                    <select
                        value={selectedTrackId}
                        onChange={(e) => setSelectedTrackId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition bg-white"
                    >
                        <option value="" disabled>-- Selecciona un Track --</option>
                        {availableTracks.map((track) => (
                            <option key={track.id} value={track.id}>
                                {track.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Inicio del Curso
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition"
                    />
                </div>

                <div className="flex gap-2">
                    {currentTrack && (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isPending || !selectedTrackId}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-yellow text-brand-navy font-bold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}
