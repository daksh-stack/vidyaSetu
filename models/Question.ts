import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    // Core fields
    title: { type: String, required: true },
    type: { type: String, enum: ['coding', 'mcq', 'hr'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },

    // Content (varies by type)
    description: String,           // For coding problems
    question: String,              // For MCQ/HR
    options: [String],             // For MCQ
    correctOption: Number,         // For MCQ (0-indexed)
    starterCode: String,           // For coding
    testCases: [{
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: false },
    }],

    // Categorization (for diversity)
    topics: [String],              // e.g., ["arrays", "two-pointers"]
    tags: [String],                // e.g., ["top-100", "blind-75"]
    companies: [String],           // e.g., ["Google", "Microsoft"]

    // Extensibility (for AI generation)
    variants: [{
        question: String,
        difficulty: String,
    }],
    patternFamily: String,         // e.g., "sliding-window"

    // Stats
    solvedBy: { type: Number, default: 0 },

}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
