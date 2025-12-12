"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, PlayCircle, StopCircle, User2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuestions } from "@/hooks/useQuestions";

export default function HRPracticePage() {
    const { questions, loading, error } = useQuestions({ type: 'hr' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState<{ id: number, questionId: string, duration: string }[]>([]);

    const selectedQuestion = questions[selectedIndex];

    const toggleRecording = () => {
        if (isRecording && selectedQuestion) {
            setRecordings([...recordings, { id: Date.now(), questionId: selectedQuestion._id, duration: "0:45" }]);
        }
        setIsRecording(!isRecording);
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    if (error || questions.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <GlassCard className="p-8 text-center">
                    <p className="text-gray-400">{error || 'No HR questions available.'}</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="flex h-full">
            {/* Question List Sidebar */}
            <div className="w-80 border-r border-white/10 bg-black/50 flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white">Interview Questions</h2>
                    <p className="text-sm text-gray-400">Common behavioral questions</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {questions.map((q, index) => (
                        <div
                            key={q._id}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "p-3 rounded-lg text-sm cursor-pointer transition-colors border",
                                selectedIndex === index
                                    ? "bg-white text-black border-white font-medium"
                                    : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className="line-clamp-2">{q.question}</span>
                                <span className={cn(
                                    "text-xs px-1.5 py-0.5 rounded capitalize ml-2 shrink-0",
                                    q.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                        q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                )}>{q.difficulty}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 flex flex-col text-white relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {selectedQuestion && (
                        <motion.div
                            key={selectedQuestion._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-3xl mx-auto w-full flex-1 flex flex-col"
                        >
                            <div className="mb-8 text-center mt-12">
                                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                                    <User2 className="h-10 w-10 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold mb-4">{selectedQuestion.question}</h1>
                                <p className="text-gray-400 max-w-xl mx-auto">
                                    Practice your answer. Focus on the STAR method (Situation, Task, Action, Result).
                                </p>
                                <div className="flex gap-2 justify-center mt-4">
                                    {selectedQuestion.topics?.map(topic => (
                                        <span key={topic} className="text-xs bg-white/10 px-2 py-1 rounded capitalize">{topic}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="h-40 w-full max-w-lg mb-8 flex items-center justify-center gap-1">
                                    {isRecording ? (
                                        Array.from({ length: 20 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [10, Math.random() * 60 + 20, 10] }}
                                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                                className="w-2 bg-white rounded-full"
                                            />
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-sm">Click mic to start recording answer</div>
                                    )}
                                </div>

                                <Button
                                    size="lg"
                                    onClick={toggleRecording}
                                    className={cn("h-16 w-16 rounded-full p-0 flex items-center justify-center transition-all", isRecording ? "bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/20" : "bg-white/10 hover:bg-white/20 text-white")}
                                >
                                    {isRecording ? <StopCircle className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                                </Button>
                            </div>

                            <div className="mt-12 border-t border-white/10 pt-6">
                                <h3 className="text-sm font-medium text-gray-400 mb-4">Your Recordings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {recordings.filter(r => r.questionId === selectedQuestion._id).map((rec, i) => (
                                        <GlassCard key={i} className="p-3 flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-300">Attempt #{i + 1}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-500">{rec.duration}</span>
                                                <PlayCircle className="h-5 w-5 text-white cursor-pointer hover:text-gray-300" />
                                            </div>
                                        </GlassCard>
                                    ))}
                                    {recordings.filter(r => r.questionId === selectedQuestion._id).length === 0 && (
                                        <p className="text-sm text-slate-600 italic">No recordings yet.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
