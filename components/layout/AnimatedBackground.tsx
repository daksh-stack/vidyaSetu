"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export const AnimatedBackground = () => {
    // Generate fewer, more intentional stars
    const [stars, setStars] = useState<{ id: number; top: number; left: number; delay: number; size: number }[]>([]);

    useEffect(() => {
        const newStars = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            delay: Math.random() * 5,
            size: Math.random() < 0.8 ? 1 : 2, // mostly tiny stars
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#02040a]">
            {/* 1. Deep Atmospheric Gradient Base */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#0f172a_0%,#02040a_60%,#000000_100%)] opacity-80" />

            {/* 2. THE MOON - Asymmetric Top Right */}
            {/* Wrapper for parallax effect if needed later */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="absolute top-[-10%] right-[-10%] md:top-[-15%] md:right-[-5%] w-[600px] h-[600px] md:w-[900px] md:h-[900px] pointer-events-none"
            >
                {/* Glow/Halo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-transparent blur-[120px] mix-blend-screen" />

                {/* Moon Surface */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                    {/* Base Color */}
                    <div className="absolute inset-0 bg-[#e2e8f0]" />

                    {/* Craters/Texture via CSS Gradients */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.1)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0)_50%)]" />
                    {/* Subtle noise if we had an asset, effectively simulated by multiple subtle gradients for now */}
                    <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-slate-400/20 rounded-full blur-[40px]" />
                    <div className="absolute bottom-[30%] right-[20%] w-[30%] h-[30%] bg-slate-500/20 rounded-full blur-[30px]" />

                    {/* Inner Shadow to make it look spherical */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.5),inset_20px_20px_50px_rgba(255,255,255,0.5)]" />
                </div>
            </motion.div>

            {/* 3. Drifting Mist/Clouds - Layers */}
            {/* Layer 1 - Slow & Far */}
            <motion.div
                animate={{ x: ["-10%", "10%"] }}
                transition={{ duration: 60, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                className="absolute top-[10%] left-[-20%] w-[140%] h-[40vh] bg-gradient-to-r from-transparent via-indigo-900/10 to-transparent blur-[80px]"
            />
            {/* Layer 2 - Closer & Slightly faster */}
            <motion.div
                animate={{ x: ["5%", "-5%"] }}
                transition={{ duration: 45, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                className="absolute top-[30%] left-[-10%] w-[120%] h-[50vh] bg-gradient-to-l from-transparent via-blue-900/5 to-transparent blur-[100px]"
            />

            {/* 4. Stars - Minimal & Twinkling */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white shadow-[0_0_2px_rgba(255,255,255,0.8)]"
                    style={{
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{ opacity: [0.1, 0.5, 0.1] }}
                    transition={{ duration: Math.random() * 5 + 4, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
                />
            ))}

            {/* 5. Vignette - Focus center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#02040a_120%)] opacity-50" />

            {/* 6. Static Noise Overlay for Texture (Optional, good for film grain feel) */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        </div>
    );
};
