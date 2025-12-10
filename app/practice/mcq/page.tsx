"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const questions = [
    {
        id: 1,
        question: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correct: 1,
    },
    {
        id: 2,
        question: "Which data structure follows the LIFO (Last In First Out) principle?",
        options: ["Queue", "Linked List", "Stack", "Tree"],
        correct: 2,
    },
    {
        id: 3,
        question: "What does SQL stand for?",
        options: ["Structured Question Language", "Structured Query Language", "Simple Query Language", "Standard Query Level"],
        correct: 1,
    },
];

export default function MCQPracticePage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleOptionSelect = (index: number) => {
        if (isSubmitted) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        setIsSubmitted(true);
        if (selectedOption === questions[currentQuestion].correct) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            setShowResult(true);
        }
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6">
                <GlassCard className="max-w-md w-full text-center p-12">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                        <TrophyIcon className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
                    <p className="text-gray-400 mb-8">You scored {score} out of {questions.length}</p>

                    <Link href="/dashboard">
                        <Button className="w-full">Return to Dashboard</Button>
                    </Link>
                </GlassCard>
            </div>
        )
    }

    const question = questions[currentQuestion];

    return (
        <div className="flex h-full flex-col max-w-4xl mx-auto p-6 justify-center">
            <div className="mb-8">
                <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Link>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
                    <span className="text-sm font-medium text-white">Time: 00:45</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        className="h-full bg-white"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <GlassCard className="p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-white mb-8">{question.question}</h2>

                        <div className="space-y-4">
                            {question.options.map((option, index) => {
                                let borderColor = "border-white/10";
                                let bgColor = "bg-white/5";
                                if (isSubmitted) {
                                    if (index === question.correct) {
                                        borderColor = "border-white";
                                        bgColor = "bg-white text-black";
                                    } else if (index === selectedOption) {
                                        borderColor = "border-gray-500";
                                        bgColor = "bg-transparent text-gray-500 line-through";
                                    }
                                } else if (selectedOption === index) {
                                    borderColor = "border-white";
                                    bgColor = "bg-white/10";
                                }

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleOptionSelect(index)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group",
                                            borderColor,
                                            bgColor,
                                            !isSubmitted && "hover:border-white/50"
                                        )}
                                    >
                                        <span className={cn("font-medium", isSubmitted && index === question.correct ? "text-black" : "text-gray-200")}>{option}</span>
                                        {isSubmitted && index === question.correct && <CheckCircle className="h-5 w-5 text-black" />}
                                        {isSubmitted && index === selectedOption && index !== question.correct && <XCircle className="h-5 w-5 text-gray-500" />}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-8 flex justify-end">
                            {!isSubmitted ? (
                                <Button onClick={handleSubmit} disabled={selectedOption === null} size="lg">
                                    Submit Answer
                                </Button>
                            ) : (
                                <Button onClick={handleNext} size="lg">
                                    {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    </GlassCard>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function TrophyIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
    )
}
