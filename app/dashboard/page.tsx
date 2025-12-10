"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import {
    ArrowUpRight,
    CheckCircle2,
    Code2,
    Flame,
    Target,
    Trophy,
} from "lucide-react";
import React from "react";

export default function DashboardPage() {
    const [userName, setUserName] = React.useState("Student");

    React.useEffect(() => {
        const stored = localStorage.getItem("vidya_user_name");
        if (stored) setUserName(stored);
    }, []);

    return (
        <div className="relative text-slate-200 overflow-hidden min-h-screen p-6 md:p-8">

            {/* Welcome Header */}
            <div className="mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-900/50 bg-indigo-900/20 px-3 py-1 text-xs text-indigo-300 mb-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>VidyaSetu · Campus to Career in Progress</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                    Welcome back,{" "}
                    <span className="capitalize text-indigo-400">
                        {userName}
                    </span>{" "}
                    👋
                </h1>
                <p className="text-slate-400 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span>
                        You&apos;re on a{" "}
                        <span className="font-semibold text-white">5-day streak</span>! Keep
                        building your bridge to placement.
                    </span>
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
                {[
                    { label: "Total Solved", value: "48", icon: CheckCircle2, color: "text-emerald-400" },
                    { label: "Current Streak", value: "5 Days", icon: Flame, color: "text-orange-400" },
                    { label: "Global Rank", value: "#1420", icon: Trophy, color: "text-yellow-400" },
                    { label: "Accuracy", value: "92%", icon: Target, color: "text-sky-400" },
                ].map((stat, i) => (
                    <GlassCard key={i} className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg bg-slate-800 ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">
                                {stat.label}
                            </p>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Main Section: The Bridge (Roadmap) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            This Week&apos;s Bridge
                        </h2>
                        <span className="text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">
                            View Full Map
                        </span>
                    </div>

                    <GlassCard>
                        <div className="space-y-6">
                            {[
                                { title: "Solve 5 Array Questions", progress: 100, status: "Completed" },
                                { title: "Complete HashMap Module", progress: 60, status: "In Progress" },
                                { title: "Attempt Mock Interview", progress: 0, status: "Locked" },
                            ].map((task, i) => (
                                <div key={i} className="group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border border-slate-700 ${task.status === "Completed"
                                                        ? "bg-emerald-500 text-black border-emerald-500"
                                                        : task.status === "In Progress"
                                                            ? "bg-indigo-600 text-white border-indigo-500"
                                                            : "bg-slate-800 text-slate-500"
                                                    }`}
                                            >
                                                {i + 1}
                                            </div>
                                            <span
                                                className={`font-medium transition-colors ${task.status === "Locked"
                                                        ? "text-slate-500"
                                                        : "text-slate-200"
                                                    }`}
                                            >
                                                {task.title}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500">{task.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            style={{ width: `${task.progress}%` }}
                                            className={`h-full rounded-full transition-all duration-1000 ${task.status === "Completed"
                                                    ? "bg-emerald-500"
                                                    : "bg-indigo-500"
                                                }`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <h2 className="text-xl font-bold pt-4 text-white">Recommended Practice</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlassCard hoverEffect className="cursor-pointer">
                            <div className="flex items-start justify-between mb-4 relative">
                                <div className="p-2 bg-slate-800 rounded text-sky-400">
                                    <Code2 className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-bold mb-1 text-white">Sliding Window</h3>
                            <p className="text-sm text-slate-400">Medium • 15 Questions</p>
                        </GlassCard>

                        <GlassCard hoverEffect className="cursor-pointer">
                            <div className="flex items-start justify-between mb-4 relative">
                                <div className="p-2 bg-slate-800 rounded text-emerald-400">
                                    <Target className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-bold mb-1 text-white">Dynamic Programming</h3>
                            <p className="text-sm text-slate-400">Hard • 25 Questions</p>
                        </GlassCard>
                    </div>
                </div>

                {/* Right Sidebar: Activity */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                    <GlassCard className="h-full min-h-[400px]">
                        <div className="border-l border-slate-800 ml-3 space-y-8 pl-8 relative py-4">
                            {[
                                { title: "Solved Two Sum", time: "2 hours ago", type: "success" },
                                { title: "Failed Mock Quiz", time: "5 hours ago", type: "fail" },
                                { title: "Started Arrays", time: "1 day ago", type: "info" },
                                { title: "Joined VidyaSetu", time: "2 days ago", type: "info" },
                            ].map((activity, i) => (
                                <div key={i} className="relative">
                                    <span
                                        className={`absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-slate-900 ${activity.type === "success"
                                                ? "bg-emerald-500"
                                                : activity.type === "fail"
                                                    ? "bg-red-500"
                                                    : "bg-sky-500"
                                            }`}
                                    />
                                    <h4 className="text-sm font-medium text-slate-200">
                                        {activity.title}
                                    </h4>
                                    <p className="text-xs text-slate-500">{activity.time}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
