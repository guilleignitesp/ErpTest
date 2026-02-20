import { getAdminAbsenceRequests, getAbsenceReasons } from '@/app/actions/absences'
import AbsenceAdminClient from './_components/AbsenceAdminClient'

export default async function AdminAbsencesPage() {
    const [requestsRes, reasonsRes] = await Promise.all([
        getAdminAbsenceRequests(),
        getAbsenceReasons()
    ])

    const requests = requestsRes.success && requestsRes.data ? requestsRes.data : []
    const reasons = reasonsRes.success && reasonsRes.data ? reasonsRes.data : []

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-navy">Gestión de Ausencias</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Administra las solicitudes de ausencia de los profesores y configura los motivos.
                </p>
            </div>

            <AbsenceAdminClient initialRequests={requests} initialReasons={reasons} />
        </div>
    )
}
