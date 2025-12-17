/**
 * Code Execution API Route
 * 
 * Securely executes user code via Judge0 API (RapidAPI).
 * 
 * Flow:
 * 1. Receive code + language
 * 2. Submit to Judge0 (creates submission token)
 * 3. Poll for result (max 10 attempts)
 * 4. Return stdout/stderr/compile_output
 * 
 * Security:
 * - NO local code execution (child_process, eval, etc.)
 * - All execution happens on Judge0 sandboxed containers
 * - Time/memory limits enforced by Judge0
 */

import { NextRequest, NextResponse } from "next/server";

// Rate limiting (simple in-memory, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }

    if (record.count >= RATE_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

// Judge0 submission statuses
// 1: In Queue, 2: Processing, 3: Accepted, 4+: Various errors
const PROCESSING_STATUSES = [1, 2];

// Submission request to Judge0
interface Judge0Submission {
    source_code: string;
    language_id: number;
    stdin?: string;
    expected_output?: string;
    cpu_time_limit?: number;
    memory_limit?: number;
}

// Response from Judge0
interface Judge0Result {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    status: {
        id: number;
        description: string;
    };
    time: string | null;
    memory: number | null;
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Please wait before submitting again." },
                { status: 429 }
            );
        }

        // Parse request
        const body = await request.json();
        const { sourceCode, languageId, stdin = "" } = body;

        // Validation
        if (!sourceCode || typeof sourceCode !== "string") {
            return NextResponse.json(
                { error: "Source code is required" },
                { status: 400 }
            );
        }

        if (!languageId || typeof languageId !== "number") {
            return NextResponse.json(
                { error: "Valid language ID is required" },
                { status: 400 }
            );
        }

        // Check for API key
        const apiKey = process.env.JUDGE0_API_KEY;
        const apiUrl = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";

        if (!apiKey) {
            console.error("JUDGE0_API_KEY not configured");
            return NextResponse.json(
                { error: "Code execution service not configured" },
                { status: 503 }
            );
        }

        // Submit to Judge0
        const submission: Judge0Submission = {
            source_code: Buffer.from(sourceCode).toString("base64"),
            language_id: languageId,
            stdin: stdin ? Buffer.from(stdin).toString("base64") : undefined,
            cpu_time_limit: 5, // 5 seconds max
            memory_limit: 128000, // 128MB max
        };

        const submitResponse = await fetch(`${apiUrl}/submissions?base64_encoded=true&wait=false`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
            body: JSON.stringify(submission),
        });

        if (!submitResponse.ok) {
            const errorText = await submitResponse.text();
            console.error("Judge0 submission error:", errorText);
            return NextResponse.json(
                { error: "Failed to submit code for execution" },
                { status: 500 }
            );
        }

        const { token } = await submitResponse.json();

        if (!token) {
            return NextResponse.json(
                { error: "No submission token received" },
                { status: 500 }
            );
        }

        // Poll for result
        let result: Judge0Result | null = null;
        const maxAttempts = 10;
        const pollInterval = 1000; // 1 second

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await new Promise(resolve => setTimeout(resolve, pollInterval));

            const resultResponse = await fetch(
                `${apiUrl}/submissions/${token}?base64_encoded=true`,
                {
                    headers: {
                        "X-RapidAPI-Key": apiKey,
                        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                    },
                }
            );

            if (!resultResponse.ok) {
                continue;
            }

            const data = await resultResponse.json();

            // Check if still processing
            if (PROCESSING_STATUSES.includes(data.status?.id)) {
                continue;
            }

            // Decode base64 outputs
            result = {
                stdout: data.stdout ? Buffer.from(data.stdout, "base64").toString() : null,
                stderr: data.stderr ? Buffer.from(data.stderr, "base64").toString() : null,
                compile_output: data.compile_output
                    ? Buffer.from(data.compile_output, "base64").toString()
                    : null,
                message: data.message,
                status: data.status,
                time: data.time,
                memory: data.memory,
            };
            break;
        }

        if (!result) {
            return NextResponse.json(
                { error: "Execution timed out. Please try again." },
                { status: 408 }
            );
        }

        return NextResponse.json({
            success: true,
            ...result,
        });

    } catch (error) {
        console.error("Execute API error:", error);
        return NextResponse.json(
            { error: "Internal server error during code execution" },
            { status: 500 }
        );
    }
}
