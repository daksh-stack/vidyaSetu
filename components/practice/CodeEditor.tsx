"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Zap } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface CodeEditorProps {
    code: string;
    onChange: (code: string) => void;
    language?: string;
    className?: string;
}

// Complexity analysis based on code patterns
function analyzeComplexity(code: string): {
    time: string;
    space: string;
    color: string;
    score: number;
} {
    const lines = code.toLowerCase();

    // Check for nested loops (O(n²) or worse)
    const nestedLoops = (lines.match(/for\s*\(/g) || []).length >= 2 ||
        (lines.match(/while\s*\(/g) || []).length >= 2 ||
        ((lines.match(/for\s*\(/g) || []).length >= 1 &&
            (lines.match(/while\s*\(/g) || []).length >= 1);

    // Check for recursion patterns
    const hasRecursion = /function\s+(\w+).*\1\s*\(/.test(lines) ||
        lines.includes("return ") && lines.includes("(n - 1)");

    // Check for hash map usage (typically O(n))
    const hasHashMap = lines.includes("map") ||
        lines.includes("set") ||
        lines.includes("{}") ||
        lines.includes("object");

    // Check for sorting
    const hasSorting = lines.includes(".sort");

    // Check for binary search patterns
    const hasBinarySearch = lines.includes("mid") &&
        (lines.includes("left") || lines.includes("low"));

    if (nestedLoops && !hasHashMap) {
        return { time: "O(n²)", space: "O(1)", color: "#ef4444", score: 30 };
    }

    if (hasSorting) {
        return { time: "O(n log n)", space: "O(n)", color: "#f59e0b", score: 60 };
    }

    if (hasBinarySearch) {
        return { time: "O(log n)", space: "O(1)", color: "#10b981", score: 95 };
    }

    if (hasHashMap || hasRecursion) {
        return { time: "O(n)", space: "O(n)", color: "#10b981", score: 85 };
    }

    // Default - single loop or simple
    if (lines.includes("for") || lines.includes("while")) {
        return { time: "O(n)", space: "O(1)", color: "#10b981", score: 90 };
    }

    return { time: "O(1)", space: "O(1)", color: "#10b981", score: 100 };
}

export function CodeEditor({ code, onChange, language = "javascript", className }: CodeEditorProps) {
    const [complexity, setComplexity] = useState(analyzeComplexity(code));
    const [showSettings, setShowSettings] = useState(false);

    // Debounced complexity analysis
    useEffect(() => {
        const timer = setTimeout(() => {
            setComplexity(analyzeComplexity(code));
        }, 300);
        return () => clearTimeout(timer);
    }, [code]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const target = e.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const newCode = code.substring(0, start) + "  " + code.substring(end);
            onChange(newCode);
            // Set cursor position after the tab
            setTimeout(() => {
                target.selectionStart = target.selectionEnd = start + 2;
            }, 0);
        }
    }, [code, onChange]);

    return (
        <div className={cn("flex flex-col h-full bg-[#1e1e1e]", className)}>
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] text-xs border-b border-[#333]">
                <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-medium uppercase tracking-wide">
                        {language}
                    </span>
                    <div className="h-3 w-px bg-slate-700" />
                    {/* Live Complexity Meter */}
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Zap className="h-3 w-3" style={{ color: complexity.color }} />
                        <motion.span
                            key={`time-${complexity.time}`}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="font-mono"
                            style={{ color: complexity.color }}
                        >
                            {complexity.time} time
                        </motion.span>
                        <span className="text-slate-600">•</span>
                        <motion.span
                            key={`space-${complexity.space}`}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="font-mono"
                            style={{ color: complexity.color }}
                        >
                            {complexity.space} space
                        </motion.span>
                    </motion.div>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-slate-500 hover:text-white transition-colors"
                >
                    <Settings className="h-4 w-4" />
                </button>
            </div>

            {/* Complexity Progress Bar */}
            <div className="h-1 bg-[#333] relative overflow-hidden">
                <motion.div
                    className="h-full"
                    style={{ backgroundColor: complexity.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${complexity.score}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </div>

            {/* Code Area */}
            <div className="flex-1 relative">
                {/* Line numbers */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#333] text-slate-600 text-xs font-mono py-4 text-right pr-3 select-none overflow-hidden">
                    {code.split("\n").map((_, i) => (
                        <div key={i} className="h-6 leading-6">{i + 1}</div>
                    ))}
                </div>

                {/* Textarea */}
                <textarea
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full bg-transparent text-slate-200 font-mono text-sm p-4 pl-14 resize-none focus:outline-none leading-6"
                    spellCheck="false"
                    autoComplete="off"
                    autoCapitalize="off"
                />
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[#333] bg-[#252526] px-4 py-3"
                    >
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>Font Size: 14px</span>
                            <span>•</span>
                            <span>Tab Size: 2 spaces</span>
                            <span>•</span>
                            <span>Theme: Dark</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
