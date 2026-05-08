'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNav() {
    const pathname = usePathname();

    const links = [
        { href: '/admin', label: 'Overview' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/venues', label: 'Venues' },
        { href: '/admin/bookings', label: 'Bookings' }
    ];

    return (
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            {links.map((link) => (
                <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === link.href ? 'bg-blue-600 border border-blue-500 text-white' : 'hover:bg-white/10 text-gray-300'
                    }`}
                >
                    {link.label}
                </Link>
            ))}
        </div>
    );
}
