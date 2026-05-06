const mongoose = require('mongoose');

const vaultEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  siteName: { type: String, required: true, trim: true },
  siteURL: { type: String, trim: true },
  username: { type: String, trim: true },
  encryptedPassword: { type: String, required: true },
  category: {
    type: String,
    enum: ['Social', 'Banking', 'Work', 'Email', 'Shopping', 'Other'],
    default: 'Other'
  },
  notes: String,
  passwordStrength: { type: String, enum: ['Weak', 'Medium', 'Strong'], default: 'Weak' },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VaultEntry', vaultEntrySchema);
