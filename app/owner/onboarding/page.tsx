import { Navbar } from '@/components/ui/Navbar';
import { OnboardingFlow } from './OnboardingFlow';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function OnboardingPage() {
    return (
        <main className="min-h-screen bg-[#0B0F1A] font-sans">
            <Navbar />
            <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<div className="text-center text-gray-500">Loading onboard flow...</div>}>
                    <OnboardingFlow />
                </Suspense>
            </div>
        </main>
    );
}
