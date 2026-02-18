'use client'

import { useState } from 'react'
import { School, ChevronDown, Users, Clock, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import CreateGroupModal from './CreateGroupModal'
import Link from 'next/link'

// Define types based on Prisma schema manually since we don't have the generated types handy in this context perfectly
// but usually we would import from @prisma/client or the action return type.
type GroupStub = {
    id: string
    name: string
    dayOfWeek: string
    timeSlot: string
}

type SchoolWithGroups = {
    id: string
    name: string
    groups: GroupStub[]
    _count?: {
        groups: number
    }
}

export default function SchoolList({ schools }: { schools: SchoolWithGroups[] }) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    const toggleSchool = (id: string) => {
        const newExpanded = new Set(expandedIds)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedIds(newExpanded)
    }

    if (schools.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-100">
                <School className="w-12 h-12 mb-3 opacity-20" />
                <p>No hay escuelas registradas.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4">
            {schools.map((school) => {
                const isExpanded = expandedIds.has(school.id)

                return (
                    <div
                        key={school.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                        <button
                            onClick={() => toggleSchool(school.id)}
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none bg-white font-medium hover:bg-gray-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-50 text-brand-blue rounded-lg">
                                    <School className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{school.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {school.groups.length} {school.groups.length === 1 ? 'grupo activo' : 'grupos activos'}
                                    </p>
                                </div>
                            </div>
                            <div className={clsx("text-gray-400 transition-transform duration-200", isExpanded && "rotate-180")}>
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </button>

                        {isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50/50 p-5 animate-in slide-in-from-top-2 duration-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Grupos Activos</h4>
                                    <CreateGroupModal schoolId={school.id} />
                                </div>

                                {school.groups.length > 0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {school.groups.map((group) => (
                                            <Link
                                                key={group.id}
                                                href={`/admin/groups/${group.id}`}
                                                className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2 hover:border-brand-blue hover:shadow-md transition-all group cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <h4 className="font-semibold text-brand-navy truncate group-hover:text-brand-blue transition-colors">
                                                        {group.name}
                                                    </h4>
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                                                        {group.dayOfWeek.slice(0, 3)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{group.timeSlot}</span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-blue transition-colors" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
                                        <Users className="w-8 h-8 mb-2 opacity-20" />
                                        <p className="mb-2">No hay grupos activos en esta escuela.</p>
                                        <p className="text-xs text-gray-400">¡Crea el primero usando el botón de arriba!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
