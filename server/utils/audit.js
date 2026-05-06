const AuditLog = require('../models/AuditLog');

async function logAction(req, userId, action) {
  await AuditLog.create({
    userId,
    action,
    ipAddress: req.ip,
    userAgent: req.get('user-agent') || ''
  });
}

module.exports = { logAction };
