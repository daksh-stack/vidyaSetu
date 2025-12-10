"use client";

import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { DynamicAuthForm } from "@/components/auth/DynamicAuthForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
    const handleSubmit = async (data: Record<string, string>) => {
        // Mock auth delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.href = "/dashboard";
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* <AnimatedBackground /> */}

            {/* Back Home */}
            

            <div className="w-full max-w-lg z-10 relative">
                <DynamicAuthForm
                    fields={[
                        {
                            id: "name",
                            label: "How shall we call you?",
                            type: "text",
                            placeholder: "John Doe",
                            validation: (val) => val.length < 2 ? "Name is too short." : null
                        },
                        {
                            id: "email",
                            label: "Where can we reach you?",
                            type: "email",
                            placeholder: "student@example.com",
                            validation: (val) => !val.includes("@") ? "Please enter a valid email." : null
                        },
                        {
                            id: "password",
                            label: "Secure your access key",
                            type: "password",
                            placeholder: "••••••••",
                            validation: (val) => val.length < 6 ? "Password must be at least 6 characters." : null
                        }
                    ]}
                    submitLabel="Begin Journey"
                    onSubmit={handleSubmit}
                    footer={
                        <div className="text-sm text-gray-400">
                            Already exist?{" "}
                            <Link href="/login" className="text-white hover:underline decoration-white/50 underline-offset-4">
                                Enter Portal
                            </Link>
                        </div>
                    }
                />
            </div>
        </div>
    );
}
