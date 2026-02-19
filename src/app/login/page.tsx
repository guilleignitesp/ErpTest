'use client'

import { login } from '../actions/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            if (result.role === 'ADMIN') router.push('/admin')
            else if (result.role === 'TEACHER') router.push('/teacher')
            else if (result.role === 'STUDENT') router.push('/student')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-navy">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-brand-navy mb-2">IGNITE SP⚡</h1>
                <p className="text-center text-gray-500 mb-8">TechEd Company</p>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-brand-yellow text-brand-navy font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition duration-200"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}
