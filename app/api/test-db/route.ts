import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';

export async function GET() {
    try {
        await connectToDatabase();
        return NextResponse.json({ message: 'MongoDB connected successfully', status: 'connected' });
    } catch (error) {
        return NextResponse.json(
            { message: 'Error connecting to MongoDB', error: (error as Error).message },
            { status: 500 }
        );
    }
}
