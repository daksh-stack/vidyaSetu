"use client";

import { cn } from "@/lib/utils";
import {
    BarChart,
    BookOpen,
    Code,
    Home,
    LogOut,
    Settings,
    Terminal,
    Trophy,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
    { name: "Overview", href: "/dashboard", icon: Home },
    { name: "Coding Arena", href: "/practice/coding", icon: Code },
    { name: "MCQ Battle", href: "/practice/mcq", icon: Trophy },
    { name: "Mock Interviews", href: "/practice/hr", icon: Users },
    { name: "Learning Path", href: "/dashboard/path", icon: BookOpen },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-slate-950/90 backdrop-blur-xl">
            <div className="flex h-16 items-center px-6 border-b border-white/5">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 group-hover:bg-white group-hover:text-black transition-colors">
                        <Terminal className="h-5 w-5 text-white group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white uppercase tracking-widest">
                        Vidya<span className="font-light text-gray-400">Setu</span>
                    </span>
                </Link>
            </div>

            <nav className="space-y-1 px-3 py-6">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white text-black font-bold"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-black" : "text-gray-500")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-4 left-0 w-full px-3">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
