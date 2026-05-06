const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const VaultEntry = require('../models/VaultEntry');
const { encrypt, decrypt } = require('../utils/encryption');
const { sendOTP } = require('../utils/email');
const { logAction } = require('../utils/audit');

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, masterPassword } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email is already registered' });

    const masterPasswordHash = await bcrypt.hash(masterPassword, 12);
    await User.create({ name, email, masterPasswordHash });
    res.status(201).json({ message: 'Registration successful. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, masterPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const matches = await bcrypt.compare(masterPassword, user.masterPasswordHash);
    if (!matches) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.twoFactorEnabled) {
      const otp = crypto.randomInt(100000, 999999).toString();
      user.twoFactorOTP = await bcrypt.hash(otp, 10);
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOTP(user.email, otp);
      await logAction(req, user._id, 'LOGIN_OTP_SENT');
      return res.json({ requiresOTP: true, email: user.email, message: 'OTP sent to email' });
    }

    user.lastLogin = new Date();
    await user.save();
    await logAction(req, user._id, 'LOGIN');
    res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, twoFactorEnabled: user.twoFactorEnabled }
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.twoFactorOTP || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'OTP verification was not requested' });
    }
    if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP has expired' });

    const valid = await bcrypt.compare(otp, user.twoFactorOTP);
    if (!valid) return res.status(401).json({ message: 'Invalid OTP' });

    user.twoFactorOTP = undefined;
    user.otpExpiresAt = undefined;
    user.lastLogin = new Date();
    await user.save();
    await logAction(req, user._id, 'LOGIN_2FA');
    res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, twoFactorEnabled: user.twoFactorEnabled }
    });
  } catch (error) {
    next(error);
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.twoFactorEnabled) return res.status(404).json({ message: '2FA user not found' });
    const otp = crypto.randomInt(100000, 999999).toString();
    user.twoFactorOTP = await bcrypt.hash(otp, 10);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendOTP(user.email, otp);
    res.json({ message: 'OTP resent' });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await logAction(req, req.user._id, 'LOGOUT');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

exports.changeMasterPassword = async (req, res, next) => {
  try {
    const { currentMasterPassword, newMasterPassword } = req.body;
    const user = await User.findById(req.user._id);
    const matches = await bcrypt.compare(currentMasterPassword, user.masterPasswordHash);
    if (!matches) return res.status(401).json({ message: 'Current master password is incorrect' });

    const entries = await VaultEntry.find({ userId: user._id });
    for (const entry of entries) {
      const password = decrypt(entry.encryptedPassword, currentMasterPassword);
      const notes = decrypt(entry.notes, currentMasterPassword);
      entry.encryptedPassword = encrypt(password, newMasterPassword);
      entry.notes = encrypt(notes, newMasterPassword);
      entry.lastUpdated = new Date();
      await entry.save();
    }

    user.masterPasswordHash = await bcrypt.hash(newMasterPassword, 12);
    await user.save();
    await logAction(req, user._id, 'CHANGE_MASTER_PASSWORD');
    res.json({ message: 'Master password changed and vault re-encrypted' });
  } catch (error) {
    res.status(400);
    next(new Error('Could not change master password. Verify your current password and try again.'));
  }
};

exports.toggle2FA = async (req, res, next) => {
  try {
    const { enabled } = req.body;
    const user = await User.findById(req.user._id);
    user.twoFactorEnabled = Boolean(enabled);
    user.twoFactorOTP = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    await logAction(req, user._id, user.twoFactorEnabled ? 'ENABLE_2FA' : 'DISABLE_2FA');
    res.json({ twoFactorEnabled: user.twoFactorEnabled, message: '2FA setting updated' });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await VaultEntry.deleteMany({ userId: req.user._id });
    await User.deleteOne({ _id: req.user._id });
    res.json({ message: 'Account and vault deleted' });
  } catch (error) {
    next(error);
  }
};
