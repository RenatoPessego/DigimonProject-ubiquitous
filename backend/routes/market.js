// routes/market.js
const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const verifyToken = require('../middleware/authMiddleware');

// Colocar carta à venda
router.post('/sell', verifyToken, marketController.sellCard);

// Comprar carta
router.post('/buy/:id', verifyToken, marketController.buyCard);

// Ver mercado
router.get('/', verifyToken, marketController.getMarketListings);

// Ver cartas do utilizador
router.get('/mycards', verifyToken, marketController.getUserCards);


module.exports = router;
