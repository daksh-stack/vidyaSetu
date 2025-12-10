"use client";

import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const variants = {
            primary:
                "relative overflow-hidden bg-foreground text-background font-bold hover:bg-white/90 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] border-0",
            secondary:
                "bg-secondary/50 text-foreground hover:bg-secondary/70 border border-white/5 shadow-none backdrop-blur-sm",
            outline:
                "border border-white/20 bg-transparent text-foreground hover:border-white/50 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
            ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-11 px-6 py-2",
            lg: "h-14 px-8 text-lg",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-full font-heading tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {/* Glossy sheen for primary */}
                {variant === 'primary' && (
                    <motion.div
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        initial={{ left: "-100%" }}
                        whileHover={{ left: "200%", transition: { duration: 0.7, ease: "easeInOut" } }}
                    />
                )}

                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                <span className="relative z-10 flex items-center gap-2">{children}</span>
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button };
