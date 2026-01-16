import React, { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, MapPin, Globe, Loader2, Save, X, Shield } from 'lucide-react';
import { getCameras, addCamera, deleteCamera, setUserContext } from './services/api';

const MyCameras = ({ userId }) => {
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // list | add
    const [formData, setFormData] = useState({ name: '', location: '', type: 'IP', url: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setUserContext(userId);
        fetchCams();
    }, [userId]);

    const fetchCams = async () => {
        setLoading(true);
        try {
            const res = await getCameras();
            setCameras(res.data || []);
        } catch (err) {
            console.error("Fetch Error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addCamera({
                name: formData.name,
                location: formData.location,
                source: formData.url
            });
            await fetchCams();
            setView('list');
            setFormData({ name: '', location: '', type: 'IP', url: '' });
        } catch (err) {
            alert("Failed to register node.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this camera node from your private list?")) return;
        try {
            await deleteCamera(id);
            setCameras(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert("Failed to remove node.");
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">My Private Nodes</h1>
                    <p className="text-slate-500 font-medium">Register and manage your dedicated surveillance hardware.</p>
                </div>
                {view === 'list' && (
                    <button
                        onClick={() => setView('add')}
                        className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition"
                    >
                        <Plus size={18} /> Register Camera
                    </button>
                )}
            </div>

            {view === 'add' ? (
                <div className="max-w-2xl mx-auto glass p-10 rounded-[2.5rem] border border-white/5 relative">
                    <button onClick={() => setView('list')} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-lg text-slate-500 transition"><X /></button>
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Camera className="text-primary" /> New Private Connection</h2>

                    <form onSubmit={handleAdd} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Camera Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none text-white transition"
                                    placeholder="e.g. Home Office"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Location Label</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                    <input
                                        required
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary/50 outline-none text-white transition"
                                        placeholder="Internal/External"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Camera Type</label>
                            <div className="flex gap-4">
                                {['IP', 'RTSP', 'Webcam Alias'].map(t => (
                                    <button
                                        key={t} type="button"
                                        onClick={() => setFormData({ ...formData, type: t })}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${formData.type === t ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Stream URL / ID</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                <input
                                    required
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary/50 outline-none text-white transition font-mono"
                                    placeholder="rtsp://... or 0 (Webcam)"
                                />
                            </div>
                        </div>

                        <button
                            disabled={submitting}
                            className="w-full bg-white text-black hover:bg-slate-200 py-4 rounded-xl font-black uppercase tracking-widest transition flex items-center justify-center gap-3 mt-4"
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            Finalize Configuration
                        </button>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {loading ? (
                        <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
                    ) : cameras.length === 0 ? (
                        <div className="p-20 border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.02] text-center">
                            <Camera size={48} className="mx-auto mb-6 opacity-10" />
                            <h3 className="text-xl font-bold text-white mb-2">No cameras added.</h3>
                            <p className="text-slate-500 text-sm mb-8">Add a camera to start your secure private surveillance session.</p>
                            <button onClick={() => setView('add')} className="text-primary font-bold hover:underline">Add your first node &rarr;</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cameras.map(cam => (
                                <div key={cam.id} className="p-6 glass border border-white/5 rounded-3xl flex items-center justify-between group hover:border-white/10 transition">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-white/5 rounded-2xl text-slate-300">
                                            <Camera size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{cam.name}</h4>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><MapPin size={12} /> {cam.location}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                <span className="font-mono text-[10px] opacity-70">PRIVATE_OWNER: {userId}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-green-500/10 text-green-500 rounded-lg">Operational</span>
                                        <button
                                            onClick={() => handleDelete(cam.id)}
                                            className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-center gap-4">
                <Shield className="text-yellow-500" size={24} />
                <p className="text-xs text-yellow-500/80 font-medium">
                    <span className="font-bold uppercase tracking-wider">Privacy Notice:</span> Admin cannot see these cameras unless escalated through the official system protocols.
                </p>
            </div>
        </div>
    );
};

export default MyCameras;
