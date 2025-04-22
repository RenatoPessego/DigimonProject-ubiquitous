// backend/controllers/cardsController.js
const User = require('../models/User');

exports.addCardToUser = async (req, res) => {
  try {
    const { cardId } = req.body;
    const userId = req.user.id; // vcomes from decoded token

    if (!cardId) {
      return res.status(400).json({ message: 'Card ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingCard = user.cards.find((card) => card.id === cardId);
    if (existingCard) {
      existingCard.quantity += 1;
    } else {
      user.cards.push({ id: cardId, quantity: 1 });
    }

    await user.save();

    return res.status(200).json({ message: 'Card added to user' });
  } catch (err) {
    console.error('Error adding card:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
