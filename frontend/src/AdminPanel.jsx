import React, { useState, useEffect } from 'react';
import { Camera, Shield, Users, Activity, ExternalLink, RefreshCw, Trash2, Edit, Plus } from 'lucide-react';
import axios from 'axios';

const AdminPanel = () => {
    const [cameras, setCameras] = useState([]);
    const [stats, setStats] = useState({ totalIncidents: 0, systemLoad: '24%', storage: '45%' });

    useEffect(() => {
        // Fetch cameras and stats
        // axios.get('/api/cameras').then(res => setCameras(res.data));
    }, []);

    return (
        <div className="min-h-screen p-8 bg-[#0a0a0c] text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">System Administration</h1>
                        <p className="text-slate-500">Configure cameras, detection models, and system rules</p>
                    </div>
                    <button className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg font-medium hover:bg-primary/80 transition">
                        <Plus size={18} /> Add New Camera
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AdminStatCard title="Total Incidents" value="1,284" trend="+12% from last week" />
                    <AdminStatCard title="System Load" value="42%" trend="Stable" />
                    <AdminStatCard title="Active Streams" value="12/16" trend="4 offline" />
                </div>

                {/* Camera Management */}
                <section className="glass rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-lg font-bold">Camera Infrastructure</h2>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-lg"><RefreshCw size={18} /></button>
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-[#141417] text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Camera ID</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">AI Model</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[1, 2, 3, 4].map(id => (
                                <tr key={id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4 font-mono text-sm">CAM-0{id}</td>
                                    <td className="px-6 py-4 text-sm">Main Entrance - Sector {id}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-2 text-xs font-medium text-green-400">
                                            <div className="w-2 h-2 rounded-full bg-green-400" /> Online
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold">YOLOv8-Security</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button className="text-slate-400 hover:text-white"><Edit size={16} /></button>
                                            <button className="text-slate-400 hover:text-danger"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};

const AdminStatCard = ({ title, value, trend }) => (
    <div className="p-6 glass rounded-2xl space-y-2">
        <p className="text-sm text-slate-500">{title}</p>
        <div className="flex justify-between items-end">
            <h3 className="text-4xl font-bold">{value}</h3>
            <span className="text-[10px] text-green-400 font-bold mb-1">{trend}</span>
        </div>
    </div>
);

export default AdminPanel;
