const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['TECH', 'NON_TECH', 'EXTRACURRICULAR'],
        required: true,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    institutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
