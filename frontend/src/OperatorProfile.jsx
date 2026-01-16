import React from 'react';
import { User, Shield, Clock, LogOut, Key, Calendar } from 'lucide-react';

const OperatorProfile = ({ userId, onLogout }) => {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">My Profile</h1>
                    <p className="text-slate-500 font-medium">Manage your personal identification and session status.</p>
                </div>
                <button
                    onClick={onLogout}
                    className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-sm font-bold flex items-center gap-2 transition"
                >
                    <LogOut size={18} /> Terminate Session
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* ID CARD */}
                <div className="md:col-span-1">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent p-[3px] mx-auto mb-6 shadow-2xl">
                            <div className="w-full h-full rounded-full bg-[#0a0a0c] flex items-center justify-center font-black text-3xl text-white">OP</div>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Security Operator</h3>
                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1">{userId}</p>

                        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-2 bg-white/5 rounded-lg text-slate-500"><Shield size={16} /></div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Assigned Role</p>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase underline decoration-primary underline-offset-4">Active Surveillance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DETAILS */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                        <div>
                            <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Key size={12} /> Authentication Details
                            </h4>
                            <div className="grid grid-cols-2 gap-8">
                                <ProfileItem label="Node Access ID" value={userId} icon={<User size={14} />} />
                                <ProfileItem label="Encryption Level" value="AES-256" icon={<Shield size={14} />} />
                                <ProfileItem label="Last Login" value={new Date().toLocaleDateString()} icon={<Calendar size={14} />} />
                                <ProfileItem label="Session Timer" value="04:22:15" icon={<Clock size={14} />} />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Account Limitations</h4>
                            <p className="text-xs text-slate-600 italic">"Operators are restricted from modifying system-wide AI thresholds, deletion of logs, or access to administrative nodes. All surveillance sessions are source-tagged and time-stamped for audit trails."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileItem = ({ label, value, icon }) => (
    <div className="flex items-start gap-4">
        <div className="p-2.5 bg-white/5 rounded-xl text-slate-500">{icon}</div>
        <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-bold text-white">{value}</p>
        </div>
    </div>
);

export default OperatorProfile;
