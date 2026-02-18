import { getSchools } from '@/app/actions/schools'
import SchoolList from './_components/SchoolList'
import CreateSchoolModal from './_components/CreateSchoolModal'

export default async function AdminDashboard() {
    const { data: schools } = await getSchools()

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-navy">Gestión de Escuelas y Grupos</h1>
                    <p className="text-gray-600 mt-1">Administra las sedes y sus grupos asociados.</p>
                </div>
                <CreateSchoolModal />
            </div>

            <SchoolList schools={schools || []} />
        </div>
    )
}

