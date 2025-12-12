import mongoose from 'mongoose';

const UserStatsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    totalSolved: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    globalRank: Number,
    weakTopics: [String],
    strongTopics: [String],
    lastActiveAt: Date,
}, { timestamps: true });

export default mongoose.models.UserStats || mongoose.model('UserStats', UserStatsSchema);
