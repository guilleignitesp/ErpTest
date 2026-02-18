'use client'

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'

type SkillsRadarProps = {
    data: {
        subject: string
        A: number
        fullMark: number
    }[]
}

export default function SkillsRadar({ data }: SkillsRadarProps) {
    return (
        <div className="h-full min-h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="rgba(59, 130, 246, 0.3)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#bfdbfe', fontSize: 12, opacity: 0.9 }}
                    />
                    <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#FACC15" // Yellow-400
                        strokeWidth={3}
                        fill="#FACC15"
                        fillOpacity={0.7}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
