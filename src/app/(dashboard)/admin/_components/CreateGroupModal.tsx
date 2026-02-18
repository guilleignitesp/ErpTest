'use client'

import { useState } from 'react'
import { createGroup } from '@/app/actions/groups'
import { Plus, X, Loader2 } from 'lucide-react'

export default function CreateGroupModal({ schoolId }: { schoolId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setError(null)

        // Append schoolId since it's passed as prop
        formData.append('schoolId', schoolId)

        const result = await createGroup(formData)

        if (result.error) {
            setError(result.error)
            setIsPending(false)
        } else {
            setIsOpen(false)
            setIsPending(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-sm bg-white border border-brand-yellow text-brand-navy font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-50 transition-colors"
            >
                <Plus className="w-4 h-4" />
                <span>Nuevo Grupo</span>
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-lg font-bold text-brand-navy">Nuevo Grupo</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form action={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Grupo</label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. Robotics A"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Día</label>
                            <select
                                name="dayOfWeek"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition bg-white"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="Monday">Lunes</option>
                                <option value="Tuesday">Martes</option>
                                <option value="Wednesday">Miércoles</option>
                                <option value="Thursday">Jueves</option>
                                <option value="Friday">Viernes</option>
                                <option value="Saturday">Sábado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                            <input
                                name="timeSlot"
                                type="text"
                                required
                                placeholder="e.g. 17:30 - 19:00"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                            <input
                                name="subject"
                                type="text"
                                required
                                placeholder="e.g. Python"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                            <input
                                name="ageRange"
                                type="text"
                                required
                                placeholder="e.g. 10-12"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            disabled={isPending}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-yellow text-brand-navy font-bold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <span>Crear Grupo</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
