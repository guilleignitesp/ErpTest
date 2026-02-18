import AdminSidebar from './_components/AdminSidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 ml-64 bg-gray-50 p-8">
                {children}
            </main>
        </div>
    )
}
