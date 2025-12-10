"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pathname.includes("/admin") || pathname.includes("/dashboard") || pathname.includes("/practice")) return null;

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "border-b border-white/10 bg-black/80 backdrop-blur-md py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto flex items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 transition-transform group-hover:scale-105 group-hover:bg-white group-hover:text-black">
                        <Terminal className="h-5 w-5 text-white group-hover:text-black transition-colors" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white uppercase tracking-widest">
                        Vidya<span className="font-light text-gray-400">Setu</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {[
                        { name: "Features", href: "/#features" },
                        { name: "Practice", href: "/practice" },
                        { name: "About", href: "/#about" },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
};
