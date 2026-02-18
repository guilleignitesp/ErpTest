'use client'

import { useState } from 'react'
import { Trophy, Star, Zap, Target } from 'lucide-react'
import TeacherEvaluationModal from './TeacherEvaluationModal'
import { EvaluationData } from '@/app/actions/evaluations'

type Evaluation = {
    id: string
    xp: number
    skillLogic: number
    skillCreativity: number
    skillTeamwork: number
    skillProblemSolving: number
    skillAutonomy: number
    skillCommunication: number
}

type Student = {
    id: string
    name: string
    username: string
    evaluation?: Evaluation | null
}

export default function EvaluationTab({
    groupId,
    students
}: {
    groupId: string
    students: Student[]
}) {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

    const defaultEvaluation: EvaluationData = {
        xp: 0,
        skillLogic: 0,
        skillCreativity: 0,
        skillTeamwork: 0,
        skillProblemSolving: 0,
        skillAutonomy: 0,
        skillCommunication: 0
    }

    return (
        <div className="space-y-6">
            <h3 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-brand-yellow" />
                Evaluación y Gamificación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map(student => {
                    const evalData = student.evaluation || defaultEvaluation

                    return (
                        <div key={student.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-brand-navy text-lg">{student.name}</h4>
                                    <p className="text-sm text-gray-500">@{student.username}</p>
                                </div>
                                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-800" />
                                    {evalData.xp} XP
                                </div>
                            </div>

                            {/* Mini Skills Summary */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Crea.</span>
                                    <span className="font-bold">{evalData.skillCreativity}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                    <span className="flex items-center gap-1"><Target className="w-3 h-3 text-red-500" /> Prob.</span>
                                    <span className="font-bold">{evalData.skillProblemSolving}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedStudent(student)}
                                className="w-full py-2 bg-brand-yellow text-brand-navy font-bold rounded-lg hover:bg-yellow-300 transition-colors text-sm"
                            >
                                Evaluar
                            </button>
                        </div>
                    )
                })}
            </div>

            {selectedStudent && (
                <TeacherEvaluationModal
                    isOpen={!!selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    student={{ id: selectedStudent.id, name: selectedStudent.name }}
                    groupId={groupId}
                    initialData={selectedStudent.evaluation || defaultEvaluation}
                />
            )}
        </div>
    )
}
