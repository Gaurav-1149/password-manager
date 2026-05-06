const express = require('express');
const { body } = require('express-validator');
const tools = require('../controllers/toolsController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(protect);

router.post('/generate', [
  body('length').optional().isInt({ min: 8, max: 64 }),
  body('includeUppercase').optional().isBoolean(),
  body('includeNumbers').optional().isBoolean(),
  body('includeSymbols').optional().isBoolean()
], validate, tools.generate);

router.post('/check-breach', [body('email').isEmail().normalizeEmail()], validate, tools.checkBreach);

module.exports = router;
