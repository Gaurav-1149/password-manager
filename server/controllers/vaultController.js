const VaultEntry = require('../models/VaultEntry');
const { encrypt, decrypt } = require('../utils/encryption');
const { strengthLabel } = require('../utils/password');
const { logAction } = require('../utils/audit');

function decryptEntry(entry, masterPassword) {
  return {
    id: entry._id,
    siteName: entry.siteName,
    siteURL: entry.siteURL,
    username: entry.username,
    password: decrypt(entry.encryptedPassword, masterPassword),
    category: entry.category,
    notes: decrypt(entry.notes, masterPassword),
    passwordStrength: entry.passwordStrength,
    lastUpdated: entry.lastUpdated,
    createdAt: entry.createdAt
  };
}

exports.getEntries = async (req, res, next) => {
  try {
    const { masterPassword } = req.query;
    if (!masterPassword) return res.status(400).json({ message: 'Master password is required for decryption' });
    const entries = await VaultEntry.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(entries.map(entry => decryptEntry(entry, masterPassword)));
  } catch (error) {
    res.status(400);
    next(new Error('Unable to decrypt vault. Check your master password.'));
  }
};

exports.addEntry = async (req, res, next) => {
  try {
    const { siteName, siteURL, username, password, category, notes, masterPassword } = req.body;
    if (!masterPassword) return res.status(400).json({ message: 'Master password is required' });
    const entry = await VaultEntry.create({
      userId: req.user._id,
      siteName,
      siteURL,
      username,
      encryptedPassword: encrypt(password, masterPassword),
      category,
      notes: encrypt(notes || '', masterPassword),
      passwordStrength: strengthLabel(password)
    });
    await logAction(req, req.user._id, 'ADD_PASSWORD');
    res.status(201).json(decryptEntry(entry, masterPassword));
  } catch (error) {
    next(error);
  }
};

exports.updateEntry = async (req, res, next) => {
  try {
    const { siteName, siteURL, username, password, category, notes, masterPassword } = req.body;
    if (!masterPassword) return res.status(400).json({ message: 'Master password is required' });
    const entry = await VaultEntry.findOne({ _id: req.params.id, userId: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Vault entry not found' });

    entry.siteName = siteName ?? entry.siteName;
    entry.siteURL = siteURL ?? entry.siteURL;
    entry.username = username ?? entry.username;
    entry.category = category ?? entry.category;
    if (password) {
      entry.encryptedPassword = encrypt(password, masterPassword);
      entry.passwordStrength = strengthLabel(password);
    }
    if (notes !== undefined) entry.notes = encrypt(notes, masterPassword);
    entry.lastUpdated = new Date();
    await entry.save();
    await logAction(req, req.user._id, 'UPDATE_PASSWORD');
    res.json(decryptEntry(entry, masterPassword));
  } catch (error) {
    next(error);
  }
};

exports.deleteEntry = async (req, res, next) => {
  try {
    const deleted = await VaultEntry.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Vault entry not found' });
    await logAction(req, req.user._id, 'DELETE_PASSWORD');
    res.json({ message: 'Vault entry deleted' });
  } catch (error) {
    next(error);
  }
};

exports.searchEntries = async (req, res, next) => {
  try {
    const { q = '', masterPassword } = req.query;
    if (!masterPassword) return res.status(400).json({ message: 'Master password is required' });
    const entries = await VaultEntry.find({
      userId: req.user._id,
      $or: [
        { siteName: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(entries.map(entry => decryptEntry(entry, masterPassword)));
  } catch (error) {
    next(error);
  }
};

exports.healthReport = async (req, res, next) => {
  try {
    const { masterPassword } = req.query;
    if (!masterPassword) return res.status(400).json({ message: 'Master password is required' });
    const entries = await VaultEntry.find({ userId: req.user._id });
    const decrypted = entries.map(entry => decryptEntry(entry, masterPassword));
    const weakPasswords = decrypted.filter(entry => entry.passwordStrength === 'Weak');
    const oldPasswords = decrypted.filter(entry => Date.now() - new Date(entry.lastUpdated).getTime() > 90 * 24 * 60 * 60 * 1000);
    const groups = decrypted.reduce((acc, entry) => {
      acc[entry.password] = acc[entry.password] || [];
      acc[entry.password].push(entry);
      return acc;
    }, {});
    const duplicatePasswords = Object.values(groups).filter(group => group.length > 1).flat();
    const penalties = weakPasswords.length * 12 + duplicatePasswords.length * 10 + oldPasswords.length * 8;
    const score = Math.max(0, Math.min(100, 100 - penalties));
    res.json({ score, weakPasswords, duplicatePasswords, oldPasswords });
  } catch (error) {
    res.status(400);
    next(new Error('Unable to generate health report. Check your master password.'));
  }
};

exports.exportVault = async (req, res, next) => {
  try {
    const { masterPassword } = req.query;
    if (!masterPassword) return res.status(400).json({ message: 'Master password is required' });
    const entries = await VaultEntry.find({ userId: req.user._id });
    await logAction(req, req.user._id, 'EXPORT');
    res.json({
      exportedAt: new Date(),
      entries: entries.map(entry => decryptEntry(entry, masterPassword))
    });
  } catch (error) {
    next(error);
  }
};

exports.importVault = async (req, res, next) => {
  try {
    const { entries = [], masterPassword } = req.body;
    if (!masterPassword) return res.status(400).json({ message: 'Master password is required' });
    const docs = entries.map(entry => ({
      userId: req.user._id,
      siteName: entry.siteName,
      siteURL: entry.siteURL,
      username: entry.username,
      encryptedPassword: encrypt(entry.password, masterPassword),
      category: entry.category || 'Other',
      notes: encrypt(entry.notes || '', masterPassword),
      passwordStrength: strengthLabel(entry.password)
    }));
    await VaultEntry.insertMany(docs);
    await logAction(req, req.user._id, 'IMPORT');
    res.status(201).json({ message: `${docs.length} entries imported` });
  } catch (error) {
    next(error);
  }
};
