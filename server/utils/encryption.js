const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

function deriveKey(masterPassword, salt) {
  return crypto.pbkdf2Sync(masterPassword, salt, 100000, KEY_LENGTH, 'sha256');
}

function encrypt(text = '', masterPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = deriveKey(masterPassword, salt);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(String(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${salt}:${iv.toString('hex')}:${encrypted}`;
}

function decrypt(encryptedText = '', masterPassword) {
  if (!encryptedText) return '';
  const [salt, ivHex, encrypted] = encryptedText.split(':');
  const key = deriveKey(masterPassword, salt);
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
