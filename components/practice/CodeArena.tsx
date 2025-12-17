"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CodeEditor } from "./CodeEditor";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    RotateCcw,
    Lightbulb,
    Clock,
    Trophy,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    XCircle,
    Sparkles,
    MessageSquare,
    Target,
    Flame,
    PanelLeftClose,
    PanelLeftOpen,
    FileText,
    Code2,
    X
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

// Types aligned with MongoDB Question model
interface Question {
    _id: string;
    title: string;
    type: "coding" | "mcq" | "hr";
    difficulty: "easy" | "medium" | "hard";
    description?: string;
    starterCode?: string;
    testCases?: { input: string; expectedOutput: string; isHidden: boolean }[];
    topics: string[];
    tags?: string[];
    companies?: string[];
    solvedBy: number;
}

interface CodeArenaProps {
    questions: Question[];
    loading?: boolean;
}

// Confetti component
function Confetti({ active }: { active: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number }[] = [];
        const colors = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20 - 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4
            });
        }

        let frame = 0;
        const maxFrames = 120;

        const animate = () => {
            if (frame > maxFrames) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5;
                p.vx *= 0.99;

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            frame++;
            requestAnimationFrame(animate);
        };

        animate();
    }, [active]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
        />
    );
}

// Interview mode chat messages
const INTERVIEW_MESSAGES = [
    { delay: 0, text: "Welcome! Please explain your approach before coding." },
    { delay: 30, text: "Good start. Can you think of any edge cases?" },
    { delay: 60, text: "What's the time complexity of your solution?" },
    { delay: 90, text: "Nice! Can you optimize this further?" },
];

export function CodeArena({ questions, loading }: CodeArenaProps) {
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [code, setCode] = useState("");
    const [hintsRevealed, setHintsRevealed] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<"success" | "failure" | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);
    const [testResults, setTestResults] = useState<{ passed: boolean; input: string; expected: string; got: string }[]>([]);

    // Panel visibility states
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [descriptionCollapsed, setDescriptionCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState<"description" | "hints">("description");

    // Interview mode
    const [interviewMode, setInterviewMode] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(15 * 60);
    const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean }[]>([]);

    // Filter only coding questions
    const codingQuestions = questions.filter(q => q.type === "coding");

    // Get recommended topic
    const recommendedTopic = codingQuestions[0]?.topics?.[0] || "arrays";

    // Difficulty badge colors
    const difficultyColors = {
        easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        hard: "bg-red-500/20 text-red-400 border-red-500/30"
    };

    // Select a question
    const handleSelectQuestion = useCallback((question: Question) => {
        setSelectedQuestion(question);
        setCode(question.starterCode || `function solution() {\n  // Write your code here\n  \n}`);
        setHintsRevealed(0);
        setSubmitResult(null);
        setTestResults([]);
        setXpEarned(0);
        // Auto-collapse sidebar on mobile when question selected
        if (window.innerWidth < 768) {
            setSidebarCollapsed(true);
        }
    }, []);

    // Interview timer
    useEffect(() => {
        if (!interviewMode || timeRemaining <= 0) return;
        const timer = setInterval(() => setTimeRemaining(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [interviewMode, timeRemaining]);

    // Interview chat messages
    useEffect(() => {
        if (!interviewMode) {
            setChatMessages([]);
            return;
        }
        setChatMessages([{ text: INTERVIEW_MESSAGES[0].text, isUser: false }]);
        const timers = INTERVIEW_MESSAGES.slice(1).map(msg =>
            setTimeout(() => {
                setChatMessages(prev => [...prev, { text: msg.text, isUser: false }]);
            }, msg.delay * 1000)
        );
        return () => timers.forEach(clearTimeout);
    }, [interviewMode]);

    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Submit code
    const handleSubmit = async () => {
        if (!selectedQuestion) return;
        setIsSubmitting(true);
        setSubmitResult(null);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockResults = (selectedQuestion.testCases || [])
            .filter(tc => !tc.isHidden)
            .map(tc => ({
                passed: Math.random() > 0.3,
                input: tc.input,
                expected: tc.expectedOutput,
                got: tc.expectedOutput
            }));

        setTestResults(mockResults);
        const allPassed = mockResults.every(r => r.passed);
        setSubmitResult(allPassed ? "success" : "failure");

        if (allPassed) {
            setShowConfetti(true);
            const baseXP = selectedQuestion.difficulty === "hard" ? 250 :
                selectedQuestion.difficulty === "medium" ? 150 : 75;
            setXpEarned(Math.max(baseXP - hintsRevealed * 25, 25));
            setTimeout(() => setShowConfetti(false), 3000);
        }

        setIsSubmitting(false);
    };

    // Reset code
    const handleReset = () => {
        if (selectedQuestion) {
            setCode(selectedQuestion.starterCode || `function solution() {\n  // Write your code here\n  \n}`);
        }
        setSubmitResult(null);
        setTestResults([]);
    };

    // Mock hints
    const hints = [
        "Think about using a hash map for O(1) lookups",
        "Store the complement of each number as you iterate",
        "Check if the complement exists before adding to the map"
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
            </div>
        );
    }

    return (
        <div className="flex h-full overflow-hidden">
            <Confetti active={showConfetti} />

            {/* LEFT: Collapsible Problem List Sidebar */}
            <motion.div
                className={cn(
                    "border-r border-white/10 flex flex-col bg-slate-950/50 overflow-hidden flex-shrink-0",
                    sidebarCollapsed ? "w-12" : "w-72"
                )}
                animate={{ width: sidebarCollapsed ? 48 : 288 }}
                transition={{ duration: 0.2 }}
            >
                {/* Sidebar Header */}
                <div className="p-3 border-b border-white/10 flex items-center justify-between">
                    {!sidebarCollapsed && (
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-emerald-400" />
                            <span className="font-semibold text-white text-sm">Problems</span>
                            <span className="text-xs text-slate-500">({codingQuestions.length})</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
                    >
                        {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                    </button>
                </div>

                {/* Sidebar Content */}
                <AnimatePresence>
                    {!sidebarCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col overflow-hidden"
                        >
                            {/* Recommended */}
                            <div className="px-3 py-2 bg-emerald-500/5 border-b border-white/5">
                                <div className="flex items-center gap-1.5 text-xs">
                                    <Flame className="h-3 w-3 text-emerald-400" />
                                    <span className="text-emerald-400">Focus:</span>
                                    <span className="text-white capitalize">{recommendedTopic}</span>
                                </div>
                            </div>

                            {/* Question List */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {codingQuestions.map((q) => (
                                    <button
                                        key={q._id}
                                        onClick={() => handleSelectQuestion(q)}
                                        className={cn(
                                            "w-full text-left px-2.5 py-2 rounded-lg transition-all text-sm",
                                            selectedQuestion?._id === q._id
                                                ? "bg-white/10 border border-white/20"
                                                : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                                q.difficulty === "easy" ? "bg-emerald-400" :
                                                    q.difficulty === "medium" ? "bg-amber-400" : "bg-red-400"
                                            )} />
                                            <span className="text-white truncate flex-1">{q.title}</span>
                                            <ChevronRight className="h-3 w-3 text-slate-600 flex-shrink-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Mini Leaderboard */}
                            <div className="p-2 border-t border-white/10 bg-slate-900/50">
                                <div className="flex items-center gap-1 text-xs text-slate-500 mb-1.5">
                                    <Trophy className="h-3 w-3 text-amber-400" />
                                    Top 3
                                </div>
                                <div className="space-y-0.5 text-xs">
                                    {["Alice", "Bob", "Charlie"].map((name, i) => (
                                        <div key={name} className="flex justify-between text-slate-400">
                                            <span>{i + 1}. {name}</span>
                                            <span className="text-emerald-400">{1250 - i * 120}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Collapsed icons */}
                {sidebarCollapsed && (
                    <div className="flex-1 flex flex-col items-center gap-1 pt-2">
                        {codingQuestions.slice(0, 8).map((q) => (
                            <button
                                key={q._id}
                                onClick={() => {
                                    handleSelectQuestion(q);
                                    setSidebarCollapsed(false);
                                }}
                                title={q.title}
                                className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                    selectedQuestion?._id === q._id
                                        ? "bg-white/10"
                                        : "hover:bg-white/5"
                                )}
                            >
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    q.difficulty === "easy" ? "bg-emerald-400" :
                                        q.difficulty === "medium" ? "bg-amber-400" : "bg-red-400"
                                )} />
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {selectedQuestion ? (
                    <>
                        {/* Top Bar */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-slate-900/50 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <h1 className="font-semibold text-white">{selectedQuestion.title}</h1>
                                <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full border",
                                    difficultyColors[selectedQuestion.difficulty]
                                )}>
                                    {selectedQuestion.difficulty}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Interview Toggle */}
                                <button
                                    onClick={() => {
                                        setInterviewMode(!interviewMode);
                                        setTimeRemaining(15 * 60);
                                    }}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                        interviewMode
                                            ? "bg-emerald-500 text-white"
                                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    )}
                                >
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Interview
                                </button>
                                {interviewMode && (
                                    <div className={cn(
                                        "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono",
                                        timeRemaining < 60 ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-white"
                                    )}>
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatTime(timeRemaining)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Split View */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Left Panel: Description (collapsible) */}
                            <motion.div
                                className={cn(
                                    "border-r border-white/10 flex flex-col overflow-hidden bg-slate-950/30",
                                    descriptionCollapsed ? "w-10" : "w-[40%]"
                                )}
                                animate={{ width: descriptionCollapsed ? 40 : "40%" }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Panel Header */}
                                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-slate-900/50">
                                    {!descriptionCollapsed && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setActiveTab("description")}
                                                className={cn(
                                                    "text-xs px-2 py-1 rounded transition-colors",
                                                    activeTab === "description"
                                                        ? "bg-white/10 text-white"
                                                        : "text-slate-400 hover:text-white"
                                                )}
                                            >
                                                <FileText className="h-3.5 w-3.5 inline mr-1" />
                                                Problem
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("hints")}
                                                className={cn(
                                                    "text-xs px-2 py-1 rounded transition-colors",
                                                    activeTab === "hints"
                                                        ? "bg-white/10 text-white"
                                                        : "text-slate-400 hover:text-white"
                                                )}
                                            >
                                                <Lightbulb className="h-3.5 w-3.5 inline mr-1" />
                                                Hints
                                                {hintsRevealed > 0 && (
                                                    <span className="ml-1 text-amber-400">({hintsRevealed}/3)</span>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setDescriptionCollapsed(!descriptionCollapsed)}
                                        className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                                    >
                                        {descriptionCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Panel Content */}
                                {!descriptionCollapsed && (
                                    <div className="flex-1 overflow-y-auto p-4">
                                        {activeTab === "description" ? (
                                            <div className="space-y-4">
                                                <p className="text-slate-300 text-sm leading-relaxed">
                                                    {selectedQuestion.description || "No description available."}
                                                </p>

                                                {/* Examples */}
                                                {selectedQuestion.testCases?.filter(tc => !tc.isHidden).slice(0, 2).map((tc, i) => (
                                                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                                                        <h4 className="text-white text-xs font-medium mb-2">Example {i + 1}</h4>
                                                        <pre className="text-xs text-slate-400 font-mono overflow-x-auto">
                                                            <span className="text-slate-500">Input: </span>{tc.input}{"\n"}
                                                            <span className="text-slate-500">Output: </span>{tc.expectedOutput}
                                                        </pre>
                                                    </div>
                                                ))}

                                                {/* Topics */}
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedQuestion.topics?.map(t => (
                                                        <span key={t} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded capitalize">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => hintsRevealed < 3 && setHintsRevealed(h => h + 1)}
                                                    disabled={hintsRevealed >= 3}
                                                    className="flex items-center gap-2 text-amber-400 hover:text-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                >
                                                    <Lightbulb className="h-4 w-4" />
                                                    {hintsRevealed >= 3 ? "All hints revealed" : `Reveal hint (costs 25 XP)`}
                                                </button>

                                                {hints.slice(0, hintsRevealed).map((hint, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm text-amber-200"
                                                    >
                                                        <span className="text-amber-400 font-medium">Hint {i + 1}: </span>
                                                        {hint}
                                                    </motion.div>
                                                ))}

                                                {hintsRevealed === 0 && (
                                                    <p className="text-slate-500 text-xs">
                                                        Click above to reveal hints. Each hint costs 25 XP.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Collapsed state */}
                                {descriptionCollapsed && (
                                    <div className="flex-1 flex flex-col items-center pt-4 gap-3">
                                        <button
                                            onClick={() => {
                                                setDescriptionCollapsed(false);
                                                setActiveTab("description");
                                            }}
                                            className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                                            title="Problem"
                                        >
                                            <FileText className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDescriptionCollapsed(false);
                                                setActiveTab("hints");
                                            }}
                                            className="p-2 hover:bg-white/10 rounded text-amber-400"
                                            title="Hints"
                                        >
                                            <Lightbulb className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>

                            {/* Right Panel: Editor */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <CodeEditor
                                    code={code}
                                    onChange={setCode}
                                    className="flex-1"
                                />

                                {/* Interview Chat (appears at bottom when active) */}
                                <AnimatePresence>
                                    {interviewMode && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 120 }}
                                            exit={{ height: 0 }}
                                            className="border-t border-white/10 bg-slate-900/80 overflow-hidden"
                                        >
                                            <div className="h-full flex flex-col p-2">
                                                <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                                    <MessageSquare className="h-3 w-3" />
                                                    Interviewer
                                                </div>
                                                <div className="flex-1 overflow-y-auto space-y-1">
                                                    {chatMessages.map((msg, i) => (
                                                        <div key={i} className="bg-slate-800 rounded px-2 py-1 text-xs text-slate-300">
                                                            {msg.text}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Test Results */}
                                {testResults.length > 0 && (
                                    <div className="border-t border-white/10 bg-slate-900/50 px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            {submitResult === "success" ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-400" />
                                            )}
                                            <span className={cn(
                                                "text-sm font-medium",
                                                submitResult === "success" ? "text-emerald-400" : "text-red-400"
                                            )}>
                                                {submitResult === "success" ? "Passed!" : "Failed"}
                                            </span>
                                            <div className="flex gap-1 ml-2">
                                                {testResults.map((r, i) => (
                                                    <span
                                                        key={i}
                                                        className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            r.passed ? "bg-emerald-400" : "bg-red-400"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            {submitResult === "success" && (
                                                <span className="ml-auto flex items-center gap-1 text-amber-400 text-sm font-bold">
                                                    <Sparkles className="h-3.5 w-3.5" />
                                                    +{xpEarned} XP
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Bar */}
                                <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-slate-900/80">
                                    <Button variant="ghost" size="sm" onClick={handleReset}>
                                        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                                        Reset
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Play className="h-3.5 w-3.5 mr-1.5" />
                                            Run
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSubmit}
                                            isLoading={isSubmitting}
                                            className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 border-0"
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Empty state */
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Code2 className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">Select a Challenge</h2>
                            <p className="text-slate-500 text-sm">
                                Choose from the problem list to start coding
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
