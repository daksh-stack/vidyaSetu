"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export const MoonBackground = () => {
    const { scrollY } = useScroll();
    const yNear = useTransform(scrollY, [0, 1200], [0, 120]);
    const yFar = useTransform(scrollY, [0, 1200], [0, -50]);

    // Sparse, intentional stars generated on client to avoid hydration mismatch
    const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; delay: number; twinkle: number }[]>([]);

    useEffect(() => {
        const starCount = 18; // intentionally sparse
        const newStars = Array.from({ length: starCount }).map((_, i) => ({
            id: i,
            top: `${5 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            size: Math.random() * 2 + 0.8,
            delay: Math.random() * 8,
            twinkle: 2 + Math.random() * 6,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Deep atmospheric base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020416] via-[#030417] to-[#000407]" />

            {/* Far soft halo — gives scale and cool-color wash to scene */}
            <motion.div
                style={{ y: yFar }}
                className="absolute top-[-10%] left-[-20%] w-[90vw] h-[90vw] max-w-[1200px] max-h-[1200px] rounded-full opacity-30 bg-[radial-gradient(circle_at_30%_30%,rgba(86,102,255,0.12),transparent 30%)] blur-[120px]"
            />

            {/* Main Moon (asymmetrical, slightly off-right and down) */}
            <motion.div
                style={{ y: yNear }}
                className="absolute top-[6%] right-[6%] w-[36vw] h-[36vw] max-w-[520px] max-h-[520px] z-10"
            >
                {/* Inline SVG moon with subtle crater noise via SVG filters (no external textures) */}
                <svg viewBox="0 0 1024 1024" className="w-full h-full rounded-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <defs>
                        <filter id="moon-grain">
                            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
                            <feColorMatrix type="saturate" values="0.2" in="noise" result="noiseSat" />
                            <feBlend in="SourceGraphic" in2="noiseSat" mode="overlay" />
                        </filter>
                        <radialGradient id="moon-shade" cx="30%" cy="28%">
                            <stop offset="0%" stopColor="#F2F6FF" stopOpacity="0.95" />
                            <stop offset="55%" stopColor="#DDE8FF" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#9AA7D6" stopOpacity="0.15" />
                        </radialGradient>
                        <filter id="soft-halo" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="40" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <g filter="url(#soft-halo)">
                        <circle cx="512" cy="462" r="420" fill="url(#moon-shade)" opacity="0.98" />
                    </g>

                    <g filter="url(#moon-grain)" opacity="0.28">
                        <circle cx="512" cy="462" r="420" fill="#cfd9ff" />
                    </g>

                    {/* Subtle crater shapes — carefully placed rather than noisy */}
                    <g opacity="0.06" fill="#000">
                        <ellipse cx="360" cy="420" rx="34" ry="24" />
                        <ellipse cx="680" cy="520" rx="54" ry="36" />
                        <ellipse cx="520" cy="330" rx="28" ry="18" />
                        <ellipse cx="440" cy="560" rx="18" ry="12" />
                    </g>
                </svg>
            </motion.div>

            {/* Sparse Stars — subtle, organic twinkle */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{ top: star.top, left: star.left, width: star.size, height: star.size, opacity: 0.85 }}
                    animate={{
                        opacity: [0.18, 0.9, 0.18],
                        scale: [1, 1.18, 1],
                        y: [0, Math.sin(star.id) * 2, 0],
                    }}
                    transition={{ duration: star.twinkle, repeat: Infinity, delay: star.delay, ease: [0.4, 0.0, 0.2, 1] }}
                />
            ))}

            {/* Near-ground drifting mist — slow parallax */}
            <motion.div style={{ y: yFar }} className="absolute bottom-0 left-0 right-0 h-[45vh] pointer-events-none z-20">
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,6,15,0.88)] to-transparent" />
                <div className="absolute -left-40 bottom-10 w-[60vw] h-48 bg-[radial-gradient(ellipse_at_center,rgba(120,130,200,0.06),transparent 45%)] blur-3xl opacity-60" />
                <div className="absolute right-[-10vw] bottom-20 w-[50vw] h-36 bg-[radial-gradient(ellipse_at_center,rgba(90,100,170,0.04),transparent 45%)] blur-2xl opacity-50" />
            </motion.div>
        </div>
    );
};
