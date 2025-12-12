import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Question from '@/models/Question';

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const count = parseInt(searchParams.get('count') || '5');
        const difficulty = searchParams.get('difficulty');

        // Build aggregation pipeline for random sampling
        const pipeline: object[] = [];

        // Match filters
        const matchStage: Record<string, unknown> = {};
        if (type) matchStage.type = type;
        if (difficulty) matchStage.difficulty = difficulty;

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // Random sample
        pipeline.push({ $sample: { size: count } });

        const questions = await Question.aggregate(pipeline);

        return NextResponse.json({
            questions,
            count: questions.length,
        });

    } catch (error) {
        console.error('Random questions API error:', error);
        return NextResponse.json(
            { message: 'Error fetching random questions', error: (error as Error).message },
            { status: 500 }
        );
    }
}
