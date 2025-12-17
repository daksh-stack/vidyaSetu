"use client";

import { CodeArena } from "@/components/practice/CodeArena";
import { useEffect, useState, Suspense } from "react";

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

function CodingArenaContent() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const res = await fetch("/api/questions?type=coding&limit=30");
                if (!res.ok) throw new Error("Failed to fetch questions");
                const data = await res.json();
                setQuestions(data.questions || []);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, []);

    if (error) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-2">Error loading questions</p>
                    <p className="text-slate-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return <CodeArena questions={questions} loading={loading} />;
}

export default function CodingPracticePage() {
    return (
        <div className="h-full">
            <Suspense fallback={
                <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
                </div>
            }>
                <CodingArenaContent />
            </Suspense>
        </div>
    );
}
