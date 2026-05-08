'use client';

import { GlassPane } from '@/components/ui/GlassPane';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export function AdminDashboardAnalytics({ categoryData, trendsData }: { categoryData: any[], trendsData: any[] }) {
    if (!categoryData || categoryData.length === 0) return null;

    const pieData = categoryData.map(c => ({
        name: c.category,
        value: c._count.id
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <GlassPane className="p-6">
                <h3 className="font-display font-bold text-lg mb-6">Venue Categories</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {pieData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            {entry.name} ({entry.value})
                        </div>
                    ))}
                </div>
            </GlassPane>

            <GlassPane className="p-6">
                <h3 className="font-display font-bold text-lg mb-6">Revenue Trends (Recent Days)</h3>
                <div className="h-[250px] w-full">
                    {trendsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#94a3b8" 
                                    fontSize={12} 
                                    tickFormatter={(val) => {
                                        const date = new Date(val);
                                        return `${date.getDate()}/${date.getMonth() + 1}`;
                                    }} 
                                />
                                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                                <RechartsTooltip 
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="right" dataKey="count" name="Bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-sm text-gray-500">
                            No revenue data available yet.
                        </div>
                    )}
                </div>
            </GlassPane>
        </div>
    );
}
