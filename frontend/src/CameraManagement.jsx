import React, { useState, useEffect } from 'react';
import { Camera, Plus, MapPin, Signal, MoreVertical, Trash2, Edit } from 'lucide-react';
import { getCameras } from './services/api';

const CameraManagement = () => {
    const [cameras, setCameras] = useState([]);

    useEffect(() => {
        const fetchCams = async () => {
            try {
                const res = await getCameras();
                setCameras(res.data);
            } catch (e) {
                console.error("Camera fetch error", e);
            }
        };
        fetchCams();
    }, []);

    // Placeholder data if backend is empty for checking UI
    const demoCameras = [
        { id: 'CAM-01', location: 'Main Entrance Lobby', status: 'Active' },
        { id: 'CAM-02', location: 'Parking Lot B', status: 'Inactive' },
        { id: 'DEMO-USER-CAM', location: 'Live Demo Workstation', status: 'Active' },
    ];

    const displayCameras = cameras.length > 0 ? cameras : demoCameras;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Camera Management</h1>
                    <p className="text-slate-400">Manage surveillance nodes and configure stream settings.</p>
                </div>
                <button className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition text-sm">
                    <Plus size={18} /> Add Camera
                </button>
            </div>

            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-6 font-bold">Camera ID</th>
                            <th className="p-6 font-bold">Location</th>
                            <th className="p-6 font-bold">Status</th>
                            <th className="p-6 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {displayCameras.map((cam, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition">
                                <td className="p-6 font-mono text-primary font-bold">{cam.id || cam.camera_id}</td>
                                <td className="p-6 flex items-center gap-2 text-slate-300">
                                    <MapPin size={16} className="text-slate-500" />
                                    {cam.location}
                                </td>
                                <td className="p-6">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${(cam.status === 'Active' || cam.is_active)
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {cam.status || (cam.is_active ? 'Active' : 'Offline')}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-danger transition">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CameraManagement;
