import { getTeacherAbsenceRequests, getAbsenceReasons } from '@/app/actions/absences'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AbsenceTeacherClient from './_components/AbsenceTeacherClient'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function TeacherAbsencesPage() {
    const sessionCookie = cookies().get('session')
    if (!sessionCookie || !sessionCookie.value) redirect('/login')

    let session
    try {
        session = JSON.parse(sessionCookie.value)
    } catch (e) {
        redirect('/login')
    }

    if (!session.userId) redirect('/login')

    const [requestsRes, reasonsRes] = await Promise.all([
        getTeacherAbsenceRequests(session.userId),
        getAbsenceReasons()
    ])

    const requests = requestsRes.success && requestsRes.data ? requestsRes.data : []
    const reasons = reasonsRes.success && reasonsRes.data ? reasonsRes.data : []

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/teacher" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-brand-navy">Mis Ausencias</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Solicita ausencias y revisa el estado de tus peticiones.
                    </p>
                </div>
            </div>

            <AbsenceTeacherClient teacherId={session.userId} initialRequests={requests} reasons={reasons} />
        </div>
    )
}
