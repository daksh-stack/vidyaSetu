import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // NOTE: In production, compare hashed passwords with bcrypt!
        if (user.password !== password) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email },
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Error during login', error: (error as Error).message },
            { status: 500 }
        );
    }
}
