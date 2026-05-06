const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const vaultRoutes = require('./routes/vaultRoutes');
const toolsRoutes = require('./routes/toolsRoutes');
const auditRoutes = require('./routes/auditRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config({ path: '../.env' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', app: 'SecureVault API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/audit', auditRoutes);
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/securevault');
    app.listen(PORT, () => console.log(`SecureVault API running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
