const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const packsController = require('../controllers/packsController');
const packsData = require('../packsData');

router.get('/', (req, res) => {
    res.json(packsData);
  });


router.get('/', packsController.getAllPacks);
router.post('/:id/open', verifyToken, packsController.openPack);

module.exports = router;
