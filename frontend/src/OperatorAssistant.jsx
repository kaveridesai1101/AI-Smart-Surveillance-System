import React, { useState } from 'react';
import { Brain, MessageSquare, Send, Sparkles, ShieldCheck, ChevronRight, HelpCircle } from 'lucide-react';

const OperatorAssistant = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Sentinel AI Operator Assistant online. How can I assist your surveillance session?' }
    ]);
    const [input, setInput] = useState('');

    const suggestions = [
        "Explain Loitering Detections",
        "Recommended Escalation Protocol",
        "How to add my camera?",
        "Explain Confidence Scores"
    ];

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages([...messages, userMsg]);
        setInput('');

        // Mock AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "Based on internal protocols, I can explain detection signatures and recommended responses. However, as an Operator Assistant, I cannot modify system settings. How else can I help?"
            }]);
        }, 1000);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">AI Guidance Console</h1>
                    <p className="text-slate-500 font-medium">Real-time intelligence assistant for incident evaluation.</p>
                </div>
                <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-2">
                    <Sparkles className="text-purple-400" size={14} />
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Neural Link 1.2</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
                {/* SUGGESTIONS */}
                <div className="lg:col-span-1 space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">Quick Queries</h4>
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => setInput(s)}
                            className="w-full p-4 glass border border-white/5 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:border-primary/30 transition text-left flex items-center justify-between group"
                        >
                            {s} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                        </button>
                    ))}

                    <div className="mt-10 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                        <HelpCircle className="text-blue-500 mb-3" size={24} />
                        <h5 className="text-[10px] font-black text-white uppercase mb-2">Capabilities</h5>
                        <ul className="text-[10px] text-slate-500 space-y-2 list-disc pl-4 font-medium">
                            <li>Incident behavior analysis</li>
                            <li>Confidence factor explanation</li>
                            <li>Standard escalation flows</li>
                        </ul>
                    </div>
                </div>

                {/* CHAT INTERFACE */}
                <div className="lg:col-span-3 glass rounded-[3rem] border border-white/5 p-6 flex flex-col h-[600px] shadow-2xl">
                    <div className="flex-1 overflow-y-auto space-y-6 px-4 mb-6">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed ${m.role === 'user'
                                        ? 'bg-primary text-white font-medium rounded-tr-none'
                                        : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none'
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSend} className="relative mt-auto">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-[2rem] py-5 px-8 pr-20 text-sm focus:border-primary/50 outline-none transition"
                            placeholder="Type a query or select a suggestion..."
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OperatorAssistant;
