'use client'

import { useState } from 'react'
import { User, School, Clock, Calendar, X } from 'lucide-react'
import clsx from 'clsx'

type Teacher = {
    id: string
    name: string
    username: string
    groupsAsTeacher: {
        id: string
        name: string
        dayOfWeek: string
        timeSlot: string
        school: {
            name: string
        }
    }[]
}

export default function TeacherList({ teachers }: { teachers: Teacher[] }) {
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Carga Docente</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {teachers.length > 0 ? (
                            teachers.map((teacher) => (
                                <tr
                                    key={teacher.id}
                                    className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                                    onClick={() => setSelectedTeacher(teacher)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
                                                {teacher.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-900">{teacher.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">
                                            {teacher.username}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "px-2.5 py-1 rounded-full text-xs font-bold",
                                            teacher.groupsAsTeacher.length > 0
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-gray-100 text-gray-500"
                                        )}>
                                            {teacher.groupsAsTeacher.length} Grupos
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-brand-blue hover:underline">
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    No hay profesores registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedTeacher && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                        <div className="relative h-24 bg-brand-navy flex items-center justify-center">
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="absolute -bottom-10 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-brand-blue flex items-center justify-center text-white text-3xl font-bold">
                                        {selectedTeacher.name.charAt(0)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 pb-8 px-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900">{selectedTeacher.name}</h2>
                            <p className="text-gray-500 font-mono text-sm mt-1">@{selectedTeacher.username}</p>
                        </div>

                        <div className="bg-gray-50 p-6 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Grupos Asignados</h3>
                            <div className="space-y-3">
                                {selectedTeacher.groupsAsTeacher.length > 0 ? (
                                    selectedTeacher.groupsAsTeacher.map(group => (
                                        <div key={group.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-brand-navy">{group.name}</h4>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <School className="w-3 h-3" />
                                                    {group.school.name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full inline-block mb-1">
                                                    {group.dayOfWeek.slice(0, 3)}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {group.timeSlot}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 italic py-4">No tiene grupos asignados todavía.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-100 text-center">
                            <button
                                onClick={() => setSelectedTeacher(null)}
                                className="text-gray-500 hover:text-gray-800 font-medium text-sm"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
