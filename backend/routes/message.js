const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const verifyToken = require('../middleware/authMiddleware');

// Enviar mensagem
router.post('/', verifyToken, messageController.sendMessage);

// Obter utilizadores que participaram na conversa de um anúncio
router.get('/participants/:listingId', verifyToken, messageController.getParticipants);

// Buscar histórico de conversa de um anúncio com outro utilizador
router.get('/:listingId/:userId', verifyToken, messageController.getMessages);



module.exports = router;