import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Salud',
  description: 'Admin dashboard for managing reservations',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#FFFBF5] p-0">
      {children}
    </main>
  )
} 