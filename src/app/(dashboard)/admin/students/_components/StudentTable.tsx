'use client'

import { useState } from 'react'
import { StudentEnrollment } from '@/app/actions/evaluations'
import { Search, GraduationCap, School, Users, Award, AlertCircle } from 'lucide-react'
import EvaluationModal from './EvaluationModal'

export default function StudentTable({ enrollments }: { enrollments: StudentEnrollment[] }) {
    const [search, setSearch] = useState('')
    const [selectedEnrollment, setSelectedEnrollment] = useState<StudentEnrollment | null>(null)

    const filtered = enrollments.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.username.toLowerCase().includes(search.toLowerCase()) ||
        e.groupName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar alumno, usuario o grupo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Alumno</th>
                            <th className="px-6 py-4">Grupo / Escuela</th>
                            <th className="px-6 py-4">Profesores</th>
                            <th className="px-6 py-4 text-center">Progreso (XP)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.length > 0 ? (
                            filtered.map((item, idx) => (
                                <tr
                                    key={`${item.userId}-${idx}`} // Uniqueness for multiple enrollments
                                    onClick={() => item.evaluation && setSelectedEnrollment(item)}
                                    className="hover:bg-brand-blue/5 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                                {item.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500 font-mono">@{item.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-brand-navy flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {item.groupName}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <School className="w-3 h-3" /> {item.schoolName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">
                                            {item.teachers.join(', ') || <span className="text-gray-400 italic">Sin asignar</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.evaluation ? (
                                            <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-bold text-sm">
                                                <Award className="w-4 h-4" />
                                                {item.evaluation.xp} XP
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-1 text-red-500 text-xs" title="Missing Evaluation Record">
                                                <AlertCircle className="w-4 h-4" /> Error
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    No se encontraron alumnos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedEnrollment && selectedEnrollment.evaluation && (
                <EvaluationModal
                    isOpen={true}
                    onClose={() => setSelectedEnrollment(null)}
                    studentName={selectedEnrollment.name}
                    groupName={selectedEnrollment.groupName}
                    studentId={selectedEnrollment.userId}
                    groupId={selectedEnrollment.groupId}
                    initialData={{
                        xp: selectedEnrollment.evaluation.xp,
                        skillLogic: selectedEnrollment.evaluation.skillLogic,
                        skillCreativity: selectedEnrollment.evaluation.skillCreativity,
                        skillTeamwork: selectedEnrollment.evaluation.skillTeamwork,
                        skillProblemSolving: selectedEnrollment.evaluation.skillProblemSolving,
                        skillAutonomy: selectedEnrollment.evaluation.skillAutonomy,
                        skillCommunication: selectedEnrollment.evaluation.skillCommunication,
                    }}
                />
            )}
        </div>
    )
}
