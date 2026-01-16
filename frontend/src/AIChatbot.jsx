import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello, I am Sentinel AI. How can I assist you with the surveillance controls today?' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        // User Message
        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Mock LLM Response (Simulating API Latency)
        setTimeout(() => {
            let reply = "I can help you navigate the system. Try asking about 'Alerts' or 'Cameras'.";
            if (input.toLowerCase().includes('alert')) {
                reply = "Alerts are generated when motion exceeds the escalation threshold. Check the 'Incidents' page for a full log.";
            } else if (input.toLowerCase().includes('camera')) {
                reply = "You can manage active nodes in the 'Camera Management' section. Currently, Camera 0 is live.";
            } else if (input.toLowerCase().includes('demo')) {
                reply = "We are currently running in DEMO mode using your local webcam.";
            }
            setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all ${isOpen ? 'hidden' : 'bg-primary text-white'}`}
            >
                <MessageSquare size={24} />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-50 w-96 h-[500px] glass rounded-2xl border border-white/10 flex flex-col shadow-2xl overflow-hidden bg-[#0a0a0c]"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-primary/10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bot className="text-primary w-5 h-5" />
                                <span className="font-bold text-sm">Sentinel Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-xl p-3 text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-white/5 text-slate-300 rounded-bl-none border border-white/5'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a message..."
                                    className="w-full bg-black/20 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-primary/50 text-white"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary rounded-full text-white hover:bg-primary/80 transition"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatbot;
