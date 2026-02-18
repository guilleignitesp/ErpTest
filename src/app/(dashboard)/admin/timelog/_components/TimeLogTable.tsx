'use client'

import { useState } from 'react'
import { getAllTimeLogs, TimeLogWithUser } from '@/app/actions/timelogs'
import { Search, Calendar, Clock, ArrowRight, ArrowLeft } from 'lucide-react'
import clsx from 'clsx'

export default function TimeLogTable({ initialLogs }: { initialLogs: TimeLogWithUser[] }) {
    const [logs, setLogs] = useState<TimeLogWithUser[]>(initialLogs)
    const [filterName, setFilterName] = useState('')
    const [filterDate, setFilterDate] = useState('')
    const [isPending, setIsPending] = useState(false)

    async function handleSearch() {
        setIsPending(true)
        const res = await getAllTimeLogs({ name: filterName, date: filterDate })
        if (res.success && res.data) {
            setLogs(res.data)
        }
        setIsPending(false)
    }

    // Formatting helper
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por Nombre</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            placeholder="Ej. Juan..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Fecha</label>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                    />
                </div>

                <button
                    onClick={handleSearch}
                    disabled={isPending}
                    className="px-6 py-2 bg-brand-navy text-white font-bold rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-70"
                >
                    {isPending ? 'Buscando...' : 'Filtrar'}
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-brand-navy text-white font-medium">
                        <tr>
                            <th className="px-6 py-3">Trabajador</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3">Fecha</th>
                            <th className="px-6 py-3 text-right">Hora</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-gray-900">{log.user.name}</p>
                                            <span className="text-xs text-brand-blue font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                                                {log.user.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                            log.type === 'CLOCK_IN'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        )}>
                                            {log.type === 'CLOCK_IN' ? (
                                                <><ArrowRight className="w-3 h-3" /> Entrada</>
                                            ) : (
                                                <><ArrowLeft className="w-3 h-3" /> Salida</>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {formatDate(log.timestamp)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 font-mono text-gray-900">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {formatTime(log.timestamp)}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    No se encontraron registros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
