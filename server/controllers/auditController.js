const AuditLog = require('../models/AuditLog');

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
