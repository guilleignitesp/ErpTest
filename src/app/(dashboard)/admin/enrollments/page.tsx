import { getEnrollmentDashboardData } from '@/app/actions/enrollments'
import { Users, TrendingUp, TrendingDown, Building2, Calendar, UserCheck } from 'lucide-react'

export default async function EnrollmentsPage() {
    const response = await getEnrollmentDashboardData()

    if (!response.success || !response.data) {
        return <div className="p-8 text-center text-red-500">Error cargando datos de altas y bajas.</div>
    }

    const { totalActiveStudents, totalAltas, totalBajas, logs, aggregations } = response.data

    return (
        <div className="space-y-8 p-2 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-navy">Centro de Mandos: Altas y Bajas</h1>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-brand-blue rounded-xl">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Alumnos Activos</p>
                        <p className="text-3xl font-black text-brand-navy">{totalActiveStudents}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Altas Históricas</p>
                        <p className="text-3xl font-black text-emerald-600">+{totalAltas}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-red-50 text-red-500 rounded-xl">
                        <TrendingDown className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Bajas Históricas</p>
                        <p className="text-3xl font-black text-red-500">-{totalBajas}</p>
                    </div>
                </div>
            </div>

            {/* Aggregations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* By School */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-brand-blue" />
                        Por Escuela
                    </h3>
                    <div className="space-y-3">
                        {aggregations.bySchool.map(school => (
                            <div key={school.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">{school.name}</span>
                                <div className="flex gap-4 text-sm font-bold">
                                    <span className="text-emerald-600">+{school.ALTA}</span>
                                    <span className="text-red-500">-{school.BAJA}</span>
                                </div>
                            </div>
                        ))}
                        {aggregations.bySchool.length === 0 && <p className="text-sm text-gray-500 italic">Sin datos.</p>}
                    </div>
                </div>

                {/* By Month */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-brand-blue" />
                        Por Mes (Últimos meses)
                    </h3>
                    <div className="space-y-3">
                        {aggregations.byMonth.slice(0, 5).map(month => (
                            <div key={month.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">{month.name}</span>
                                <div className="flex gap-4 text-sm font-bold">
                                    <span className="text-emerald-600">+{month.ALTA}</span>
                                    <span className="text-red-500">-{month.BAJA}</span>
                                </div>
                            </div>
                        ))}
                        {aggregations.byMonth.length === 0 && <p className="text-sm text-gray-500 italic">Sin datos.</p>}
                    </div>
                </div>
            </div>

            {/* Raw Log Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800">Registro Histórico Completo</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Alumno</th>
                                <th className="px-6 py-4">Grupo</th>
                                <th className="px-6 py-4">Escuela</th>
                                <th className="px-6 py-4">Profesor(es)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(log.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${log.type === 'ALTA' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{log.studentName}</td>
                                    <td className="px-6 py-4">{log.groupName}</td>
                                    <td className="px-6 py-4">{log.schoolName}</td>
                                    <td className="px-6 py-4 text-xs">{log.teacherNames}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        No hay registros de altas ni bajas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
