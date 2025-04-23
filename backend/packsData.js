module.exports = [
  {
    id: 'free_pack',
    name: 'Free Pack',
    price: 0,
    cardsPerPack: 1,
    rarities: {
      "Common": 1.0
    },
    imageUrl: 'free-pack.png'
  },
  {
    id: 'starter_pack',
    name: 'Starter Pack',
    price: 50,
    cardsPerPack: 3,
    rarities: {
      "Common": 0.85,
      "Rare": 0.1,
      "Super Rare": 0.05
    },
    imageUrl: 'starter-pack.png'
  },
  {
    id: 'premium_pack',
    name: 'Premium Pack',
    price: 150,
    cardsPerPack: 5,
    rarities: {
      "Common": 0.4,
      "Rare": 0.2,
      "Super Rare": 0.15,
      "Ultra Rare": 0.1,
      "Secret Rare": 0.08,
      "Ghost Rare": 0.07
    },
    imageUrl: 'premium-pack.png'
  }
];
