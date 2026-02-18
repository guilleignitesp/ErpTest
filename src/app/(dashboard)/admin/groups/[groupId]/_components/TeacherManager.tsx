'use client'

import { useState } from 'react'
import { assignTeacher, removeTeacher } from '@/app/actions/group-details'
import { Trash2, Plus, Loader2, User } from 'lucide-react'

type SimpleUser = {
    id: string
    name: string
    username: string
}

export default function TeacherManager({
    groupId,
    teachers,
    allTeachers,
}: {
    groupId: string
    teachers: SimpleUser[]
    allTeachers: SimpleUser[]
}) {
    const [selectedTeacher, setSelectedTeacher] = useState('')
    const [isPending, setIsPending] = useState(false)

    // Filter out teachers already assigned
    const availableTeachers = allTeachers.filter(
        (t) => !teachers.some((current) => current.id === t.id)
    )

    async function handleAssign() {
        if (!selectedTeacher) return
        setIsPending(true)
        await assignTeacher(groupId, selectedTeacher)
        setIsPending(false)
        setSelectedTeacher('')
    }

    async function handleRemove(teacherId: string) {
        if (!confirm('¿Estás seguro de quitar a este profesor del grupo?')) return
        setIsPending(true)
        await removeTeacher(groupId, teacherId)
        setIsPending(false)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-blue" />
                Profesores Asignados
            </h3>

            <div className="space-y-3 mb-6">
                {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                        >
                            <div>
                                <p className="font-medium text-gray-900">{teacher.name}</p>
                                <p className="text-xs text-gray-500">@{teacher.username}</p>
                            </div>
                            <button
                                onClick={() => handleRemove(teacher.id)}
                                disabled={isPending}
                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                                title="Quitar profesor"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm italic py-2">No hay profesores asignados.</p>
                )}
            </div>

            <div className="border-t border-gray-100 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Asignar Nuevo Profesor</label>
                <div className="flex gap-2">
                    <select
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        disabled={isPending}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition text-sm bg-white"
                    >
                        <option value="">Seleccionar profesor...</option>
                        {availableTeachers.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name} (@{t.username})
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedTeacher || isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white font-medium rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Asignar
                    </button>
                </div>
            </div>
        </div>
    )
}
