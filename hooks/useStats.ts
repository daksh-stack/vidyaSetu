import { useState, useEffect } from 'react';

export interface UserStats {
    totalSolved: number;
    currentStreak: number;
    accuracy: number;
    globalRank: number | null;
    weakTopics: string[];
    strongTopics: string[];
    userName?: string;
}

export function useStats(email?: string) {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (email) params.set('email', email);

                const res = await fetch(`/api/stats?${params.toString()}`);
                if (!res.ok) throw new Error('Failed to fetch stats');

                const data = await res.json();
                setStats(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [email]);

    return { stats, loading, error };
}
