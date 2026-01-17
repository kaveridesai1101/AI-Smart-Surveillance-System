import React, { useState, useEffect } from 'react';
import { Camera, Shield, Users, Activity, ExternalLink, RefreshCw, Trash2, Edit, Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { getIncidents, setUserContext } from './services/api';

const AdminPanel = () => {
    const [cameras, setCameras] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [stats, setStats] = useState({ totalIncidents: 0, systemLoad: '24%', storage: '45%' });

    useEffect(() => {
        // Set context as admin to see all alerts
        setUserContext('admin');
        fetchData();

        // Real-time Sync
        const ws = new WebSocket('ws://localhost:8001/ws/alerts');
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.msg_type === 'incident') {
                    setIncidents(prev => [data, ...prev]);
                } else if (data.msg_type === 'incident_update') {
                    setIncidents(prev => prev.map(inc =>
                        inc.id === data.id ? { ...inc, status: data.status } : inc
                    ));
                }
            } catch (err) { console.error("WS Alert Error", err); }
        };

        return () => ws.close();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getIncidents();
            setIncidents(res.data || []);
            // axios.get('/api/cameras').then(res => setCameras(res.data));
        } catch (err) {
            console.error("Admin Fetch Error", err);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-[#0a0a0c] text-slate-200 font-inter">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">System Administration</h1>
                        <p className="text-slate-500">Configure cameras, detection models, and system rules</p>
                    </div>
                    <button className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/80 transition shadow-lg shadow-primary/20">
                        <Plus size={18} /> Add New Camera
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AdminStatCard title="Total Incidents" value={incidents.length} trend="+12% from last week" />
                    <AdminStatCard title="System Load" value="42%" trend="Stable" />
                    <AdminStatCard title="Active Streams" value="12/16" trend="4 offline" />
                </div>

                {/* Incident Logs */}
                <section className="glass rounded-2xl overflow-hidden border border-white/5">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <Shield className="text-primary" size={20} />
                            <h2 className="text-lg font-bold">Global Incident Log</h2>
                        </div>
                        <button onClick={fetchData} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition"><RefreshCw size={18} /></button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#141417] text-slate-500 text-xs uppercase tracking-wider sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Severity</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Source</th>
                                    <th className="px-6 py-4">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {incidents.map((inc, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition group">
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${inc.status === 'Resolved' ? 'text-green-500' : 'text-slate-400'}`}>
                                                {inc.status || 'New'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${inc.severity === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
                                                {inc.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">{inc.type}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{inc.camera_id}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500 flex items-center gap-2">
                                            <Clock size={12} />
                                            {new Date(inc.timestamp).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
                                {incidents.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">No incidents recorded yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Camera Management */}
                <section className="glass rounded-2xl overflow-hidden border border-white/5 opacity-50 hover:opacity-100 transition duration-500">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <h2 className="text-lg font-bold">Camera Infrastructure</h2>
                    </div>
                    {/* ... (Existing Camera Table Placeholder) ... */}
                    <div className="p-8 text-center text-slate-500 text-sm">Camera management module requires higher privileges.</div>
                </section>
            </div>
        </div>
    );
};

const AdminStatCard = ({ title, value, trend }) => (
    <div className="p-6 glass rounded-2xl space-y-2 border border-white/5">
        <p className="text-sm text-slate-500">{title}</p>
        <div className="flex justify-between items-end">
            <h3 className="text-4xl font-bold text-white">{value}</h3>
            <span className="text-[10px] text-green-400 font-bold mb-1">{trend}</span>
        </div>
    </div>
);

export default AdminPanel;
