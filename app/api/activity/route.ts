import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Activity from '@/models/Activity';

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const type = searchParams.get('type');

        // Build filter
        const filter: Record<string, unknown> = {};
        if (type) filter.type = type;

        const activities = await Activity.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('questionId', 'title type');

        // Format time as relative (e.g., "2 hours ago")
        const formattedActivities = activities.map(activity => {
            const now = new Date();
            const activityDate = new Date(activity.createdAt);
            const diffMs = now.getTime() - activityDate.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);

            let timeAgo: string;
            if (diffHours < 1) {
                timeAgo = 'Just now';
            } else if (diffHours < 24) {
                timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else {
                timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            }

            return {
                _id: activity._id,
                type: activity.type,
                title: activity.title,
                time: timeAgo,
                createdAt: activity.createdAt,
            };
        });

        return NextResponse.json({
            activities: formattedActivities,
            count: formattedActivities.length,
        });

    } catch (error) {
        console.error('Activity API error:', error);
        return NextResponse.json(
            { message: 'Error fetching activities', error: (error as Error).message },
            { status: 500 }
        );
    }
}
