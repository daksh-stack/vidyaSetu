"use client";

/**
 * Monaco Code Editor Component
 * 
 * Professional code editor with:
 * - Syntax highlighting per language
 * - Dark theme matching arena aesthetic
 * - Line numbers
 * - Auto-complete
 */

import Editor, { OnMount } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface MonacoEditorProps {
    code: string;
    language: string; // Monaco language ID (javascript, python, cpp, etc.)
    onChange: (value: string) => void;
    readOnly?: boolean;
    height?: string;
}

// Custom dark theme matching VidyaSetu arena
const ARENA_THEME = {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
        { token: "comment", foreground: "6A737D", fontStyle: "italic" },
        { token: "keyword", foreground: "F97583" },
        { token: "string", foreground: "9ECBFF" },
        { token: "number", foreground: "79B8FF" },
        { token: "function", foreground: "B392F0" },
        { token: "variable", foreground: "E1E4E8" },
        { token: "type", foreground: "79B8FF" },
    ],
    colors: {
        "editor.background": "#0D1117",
        "editor.foreground": "#E1E4E8",
        "editor.lineHighlightBackground": "#161B22",
        "editor.selectionBackground": "#264F78",
        "editorCursor.foreground": "#10B981",
        "editorLineNumber.foreground": "#484F58",
        "editorLineNumber.activeForeground": "#E1E4E8",
        "editor.inactiveSelectionBackground": "#1D2D3E",
        "editorIndentGuide.background": "#21262D",
        "editorIndentGuide.activeBackground": "#30363D",
    },
};

export function MonacoEditor({
    code,
    language,
    onChange,
    readOnly = false,
    height = "100%",
}: MonacoEditorProps) {
    // Handle editor mount
    const handleEditorMount: OnMount = (editor, monaco) => {
        // Define custom theme
        monaco.editor.defineTheme("arena-dark", ARENA_THEME);
        monaco.editor.setTheme("arena-dark");

        // Configure editor options
        editor.updateOptions({
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: "line",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            automaticLayout: true,
        });

        // Focus editor
        editor.focus();
    };

    // Handle value change
    const handleChange = (value: string | undefined) => {
        onChange(value || "");
    };

    return (
        <div className="h-full w-full bg-[#0D1117] rounded-lg overflow-hidden">
            <Editor
                height={height}
                language={language}
                value={code}
                onChange={handleChange}
                onMount={handleEditorMount}
                theme="vs-dark" // Will be overridden by custom theme on mount
                loading={
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full w-full flex items-center justify-center bg-[#0D1117]"
                    >
                        <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
                    </motion.div>
                }
                options={{
                    readOnly,
                    domReadOnly: readOnly,
                }}
            />
        </div>
    );
}
