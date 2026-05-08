'use client';

import { useState } from 'react';
import { updateUserRole } from '../actions';

export function UserRoleDropdown({ userId, currentRole }: { userId: string, currentRole: string }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsUpdating(true);
        await updateUserRole(userId, e.target.value);
        setIsUpdating(false);
    };

    return (
        <select 
            value={currentRole} 
            onChange={handleChange}
            disabled={isUpdating}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
        >
            <option className="bg-gray-900 text-white" value="USER">USER</option>
            <option className="bg-gray-900 text-white" value="OWNER">OWNER</option>
            <option className="bg-gray-900 text-white" value="ADMIN">ADMIN</option>
        </select>
    );
}
