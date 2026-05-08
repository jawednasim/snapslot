import { Navbar } from '@/components/ui/Navbar';
import { AdminNav } from './AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen pt-24 pb-12 font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-bold">Admin overview</h1>
                        <p className="text-gray-400 text-sm mt-1">Platform analytics and operational metrics.</p>
                    </div>
                    <AdminNav />
                </div>
                {children}
            </div>
        </main>
    );
}
