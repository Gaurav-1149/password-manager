const express = require('express');
const protect = require('../middleware/authMiddleware');
const audit = require('../controllers/auditController');

const router = express.Router();
router.use(protect);
router.get('/', audit.getLogs);

module.exports = router;
