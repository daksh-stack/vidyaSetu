"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";

const initialQuestions = [
    { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays", solvedBy: 1205 },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", category: "Linked List", solvedBy: 850 },
    { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "Strings", solvedBy: 920 },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Arrays", solvedBy: 340 },
];

export default function AdminPage() {
    const [questions, setQuestions] = useState(initialQuestions);
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar />
            <main className="ml-64 w-full p-8 relative">
                <div className="max-w-6xl mx-auto text-white">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Question Management</h1>
                            <p className="text-slate-400">Add, edit, or remove practice problems.</p>
                        </div>
                        <Button onClick={() => setShowAddModal(true)} className="bg-white text-black hover:bg-gray-200">
                            <Plus className="h-4 w-4 mr-2" /> Add New Question
                        </Button>
                    </div>

                    <GlassCard className="mb-6 flex items-center gap-4 p-4">
                        <Search className="h-5 w-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            className="bg-transparent border-none focus:outline-none text-white w-full placeholder:text-gray-500"
                        />
                    </GlassCard>

                    <div className="bg-black/50 rounded-xl border border-white/10 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 font-medium text-gray-300">Title</th>
                                    <th className="p-4 font-medium text-gray-300">Category</th>
                                    <th className="p-4 font-medium text-gray-300">Difficulty</th>
                                    <th className="p-4 font-medium text-gray-300">Solves</th>
                                    <th className="p-4 font-medium text-gray-300 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((q) => (
                                    <tr key={q.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{q.title}</td>
                                        <td className="p-4 text-gray-400">{q.category}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${q.difficulty === 'Easy' ? 'bg-white/10 text-white border-white/20' :
                                                q.difficulty === 'Medium' ? 'bg-white/5 text-gray-400 border-white/10' :
                                                    'bg-transparent text-gray-500 border-gray-800'
                                                }`}>
                                                {q.difficulty}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400">{q.solvedBy}</td>
                                        <td className="p-4 text-right space-x-2">
                                            <button className="text-gray-400 hover:text-white transition-colors"><Edit2 className="h-4 w-4" /></button>
                                            <button className="text-gray-400 hover:text-white transition-colors"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Simple Modal Overlay */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <GlassCard className="w-full max-w-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Add New Question</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Title</label>
                                    <Input placeholder="e.g. Reverse Linked List" className="text-white bg-black/50 border-white/10" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Category</label>
                                        <Input placeholder="Arrays" className="text-white bg-black/50 border-white/10" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Difficulty</label>
                                        <select className="w-full h-10 rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20">
                                            <option>Easy</option>
                                            <option>Medium</option>
                                            <option>Hard</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                                <Button onClick={() => setShowAddModal(false)}>Save Question</Button>
                            </div>
                        </GlassCard>
                    </div>
                )}
            </main>
        </div>
    );
}
