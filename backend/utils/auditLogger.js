const AuditLog = require('../models/AuditLog');

const logAction = async ({ action, performedBy, institutionId, targetId, targetModel, details, req }) => {
    try {
        const log = await AuditLog.create({
            action,
            performedBy,
            institutionId,
            targetId,
            targetModel,
            details,
            ip: req?.ip,
            userAgent: req?.headers['user-agent']
        });
        // Non-blocking, we don't await this usually in controllers to avoid slowing resp, 
        // but here we used await inside async function.
        // Caller can choose to await or not.
    } catch (error) {
        console.error('Audit Log failed:', error);
    }
};

module.exports = logAction;
