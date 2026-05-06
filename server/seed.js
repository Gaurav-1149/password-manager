const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const VaultEntry = require('./models/VaultEntry');
const AuditLog = require('./models/AuditLog');
const { encrypt } = require('./utils/encryption');
const { strengthLabel } = require('./utils/password');

dotenv.config({ path: '../.env' });
dotenv.config();

const masterPassword = 'DemoMasterPassword!2026';

const sampleEntries = [
  ['GitHub', 'https://github.com', 'demo-dev', 'Fv9!xQ2pL#8mTzR4', 'Work', 'Developer account'],
  ['Gmail', 'https://mail.google.com', 'demo@gmail.com', 'MailStrong#2026!A', 'Email', 'Primary inbox'],
  ['Bank Portal', 'https://bank.example.com', 'demo-user', 'Banking#Vault9921', 'Banking', 'Do not share'],
  ['ShopEasy', 'https://shop.example.com', 'demo-shopper', 'Shop$ecure8291', 'Shopping', 'Saved for testing'],
  ['Old Forum', 'https://forum.example.com', 'demo-forum', 'password123', 'Social', 'Weak sample for health report']
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/securevault');
  await Promise.all([User.deleteMany({ email: 'demo@securevault.test' }), AuditLog.deleteMany({})]);
  const user = await User.create({
    name: 'SecureVault Demo',
    email: 'demo@securevault.test',
    masterPasswordHash: await bcrypt.hash(masterPassword, 12),
    twoFactorEnabled: false
  });
  await VaultEntry.deleteMany({ userId: user._id });
  await VaultEntry.insertMany(sampleEntries.map(([siteName, siteURL, username, password, category, notes], index) => ({
    userId: user._id,
    siteName,
    siteURL,
    username,
    encryptedPassword: encrypt(password, masterPassword),
    category,
    notes: encrypt(notes, masterPassword),
    passwordStrength: strengthLabel(password),
    lastUpdated: new Date(Date.now() - index * 35 * 24 * 60 * 60 * 1000)
  })));
  console.log('Seed complete');
  console.log('Email: demo@securevault.test');
  console.log(`Master password: ${masterPassword}`);
  await mongoose.disconnect();
}

seed().catch(error => {
  console.error(error);
  process.exit(1);
});
