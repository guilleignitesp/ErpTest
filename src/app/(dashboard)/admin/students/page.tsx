import { getStudentEnrollments } from '@/app/actions/evaluations'
import StudentTable from './_components/StudentTable'
import { Loader2 } from 'lucide-react'

export default async function StudentsPage() {
    // Fetch all for MVP, client filter handles search
    const { data: enrollments, success } = await getStudentEnrollments()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-brand-navy">Gestión de Alumnos</h1>
                <p className="text-gray-600">Busca alumnos y actualiza sus evaluaciones y progreso.</p>
            </div>

            {!success && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                    Error al cargar los alumnos.
                </div>
            )}

            {enrollments ? (
                <StudentTable enrollments={enrollments} />
            ) : (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                </div>
            )}
        </div>
    )
}
