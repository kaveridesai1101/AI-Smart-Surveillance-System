import React from 'react';
import { CheckCircle, BarChart2, Activity, Eye, Brain, Shield } from 'lucide-react';

const AccuracyPage = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 text-slate-200">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Accuracy & Results</h1>
                <p className="text-slate-400">System performance metrics and detection logic explanation for presentation.</p>
            </div>

            {/* Explanation Section */}
            <div className="glass p-8 rounded-2xl border border-white/5 mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Activity className="text-primary" /> Detection Logic
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    This system uses a hybrid AI approach to ensure high accuracy while minimizing false positives.
                    The <b>Confidence Score</b> (%) indicates the probability that a detected behavior matches a known threat pattern.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Eye className="text-blue-400" size={20} />
                            <h3 className="font-bold">OpenCV Layer</h3>
                        </div>
                        <p className="text-xs text-slate-500">Responsible for raw video capture, frame preprocessing, and initial object detection (bounding boxes).</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="text-orange-400" size={20} />
                            <h3 className="font-bold">TensorFlow Layer</h3>
                        </div>
                        <p className="text-xs text-slate-500">Analyzes temporal movement vectors (speed, direction) to classify behaviors like aggression or loitering.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Brain className="text-purple-400" size={20} />
                            <h3 className="font-bold">Rule-Based Filter</h3>
                        </div>
                        <p className="text-xs text-slate-500">Applies deterministic logic (e.g., "Time &gt; 10s" for Loitering) to validate AI predictions.</p>
                    </div>
                </div>
            </div>

            {/* Accuracy Table */}
            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-bold">Model Performance Matrix</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-6 font-bold">Activity Type</th>
                            <th className="p-6 font-bold">Confidence Threshold</th>
                            <th className="p-6 font-bold">Detection Method</th>
                            <th className="p-6 font-bold">Accuracy Rating</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                        <tr className="hover:bg-white/5 transition">
                            <td className="p-6 font-bold text-white">Aggressive Movement</td>
                            <td className="p-6 font-mono text-primary">&gt; 85%</td>
                            <td className="p-6">TensorFlow Motion Vector</td>
                            <td className="p-6 flex items-center gap-2 text-green-400">
                                <CheckCircle size={14} /> High (92%)
                            </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition">
                            <td className="p-6 font-bold text-white">Loitering</td>
                            <td className="p-6 font-mono text-primary">&gt; 90%</td>
                            <td className="p-6">OpenCV Tracking + Timer</td>
                            <td className="p-6 flex items-center gap-2 text-green-400">
                                <CheckCircle size={14} /> Very High (98%)
                            </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition">
                            <td className="p-6 font-bold text-white">Abandoned Object</td>
                            <td className="p-6 font-mono text-primary">&gt; 75%</td>
                            <td className="p-6">Static Object Detection</td>
                            <td className="p-6 flex items-center gap-2 text-yellow-400">
                                <BarChart2 size={14} /> Moderate (78%)
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccuracyPage;
