const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'ADMIN', 'MEMBER'],
        default: 'MEMBER',
    },
    institutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        required: true,
    },
    // Secure Password Reset Fields
    resetTokenHash: String, // Bcrypt hash of the token
    resetTokenExpiresAt: Date,
    resetUsed: {
        type: Boolean,
        default: false,
    },
    resetRequestedAt: Date,
    resetAttempts: {
        type: Number,
        default: 0,
    },
    // Session Invalidation
    tokenVersion: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// Email must be unique globally across the entire platform
userSchema.index({ email: 1 }, { unique: true });

// OLD method removed. Logic moved to controller for async bcrypt.

module.exports = mongoose.model('User', userSchema);
