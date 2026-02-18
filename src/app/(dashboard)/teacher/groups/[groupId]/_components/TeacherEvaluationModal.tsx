'use client'

import { useState } from 'react'
import { updateEvaluation, EvaluationData } from '@/app/actions/evaluations'
import { X, Save, Loader2, Star, Zap, Users, Brain, Target, MessageSquare } from 'lucide-react'
import clsx from 'clsx'

type Props = {
    isOpen: boolean
    onClose: () => void
    student: {
        id: string
        name: string
    }
    groupId: string
    initialData: EvaluationData
}

export default function TeacherEvaluationModal({ isOpen, onClose, student, groupId, initialData }: Props) {
    const [formData, setFormData] = useState<EvaluationData>(initialData)
    const [isPending, setIsPending] = useState(false)

    if (!isOpen) return null

    const handleSave = async () => {
        setIsPending(true)
        await updateEvaluation(groupId, student.id, formData)
        setIsPending(false)
        onClose()
    }

    const handleChange = (field: keyof EvaluationData, value: number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const skills = [
        { key: 'skillLogic', label: 'Lógica', icon: Brain, color: 'text-purple-500' },
        { key: 'skillCreativity', label: 'Creatividad', icon: Zap, color: 'text-yellow-500' },
        { key: 'skillTeamwork', label: 'Trabajo en Equipo', icon: Users, color: 'text-blue-500' },
        { key: 'skillProblemSolving', label: 'Resolución de Problemas', icon: Target, color: 'text-red-500' },
        { key: 'skillAutonomy', label: 'Autonomía', icon: Star, color: 'text-green-500' },
        { key: 'skillCommunication', label: 'Comunicación', icon: MessageSquare, color: 'text-pink-500' },
    ] as const

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-brand-navy">Evaluación de Estudiante</h2>
                        <p className="text-gray-500 text-sm">{student.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* XP Section */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Experiencia (XP)</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={formData.xp}
                                onChange={(e) => handleChange('xp', parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none text-lg font-bold text-brand-blue"
                            />
                            <div className="text-sm text-gray-500">
                                Puntos totales acumulados
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-gray-900 border-b pb-2">Habilidades (1-10)</h3>
                        {skills.map((skill) => (
                            <div key={skill.key}>
                                <div className="flex justify-between mb-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <skill.icon className={clsx("w-4 h-4", skill.color)} />
                                        {skill.label}
                                    </label>
                                    <span className="font-bold text-brand-navy">{formData[skill.key]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={formData[skill.key]}
                                    onChange={(e) => handleChange(skill.key, parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-yellow text-brand-navy font-bold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    )
}
