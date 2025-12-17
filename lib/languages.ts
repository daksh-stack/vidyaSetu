/**
 * Language Configuration for Judge0 API
 * 
 * Maps language names to Judge0 language IDs and provides
 * starter code templates for each language.
 * 
 * Judge0 CE Language IDs: https://ce.judge0.com/languages
 */

export interface LanguageConfig {
    id: number;           // Judge0 language ID
    name: string;         // Display name
    extension: string;    // File extension
    monacoId: string;     // Monaco Editor language ID
    template: string;     // Starter code template
}

export const LANGUAGES: Record<string, LanguageConfig> = {
    javascript: {
        id: 63,
        name: "JavaScript (Node.js)",
        extension: "js",
        monacoId: "javascript",
        template: `// JavaScript Solution
function solution(input) {
    // Parse input
    const lines = input.trim().split('\\n');
    
    // Your code here
    
    return result;
}

// Read input and run solution
const input = require('fs').readFileSync(0, 'utf-8');
console.log(solution(input));
`,
    },
    python: {
        id: 71,
        name: "Python 3",
        extension: "py",
        monacoId: "python",
        template: `# Python Solution
def solution():
    # Read input
    # n = int(input())
    # arr = list(map(int, input().split()))
    
    # Your code here
    
    pass

if __name__ == "__main__":
    solution()
`,
    },
    cpp: {
        id: 54,
        name: "C++ (GCC 9.2.0)",
        extension: "cpp",
        monacoId: "cpp",
        template: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Read input
    // int n;
    // cin >> n;
    
    // Your code here
    
    return 0;
}
`,
    },
    java: {
        id: 62,
        name: "Java (OpenJDK 13)",
        extension: "java",
        monacoId: "java",
        template: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input
        // int n = sc.nextInt();
        
        // Your code here
        
        sc.close();
    }
}
`,
    },
    typescript: {
        id: 74,
        name: "TypeScript",
        extension: "ts",
        monacoId: "typescript",
        template: `// TypeScript Solution
function solution(input: string): string {
    const lines = input.trim().split('\\n');
    
    // Your code here
    
    return "";
}

// For local testing
declare const require: any;
const input = require('fs').readFileSync(0, 'utf-8');
console.log(solution(input));
`,
    },
    go: {
        id: 60,
        name: "Go (1.13)",
        extension: "go",
        monacoId: "go",
        template: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    
    // Read input
    // var n int
    // fmt.Fscan(reader, &n)
    _ = reader
    
    // Your code here
    fmt.Println("Hello, World!")
}
`,
    },
    rust: {
        id: 73,
        name: "Rust (1.40)",
        extension: "rs",
        monacoId: "rust",
        template: `use std::io::{self, BufRead};

fn main() {
    let stdin = io::stdin();
    let mut lines = stdin.lock().lines();
    
    // Read input
    // let n: i32 = lines.next().unwrap().unwrap().parse().unwrap();
    let _ = lines;
    
    // Your code here
    println!("Hello, World!");
}
`,
    },
};

// Default language
export const DEFAULT_LANGUAGE = "javascript";

// Get language by ID
export function getLanguageById(id: number): LanguageConfig | undefined {
    return Object.values(LANGUAGES).find(lang => lang.id === id);
}

// Language options for dropdown
export const LANGUAGE_OPTIONS = Object.entries(LANGUAGES).map(([key, config]) => ({
    value: key,
    label: config.name,
}));
