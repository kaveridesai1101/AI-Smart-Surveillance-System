import React, { useState, useEffect, useRef } from 'react';
import { Camera, Video, ShieldAlert, Activity, Play, StopCircle, RefreshCw, Loader2, Smartphone } from 'lucide-react';
import { getCameras, setUserContext, setAIContext } from './services/api';

const OperatorSurveillance = ({ userId }) => {
    const [mode, setMode] = useState('webcam'); // webcam | private_cam
    const [isStreaming, setIsStreaming] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState({
        status: 'Standby',
        behavior: 'Normal',
        confidence: 0,
        timestamp: '--:--:--',
        source: 'None',
        isConfirmed: false
    });

    const ws = useRef(null);

    useEffect(() => {
        setUserContext(userId);
        const fetchCams = async () => {
            const res = await getCameras();
            setCameras(res.data || []);
        };
        fetchCams();

        // WebSocket for Real-time Analytics
        ws.current = new WebSocket('ws://localhost:8001/ws/alerts');
        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'stats') {
                    setAnalytics(prev => ({
                        ...prev,
                        status: 'Active',
                        behavior: data.score > 0.5 ? (data.confirmed ? 'Confirmed Anomaly' : 'Suspicious Movement') : 'Normal',
                        confidence: Math.round(data.score * 100),
                        timestamp: new Date().toLocaleTimeString(),
                        source: 'AI Edge Node',
                        isConfirmed: data.confirmed
                    }));
                }
            } catch (e) { console.error("WS Parse Error", e); }
        };

        return () => ws.current?.close();
    }, [userId]);

    const toggleStream = async () => {
        if (!isStreaming) {
            setLoading(true);
            try {
                // Sync Context to Backend AI Engine
                await setAIContext({
                    owner_id: userId,
                    camera_id: mode === 'webcam' ? 'LOCAL-WEBCAM' : (selectedCamera?.name || 'PRIVATE_NODE')
                });

                setTimeout(() => {
                    setIsStreaming(true);
                    setLoading(false);
                }, 800);
            } catch (err) {
                console.error("Context Sync Error", err);
                setLoading(false);
            }
        } else {
            setIsStreaming(false);
            setAnalytics(prev => ({
                ...prev,
                status: 'Stopped',
                behavior: 'N/A',
                confidence: 0,
                isConfirmed: false
            }));
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Live Monitoring</h1>
                    <p className="text-slate-500 font-medium">Real-time edge processing for private nodes.</p>
                </div>

                <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                    <button
                        onClick={() => { setIsStreaming(false); setMode('webcam'); }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${mode === 'webcam' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Video size={14} /> AI Processing (Webcam)
                    </button>
                    <button
                        onClick={() => { setIsStreaming(false); setMode('private_cam'); }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${mode === 'private_cam' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Smartphone size={14} /> My Cameras
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SOURCE SELECTOR & FEED */}
                <div className="lg:col-span-2 space-y-4">
                    {mode === 'private_cam' && (
                        <div className="flex gap-4 mb-4">
                            <select
                                onChange={(e) => setSelectedCamera(cameras.find(c => c.id === parseInt(e.target.value)))}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50 text-white"
                            >
                                <option value="">Select a private camera...</option>
                                {cameras.map(c => <option key={c.id} value={c.id}>{c.name} - {c.location}</option>)}
                            </select>
                            <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition"><RefreshCw size={18} /></button>
                        </div>
                    )}

                    <div className="aspect-video bg-[#0c0c0e] rounded-[2.5rem] border border-white/5 overflow-hidden relative group shadow-2xl">
                        {isStreaming ? (
                            <div className="w-full h-full relative">
                                <img
                                    src={mode === 'webcam' ? 'http://localhost:8001/video_feed' : (selectedCamera?.source_url || 'http://localhost:8001/video_feed')}
                                    alt="Surveillance Feed"
                                    className="w-full h-full object-cover opacity-90 transition duration-700"
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"; }}
                                />
                                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-red-500 rounded-full animate-pulse shadow-lg">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Live AI Feed</span>
                                </div>
                                <button
                                    onClick={toggleStream}
                                    className="absolute bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl shadow-2xl transition-all hover:scale-110"
                                >
                                    <StopCircle size={24} />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
                                <div className="p-8 bg-white/5 rounded-full border border-white/5 group-hover:scale-110 transition duration-500">
                                    <Camera size={48} className="text-slate-700" />
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-500 text-sm font-medium">System standby. Secure link ready.</p>
                                    <button
                                        disabled={loading || (mode === 'private_cam' && !selectedCamera)}
                                        onClick={toggleStream}
                                        className="mt-4 bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-30"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                                        Initialize AI Protocol
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI ANALYTICS PANEL */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass rounded-3xl border border-white/5 p-8 h-full flex flex-col">
                        <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                            <Activity className="text-primary" /> SYSTEM ANALYTICS
                        </h2>

                        <div className="space-y-8 flex-1">
                            <AnalyticRow label="Feed Status" value={analytics.status} color={analytics.status === 'Active' ? 'text-green-400' : 'text-slate-500'} />
                            <AnalyticRow label="Behavior Logic" value={analytics.behavior} color={analytics.behavior === 'Suspicious' ? 'text-red-400' : 'text-blue-400'} />
                            <AnalyticRow label="AI Confidence" value={`${analytics.confidence}%`} color="text-primary" />
                            <AnalyticRow label="Active Source" value={mode === 'webcam' ? 'Neural Edge Node' : (selectedCamera?.name || 'Searching...')} color="text-slate-400" />
                            <AnalyticRow label="Last Analysis" value={analytics.timestamp} color="text-slate-500 font-mono" />
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Neural Network Load
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${analytics.confidence > 0 ? 35 + (analytics.confidence / 10) : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnalyticRow = ({ label, value, color }) => (
    <div>
        <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">{label}</p>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
);

export default OperatorSurveillance;
