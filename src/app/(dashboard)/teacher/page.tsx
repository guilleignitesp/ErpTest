import { getTeacherGroups } from '@/app/actions/teacher-dashboard'
import { Clock, Users, Calendar, ArrowRight, School } from 'lucide-react'
import Link from 'next/link'

export default async function TeacherDashboard() {
    const { data: groups, success } = await getTeacherGroups()

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
                        Panel del Profesor
                    </h1>
                    <p className="text-gray-600">
                        Gestiona tus clases y registra tu horario laboral.
                    </p>
                </div>

                <Link href="/teacher/timelog" className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-yellow text-brand-navy font-black text-lg rounded-xl shadow-lg shadow-yellow-200 hover:shadow-xl hover:scale-105 transition-all transform active:scale-95">
                    <Clock className="w-6 h-6" />
                    CONTROL DE FICHAJE
                </Link>
            </div>

            {/* Groups Grid */}
            <div>
                <h2 className="text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
                    <School className="w-5 h-5 text-brand-blue" />
                    Mis Grupos Asignados
                </h2>

                {success && groups && groups.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {groups.map((group) => (
                            <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-blue-50 text-brand-blue text-xs font-bold uppercase rounded-full tracking-wider">
                                            {group.school.name}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                                            <Users className="w-3 h-3" />
                                            {group._count.students}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-brand-navy mb-1">{group.name}</h3>

                                    <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                                        <Calendar className="w-4 h-4 text-brand-yellow" />
                                        <span className="font-medium">{group.dayOfWeek}</span>
                                        <span className="text-gray-300">|</span>
                                        <span>{group.timeSlot}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 border-t border-gray-100">
                                    <Link
                                        href={`/teacher/groups/${group.id}`}
                                        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 text-brand-navy font-bold rounded-lg hover:bg-brand-blue hover:text-white hover:border-transparent transition-all group"
                                    >
                                        <span>Entrar a Clase</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <School className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No tienes grupos asignados</h3>
                        <p className="text-gray-500">Contacta con el administrador para que te asigne a un grupo.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
