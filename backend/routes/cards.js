const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const cardsController = require('../controllers/cardsController');

// Route to open a pack using its ID (e.g., /cards/open-pack/free_pack)
router.post('/open-pack/:id', verifyToken, cardsController.openPack);

module.exports = router;
