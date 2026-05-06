const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const auth = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' }
});

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('masterPassword').isLength({ min: 12 }).withMessage('Master password must be at least 12 characters')
], validate, auth.register);

router.post('/login', loginLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('masterPassword').notEmpty()
], validate, auth.login);

router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric()
], validate, auth.verifyOTP);

router.post('/resend-otp', [body('email').isEmail().normalizeEmail()], validate, auth.resendOTP);
router.post('/logout', protect, auth.logout);
router.put('/change-master-password', protect, [
  body('currentMasterPassword').notEmpty(),
  body('newMasterPassword').isLength({ min: 12 })
], validate, auth.changeMasterPassword);
router.put('/2fa', protect, [body('enabled').isBoolean()], validate, auth.toggle2FA);
router.delete('/account', protect, auth.deleteAccount);

module.exports = router;
