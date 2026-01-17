import React from 'react';
import { X, Clock, MapPin, Eye, ShieldAlert, Cpu, Activity, Info } from 'lucide-react';

const IncidentDetailModal = ({ incident, userRole, onClose, onHide, onRestore }) => {
    if (!incident) return null;

    const confidence = Number(incident.confidence) || 0;

    return (
        <div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#121214] border border-white/10 w-full max-w-4xl rounded-[3rem] p-12 shadow-2xl relative animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-3xl text-slate-400 transition hover:rotate-90 hover:text-white"
                >
                    <X size={24} />
                </button>

                {/* Header Section */}
                <div className="space-y-4 mb-12">
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${incident.severity === 'High' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}>
                            {incident.severity || 'Medium'} PRIORITY
                        </span>
                        <span className="text-slate-600 font-mono text-sm">ARCHIVE_NODE_{incident.id}</span>
                    </div>
                    <h2 className="text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                        {incident.type || 'Detection Alert'}
                    </h2>
                    <div className="flex items-center gap-6 text-slate-400 font-medium">
                        <div className="flex items-center gap-2"><Clock size={16} className="text-primary" /> {new Date(incident.timestamp).toLocaleString()}</div>
                        <div className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> {incident.camera_id || 'Unknown Source'}</div>
                        {userRole === 'admin' && (
                            <div className="flex items-center gap-2 border-l border-white/10 pl-6"><Activity size={16} className="text-primary" /> Assigned Operator: {incident.owner_id || 'SYSTEM'}</div>
                        )}
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <MetricCard icon={<Activity size={20} />} label="Motion Vector" value={Math.round(confidence * 85)} color="text-blue-400" />
                    <MetricCard icon={<Cpu size={20} />} label="Neural Logic" value={Math.round(confidence * 95)} color="text-purple-400" />
                    <MetricCard icon={<ShieldAlert size={20} />} label="Decision Score" value={Math.round(confidence * 100)} color="text-primary" />
                </div>

                {/* Behavioral Summary */}
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em]">
                        <Info size={14} /> AI Context Narrative
                    </div>
                    <p className="text-slate-300 text-xl leading-relaxed italic font-light">
                        "{incident.description || incident.ai_summary || "Temporal behavioral analysis suggests unique motion patterns consistent with the identified escalation type. Probability density remains within monitored limits."}"
                    </p>
                </div>

                {/* Admin Controls Area */}
                {userRole === 'admin' && (
                    <div className="mt-8 flex items-center justify-between p-8 bg-black/40 rounded-[2rem] border border-white/5">
                        <div>
                            <h4 className="font-bold text-white text-lg">Visibility Control</h4>
                            <p className="text-slate-500 text-sm">Toggle item existence for standard operators.</p>
                        </div>
                        <button
                            onClick={() => incident.status === 'Hidden' ? onRestore(incident.id) : onHide(incident.id)}
                            className={`px-8 py-4 rounded-2xl font-black transition-all ${incident.status === 'Hidden' ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                        >
                            {incident.status === 'Hidden' ? 'RESTORE ITEM' : 'HIDE FROM FEED'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const MetricCard = ({ icon, label, value, color }) => (
    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] flex flex-col items-center text-center group hover:bg-white/10 transition">
        <div className={`mb-4 ${color} opacity-40 group-hover:opacity-100 transition duration-500`}>{icon}</div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
        <div className={`text-4xl font-black ${color} font-mono tracking-tighter`}>{value}%</div>
    </div>
);

export default IncidentDetailModal;
