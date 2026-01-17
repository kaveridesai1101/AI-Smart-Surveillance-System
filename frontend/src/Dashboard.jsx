import React, { useState, useEffect } from 'react';
import {
    Shield, Camera, Activity, AlertTriangle, Settings,
    TrendingUp, Clock, ShieldAlert, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCameras, getIncidents } from './services/api';

const SurveillanceDashboard = () => {
    const [incidents, setIncidents] = useState([]);
    const [cameras, setCameras] = useState([]);
    const [stats, setStats] = useState({ activeCameras: 0, alertsToday: 0, health: '100%' });
    const [loading, setLoading] = useState(true);
    const [motionScore, setMotionScore] = useState(0);

    // Safe Date Helper
    const safeTime = (dateStr) => {
        try {
            if (!dateStr) return 'None';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return 'None';
            return d.toLocaleTimeString();
        } catch (e) { return 'None'; }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [camsRes, incsRes] = await Promise.all([getCameras(), getIncidents()]);
                const realCams = camsRes.data || [];
                const allIncs = incsRes.data || [];

                setCameras(realCams);
                setIncidents(allIncs.slice(0, 10));

                setStats({
                    activeCameras: realCams.length,
                    alertsToday: allIncs.filter(i => {
                        try {
                            return new Date(i.timestamp).toDateString() === new Date().toDateString();
                        } catch (e) { return false; }
                    }).length,
                    health: realCams.length > 0 ? '100%' : 'Offline'
                });
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const ws = new WebSocket('ws://localhost:8001/ws/alerts');
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'stats') {
                    setMotionScore(data.score);
                } else if (data.type === 'incident_update') {
                    setIncidents(prev => prev.map(inc =>
                        inc.id === data.incident_id ? { ...inc, status: data.status } : inc
                    ));
                } else if (data.type === 'incident') { // Actual incident object
                    const newIncident = {
                        ...data,
                        id: data.id || Date.now(),
                        status: data.status || 'Active'
                    };
                    setIncidents(prev => {
                        const exists = prev.find(p => p.id === newIncident.id);
                        if (exists) return prev;
                        return [newIncident, ...prev].slice(0, 10);
                    });
                    setStats(prev => ({
                        ...prev,
                        alertsToday: prev.alertsToday + 1,
                        health: 'Active'
                    }));
                }
            } catch (e) { console.warn("Dashboard WS Error", e); }
        };
        return () => ws.close();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 space-y-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="font-mono text-xs uppercase tracking-widest text-slate-600">Initializing Core Intel...</p>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Operations Overview</h1>
                    <p className="text-slate-500 font-medium">Real-time behavior analysis and safety metrics.</p>
                </div>
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Global Stream Enabled</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox icon={<Camera size={20} />} label="Video Input" value={cameras.length > 0 ? "Connected" : "Standby"} color="text-blue-400" />
                <StatBox icon={<Activity size={20} />} label="AI Core" value={cameras.length > 0 ? "Active" : "Standby"} color="text-green-400" />
                <StatBox icon={<AlertTriangle size={20} />} label="Total Alerts" value={incidents.length} color="text-red-400" />
                <StatBox icon={<Clock size={20} />} label="Last Event" value={safeTime(incidents[0]?.timestamp)} color="text-purple-400" />
            </div>

            {/* MISSION STATEMENT */}
            <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-center backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition duration-1000" />
                <p className="text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed relative z-10">
                    "Analyzing live video using <span className="text-primary font-bold">OpenCV</span> for motion tracking and <span className="text-primary font-bold">TensorFlow</span> for intent classification."
                </p>
                <div className="mt-8 flex justify-center gap-4 relative z-10 font-mono text-[10px] uppercase font-bold text-slate-500 tracking-[0.3em]">
                    <span>Secure Feed Analysis Protocol v1.0.4</span>
                </div>
            </div>

            {/* RECENT ALERTS */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black text-white tracking-tight">RECENT ALERTS</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="space-y-4">
                    {incidents.length === 0 ? (
                        <div className="p-20 bg-black/20 rounded-[2.5rem] border border-white/5 border-dashed text-center">
                            <ShieldAlert size={48} className="mx-auto mb-4 opacity-10 text-primary" />
                            <p className="text-xl font-black text-white uppercase tracking-tighter">No incidents detected yet.</p>
                            <p className="text-sm text-slate-600 mt-2">The system is standing by. Live camera signals will trigger alerts here.</p>
                        </div>
                    ) : (
                        incidents.slice(0, 5).map((inc, i) => (
                            <div key={i} className="p-6 bg-[#121214] border border-white/5 rounded-3xl flex justify-between items-center group hover:bg-white/5 transition shadow-2xl">
                                <div className="flex items-center gap-6">
                                    <div className={`p-4 rounded-2xl ${inc.severity === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-lg tracking-tight uppercase">{inc.type}</h4>
                                        <p className="text-slate-500 font-medium">{inc.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-mono text-slate-400 mb-1">
                                        {inc.camera_id} • {inc.owner_id}
                                    </p>
                                    <p className="text-xs font-mono text-slate-600 mb-1">{safeTime(inc.timestamp)}</p>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${inc.severity === 'High' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}>
                                        {inc.severity}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ icon, label, value, color }) => (
    <div className="p-8 bg-[#121214] border border-white/5 rounded-[2.5rem] group hover:border-primary/20 transition duration-500 shadow-xl">
        <div className={`mb-6 ${color} p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition duration-500`}>{icon}</div>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
    </div>
);

export default SurveillanceDashboard;
