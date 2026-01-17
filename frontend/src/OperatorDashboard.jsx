import React, { useState, useEffect } from 'react';
import { Camera, ShieldAlert, Activity, Clock, Loader2, Video, List } from 'lucide-react';
import { getCameras, getIncidents, setUserContext } from './services/api';

const OperatorDashboard = ({ userId }) => {
    const [incidents, setIncidents] = useState([]);
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUserContext(userId);
        const fetchData = async () => {
            try {
                const [camsRes, incsRes] = await Promise.all([getCameras(), getIncidents()]);
                setCameras(camsRes.data || []);
                setIncidents(incsRes.data || []);
            } catch (err) {
                console.error("Dashboard Load Error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Real-time Sync
        const ws = new WebSocket('ws://localhost:8001/ws/alerts');
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'incident' && (data.owner_id === userId || userId === 'admin')) {
                    setIncidents(prev => [data, ...prev]);
                } else if (data.type === 'incident_update') {
                    setIncidents(prev => prev.map(inc =>
                        inc.id === data.id ? { ...inc, status: data.status } : inc
                    ));
                }
            } catch (err) { console.error("WS Alert Error", err); }
        };

        return () => ws.close();
    }, [userId]);

    const activeIncidentsToday = incidents.filter(i =>
        new Date(i.timestamp).toDateString() === new Date().toDateString()
    ).length;

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="font-mono text-xs uppercase tracking-widest">Loading Operator Intel...</p>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Operator Overview</h1>
                    <p className="text-slate-500 font-medium">Session-specific surveillance and private alert tracking.</p>
                </div>
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Private Link Active</span>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <OperatorStatBox
                    icon={<Video size={20} />}
                    label="Webcam Status"
                    value="Connected"
                    sub="Demo Ready"
                    color="text-blue-400"
                />
                <OperatorStatBox
                    icon={<List size={20} />}
                    label="My Cameras"
                    value={cameras.length}
                    sub="Private Nodes"
                    color="text-green-400"
                />
                <OperatorStatBox
                    icon={<ShieldAlert size={20} />}
                    label="Alerts Today"
                    value={activeIncidentsToday}
                    sub="Target Detections"
                    color="text-red-400"
                />
                <OperatorStatBox
                    icon={<Activity size={20} />}
                    label="Active Logic"
                    value="Stable"
                    sub="Secure Node"
                    color="text-purple-400"
                />
            </div>

            {/* EMPTY STATE / RECENT */}
            <div className="glass rounded-[2.5rem] p-10 border border-white/5 text-center">
                {cameras.length === 0 ? (
                    <div className="space-y-4">
                        <Camera size={48} className="mx-auto opacity-10" />
                        <h3 className="text-xl font-bold text-white">No cameras added yet.</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto">Add your own surveillance nodes in the "My Cameras" section to begin private monitoring.</p>
                    </div>
                ) : incidents.length === 0 ? (
                    <div className="space-y-4">
                        <ShieldAlert size={48} className="mx-auto opacity-10" />
                        <h3 className="text-xl font-bold text-white">No suspicious activity detected.</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto">Your private surveillance nodes are currently reporting zero threat signatures.</p>
                    </div>
                ) : (
                    <div className="text-left">
                        <h3 className="text-xl font-bold text-white mb-6">Latest Private Alerts</h3>
                        <div className="space-y-3">
                            {incidents.slice(0, 3).map((inc, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><ShieldAlert size={16} /></div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase tracking-tight">{inc.type}</p>
                                            <p className="text-[10px] text-slate-500">{inc.description}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-600">{new Date(inc.timestamp).toLocaleTimeString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const OperatorStatBox = ({ icon, label, value, sub, color }) => (
    <div className="p-8 bg-[#121214] border border-white/5 rounded-[2.5rem] hover:border-white/10 transition shadow-xl">
        <div className={`mb-6 ${color} p-4 bg-white/5 w-fit rounded-2xl`}>{icon}</div>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
        <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-widest">{sub}</p>
    </div>
);

export default OperatorDashboard;
