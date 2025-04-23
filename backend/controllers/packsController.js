const User = require('../models/User');
const packs = require('../packsData');
const fetch = require('node-fetch');

// In-memory cache to avoid repeated API requests
const rarityCache = {};

/**
 * Selects a rarity based on the pack's rarity probabilities
 */
function getRandomRarity(rarityWeights) {
  const rand = Math.random();
  let sum = 0;
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    sum += weight;
    if (rand <= sum) return rarity;
  }
  return 'Common'; // Fallback if none selected
}

/**
 * GET /packs - Returns all available packs
 */
exports.getAllPacks = (req, res) => {
  res.json(packs);
};

/**
 * POST /packs/:id/open - Opens a pack and adds cards to the user's collection
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

      // Fetch and cache cards of this rarity if not already cached
      if (!rarityCache[rarity]) {
        console.log(`Fetching cards with rarity "${rarity}" from YGO API...`);
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?rarity=${encodeURIComponent(rarity)}`);
        const data = await response.json();

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
        image_url: selected.card_images?.[0]?.image_url || null,
        rarity: rarity
      });

      // Add to user's collection
      const existing = user.cards.find(c => c.id === selected.id.toString());
      if (existing) {
        existing.quantity += 1;
      } else {
        user.cards.push({ id: selected.id.toString(), quantity: 1 });
      }
    }

    // Deduct pack cost
    user.balance -= pack.price;
    await user.save();

    return res.status(200).json({ cards });
  } catch (err) {
    console.error('❌ Error opening pack:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};
