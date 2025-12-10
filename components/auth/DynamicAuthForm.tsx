"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Field {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    validation?: (value: string) => string | null; // Returns error message or null
}

interface DynamicAuthFormProps {
    fields: Field[];
    submitLabel: string;
    onSubmit: (data: Record<string, string>) => Promise<void>;
    footer?: React.ReactNode;
}

export function DynamicAuthForm({ fields, submitLabel, onSubmit, footer }: DynamicAuthFormProps) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for back

    // Focus management
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Auto-focus input on step change
        const timeout = setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
        return () => clearTimeout(timeout);
    }, [step]);

    const currentField = fields[step];

    const handleNext = async () => {
        const val = formData[currentField.id] || "";

        // Validate current field
        if (!val.trim()) {
            setError("This field is required.");
            // Shake animation triggers here ideally
            return;
        }
        if (currentField.validation) {
            const validationError = currentField.validation(val);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        setError(null);

        if (step < fields.length - 1) {
            setDirection(1);
            setStep(step + 1);
        } else {
            // Submit
            setIsSubmitting(true);
            try {
                await onSubmit(formData);
            } catch (err) {
                setError("Something went wrong. Please try again.");
                setIsSubmitting(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleNext();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [currentField.id]: e.target.value });
        if (error) setError(null);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative min-h-[300px] flex flex-col justify-center">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -50, position: "absolute" }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                        className="w-full"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                            {currentField.label}
                        </h2>

                        <div className="relative mt-8 group">
                            <input
                                ref={inputRef}
                                type={currentField.type}
                                value={formData[currentField.id] || ""}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder={currentField.placeholder}
                                className="w-full bg-transparent border-b-2 border-white/20 text-white text-xl md:text-2xl py-4 px-2 focus:outline-none focus:border-white transition-colors placeholder:text-white/20 text-center"
                                autoComplete="off"
                            />

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute -bottom-8 left-0 right-0 text-center text-rose-400 text-sm"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-12 flex justify-center gap-4">
                            {step > 0 && (
                                <button
                                    onClick={() => {
                                        setDirection(-1);
                                        setStep(step - 1);
                                    }}
                                    className="px-6 py-2 rounded-full text-white/50 hover:text-white border border-transparent hover:border-white/20 transition-all text-sm font-medium"
                                >
                                    Back
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="group relative px-8 py-3 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{step === fields.length - 1 ? submitLabel : "Continue"}</span>
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                )}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-8">
                    {fields.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1 rounded-full transition-all duration-300",
                                i === step ? "w-8 bg-white" : i < step ? "w-4 bg-white/40" : "w-1 bg-white/10"
                            )}
                        />
                    ))}
                </div>
            </div>

            {footer && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    {footer}
                </motion.div>
            )}
        </div>
    );
}
