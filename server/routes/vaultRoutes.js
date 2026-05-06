const express = require('express');
const { body, param } = require('express-validator');
const vault = require('../controllers/vaultController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();
const categories = ['Social', 'Banking', 'Work', 'Email', 'Shopping', 'Other'];

router.use(protect);

router.get('/search', vault.searchEntries);
router.get('/health', vault.healthReport);
router.get('/export', vault.exportVault);
router.post('/import', [body('entries').isArray(), body('masterPassword').notEmpty()], validate, vault.importVault);
router.get('/', vault.getEntries);
router.post('/', [
  body('siteName').trim().notEmpty(),
  body('password').notEmpty(),
  body('masterPassword').notEmpty(),
  body('category').optional().isIn(categories)
], validate, vault.addEntry);
router.put('/:id', [
  param('id').isMongoId(),
  body('masterPassword').notEmpty(),
  body('category').optional().isIn(categories)
], validate, vault.updateEntry);
router.delete('/:id', [param('id').isMongoId()], validate, vault.deleteEntry);

module.exports = router;
