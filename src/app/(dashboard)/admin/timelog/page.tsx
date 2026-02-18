import { getAllTimeLogs } from '@/app/actions/timelogs'
import TimeLogTable from './_components/TimeLogTable'
import { Loader2 } from 'lucide-react'

export default async function TimeLogPage() {
    const { data: logs, success } = await getAllTimeLogs()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-brand-navy">Control de Fichaje y Presencia</h1>
                <p className="text-gray-600">Registro de entradas y salidas del personal.</p>
            </div>

            {!success && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                    Error al cargar los registros.
                </div>
            )}

            {logs ? (
                <TimeLogTable initialLogs={logs} />
            ) : (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                </div>
            )}
        </div>
    )
}
