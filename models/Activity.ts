import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['solved', 'failed', 'started', 'streak', 'joined', 'badge'],
        required: true
    },
    title: { type: String, required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    metadata: mongoose.Schema.Types.Mixed, // Flexible extra data
}, { timestamps: true });

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
