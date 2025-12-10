import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className, hoverEffect = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all duration-300",
                    hoverEffect && "hover:border-slate-700 hover:bg-slate-900 hover:shadow-lg group",
                    className
                )}
                {...props}
            >
                {/* Inner Gradient for depth - optional, keeping simple for MVP */}

                <div className="relative z-10">{children}</div>
            </div>
        );
    }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
