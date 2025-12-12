"use client";

import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { DynamicAuthForm } from "@/components/auth/DynamicAuthForm";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const handleSubmit = async (data: Record<string, string>) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || 'Login failed');
                return;
            }

            localStorage.setItem("vidya_user_name", result.user.name);
            localStorage.setItem("vidya_user_email", result.user.email);
            window.location.href = "/dashboard";
        } catch (error) {
            alert('An error occurred during login');
            console.error(error);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* <AnimatedBackground /> */}

            {/* Back Home */}
            <Link
                href="/"
                className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 transition-colors z-20"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </Link>

            <div className="w-full max-w-lg z-10 relative">
                <DynamicAuthForm
                    fields={[
                        {
                            id: "email",
                            label: "What is your email?",
                            type: "email",
                            placeholder: "student@example.com",
                            validation: (val) => !val.includes("@") ? "Please enter a valid email." : null
                        },
                        {
                            id: "password",
                            label: "Enter your password",
                            type: "password",
                            placeholder: "••••••••",
                            validation: (val) => val.length < 6 ? "Password must be at least 6 characters." : null
                        }
                    ]}
                    submitLabel="Authenticate"
                    onSubmit={handleSubmit}
                    footer={
                        <div className="text-sm text-gray-400">
                            New here?{" "}
                            <Link href="/signup" className="text-white hover:underline decoration-white/50 underline-offset-4">
                                Initialize Protocol
                            </Link>
                        </div>
                    }
                />
            </div>
        </div>
    );
}
