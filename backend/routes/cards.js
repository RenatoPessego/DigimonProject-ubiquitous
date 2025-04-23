// backend/routes/cards.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const cardsController = require('../controllers/cardsController');


router.post('/open-pack', verifyToken, cardsController.openPack);


module.exports = router;
