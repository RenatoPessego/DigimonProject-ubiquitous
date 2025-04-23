const User = require('../models/User');
const packs = require('../packsData');
const fetch = require('node-fetch');

function getRandomRarity(rarityWeights) {
  const rand = Math.random();
  let sum = 0;
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    sum += weight;
    if (rand <= sum) return rarity;
  }
  return 'c';
}

exports.getAllPacks = (req, res) => {
  res.json(packs);
};

exports.openPack = async (req, res) => {
  try {
    const packId = req.params.id;
    const userId = req.user.id;
    const pack = packs.find(p => p.id === packId);

    if (!pack) return res.status(404).json({ message: 'Pack not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.balance < pack.price) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const cards = [];

    for (let i = 0; i < pack.cardsPerPack; i++) {
      const rarity = getRandomRarity(pack.rarities);
      const apiRes = await fetch(`https://digimoncard.io/api-public/search.php?rarity=${rarity}`);
      const apiData = await apiRes.json();

      if (!Array.isArray(apiData) || apiData.length === 0) continue;

      const selected = apiData[Math.floor(Math.random() * apiData.length)];
      cards.push(selected);

      const existing = user.cards.find(c => c.id === selected.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        user.cards.push({ id: selected.id, quantity: 1 });
      }
    }

    user.balance -= pack.price;
    await user.save();

    res.status(200).json({ cards });
  } catch (err) {
    console.error('Error opening pack:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
