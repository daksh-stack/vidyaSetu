"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CodingPracticePage() {
    const [activeTab, setActiveTab] = useState("description");
    const [code, setCode] = useState(`function twoSum(nums, target) {
  // Write your code here
  
}`);

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 bg-black/50 px-6 py-3 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-white">Two Sum</h1>
                        <span className="text-xs text-white font-medium bg-white/10 px-2 py-0.5 rounded border border-white/20">Easy</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm"><RotateCcw className="h-4 w-4 mr-2" /> Reset</Button>
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200"><Play className="h-4 w-4 mr-2" /> Run Code</Button>
                    <Button size="sm" variant="outline">Submit</Button>
                </div>
            </header>

            {/* Main Content Split */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Description */}
                <div className="w-1/2 border-r border-white/10 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <div className="flex gap-4 border-b border-white/10 mb-6 pb-2">
                        {['Description', 'Editorial', 'Solutions'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="prose prose-invert prose-sm max-w-none">
                        <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
                        <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
                        <p>You can return the answer in any order.</p>

                        <h3>Example 1:</h3>
                        <GlassCard className="not-prose bg-slate-900/50 border-slate-800 my-4">
                            <pre className="text-xs text-slate-300">
                                Input: nums = [2,7,11,15], target = 9{'\n'}
                                Output: [0,1]{'\n'}
                                Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                            </pre>
                        </GlassCard>

                        <h3>Constraints:</h3>
                        <ul>
                            <li>2 &le; nums.length &le; 104</li>
                            <li>-109 &le; nums[i] &le; 109</li>
                            <li>-109 &le; target &le; 109</li>
                        </ul>
                    </div>
                </div>

                {/* Right Panel: Editor */}
                <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#252526] text-xs text-slate-400 border-b border-[#333]">
                        <span>JavaScript</span>
                        <span className="cursor-pointer hover:text-white">Settings</span>
                    </div>
                    <div className="flex-1 relative font-mono text-sm">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-full bg-[#1e1e1e] text-slate-200 p-4 resize-none focus:outline-none"
                            spellCheck="false"
                        />
                    </div>
                    <div className="h-40 border-t border-[#333] bg-[#1e1e1e] p-4">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <ChevronRight className="h-3 w-3" /> Test Results
                        </div>
                        <div className="text-sm text-slate-500 italic">Run code to see results...</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
