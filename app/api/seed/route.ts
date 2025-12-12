import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Question from '@/models/Question';
import Activity from '@/models/Activity';
import User from '@/models/User';
import mongoose from 'mongoose';
import seedQuestions from '@/data/seed-questions.json';

export async function GET() {
    try {
        await connectToDatabase();

        // Clear existing questions and activities
        await Question.deleteMany({});
        await Activity.deleteMany({});

        // Seed questions
        const insertedQuestions = await Question.insertMany(seedQuestions);

        // Get a user to link activities (or create one)
        let user = await User.findOne({});
        if (!user) {
            user = await User.create({
                name: 'Demo User',
                email: 'demo@vidyasetu.com',
                password: 'demo123',
            });
        }

        // Create diverse activities with varied timestamps
        const activityTypes = [
            { type: 'solved', title: 'Solved Two Sum', hours: 2 },
            { type: 'solved', title: 'Solved Valid Parentheses', hours: 5 },
            { type: 'failed', title: 'Failed Maximum Subarray', hours: 8 },
            { type: 'started', title: 'Started Arrays Module', hours: 24 },
            { type: 'solved', title: 'Solved BST Search MCQ', hours: 26 },
            { type: 'streak', title: '5 Day Streak Achieved!', hours: 48 },
            { type: 'failed', title: 'Failed Sliding Window', hours: 72 },
            { type: 'started', title: 'Started Dynamic Programming', hours: 96 },
            { type: 'joined', title: 'Joined VidyaSetu', hours: 120 },
        ];

        const activities = activityTypes.map((a) => ({
            userId: user._id,
            type: a.type,
            title: a.title,
            createdAt: new Date(Date.now() - a.hours * 3600000),
            updatedAt: new Date(Date.now() - a.hours * 3600000),
        }));

        await Activity.insertMany(activities);

        return NextResponse.json({
            message: 'Database seeded successfully',
            stats: {
                questions: insertedQuestions.length,
                activities: activities.length,
                coding: insertedQuestions.filter(q => q.type === 'coding').length,
                mcq: insertedQuestions.filter(q => q.type === 'mcq').length,
                hr: insertedQuestions.filter(q => q.type === 'hr').length,
            }
        });

    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { message: 'Error seeding database', error: (error as Error).message },
            { status: 500 }
        );
    }
}
