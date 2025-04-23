module.exports = [
    {
      id: 'free_pack',
      name: 'Free Pack',
      price: 0,
      cardsPerPack: 1,
      rarities: {
        c: 1.00,   // Common
        u: 0.00,   // Uncommon
        sr: 0.00   // Super Rare
      },
      imageUrl: 'free-pack.png' 
    },
    {
      id: 'starter_pack',
      name: 'Starter Pack',
      price: 50,
      cardsPerPack: 3,
      rarities: {
        c: 0.85,
        u: 0.12,
        sr: 0.03
      },
      imageUrl: 'free-pack.png'
    },
    {
      id: 'premium_pack',
      name: 'Premium Pack',
      price: 150,
      cardsPerPack: 5,
      rarities: {
        c: 0.6,
        u: 0.3,
        sr: 0.1
      },
      imageUrl: 'free-pack.png'
    }
  ];
  