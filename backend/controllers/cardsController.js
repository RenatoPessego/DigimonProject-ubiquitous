// backend/controllers/cardsController.js
const User = require('../models/User');
const packsData = require('../packsData');
const fetch = require('node-fetch');

function pickRarity(rarityProbabilities) {
  const rarities = Object.entries(rarityProbabilities);
  const totalProb = rarities.reduce((sum, [_, p]) => sum + p, 0);
  const rand = Math.random();

  let cumulative = 0;
  for (const [rarity, probability] of rarities) {
    cumulative += probability / totalProb; // normaliza para 100%
    if (rand < cumulative) {
      return rarity;
    }
  }

  // Fallback (deve nunca ser usado se os dados forem corretos)
  return 'c';
}



// Adiciona cartas ao utilizador ao abrir um pack
exports.openPack = async (req, res) => {
  try {
    const { packId } = req.body;
    const userId = req.user.id;

    if (!packId) {
      return res.status(400).json({ message: 'Pack ID is required' });
    }

    const pack = packsData.find((p) => p.id === packId);
    if (!pack) {
      return res.status(400).json({ message: 'Invalid pack ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cardsToAdd = [];

    for (let i = 0; i < pack.cardsPerPack; i++) {
      const rarity = pickRarity(pack.rarities);
      console.log(`🃏 Sorteada raridade: ${rarity}`);
      const response = await fetch(`https://digimoncard.io/api-public/search.php?rarity=${rarity}`);
      const data = await response.json();

      
      const filteredCards = data.filter((card) => card.rarity === rarity);
      if (!Array.isArray(filteredCards) || filteredCards.length === 0) continue;

      const randomCard = filteredCards[Math.floor(Math.random() * filteredCards.length)];

      const existing = user.cards.find((c) => c.id === randomCard.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        user.cards.push({ id: randomCard.id, quantity: 1 });
      }

      cardsToAdd.push(randomCard);
    }

    await user.save();

    return res.status(200).json({
      message: 'Pack opened successfully',
      cards: cardsToAdd,
    });
  } catch (err) {
    console.error('Error opening pack:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};
