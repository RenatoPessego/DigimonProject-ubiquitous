// controllers/marketController.js
const MarketListing = require('../models/MarketListing');
const User = require('../models/User');
const Message = require('../models/Message');

// Colocar carta à venda
exports.sellCard = async (req, res) => {
  const userId = req.user.id;
  const { cardId, rarity, pack, price } = req.body;

  if (!cardId || !rarity || !pack || !price)
    return res.status(400).json({ message: 'Missing data' });

  const user = await User.findById(userId);
  const index = user.cards.findIndex(c => c.id === cardId && c.rarity === rarity && c.pack === pack);

  if (index === -1 || user.cards[index].quantity < 1)
    return res.status(400).json({ message: 'Card not available' });

  // Remove carta do inventário
  user.cards[index].quantity -= 1;
  if (user.cards[index].quantity === 0)
    user.cards.splice(index, 1);
  await user.save();

  // Criar anúncio no mercado
  const listing = new MarketListing({ sellerId: userId, cardId, rarity, pack, price });
  await listing.save();

  res.status(201).json({ message: 'Card listed for sale', user });
};

// Comprar carta
exports.buyCard = async (req, res) => {
  const userId = req.user.id;
  const listingId = req.params.id;

  const listing = await MarketListing.findById(listingId);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  const buyer = await User.findById(userId);
  const seller = await User.findById(listing.sellerId);

  if (!buyer || !seller) return res.status(404).json({ message: 'User not found' });

  if (buyer._id.toString() === seller._id.toString()) {
    return res.status(400).json({ message: 'You cannot buy your own card' });
  }  
  
  if (buyer.balance < listing.price) return res.status(400).json({ message: 'Not enough coins' });

  // Transferir moedas
  buyer.balance -= listing.price;
  seller.balance += listing.price;

  // Adicionar carta ao comprador
  const exists = buyer.cards.find(c =>
    c.id === listing.cardId && c.rarity === listing.rarity && c.pack === listing.pack
  );
  if (exists) exists.quantity += 1;
  else {
    buyer.cards.push({
      id: listing.cardId,
      rarity: listing.rarity,
      pack: listing.pack,
      quantity: 1
    });
  }

  await buyer.save();
  await seller.save();

  // Remover anúncio
  await Message.deleteMany({ listingId: listing._id });
  await listing.deleteOne();

  res.status(200).json({ message: 'Purchase successful' });
};

// Listar todas as cartas disponíveis no mercado
exports.getMarketListings = async (req, res) => {
    try {
      const currentUserId = req.user?.id; // Pode ser undefined se o utilizador não estiver autenticado
      const filter = currentUserId ? { sellerId: { $ne: currentUserId } } : {};
      const listings = await MarketListing.find(filter).populate('sellerId', 'username');
      res.status(200).json({ listings });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching market listings' });
    }
  };  
  
  // Listar cartas do utilizador autenticado
exports.getUserCards = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ cards: user.cards });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user cards' });
    }
  };

  // GET /market/mylistings
exports.getMyListings = async (req, res) => {
  try {
    const listings = await MarketListing.find({ sellerId: req.user.id });
    res.status(200).json({ listings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
};

// DELETE /market/:id
exports.deleteListing = async (req, res) => {
  try {
    const listing = await MarketListing.findById(req.params.id);
    if (!listing) {
      console.log('❌ Listing not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Listing not found' });
    }

    const userId = req.user.id || req.user._id;
    if (listing.sellerId.toString() !== userId) {
      console.log('⛔ Not authorized');
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    // ✅ Repor carta ao inventário do utilizador
    const user = await User.findById(userId);
    const existing = user.cards.find(
      (c) => c.id === listing.cardId && c.rarity === listing.rarity && c.pack === listing.pack
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      user.cards.push({
        id: listing.cardId,
        rarity: listing.rarity,
        pack: listing.pack,
        quantity: 1
      });
    }

    await user.save();
    await Message.deleteMany({ listingId: listing._id });
    await listing.deleteOne();

    console.log('✅ Listing removed and messages deleted');
    res.status(200).json({ message: 'Listing removed and messages deleted' });
  } catch (err) {
    console.error('❌ Error removing listing:', err);
    res.status(500).json({ message: 'Error removing listing', error: err.message });
  }
};



// PUT /market/:id
exports.updateListing = async (req, res) => {
  try {
    const { price } = req.body;
    const listing = await MarketListing.findById(req.params.id);

    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.sellerId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    listing.price = price;
    await listing.save();
    res.status(200).json({ message: 'Price updated', listing });
  } catch (err) {
    res.status(500).json({ message: 'Error updating listing' });
  }
};
  