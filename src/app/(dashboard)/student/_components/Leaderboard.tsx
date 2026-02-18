'use client'

import clsx from 'clsx'
import { Trophy, Medal, Crown } from 'lucide-react'

type LeaderboardProps = {
    students: {
        rank: number
        name: string
        xp: number
        isCurrentUser: boolean
    }[]
}

export default function Leaderboard({ students }: LeaderboardProps) {
    return (
        <div className="glass-panel rounded-2xl p-6 h-full min-h-[300px]">
            <h3 className="neon-text-yellow font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Tabla de Líderes
            </h3>

            <div className="space-y-3">
                {students.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center italic mt-10">Sin datos aún...</p>
                ) : (
                    students.map((student) => (
                        <div
                            key={student.rank}
                            className={clsx(
                                "flex items-center justify-between p-3 rounded-lg transition-colors border",
                                student.isCurrentUser
                                    ? "bg-blue-600/20 border-blue-400/50 ring-1 ring-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                    : "bg-white/5 border-transparent hover:bg-blue-900/20"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md",
                                    student.rank === 1 ? "bg-yellow-400 text-yellow-900 shadow-yellow-500/50" :
                                        student.rank === 2 ? "bg-gray-300 text-gray-800 shadow-gray-400/50" :
                                            student.rank === 3 ? "bg-amber-700 text-amber-100 shadow-amber-700/50" :
                                                "bg-slate-700 text-slate-300"
                                )}>
                                    {student.rank}
                                </div>
                                <div className="flex flex-col">
                                    <span className={clsx("font-medium", student.isCurrentUser ? "text-white" : "text-gray-300")}>
                                        {student.name} {student.isCurrentUser && "(Tú)"}
                                    </span>
                                    {student.rank === 1 && <span className="text-[10px] text-yellow-400 flex items-center gap-1"><Crown className="w-3 h-3" /> Líder</span>}
                                </div>
                            </div>
                            <span className="font-mono font-bold neon-text-yellow">{student.xp} XP</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
