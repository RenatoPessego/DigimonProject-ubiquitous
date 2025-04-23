const User = require('../models/User');
const packs = require('../packsData');
const fetch = require('node-fetch');

// In-memory cache to avoid hitting the API repeatedly
const rarityCache = {};

/**
 * Picks a rarity based on the defined probability weights
 */
function getRandomRarity(rarityWeights) {
  const rand = Math.random();
  let sum = 0;
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    sum += weight;
    if (rand <= sum) return rarity;
  }
  return 'Common'; // default fallback
}

/**
 * Returns the list of all available packs
 */
exports.getAllPacks = (req, res) => {
  res.json(packs);
};

/**
 * Handles pack opening:
 *  - Validates user and balance
 *  - Picks cards based on pack configuration
 *  - Updates user card collection and balance
 */
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
      console.log(`🃏 Picked rarity: ${rarity}`);

      // If not cached, fetch and store in cache
      if (!rarityCache[rarity]) {
        console.log(`Fetching cards from API with rarity "${rarity}"...`);
        const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?rarity=${encodeURIComponent(rarity)}`);
        const data = await res.json();

        if (!data.data || !Array.isArray(data.data)) {
          console.warn(`⚠️ No cards found for rarity ${rarity}`);
          continue;
        }

        rarityCache[rarity] = data.data;
      }

      const availableCards = rarityCache[rarity];
      const selected = availableCards[Math.floor(Math.random() * availableCards.length)];

      cards.push({
        id: selected.id.toString(),
        name: selected.name,
        image_url: selected.card_images?.[0]?.image_url,
        rarity: rarity
      });

      // Update user collection
      const existing = user.cards.find(c => c.id === selected.id.toString());
      if (existing) {
        existing.quantity += 1;
      } else {
        user.cards.push({ id: selected.id.toString(), quantity: 1 });
      }
    }

    user.balance -= pack.price;
    await user.save();

    res.status(200).json({ cards });
  } catch (err) {
    console.error('❌ Error opening pack:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
