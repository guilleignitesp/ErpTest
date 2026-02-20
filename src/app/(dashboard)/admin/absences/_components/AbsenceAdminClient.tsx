'use client'

import { useState, useTransition } from 'react'
import { updateAbsenceStatus, createAbsenceReason, deleteAbsenceReason } from '@/app/actions/absences'
import { Check, X, Trash2, Plus, Loader2, Calendar, FileText, User } from 'lucide-react'
import clsx from 'clsx'

type AbsenceAdminClientProps = {
    initialRequests: any[]
    initialReasons: any[]
}

export default function AbsenceAdminClient({ initialRequests, initialReasons }: AbsenceAdminClientProps) {
    const [activeTab, setActiveTab] = useState<'requests' | 'reasons'>('requests')
    const [isPending, startTransition] = useTransition()
    const [newReason, setNewReason] = useState('')

    const handleUpdateStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
        startTransition(async () => {
            await updateAbsenceStatus(id, status)
        })
    }

    const handleAddReason = () => {
        if (!newReason.trim()) return
        startTransition(async () => {
            await createAbsenceReason(newReason)
            setNewReason('')
        })
    }

    const handleDeleteReason = (id: string) => {
        if (!confirm('¿Seguro que quieres eliminar este motivo?')) return
        startTransition(async () => {
            await deleteAbsenceReason(id)
        })
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50">
                <button
                    onClick={() => setActiveTab('requests')}
                    className={clsx(
                        "px-6 py-4 text-sm font-bold transition-colors border-b-2",
                        activeTab === 'requests'
                            ? "border-brand-blue text-brand-blue bg-white"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                    )}
                >
                    Solicitudes
                </button>
                <button
                    onClick={() => setActiveTab('reasons')}
                    className={clsx(
                        "px-6 py-4 text-sm font-bold transition-colors border-b-2",
                        activeTab === 'reasons'
                            ? "border-brand-blue text-brand-blue bg-white"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                    )}
                >
                    Configuración de Motivos
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'requests' && (
                    <div className="space-y-4">
                        {initialRequests.length === 0 ? (
                            <p className="text-center text-gray-500 py-8 italic">No hay solicitudes de ausencia registradas.</p>
                        ) : (
                            initialRequests.map((req) => (
                                <div key={req.id} className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className={clsx(
                                                    "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
                                                    req.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                                                        req.status === 'APPROVED' ? "bg-green-100 text-green-700" :
                                                            "bg-red-100 text-red-700"
                                                )}>
                                                    {req.status === 'PENDING' ? 'Pendiente' : req.status === 'APPROVED' ? 'Aprobada' : 'Rechazada'}
                                                </span>
                                                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    {req.teacher.name}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="space-y-1">
                                                    <p className="text-gray-500 text-xs font-semibold uppercase">Motivo</p>
                                                    <p className="font-medium text-gray-800 bg-gray-50 inline-block px-2 py-1 rounded">{req.reason.name}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-gray-500 text-xs font-semibold uppercase">Fechas</p>
                                                    <p className="flex items-center gap-1.5 font-medium text-gray-800">
                                                        <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                                                        {new Date(req.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                        <span className="text-gray-400 mx-1">→</span>
                                                        {new Date(req.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>

                                            {req.description && (
                                                <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-600 flex gap-2 items-start">
                                                    <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                                    <p>{req.description}</p>
                                                </div>
                                            )}
                                        </div>

                                        {req.status === 'PENDING' && (
                                            <div className="flex gap-2 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4">
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                                                    disabled={isPending}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 font-bold text-sm rounded-lg transition-colors"
                                                >
                                                    <Check className="w-4 h-4" /> Aprobar
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                                                    disabled={isPending}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-sm rounded-lg transition-colors"
                                                >
                                                    <X className="w-4 h-4" /> Rechazar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'reasons' && (
                    <div className="max-w-2xl">
                        <div className="mb-8 p-5 bg-blue-50/50 border border-blue-100 rounded-xl">
                            <h3 className="text-sm font-bold text-brand-navy mb-3">Añadir Nuevo Motivo</h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newReason}
                                    onChange={(e) => setNewReason(e.target.value)}
                                    placeholder="Ej. Mudanza, Asuntos Propios..."
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-brand-blue/20 text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddReason()}
                                />
                                <button
                                    onClick={handleAddReason}
                                    disabled={!newReason.trim() || isPending}
                                    className="px-5 py-2.5 bg-brand-blue text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Añadir
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Motivos Configurados</h3>
                            {initialReasons.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No hay motivos configurados.</p>
                            ) : (
                                initialReasons.map(reason => (
                                    <div key={reason.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-100 transition-colors">
                                        <span className="font-medium text-gray-800">{reason.name}</span>
                                        <button
                                            onClick={() => handleDeleteReason(reason.id)}
                                            disabled={isPending}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
