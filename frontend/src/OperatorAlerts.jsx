import React, { useState, useEffect } from 'react';
import { History, ShieldAlert, CheckCircle, ArrowUpRight, Loader2, Filter, AlertTriangle } from 'lucide-react';
import { getIncidents, setUserContext, updateIncidentStatus } from './services/api';

const OperatorAlerts = ({ userId }) => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUserContext(userId);
        fetchAlerts();

        // Real-time Sync
        const ws = new WebSocket('ws://localhost:8001/ws/alerts');
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.msg_type === 'incident' && (data.owner_id === userId || userId === 'admin')) {
                    setIncidents(prev => [data, ...prev]);
                } else if (data.msg_type === 'incident_update') {
                    setIncidents(prev => prev.map(inc =>
                        inc.id === data.id ? { ...inc, status: data.status } : inc
                    ));
                }
            } catch (err) { console.error("WS Alert Error", err); }
        };

        return () => ws.close();
    }, [userId]);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const res = await getIncidents();
            setIncidents(res.data || []);
        } catch (err) {
            console.error("Alerts Fetch Error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateIncidentStatus(id, status);
        } catch (err) {
            console.error("Status Update Failed", err);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">My Incident Alerts</h1>
                    <p className="text-slate-500 font-medium">Archived detections from your private surveillance nodes.</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition"><Filter size={18} /></button>
                    <button onClick={fetchAlerts} className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition">
                        <History size={18} /> Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Querying Private Archive...</p>
                </div>
            ) : incidents.length === 0 ? (
                <div className="p-32 glass border border-dashed border-white/5 rounded-[3rem] text-center">
                    <AlertTriangle size={48} className="mx-auto mb-6 opacity-10 text-primary" />
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">No incidents detected.</h3>
                    <p className="text-sm text-slate-600 mt-2">Detections from your webcam and private nodes will appear here automatically.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {incidents.map((inc, i) => (
                        <div key={i} className="p-6 glass border border-white/5 rounded-[2rem] flex items-center justify-between group hover:bg-white/5 transition shadow-2xl">
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-2xl ${inc.severity === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-black text-white text-lg tracking-tight uppercase leading-none">{inc.type}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-[0.15em] ${inc.severity === 'High' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}>
                                            {inc.severity}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">{inc.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-slate-600">
                                        <span>SRC: {inc.camera_id}</span>
                                        <span>•</span>
                                        <span>CONF: {(inc.confidence * 100).toFixed(1)}%</span>
                                        <span>•</span>
                                        <span>{new Date(inc.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="px-5 py-2.5 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center gap-2">
                                    <CheckCircle size={14} /> Acknowledge
                                </button>
                                <button className="px-5 py-2.5 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center gap-2 border border-yellow-500/20">
                                    <ArrowUpRight size={14} /> Escalate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OperatorAlerts;
