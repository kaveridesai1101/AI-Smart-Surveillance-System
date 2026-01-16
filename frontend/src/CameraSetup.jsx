import React, { useState, useEffect } from 'react';
import { Camera, Save, MapPin, Link as LinkIcon, Webcam, Server, Trash2, Loader2, Plus, X } from 'lucide-react';
import { getCameras, addCamera } from './services/api';

const CameraSetup = ({ userRole }) => {
    // STRICT: Real Data Only
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // list | add_camera | manage_areas

    // Areas State (In a real app, this would be an API)
    // We will initialize it with unique locations from cameras + default
    const [areas, setAreas] = useState([]);
    const [newAreaName, setNewAreaName] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [sourceType, setSourceType] = useState('webcam'); // webcam | external
    const [sourceUrl, setSourceUrl] = useState('');

    useEffect(() => {
        const fetchCams = async () => {
            try {
                const res = await getCameras();
                setCameras(res.data);
                // Sync areas from existing cams if any
                const existingLocs = [...new Set(res.data.map(c => c.location))];
                setAreas(prev => [...new Set([...prev, ...existingLocs])]);
            } catch (err) {
                console.warn("API Error", err);
                setCameras([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCams();
    }, []);

    const handleAddArea = (e) => {
        e.preventDefault();
        if (newAreaName && !areas.includes(newAreaName)) {
            setAreas([...areas, newAreaName]);
            setNewAreaName('');
        }
    };

    const [successMsg, setSuccessMsg] = useState('');

    const handleAddCamera = async (e) => {
        e.preventDefault();

        // 1. Create Optimistic Data
        const finalSource = sourceType === 'webcam' ? '0' : sourceUrl;
        const tempId = Date.now();
        const optimisticCam = {
            id: tempId,
            name,
            location: location || areas[0],
            source_url: finalSource,
            status: 'Inactive' // Default until verified
        };

        // 2. INSTANT UI UPDATE (Optimistic)
        setSuccessMsg('');
        setCameras(prev => [...prev, optimisticCam]);
        setViewMode('list');
        setSuccessMsg(`Camera "${name}" registered (Background Syncing...)`);

        // Reset Form Immediately
        setName('');
        setLocation('');
        setSourceUrl('');
        setTimeout(() => setSuccessMsg(''), 4000);

        // 3. Background API Call
        try {
            const response = await addCamera({ name: optimisticCam.name, location: optimisticCam.location, source: optimisticCam.source_url });

            // 4. Reconcile: Replace temp object with real backend object (with real ID)
            setCameras(prev => prev.map(c => c.id === tempId ? response.data : c));
            setSuccessMsg(`Camera "${optimisticCam.name}" synced successfully.`);

        } catch (err) {
            console.error("Failed to add camera", err);
            // 5. Rollback on Error
            setCameras(prev => prev.filter(c => c.id !== tempId));
            alert("Failed to sync camera with server. Changes reverted.");
            setViewMode('add_camera'); // Re-open form so user doesn't lose data context
        }
    };

    if (userRole !== 'admin') return (
        <div className="flex items-center justify-center h-full text-slate-500">
            <p>Access Restricted: Admin Only</p>
        </div>
    );

    return (
        <div className="p-8 max-w-6xl mx-auto text-slate-200 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Camera Configuration</h1>
                    <p className="text-slate-500 mt-1">Manage surveillance nodes and input streams</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setViewMode('manage_areas')}
                        className={`px-5 py-2.5 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition flex items-center gap-2 ${viewMode === 'manage_areas' ? 'bg-white/10' : ''}`}
                    >
                        <MapPin size={18} /> Manage Areas
                    </button>
                    <button
                        onClick={() => setViewMode('add_camera')}
                        disabled={viewMode === 'add_camera'}
                        className="bg-primary hover:bg-primary/80 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition"
                    >
                        <Plus size={18} /> Add Camera
                    </button>
                </div>
            </div>

            {/* Success Message Banner */}
            {successMsg && (
                <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 text-green-500 animate-in fade-in slide-in-from-top-2">
                    <div className="p-1 bg-green-500 rounded-full text-black"><Plus size={12} /></div>
                    <span className="font-bold text-sm">{successMsg}</span>
                </div>
            )}

            {/* Empty State */}
            {!loading && cameras.length === 0 && viewMode === 'list' && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5 text-center">
                    <div className="p-4 bg-white/5 rounded-full mb-4">
                        <Camera size={32} className="opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No cameras configured yet</h3>
                    <p className="text-slate-500 max-w-md mb-6">The system requires at least one active video node to begin surveillance operations.</p>
                    <button
                        onClick={() => setViewMode('add_camera')}
                        className="text-primary font-bold hover:underline"
                    >
                        Register your first camera &rarr;
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* AREA MANAGEMENT PANEL */}
                {viewMode === 'manage_areas' && (
                    <div className="lg:col-span-1">
                        <div className="glass p-6 rounded-2xl border border-white/10 shadow-2xl relative">
                            <button onClick={() => setViewMode('list')} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg text-slate-400"><X size={16} /></button>
                            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-purple-500 rounded-full" /> Area Management
                            </h2>

                            <form onSubmit={handleAddArea} className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    value={newAreaName}
                                    onChange={e => setNewAreaName(e.target.value)}
                                    placeholder="New Area Name..."
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-purple-500/50 outline-none"
                                />
                                <button type="submit" className="bg-purple-500 hover:bg-purple-600 p-3 rounded-xl transition"><Plus size={18} /></button>
                            </form>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {areas.map((area, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <MapPin size={14} className="text-purple-400" />
                                            <span className="text-sm font-medium">{area}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded uppercase font-bold">Active</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ADD CAMERA MODAL / PANEL */}
                {viewMode === 'add_camera' && (
                    <div className="lg:col-span-1">
                        <div className="glass p-6 rounded-2xl border border-white/10 shadow-2xl relative">
                            <button
                                onClick={() => setViewMode('list')}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg text-slate-400"
                            >
                                <X size={16} />
                            </button>

                            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary rounded-full" /> New Node Configuration
                            </h2>

                            <form onSubmit={handleAddCamera} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Source Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSourceType('webcam')}
                                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition ${sourceType === 'webcam' ? 'bg-primary/20 border-primary text-white' : 'bg-black/20 border-white/10 text-slate-500 hover:bg-white/5'}`}
                                        >
                                            <Webcam size={20} />
                                            <span className="text-xs font-bold">Device Cam</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSourceType('external')}
                                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition ${sourceType === 'external' ? 'bg-primary/20 border-primary text-white' : 'bg-black/20 border-white/10 text-slate-500 hover:bg-white/5'}`}
                                        >
                                            <Server size={20} />
                                            <span className="text-xs font-bold">External IP</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Camera Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-primary/50 outline-none transition text-white"
                                        placeholder="e.g. Main Entrance"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Location / Zone</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <select
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-sm focus:border-primary/50 outline-none transition text-white appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select Area...</option>
                                            {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {sourceType === 'external' && (
                                    <div className="space-y-2 animate-in fade-in">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">RTSP Stream URL</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                            <input
                                                type="text"
                                                value={sourceUrl}
                                                onChange={e => setSourceUrl(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-sm focus:border-primary/50 outline-none transition text-white font-mono"
                                                placeholder="rtsp://admin:pass@192..."
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="w-full bg-white text-black hover:bg-slate-200 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-4">
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Configuration
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* CAMERA LIST */}
                {cameras.length > 0 && (
                    <div className={viewMode !== 'list' ? 'lg:col-span-2' : 'lg:col-span-3'}>
                        <div className="space-y-4">
                            {cameras.map((cam) => (
                                <div key={cam.id} className="p-5 glass rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-slate-300">
                                            {cam.source_url === '0' ? <Webcam size={24} /> : <Server size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-base">{cam.name}</h3>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><MapPin size={12} /> {cam.location}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                <span className="font-mono text-[10px] opacity-70">{cam.source_url === '0' ? 'LOCAL DEVICE' : 'NETWORK STREAM'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                                            Registered
                                        </span>
                                        <button className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition" title="Remove Camera">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CameraSetup;
