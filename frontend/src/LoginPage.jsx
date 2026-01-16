import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            if (email === 'admin@sentinel.ai' && password === 'admin123') {
                onLogin('admin', 'admin');
            } else if (email === 'operator@sentinel.ai' && password === 'operator123') {
                onLogin('operator', 'operator_001');
            } else {
                setError('Invalid credentials');
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center relative overflow-hidden font-inter">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 mx-auto mb-6">
                        <Shield className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Authenticate to access the Surveillance Node.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Access ID</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-black/60 transition text-white"
                                    placeholder="Enter your ID"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Secure Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:bg-black/60 transition text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-400 text-xs font-bold bg-red-500/10 p-3 rounded-lg flex items-center gap-2">
                                <Shield className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/80 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-xs font-bold uppercase text-slate-500 mb-3 text-center tracking-widest">Demo Credentials</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => { setEmail('admin@sentinel.ai'); setPassword('admin123'); }}
                                className="p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition group"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <span className="text-xs font-bold text-white">Admin</span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono group-hover:text-primary transition">admin@sentinel.ai</div>
                            </div>
                            <div
                                onClick={() => { setEmail('operator@sentinel.ai'); setPassword('operator123'); }}
                                className="p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition group"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-xs font-bold text-white">Operator</span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono group-hover:text-primary transition">operator@sentinel.ai</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
