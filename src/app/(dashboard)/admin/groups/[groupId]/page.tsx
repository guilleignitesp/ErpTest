import { getGroupById, getAvailableTeachers } from '@/app/actions/group-details'
import { getTracks } from '@/app/actions/tracks'
import TeacherManager from './_components/TeacherManager'
import StudentManager from './_components/StudentManager'
import TrackSelector from './_components/TrackSelector'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Calendar, Clock, BookOpen, User } from 'lucide-react'

export default async function GroupDetailPage({ params }: { params: { groupId: string } }) {
    const { data: group } = await getGroupById(params.groupId)
    const { data: allTeachers } = await getAvailableTeachers()
    const { data: allTracks } = await getTracks()

    if (!group) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    href="/admin"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-brand-blue mb-4 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Volver a Escuelas
                </Link>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-navy">{group.name}</h1>
                        <p className="text-lg text-gray-600">{group.school.name}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-brand-navy mb-4">Información del Grupo</h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Día</p>
                                    <p className="font-semibold text-gray-900">{group.dayOfWeek}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 text-brand-blue rounded-lg">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Horario</p>
                                    <p className="font-semibold text-gray-900">{group.timeSlot}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Materia</p>
                                    <p className="font-semibold text-gray-900">{group.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Edad</p>
                                    <p className="font-semibold text-gray-900">{group.ageRange}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Track Selector */}
                    {/* Track Selector */}
                    <TrackSelector
                        groupId={group.id}
                        groupTracks={group.groupTracks || []}
                        availableTracks={allTracks || []}
                    />
                </div>

                <div className="md:col-span-1 space-y-6">
                    <TeacherManager
                        groupId={group.id}
                        teachers={group.teachers}
                        allTeachers={allTeachers || []}
                    />
                    <StudentManager
                        groupId={group.id}
                        students={group.students}
                    />
                </div>
            </div>
        </div>
    )
}
