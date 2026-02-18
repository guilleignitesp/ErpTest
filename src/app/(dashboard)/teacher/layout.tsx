import Link from 'next/link'
import { cookies } from 'next/headers'
import { LogOut, GraduationCap } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')

    // Basic protection, though middleware usually handles this
    if (!sessionCookie || !sessionCookie.value) {
        redirect('/login')
    }

    let session
    try {
        session = JSON.parse(sessionCookie.value)
    } catch (error) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-brand-navy text-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo / Home */}
                        <div className="flex items-center">
                            <Link href="/teacher" className="flex items-center gap-2 font-bold text-xl hover:text-brand-yellow transition-colors">
                                <GraduationCap className="w-8 h-8 text-brand-yellow" />
                                <span>TechSchool</span>
                            </Link>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block text-sm text-gray-300">
                                Hola, <span className="font-bold text-white">{session.name}</span>
                            </span>
                            <form action={logout}>
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Salir</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    )
}
