import React, { useState } from 'react';
import {
    LayoutDashboard, Camera, History, PieChart, Settings,
    Bell, Search, Shield, LogOut, Menu, X, ChevronRight, Activity, FileText, Brain, User
} from 'lucide-react';
import SurveillanceDashboard from './Dashboard';
import SurveillancePage from './SurveillancePage';
import IncidentsPage from './IncidentsPage';
import AccuracyPage from './AccuracyPage';
import SettingsPage from './SettingsPage';
import AIChatbot from './AIChatbot';
import CameraSetup from './CameraSetup';
import OperatorDashboard from './OperatorDashboard';
import OperatorSurveillance from './OperatorSurveillance';
import MyCameras from './MyCameras';
import OperatorAlerts from './OperatorAlerts';
import OperatorAssistant from './OperatorAssistant';
import OperatorProfile from './OperatorProfile';
import { setUserContext } from './services/api';

const DashboardLayout = ({ onLogout, userRole, userId }) => {
    const [activePage, setActivePage] = useState('overview');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Initialize API Context Immediately
    React.useEffect(() => {
        if (userId) setUserContext(userId);
    }, [userId]);

    const adminMenu = [
        { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'surveillance', label: 'Live Surveillance', icon: <Camera size={20} /> },
        { id: 'camerasetup', label: 'Camera Setup', icon: <Shield size={20} /> },
        { id: 'incidents', label: 'Incidents', icon: <History size={20} /> },
        { id: 'accuracy', label: 'Accuracy & Results', icon: <FileText size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    const operatorMenu = [
        { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'surveillance', label: 'Live Surveillance', icon: <Camera size={20} /> },
        { id: 'mycameras', label: 'My Cameras', icon: <Shield size={20} /> },
        { id: 'incidents', label: 'Incident Alerts', icon: <Bell size={20} /> },
        { id: 'assistant', label: 'AI Assistant', icon: <Brain size={20} /> },
        { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    ];

    const menuItems = userRole === 'admin' ? adminMenu : operatorMenu;

    return (
        <div className="flex h-screen bg-[#0a0a0c] text-slate-200 font-inter">
            {/* Sidebar */}
            <aside className={`glass border-r border-white/5 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-6 flex items-center gap-3">
                    <Shield className="text-primary" />
                    {isSidebarOpen && <span className="font-bold text-xl tracking-tight">Sentinel AI</span>}
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActivePage(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${activePage === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-slate-400'
                                }`}
                        >
                            {item.icon}
                            {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                            {isSidebarOpen && activePage === item.id && <ChevronRight size={14} className="ml-auto" />}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-xl transition">
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Topbar Strict Requirement: System Status + Notifs + Chatbot + User */}
                <header className="h-20 glass border-b border-white/5 px-8 flex justify-between items-center z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
                            <Menu />
                        </button>
                        <h2 className="font-bold text-lg capitalize">{menuItems.find(i => i.id === activePage)?.label || 'Sentinel Node'}</h2>

                        {/* System Status Indicator */}
                        <div className="ml-8 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-mono font-bold text-green-500 uppercase tracking-widest">System Active</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 hover:bg-white/5 rounded-lg">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-[#0a0a0c]" />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right">
                                <p className="text-sm font-black leading-none uppercase tracking-tighter text-white">
                                    {userRole === 'admin' ? 'System Admin' : 'Security Operator'}
                                </p>
                                <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-widest">
                                    {userRole === 'admin' ? 'Master Control Center' : `Node ID: ${userId}`}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold">
                                    {userRole === 'admin' ? 'AD' : 'OP'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page View */}
                <main className="flex-1 overflow-y-auto bg-[#0a0a0c] relative">
                    {/* Admin Specific Views */}
                    {userRole === 'admin' && (
                        <>
                            {activePage === 'overview' && <SurveillanceDashboard userRole={userRole} />}
                            {activePage === 'surveillance' && <SurveillancePage userRole={userRole} />}
                            {activePage === 'camerasetup' && <CameraSetup userRole={userRole} />}
                            {activePage === 'incidents' && <IncidentsPage userRole={userRole} />}
                            {activePage === 'accuracy' && <AccuracyPage userRole={userRole} />}
                            {activePage === 'settings' && <SettingsPage userRole={userRole} />}
                        </>
                    )}

                    {/* Operator Specific Views */}
                    {userRole === 'operator' && (
                        <>
                            {activePage === 'overview' && <OperatorDashboard userId={userId} />}
                            {activePage === 'surveillance' && <OperatorSurveillance userId={userId} />}
                            {activePage === 'mycameras' && <MyCameras userId={userId} />}
                            {activePage === 'incidents' && <OperatorAlerts userId={userId} />}
                            {activePage === 'assistant' && <OperatorAssistant />}
                            {activePage === 'profile' && <OperatorProfile userId={userId} onLogout={onLogout} />}
                        </>
                    )}
                </main>

                {/* MANDATORY AI CHATBOT */}
                <AIChatbot />
            </div>
        </div>
    );
};



export default DashboardLayout;
