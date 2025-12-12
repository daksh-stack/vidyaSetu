import { useState, useEffect } from 'react';

export interface Activity {
    _id: string;
    type: 'solved' | 'failed' | 'started' | 'streak' | 'joined' | 'badge';
    title: string;
    time: string;
    createdAt: string;
}

export function useActivity(limit: number = 10) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchActivity() {
            try {
                setLoading(true);
                const res = await fetch(`/api/activity?limit=${limit}`);
                if (!res.ok) throw new Error('Failed to fetch activity');

                const data = await res.json();
                setActivities(data.activities);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchActivity();
    }, [limit]);

    return { activities, loading, error };
}
