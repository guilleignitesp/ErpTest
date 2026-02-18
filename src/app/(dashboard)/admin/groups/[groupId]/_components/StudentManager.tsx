'use client'

import { useState } from 'react'
import { createAndAssignStudent, removeStudentFromGroup } from '@/app/actions/students'
import { Trash2, Plus, Loader2, User, X, Save } from 'lucide-react'

type SimpleUser = {
    id: string
    name: string
    username: string
}

export default function StudentManager({
    groupId,
    students,
}: {
    groupId: string
    students: SimpleUser[]
}) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Modal Form State
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
    })

    async function handleSubmit() {
        setIsPending(true)
        setError(null)

        const payload = new FormData()
        payload.append('groupId', groupId)
        payload.append('name', formData.name)
        payload.append('username', formData.username)
        payload.append('password', formData.password)

        const result = await createAndAssignStudent(payload)

        if (result.error) {
            setError(result.error)
            setIsPending(false)
        } else {
            setIsModalOpen(false)
            setFormData({ name: '', username: '', password: '' })
            setIsPending(false)
        }
    }

    async function handleRemove(studentId: string) {
        if (!confirm('¿Estás seguro de quitar a este alumno del grupo?')) return
        // Simple remove call, in a real app we might want loading state per item
        await removeStudentFromGroup(groupId, studentId)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Alumnos Matriculados ({students.length})
                </h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 font-bold rounded-lg hover:bg-green-200 transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Matricular Nuevo
                </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Usuario (Login)</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                                    <td className="px-4 py-3 font-mono text-brand-blue bg-blue-50/50 w-fit rounded block my-1 mx-2 px-2">
                                        {student.username}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleRemove(student.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            title="Quitar alumno"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-gray-400 italic">
                                    No hay alumnos matriculados en este grupo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for New Student */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-bold text-brand-navy">Nuevo Alumno</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition"
                                    placeholder="Ej. Pepito Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario (Login)</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition font-mono"
                                    placeholder="Ej. pepito1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <input
                                    type="text"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition font-mono"
                                    placeholder="Ej. 123456"
                                />
                                <p className="text-xs text-gray-500 mt-1">Visible para que puedas compartirla.</p>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isPending || !formData.name || !formData.username || !formData.password}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
