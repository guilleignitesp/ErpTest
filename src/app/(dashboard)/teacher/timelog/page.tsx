import { getTeacherLogs, logTeacherTime } from '@/app/actions/timelogs'
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react'
import clsx from 'clsx'

export default async function TeacherTimeLogPage() {
    const { data: logs, success } = await getTeacherLogs()

    // Determine current status based on last log
    // If no logs, assume OUT. If last log is IN, status is IN.
    const lastLog = logs && logs.length > 0 ? logs[0] : null
    const isClockedIn = lastLog?.type === 'CLOCK_IN'

    // Server Actions wrapper for buttons
    async function handleClockIn() {
        'use server'
        await logTeacherTime('CLOCK_IN')
    }

    async function handleClockOut() {
        'use server'
        await logTeacherTime('CLOCK_OUT')
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-brand-navy">Control de Fichaje</h1>
                <p className="text-gray-600">Registra tu entrada y salida laboral.</p>
            </div>

            {/* Status Card & Buttons */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className={clsx(
                    "p-6 text-center border-b transition-colors",
                    isClockedIn ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"
                )}>
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-1">Estado Actual</p>
                    <div className={clsx(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-lg",
                        isClockedIn ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {isClockedIn ? (
                            <><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span> TRABAJANDO</>
                        ) : (
                            <><span className="w-3 h-3 rounded-full bg-red-500"></span> FUERA DE SERVICIO</>
                        )}
                    </div>
                </div>

                <div className="p-8 grid gap-4 sm:grid-cols-2">
                    <form action={handleClockIn} className="w-full">
                        <button
                            disabled={isClockedIn}
                            className="w-full h-32 flex flex-col items-center justify-center gap-3 rounded-xl bg-green-500 text-white font-black text-xl hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                        >
                            <ArrowRight className="w-10 h-10" />
                            ENTRADA
                        </button>
                    </form>

                    <form action={handleClockOut} className="w-full">
                        <button
                            disabled={!isClockedIn}
                            className="w-full h-32 flex flex-col items-center justify-center gap-3 rounded-xl bg-red-500 text-white font-black text-xl hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                        >
                            <ArrowLeft className="w-10 h-10" />
                            SALIDA
                        </button>
                    </form>
                </div>
            </div>

            {/* History List */}
            <div>
                <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    Historial Reciente
                </h3>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                    {logs && logs.length > 0 ? (
                        logs.map((log) => (
                            <div key={log.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={clsx(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        log.type === 'CLOCK_IN' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                    )}>
                                        {log.type === 'CLOCK_IN' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {log.type === 'CLOCK_IN' ? 'Entrada' : 'Salida'}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {new Date(log.timestamp).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-mono font-bold text-lg text-brand-navy">
                                    {new Date(log.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400">
                            No hay registros recientes.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
