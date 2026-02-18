import { getStudentDashboardData } from '@/app/actions/student-dashboard'
import SkillsRadar from './_components/SkillsRadar'
import MissionCard from './_components/MissionCard'
import Leaderboard from './_components/Leaderboard'
import { Rocket, LogOut, User as UserIcon } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'

export default async function StudentDashboardPage() {
    const data = await getStudentDashboardData()

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <p>Cargando perfil de estudiante...</p>
            </div>
        )
    }

    // Calculate XP Bar percentage (nextLevelProgress is 0-100)
    const xpPercentage = data.nextLevelProgress

    return (
        <div className="min-h-screen bg-space-gradient text-white p-4 md:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-brand-yellow/20 neon-border-yellow flex items-center justify-center text-brand-yellow font-bold text-2xl">
                            {data.user.initials}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{data.user.name}</h1>
                            <p className="text-gray-400 flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue text-xs font-bold border border-brand-blue/30">
                                    NIVEL {data.level}
                                </span>
                                <span className="text-sm">{data.group?.name || 'Sin Grupo'}</span>
                            </p>
                        </div>
                    </div>

                    {/* XP Bar */}
                    <div className="flex-1 max-w-xl w-full">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                            <span className="neon-text-yellow">Progreso de Nivel</span>
                            <span className="text-white">{data.xp} XP / {(Math.floor(data.level) * 1000) + 1000} XP</span>
                        </div>
                        <div className="h-4 bg-slate-800 rounded-full relative border border-slate-700">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,193,7,0.5)]"
                                style={{ width: `${xpPercentage}%` }}
                            >
                                {/* Rocket Knob */}
                                <div className="absolute -right-3 -top-2 transform rotate-45 filter drop-shadow-[0_0_5px_rgba(255,193,7,0.8)]">
                                    <Rocket className="w-8 h-8 text-brand-yellow fill-yellow-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <form action={logout}>
                            <button className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors border border-white/10 text-gray-400" title="Cerrar Sesión">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Col 1: Mission */}
                    <div className="md:col-span-1 h-full">
                        {data.mission ? (
                            <MissionCard trackName={data.mission.trackName} progress={data.mission.progress} />
                        ) : (
                            <div className="glass-panel rounded-2xl p-6 h-full flex items-center justify-center text-gray-500 italic">
                                No hay misión activa
                            </div>
                        )}
                    </div>

                    {/* Col 2: Skills Radar (Centerpiece) */}
                    <div className="md:col-span-1 h-full min-h-[400px]">
                        <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
                            <h3 className="neon-text-yellow font-bold uppercase tracking-wider mb-4 text-center">Tus Habilidades</h3>
                            <div className="flex-1">
                                <SkillsRadar data={data.skills} />
                            </div>
                        </div>
                    </div>

                    {/* Col 3: Leaderboard */}
                    <div className="md:col-span-1 h-full">
                        <Leaderboard students={data.leaderboard} />
                    </div>

                </div>
            </div>
        </div>
    )
}
