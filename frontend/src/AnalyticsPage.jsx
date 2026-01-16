import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Map as MapIcon, Calendar, Loader2, Clock, ShieldAlert } from 'lucide-react';
import { getIncidents } from './services/api';

const AnalyticsPage = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getIncidents().then(res => {
            setIncidents(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    // 1. Calculate Real Violation Types
    const typeCounts = incidents.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
    }, {});

    const total = incidents.length || 1;

    // 2. Trend Data (Mock logic replaced with Timestamp aggregation)
    // Group incidents by hour for the last 12 hours
    const trendData = new Array(12).fill(0);
    incidents.forEach(inc => {
        const hourDiff = Math.floor((new Date() - new Date(inc.timestamp)) / (1000 * 60 * 60));
        if (hourDiff < 12 && hourDiff >= 0) {
            trendData[11 - hourDiff]++; // 11 is current hour, 0 is 11 hours ago
        }
    });

    // Find Max for scaling
    const maxVal = Math.max(...trendData, 1);

    if (loading) return (
        <div className="flex items-center justify-center h-full text-slate-500 font-medium">
            <Loader2 className="animate-spin mr-2" /> Analyzing security events...
        </div>
    );

    return (
        <div className="p-8 space-y-8 animate-in zoom-in-95 duration-500">
            <div>
                <h1 className="text-2xl font-bold">Security Analytics</h1>
                <p className="text-slate-500 text-sm">Real-time data insights</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Real-time Trend Chart */}
                    <div className="glass rounded-3xl p-8 h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} className="text-primary" /> Incident Frequency (Last 12h)</h3>
                        </div>
                        <div className="flex-1 flex items-end gap-4 px-4 overflow-hidden border-b border-white/5 pb-2">
                            {incidents.length === 0 ? (
                                <div className="w-full text-center text-slate-500 text-sm flex flex-col items-center justify-center h-full">
                                    <BarChart3 className="mb-2 opacity-50" />
                                    No Data Available
                                </div>
                            ) : (
                                trendData.map((val, i) => (
                                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-lg group relative" style={{ height: `${(val / maxVal) * 100}%` }}>
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-2 py-1 rounded font-bold transition">
                                            {val}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            <span>12h Ago</span>
                            <span>Now</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass rounded-3xl p-6">
                            <h3 className="font-bold text-sm mb-6 flex items-center gap-2"><BarChart3 size={16} className="text-accent" /> Violation Breakdown</h3>
                            <div className="space-y-4">
                                {Object.keys(typeCounts).length === 0 ? (
                                    <p className="text-xs text-slate-500 italic">No violations recorded yet.</p>
                                ) : (
                                    Object.entries(typeCounts).map(([type, count]) => (
                                        <ProgressRow key={type} label={type} value={Math.round((count / total) * 100)} color="bg-primary" />
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="glass rounded-3xl p-6">
                            <h3 className="font-bold text-sm mb-6 flex items-center gap-2"><Users size={16} className="text-green-400" /> Crowd Density</h3>
                            <div className="flex items-center justify-center h-24">
                                <p className="text-slate-500 text-xs italic">Insufficient data for heatmap generation.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Dynamic Peak Hours */}
                    <div className="glass rounded-3xl p-6 space-y-6">
                        <h3 className="font-bold text-sm">Peak Activity Windows</h3>
                        {incidents.length > 0 ? (
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-primary" />
                                    <span className="text-sm">Latest Detection</span>
                                </div>
                                <span className="text-xs font-bold text-slate-300">{new Date(incidents[0].timestamp).toLocaleTimeString()}</span>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500">No activity recorded to analyze peak usage.</p>
                        )}
                    </div>

                    <div className="glass rounded-3xl p-6 bg-gradient-to-br from-primary/10 to-transparent">
                        <ShieldAlert size={32} className="text-primary mb-4" />
                        <h3 className="font-bold mb-2">System Health</h3>
                        {incidents.length === 0 ? (
                            <p className="text-xs text-slate-400 leading-relaxed">
                                System is active and monitoring. No anomalies detected.
                            </p>
                        ) : (
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {incidents.length} anomalies have been flagged for review.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgressRow = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-400">{label}</span>
            <span>{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
        </div>
    </div>
);

export default AnalyticsPage;
