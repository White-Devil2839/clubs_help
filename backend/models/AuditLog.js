const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['LOGIN', 'REGISTER', 'LOGOUT', 'CREATE_INSTITUTION', 'UPDATE_ROLE', 'DELETE_USER', 'CREATE_CLUB', 'CREATE_EVENT', 'JOIN_CLUB', 'REGISTER_EVENT'],
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    institutionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId, // Generic reference to affected item (User, Club, Event)
        refPath: 'targetModel',
    },
    targetModel: {
        type: String,
        enum: ['User', 'Club', 'Event', 'Institution'],
    },
    details: {
        type: String, // Or Object/Map if flexible
    },
    ip: String,
    userAgent: String
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
