const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const packsController = require('../controllers/packsController');

// Get all packs
router.get('/', packsController.getAllPacks);

// Open a pack (authenticated)
router.post('/:id/open', verifyToken, packsController.openPack);

module.exports = router;
