import React, { useState, useEffect } from 'react';
import {
    Filter, Download, ExternalLink, ShieldAlert, Clock,
    MapPin, Loader2, EyeOff, RefreshCw, Trash2, Eye, X, Shield
} from 'lucide-react';
import { getIncidents, updateIncidentStatus } from './services/api';
import IncidentDetailModal from './IncidentDetailModal';

const IncidentsPage = ({ userRole }) => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIncident, setSelectedIncident] = useState(null);

    // Safe Date Formatter
    const formatDate = (dateStr) => {
        try {
            if (!dateStr) return 'Time Unknown';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return 'Time Unknown';
            return d.toLocaleString();
        } catch (e) {
            return 'Time Unknown';
        }
    };

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const response = await getIncidents();
                setIncidents(response.data || []);
            } catch (error) {
                console.warn("Backend Unresponsive - Defaulting to Empty State");
                setIncidents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchIncidents();

        // REAL-TIME WEBSOCKET CONNECTION
        const ws = new WebSocket('ws://localhost:8001/ws/alerts');
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'incident_update') {
                    // Sync status update across all windows
                    setIncidents(prev => prev.map(inc =>
                        inc.id === data.incident_id ? { ...inc, status: data.status } : inc
                    ));
                } else if (data.type === 'incident') {
                    const newIncident = {
                        id: data.id || Date.now(),
                        timestamp: data.timestamp || new Date().toISOString(),
                        camera_id: data.camera_id || 'Webcam',
                        type: data.type || 'Suspicious Activity',
                        severity: data.severity || 'Medium',
                        description: data.description || data.ai_summary || 'Activity detected',
                        ai_summary: data.ai_summary || '',
                        confidence: data.escalation_score || data.confidence || 0.75,
                        status: data.status || 'Active',
                        owner_id: data.owner_id || 'admin'
                    };
                    setIncidents(prev => {
                        const exists = prev.find(p => p.id === newIncident.id);
                        if (exists) return prev;
                        return [newIncident, ...prev];
                    });
                }
            } catch (e) { console.warn('WS Alert Parse Error', e); }
        };
        return () => ws.close();
    }, []);

    const handleHide = async (id) => {
        try {
            await updateIncidentStatus(id, 'Hidden');
            // Local state will be updated by WS broadcast
        } catch (err) { console.error("Update failed", err); }
    };

    const handleRestore = async (id) => {
        try {
            await updateIncidentStatus(id, 'Active');
            // Local state will be updated by WS broadcast
        } catch (err) { console.error("Update failed", err); }
    };


    const visibleIncidents = userRole === 'admin'
        ? incidents
        : incidents.filter(i => i.status !== 'Hidden');

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 flex justify-between items-center shadow-2xl backdrop-blur-sm">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">INCIDENT ARCHIVE</h1>
                    <p className="text-slate-500 font-medium text-sm mt-2 flex items-center gap-2">
                        <Shield size={16} className="text-primary" /> Real-time threat detection history
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        disabled={visibleIncidents.length === 0}
                        className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition border border-white/5 ${visibleIncidents.length === 0
                            ? 'bg-white/5 text-slate-600 cursor-not-allowed opacity-50'
                            : 'bg-white/10 hover:bg-white/20 text-white shadow-lg'
                            }`}
                    >
                        <Download size={18} /> Export Results
                    </button>
                    <button
                        disabled={visibleIncidents.length === 0}
                        className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition shadow-lg ${visibleIncidents.length === 0
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                            : 'bg-primary hover:bg-primary/80 text-white shadow-primary/30'
                            }`}
                    >
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Table section */}
            <div className="bg-[#0c0c0e] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-inner">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] border-b border-white/5">
                        <tr>
                            <th className="px-10 py-6">Identity / Type</th>
                            <th className="px-10 py-6">Source</th>
                            <th className="px-10 py-6">Confidence</th>
                            <th className="px-10 py-6">Timestamp</th>
                            <th className="px-10 py-6">Visibility</th>
                            {userRole === 'admin' && <th className="px-10 py-6 text-right">Admin</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-10 py-32 text-center text-slate-600">
                                    <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">Syncing Secure Feed...</p>
                                </td>
                            </tr>
                        ) : visibleIncidents.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-10 py-32 text-center text-slate-600">
                                    <ShieldAlert size={48} className="mx-auto mb-4 opacity-10 text-primary" />
                                    <p className="text-xl font-black text-white uppercase tracking-tighter">No incidents detected yet.</p>
                                    <p className="text-sm opacity-50 mt-2 font-medium">Real-time detections from live cameras will appear here automatically.</p>
                                </td>
                            </tr>
                        ) : (
                            visibleIncidents.map(incident => (
                                <tr
                                    key={incident.id}
                                    onClick={() => setSelectedIncident(incident)}
                                    className="group hover:bg-white/[0.03] transition-all cursor-pointer border-l-4 border-transparent hover:border-primary"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${incident.severity === 'High' ? 'bg-red-500' : 'bg-primary'} shadow-[0_0_10px_rgba(59,130,246,0.5)]`} />
                                            <span className="font-black text-white text-lg">{incident.type || 'Behavior Alert'}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 font-mono text-sm text-slate-400">{incident.camera_id || 'Webcam'}</td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${(incident.confidence || 0) * 100}%` }} />
                                            </div>
                                            <span className="text-primary font-bold text-xs font-mono">{Math.round((incident.confidence || 0) * 100)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-slate-500 text-sm font-medium">{formatDate(incident.timestamp)}</td>
                                    <td className="px-10 py-8">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${incident.status === 'Hidden' ? 'bg-slate-800 text-slate-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {incident.status || 'Active'}
                                        </span>
                                    </td>
                                    {userRole === 'admin' && (
                                        <td className="px-10 py-8 text-right" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => incident.status === 'Hidden' ? handleRestore(incident.id) : handleHide(incident.id)}
                                                className="p-3 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition"
                                            >
                                                {incident.status === 'Hidden' ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL LAYER */}
            {selectedIncident && (
                <div className="fixed inset-0 z-[100000]">
                    <IncidentDetailModal
                        incident={selectedIncident}
                        userRole={userRole}
                        onClose={() => setSelectedIncident(null)}
                        onHide={handleHide}
                        onRestore={handleRestore}
                    />
                </div>
            )}
        </div>
    );
};

export default IncidentsPage;
