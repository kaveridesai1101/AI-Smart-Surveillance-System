import React from 'react';
import { User, Bell, Shield, Smartphone, Globe, Save } from 'lucide-react';

const SettingsPage = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-slate-500 text-sm">Manage your profile and system preferences</p>
            </div>

            <div className="space-y-6">
                <SettingsSection icon={<User />} title="User Profile" desc="Personalize your identity and login details.">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500">Full Name</label>
                            <input type="text" defaultValue="Admin User" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary/50 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500">Email Address</label>
                            <input type="email" defaultValue="admin@sentinel.ai" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-primary/50 outline-none" />
                        </div>
                    </div>
                </SettingsSection>

                <SettingsSection icon={<Bell />} title="Notifications" desc="Configure how you receive critical alerts.">
                    <div className="space-y-4">
                        <Toggle label="Desktop Push Notifications" active />
                        <Toggle label="Email Summaries" active />
                        <Toggle label="SMS Critical Alerts" />
                    </div>
                </SettingsSection>

                <SettingsSection icon={<Shield />} title="AI Sensitivity" desc="Adjust the detection thresholds for behavior analysis.">
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-white">Detection Confidence</span>
                                <span className="text-xs text-primary font-bold">75%</span>
                            </div>
                            <input type="range" className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-primary cursor-pointer" />
                        </div>
                        <div className="flex gap-4">
                            <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold">Standard Mode</span>
                            <span className="bg-white/5 text-slate-500 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold hover:text-white transition cursor-pointer">Strict Mode</span>
                        </div>
                    </div>
                </SettingsSection>
            </div>

            <div className="flex justify-end pt-4">
                <button className="bg-primary hover:bg-primary/80 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-primary/20">
                    <Save size={18} /> Save Changes
                </button>
            </div>
        </div>
    );
};

const SettingsSection = ({ icon, title, desc, children }) => (
    <div className="glass rounded-3xl p-8 border border-white/5">
        <div className="flex gap-6 mb-8">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl h-fit">{icon}</div>
            <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
        </div>
        {children}
    </div>
);

const Toggle = ({ label, active = false }) => {
    const [isOn, setIsOn] = React.useState(active);
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-300">{label}</span>
            <button
                onClick={() => setIsOn(!isOn)}
                className={`w-10 h-5 rounded-full transition-colors relative ${isOn ? 'bg-primary' : 'bg-slate-800'}`}
            >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isOn ? 'left-6' : 'left-1'}`} />
            </button>
        </div>
    );
};

export default SettingsPage;
