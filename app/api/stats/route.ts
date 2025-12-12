import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import UserStats from '@/models/UserStats';
import Activity from '@/models/Activity';
import User from '@/models/User';

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        // Find user
        let user = null;
        if (email) {
            user = await User.findOne({ email });
        } else {
            // Fallback: get first user for demo
            user = await User.findOne({});
        }

        if (!user) {
            return NextResponse.json({
                totalSolved: 0,
                currentStreak: 0,
                accuracy: 0,
                globalRank: null,
                weakTopics: [],
                strongTopics: [],
            });
        }

        // Get or calculate stats
        let stats = await UserStats.findOne({ userId: user._id });

        if (!stats) {
            // Calculate from activities
            const solvedCount = await Activity.countDocuments({
                userId: user._id,
                type: 'solved'
            });
            const failedCount = await Activity.countDocuments({
                userId: user._id,
                type: 'failed'
            });
            const totalAttempts = solvedCount + failedCount;
            const accuracy = totalAttempts > 0 ? Math.round((solvedCount / totalAttempts) * 100) : 0;

            // Calculate streak from activities
            const recentActivities = await Activity.find({ userId: user._id })
                .sort({ createdAt: -1 })
                .limit(30);

            let streak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < 30; i++) {
                const checkDate = new Date(today);
                checkDate.setDate(checkDate.getDate() - i);
                const nextDay = new Date(checkDate);
                nextDay.setDate(nextDay.getDate() + 1);

                const hasActivity = recentActivities.some(a => {
                    const actDate = new Date(a.createdAt);
                    return actDate >= checkDate && actDate < nextDay;
                });

                if (hasActivity) {
                    streak++;
                } else if (i > 0) {
                    break;
                }
            }

            // Create stats record
            stats = await UserStats.create({
                userId: user._id,
                totalSolved: solvedCount,
                currentStreak: streak,
                accuracy,
                globalRank: Math.floor(Math.random() * 5000) + 500, // Simulated
            });
        }

        return NextResponse.json({
            totalSolved: stats.totalSolved,
            currentStreak: stats.currentStreak,
            accuracy: stats.accuracy,
            globalRank: stats.globalRank,
            weakTopics: stats.weakTopics || [],
            strongTopics: stats.strongTopics || [],
            userName: user.name,
        });

    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json(
            { message: 'Error fetching stats', error: (error as Error).message },
            { status: 500 }
        );
    }
}
