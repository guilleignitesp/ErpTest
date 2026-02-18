'use client'

import { Target } from 'lucide-react'

type MissionCardProps = {
    trackName: string
    progress: number // 0-100
}

export default function MissionCard({ trackName, progress }: MissionCardProps) {
    const radius = 50
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[300px]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target className="w-24 h-24 text-brand-blue" />
            </div>

            <h3 className="neon-text-yellow font-bold uppercase tracking-wider mb-6 text-center z-10">Misión Actual</h3>

            <div className="relative w-40 h-40 flex items-center justify-center z-10">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="#60A5FA" // blue-400
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out filter drop-shadow-[0_0_3px_rgba(96,165,250,0.8)]"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold neon-text-blue">{progress}%</span>
                </div>
            </div>

            <p className="mt-6 text-lg font-medium text-center text-blue-200 z-10">
                {trackName}
            </p>
        </div>
    )
}
