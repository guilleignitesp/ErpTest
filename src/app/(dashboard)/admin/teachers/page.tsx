import { getAllTeachers } from '@/app/actions/teachers'
import CreateTeacherModal from './_components/CreateTeacherModal'
import TeacherList from './_components/TeacherList'
import { Loader2 } from 'lucide-react'

export default async function TeachersPage() {
    const { data: teachers, success } = await getAllTeachers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy">Equipo Docente</h1>
                    <p className="text-gray-600">Gestión de profesores y asignación de carga.</p>
                </div>
                <CreateTeacherModal />
            </div>

            {!success && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                    Error al cargar los profesores.
                </div>
            )}

            {teachers ? (
                <TeacherList teachers={teachers} />
            ) : (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                </div>
            )}
        </div>
    )
}
