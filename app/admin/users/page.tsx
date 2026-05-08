import { prisma } from '@/lib/prisma';
import { GlassPane } from '@/components/ui/GlassPane';
import { UserRoleDropdown } from './UserRoleDropdown';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <GlassPane className="p-6">
            <h2 className="font-display font-bold text-xl mb-6">User Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-white/5">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Joined</th>
                            <th className="px-4 py-3 rounded-r-lg">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="px-4 py-4 text-gray-500 text-xs">{u.id}</td>
                                <td className="px-4 py-4 font-medium text-gray-200">{u.name || 'Anonymous'}</td>
                                <td className="px-4 py-4 text-gray-400">{u.email}</td>
                                <td className="px-4 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-4">
                                    <UserRoleDropdown userId={u.id} currentRole={u.role} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassPane>
    );
}
