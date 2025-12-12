import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Question from '@/models/Question';

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');        // 'coding' | 'mcq' | 'hr'
        const difficulty = searchParams.get('difficulty');
        const topic = searchParams.get('topic');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Build filter
        const filter: Record<string, unknown> = {};
        if (type) filter.type = type;
        if (difficulty) filter.difficulty = difficulty;
        if (topic) filter.topics = topic;

        const questions = await Question.find(filter)
            .limit(limit)
            .sort({ createdAt: -1 });

        return NextResponse.json({
            questions,
            count: questions.length,
        });

    } catch (error) {
        console.error('Questions API error:', error);
        return NextResponse.json(
            { message: 'Error fetching questions', error: (error as Error).message },
            { status: 500 }
        );
    }
}
