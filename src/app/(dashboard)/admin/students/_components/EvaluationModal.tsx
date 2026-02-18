'use client'

import { useState } from 'react'
import { updateEvaluation, EvaluationData } from '@/app/actions/evaluations'
import { X, Save, Loader2, Award } from 'lucide-react'

type EvaluationModalProps = {
    isOpen: boolean
    onClose: () => void
    studentName: string
    groupName: string
    studentId: string
    groupId: string
    initialData: EvaluationData
}

export default function EvaluationModal({
    isOpen,
    onClose,
    studentName,
    groupName,
    studentId,
    groupId,
    initialData
}: EvaluationModalProps) {
    const [data, setData] = useState<EvaluationData>(initialData)
    const [isPending, setIsPending] = useState(false)

    if (!isOpen) return null

    async function handleSave() {
        setIsPending(true)
        await updateEvaluation(groupId, studentId, data)
        setIsPending(false)
        onClose()
    }

    const skills = [
        { key: 'skillLogic', label: 'Lógica' },
        { key: 'skillCreativity', label: 'Creatividad' },
        { key: 'skillTeamwork', label: 'Trabajo en Equipo' },
        { key: 'skillProblemSolving', label: 'Resolución de Problemas' },
        { key: 'skillAutonomy', label: 'Autonomía' },
        { key: 'skillCommunication', label: 'Comunicación' },
    ] as const

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-brand-navy text-white">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Award className="w-5 h-5 text-brand-yellow" />
                            Evaluación
                        </h2>
                        <p className="text-sm text-gray-300">
                            {studentName} • {groupName}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">
                    {/* XP Section */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-yellow-800">Experience Points (XP)</h3>
                            <p className="text-xs text-yellow-600">Puntaje global acumulado</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={data.xp}
                                onChange={(e) => setData({ ...data, xp: parseInt(e.target.value) || 0 })}
                                className="w-24 px-3 py-2 text-right font-mono font-bold text-xl border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none"
                            />
                            <span className="font-bold text-yellow-700">XP</span>
                        </div>
                    </div>

                    {/* Skills Radar */}
                    <div>
                        <h3 className="font-bold text-brand-navy mb-4 border-b pb-2">Habilidades (1-10)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {skills.map((skill) => (
                                <div key={skill.key}>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium text-gray-700">{skill.label}</label>
                                        <span className="text-sm font-bold text-brand-blue">{data[skill.key]}/10</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        step="1"
                                        value={data[skill.key]}
                                        onChange={(e) => setData({ ...data, [skill.key]: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-yellow text-brand-navy font-bold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-70"
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    )
}
