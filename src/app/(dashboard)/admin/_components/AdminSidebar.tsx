'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { School, Users, GraduationCap, Map, Clock, LogOut, TrendingUp } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import clsx from 'clsx'

const navItems = [
    { label: 'Escuelas y Grupos', href: '/admin', icon: School },
    { label: 'Profesores', href: '/admin/teachers', icon: Users },
    { label: 'Alumnos', href: '/admin/students', icon: GraduationCap },
    { label: 'Tracks', href: '/admin/tracks', icon: Map },
    { label: 'Altas y Bajas', href: '/admin/enrollments', icon: TrendingUp },
    { label: 'Fichaje', href: '/admin/timelog', icon: Clock },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    async function handleLogout() {
        await logout()
        router.push('/login')
    }

    return (
        <aside className="w-64 bg-brand-navy text-white flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-bold text-brand-yellow">IGNITE SP</h1>
                <p className="text-sm text-gray-400">Admin Portal</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    // Exact match for root /admin, startsWith for others to handle sub-routes if any
                    const isActive =
                        item.href === '/admin'
                            ? pathname === '/admin'
                            : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-brand-blue text-brand-yellow font-medium'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-300 hover:bg-red-900/30 hover:text-red-400 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    )
}
