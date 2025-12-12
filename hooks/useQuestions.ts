import { useState, useEffect } from 'react';

export interface Question {
    _id: string;
    title: string;
    type: 'coding' | 'mcq' | 'hr';
    difficulty: 'easy' | 'medium' | 'hard';
    description?: string;
    question?: string;
    options?: string[];
    correctOption?: number;
    starterCode?: string;
    testCases?: { input: string; expectedOutput: string; isHidden: boolean }[];
    topics: string[];
    tags: string[];
    companies?: string[];
    solvedBy: number;
}

interface UseQuestionsOptions {
    type?: 'coding' | 'mcq' | 'hr';
    difficulty?: 'easy' | 'medium' | 'hard';
    topic?: string;
    limit?: number;
}

export function useQuestions(options: UseQuestionsOptions = {}) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (options.type) params.set('type', options.type);
                if (options.difficulty) params.set('difficulty', options.difficulty);
                if (options.topic) params.set('topic', options.topic);
                if (options.limit) params.set('limit', options.limit.toString());

                const res = await fetch(`/api/questions?${params.toString()}`);
                if (!res.ok) throw new Error('Failed to fetch questions');

                const data = await res.json();
                setQuestions(data.questions);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, [options.type, options.difficulty, options.topic, options.limit]);

    return { questions, loading, error };
}

export function useRandomQuestions(options: { type?: string; count?: number } = {}) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (options.type) params.set('type', options.type);
            if (options.count) params.set('count', options.count.toString());

            const res = await fetch(`/api/questions/random?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch questions');

            const data = await res.json();
            setQuestions(data.questions);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refetch();
    }, [options.type, options.count]);

    return { questions, loading, error, refetch };
}
