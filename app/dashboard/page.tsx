"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import {
    ArrowUpRight,
    CheckCircle2,
    Code2,
    Flame,
    Target,
    Trophy,
    Loader2,
} from "lucide-react";
import React from "react";
import { useActivity } from "@/hooks/useActivity";
import { useStats } from "@/hooks/useStats";
import Link from "next/link";

export default function DashboardPage() {
    const [userName, setUserName] = React.useState("Student");
    const [userEmail, setUserEmail] = React.useState<string | undefined>(undefined);
    const { activities, loading: activityLoading } = useActivity(5);
    const { stats, loading: statsLoading } = useStats(userEmail);

    React.useEffect(() => {
        const storedName = localStorage.getItem("vidya_user_name");
        const storedEmail = localStorage.getItem("vidya_user_email");
        if (storedName) setUserName(storedName);
        if (storedEmail) setUserEmail(storedEmail);
    }, []);

    // Map activity type to visual style
    const getActivityStyle = (type: string) => {
        switch (type) {
            case 'solved': return 'bg-emerald-500';
            case 'failed': return 'bg-red-500';
            case 'streak': return 'bg-orange-500';
            case 'badge': return 'bg-yellow-500';
            default: return 'bg-sky-500';
        }
    };

    const statsData = [
        {
            label: "Total Solved",
            value: statsLoading ? "..." : String(stats?.totalSolved || 0),
            icon: CheckCircle2,
            color: "text-emerald-400"
        },
        {
            label: "Current Streak",
            value: statsLoading ? "..." : `${stats?.currentStreak || 0} Days`,
            icon: Flame,
            color: "text-orange-400"
        },
        {
            label: "Global Rank",
            value: statsLoading ? "..." : (stats?.globalRank ? `#${stats.globalRank}` : "-"),
            icon: Trophy,
            color: "text-yellow-400"
        },
        {
            label: "Accuracy",
            value: statsLoading ? "..." : `${stats?.accuracy || 0}%`,
            icon: Target,
            color: "text-sky-400"
        },
    ];

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
                        {stats?.userName || userName}
                    </span>{" "}
                    👋
                </h1>
                <p className="text-slate-400 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span>
                        {statsLoading ? (
                            "Loading your progress..."
                        ) : stats?.currentStreak && stats.currentStreak > 0 ? (
                            <>
                                You&apos;re on a{" "}
                                <span className="font-semibold text-white">{stats.currentStreak}-day streak</span>! Keep
                                building your bridge to placement.
                            </>
                        ) : (
                            "Start practicing to build your streak!"
                        )}
                    </span>
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
                {statsData.map((stat, i) => (
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
                        <Link href="/practice/coding">
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
                        </Link>

                        <Link href="/practice/coding">
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
                        </Link>
                    </div>
                </div>

                {/* Right Sidebar: Activity */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                    <GlassCard className="h-full min-h-[400px]">
                        {activityLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                            </div>
                        ) : (
                            <div className="border-l border-slate-800 ml-3 space-y-8 pl-8 relative py-4">
                                {activities.length > 0 ? (
                                    activities.map((activity, i) => (
                                        <div key={activity._id || i} className="relative">
                                            <span
                                                className={`absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-slate-900 ${getActivityStyle(activity.type)}`}
                                            />
                                            <h4 className="text-sm font-medium text-slate-200">
                                                {activity.title}
                                            </h4>
                                            <p className="text-xs text-slate-500">{activity.time}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No recent activity. Start practicing!</p>
                                )}
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
