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

// Ver cartas à venda do utilizador
router.get('/mylistings', verifyToken, marketController.getMyListings);

// Deletar carta à venda
router.delete('/:id', verifyToken, marketController.deleteListing);

// Atualizar carta à venda
router.put('/:id', verifyToken, marketController.updateListing);



module.exports = router;
