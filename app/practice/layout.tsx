"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import React from "react";

export default function PracticeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar />
            <main className="ml-64 w-full h-screen overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="relative z-10 h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
