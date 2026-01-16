import React from 'react';
import { Shield, Camera, Activity, AlertTriangle, ArrowRight, ShieldCheck, Zap, Layers, Eye, Brain, Clock, Lock, TrendingUp, Cpu, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="bg-[#050507] text-white min-h-screen font-inter selection:bg-primary/30 overflow-x-hidden">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050507]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-bold tracking-tight block leading-none">IntentSentinel</span>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Enterprise AI</span>
                        </div>
                    </div>
                    <div className="hidden md:flex gap-12 text-sm text-slate-400 font-semibold uppercase tracking-widest">
                        <a href="#problem" className="hover:text-primary transition">Problem</a>
                        <a href="#solution" className="hover:text-primary transition">Intelligence</a>
                        <a href="#tech" className="hover:text-primary transition">Technology</a>
                    </div>
                    <button onClick={onGetStarted} className="bg-white text-black hover:bg-slate-200 px-8 py-3 rounded-xl font-bold transition shadow-2xl">
                        Launch System
                    </button>
                </div>
            </nav>

            {/* Hero Section - Structured */}
            <header className="relative pt-48 pb-32 px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-xs text-primary font-bold uppercase tracking-widest"
                        >
                            <Zap size={14} /> Public Safety Solved
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-bold tracking-tighter leading-[1.1] text-white"
                        >
                            AI Smart Surveillance <br />
                            <span className="text-primary">System</span>
                        </motion.h1>

                        {/* Tech Stack Badges - Explicit for User */}
                        <div className="flex flex-wrap gap-3">
                            <div className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-mono border border-blue-500/30">OpenCV</div>
                            <div className="px-3 py-1 rounded bg-orange-500/20 text-orange-400 text-xs font-mono border border-orange-500/30">TensorFlow</div>
                            <div className="px-3 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-mono border border-purple-500/30">Gemini LLM</div>
                            <div className="px-3 py-1 rounded bg-green-500/20 text-green-400 text-xs font-mono border border-green-500/30">FastAPI</div>
                        </div>

                        <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                            A simple, powerful system that uses Computer Vision to detect suspicious activity in real-time. It transforms passive cameras into smart safeguards.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={onGetStarted} className="bg-primary hover:bg-primary/80 px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition">
                                Start Live Demo <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative glass rounded-[2.5rem] border border-white/10 overflow-hidden aspect-video shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
                            <img src="http://localhost:8001/video_feed" alt="System Preview" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-mono text-primary font-bold uppercase mb-1">Live_Stream_01</p>
                                    <h3 className="text-lg font-bold">Webcam Node Active</h3>
                                </div>
                                <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                                    <Activity className="text-primary animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Problem Section - Simplified for Clarity */}
            <section id="problem" className="py-24 px-8 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-3xl font-bold mb-4">The Problem Statement</h2>
                        <p className="text-lg text-slate-400">Regular cameras are <b>Passive</b>. They only record crimes after they happen. We need a system that is <b>Proactive</b>.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ComparisonItem
                            label="The Old Way"
                            desc="Security guards staring at 100 screens. They miss 95% of events due to fatigue."
                            h="20"
                            color="bg-slate-600"
                        />
                        <ComparisonItem
                            label="Our Solution"
                            desc="AI watches every frame, 24/7. It never blinks and never gets tired."
                            h="80"
                            color="bg-primary"
                        />
                        <ComparisonItem
                            label="The Result"
                            desc="Suspicious activity is detected instantly, preventing crime before it starts."
                            h="100"
                            color="bg-green-500"
                        />
                    </div>
                </div>
            </section>

            {/* Unique Section - Enterprise Layout */}
            <section id="solution" className="py-32 px-8 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-bold tracking-tight mb-4">Core Intelligence</h2>
                        <p className="text-slate-500 uppercase tracking-widest font-bold text-xs">Temporal Behavioral Modeling</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <LayerCard
                            icon={<Cpu className="text-primary" />}
                            title="OpenCV Layer"
                            desc="Visual signal extraction and motion vector mapping."
                        />
                        <LayerCard
                            icon={<TrendingUp className="text-accent" />}
                            title="TensorFlow Layer"
                            desc="Temporal patterns and behavior classification."
                        />
                        <LayerCard
                            icon={<Brain className="text-purple-400" />}
                            title="LLM Layer"
                            desc="Gemini-powered reasoning and tactical reporting."
                        />
                        <LayerCard
                            icon={<Lock className="text-green-400" />}
                            title="Privacy Layer"
                            desc="Identity-agnostic analysis by design."
                        />
                    </div>
                </div>
            </section>

            {/* Tech Pipeline - Structured Aligned */}
            <section id="tech" className="py-32 px-8">
                <div className="max-w-7xl mx-auto glass p-16 rounded-[4rem] border border-white/5 relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div>
                            <h2 className="text-4xl font-bold mb-8 italic">The Pipeline.</h2>
                            <div className="space-y-12">
                                <StepItem num="01" title="Real-time Stream Ingestion" desc="High-fidelity capture via local CCTV or webcam nodes." />
                                <StepItem num="02" title="Behavioral Signature Extraction" desc="Identifying motion outliers using temporal OpenCV signals." />
                                <StepItem num="03" title="Escalation Risk Synthesis" desc="Calculating dynamic risk scores based on learned norms." />
                                <StepItem num="04" title="Tactical Response" desc="Instant LLM-generated briefings for field personnel." />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-6">
                            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">System Impact</h3>
                                <div className="space-y-6">
                                    <ImpactRow label="Detection Lead Time" value="+120s" />
                                    <ImpactRow label="False Positive Reduction" value="45%" />
                                    <ImpactRow label="Operator Capacity" value="3.5x" />
                                </div>
                            </div>
                            <div className="p-8 glass rounded-[2rem] border border-primary/20 bg-primary/5">
                                <ShieldCheck className="text-primary mb-4" />
                                <h4 className="font-bold mb-2">Ethics Shield Active</h4>
                                <p className="text-xs text-slate-500">All data processed locally. Facial recognition disabled by default to ensure maximum public trust and GDPR compliance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-8 border-t border-white/5 text-center text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
                    <div className="flex items-center gap-2">
                        <Shield className="text-primary" />
                        <span className="font-bold text-white text-lg">IntentSentinel</span>
                    </div>
                    <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition">Privacy</a>
                        <a href="#" className="hover:text-white transition">Ethics</a>
                        <a href="#" className="hover:text-white transition">Smart Cities</a>
                        <a href="#" className="hover:text-white transition">Documentation</a>
                    </div>
                    <p className="text-xs">&copy; 2026 Proactive Intel Labs. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const ComparisonItem = ({ label, desc, h, color = 'bg-primary' }) => (
    <div className="p-10 glass rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between h-[300px]">
        <div>
            <h4 className="font-bold mb-4 text-xl">{label}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className={`${color} h-full`} style={{ width: `${h}%` }} />
        </div>
    </div>
);

const LayerCard = ({ icon, title, desc }) => (
    <div className="p-8 glass rounded-3xl border border-white/5 text-center group hover:bg-white/5 transition">
        <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">{icon}</div>
        <h4 className="font-bold mb-3">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

const StepItem = ({ num, title, desc }) => (
    <div className="flex gap-8 group">
        <span className="text-3xl font-bold text-white/5 group-hover:text-primary/20 transition">{num}</span>
        <div>
            <h4 className="font-bold mb-2">{title}</h4>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
    </div>
);

const ImpactRow = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-lg font-bold text-white">{value}</span>
    </div>
);

export default LandingPage;
