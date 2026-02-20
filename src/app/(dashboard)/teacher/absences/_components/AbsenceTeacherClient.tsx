'use client'

import { useState, useTransition } from 'react'
import { createAbsenceRequest } from '@/app/actions/absences'
import { Plus, X, Calendar, FileText, Loader2, Clock } from 'lucide-react'
import clsx from 'clsx'

type AbsenceTeacherClientProps = {
    teacherId: string
    initialRequests: any[]
    reasons: any[]
}

export default function AbsenceTeacherClient({ teacherId, initialRequests, reasons }: AbsenceTeacherClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const [formData, setFormData] = useState({
        reasonId: '',
        description: '',
        startDate: '',
        endDate: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.reasonId || !formData.startDate || !formData.endDate) return

        startTransition(async () => {
            await createAbsenceRequest({
                teacherId,
                reasonId: formData.reasonId,
                description: formData.description,
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate)
            })
            setIsModalOpen(false)
            setFormData({ reasonId: '', description: '', startDate: '', endDate: '' })
        })
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm font-medium text-gray-500 hidden md:block">Historial de solicitudes</p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-md active:scale-95 ml-auto"
                >
                    <Plus className="w-5 h-5" />
                    Solicitar Ausencia
                </button>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {initialRequests.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 italic">
                            No has solicitado ninguna ausencia todavía.
                        </div>
                    ) : (
                        initialRequests.map((req) => (
                            <div key={req.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row gap-4 justify-between md:items-center">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={clsx(
                                            "px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
                                            req.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                                                req.status === 'APPROVED' ? "bg-green-100 text-green-700" :
                                                    "bg-red-100 text-red-700"
                                        )}>
                                            {req.status === 'PENDING' ? 'Pendiente' : req.status === 'APPROVED' ? 'Validada' : 'Rechazada'}
                                        </span>
                                        <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-sm">
                                            {req.reason.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                        <Calendar className="w-4 h-4 text-brand-blue" />
                                        {new Date(req.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        <span className="text-gray-400">→</span>
                                        {new Date(req.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    {req.description && (
                                        <p className="text-sm text-gray-500 flex items-start gap-1.5 mt-2">
                                            <FileText className="w-4 h-4 shrink-0 mt-0.5 opacity-50" />
                                            {req.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-brand-navy">Solicitar Ausencia</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Motivo de la ausencia</label>
                                <select
                                    required
                                    value={formData.reasonId}
                                    onChange={(e) => setFormData({ ...formData, reasonId: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm bg-white"
                                >
                                    <option value="">Selecciona un motivo...</option>
                                    {reasons.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">Inicio</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">Fin</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Descripción (Opcional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Añade detalles adicionales si es necesario..."
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all text-sm min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending || !formData.reasonId || !formData.startDate || !formData.endDate}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-brand-blue hover:bg-blue-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Solicitud"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
