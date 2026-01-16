const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    type: {
        type: String,
        enum: ['CLUB', 'INSTITUTE'],
        required: true,
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
    },
    institutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
