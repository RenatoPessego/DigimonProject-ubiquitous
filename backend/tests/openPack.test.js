jest.setTimeout(20000);

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');

const JWT_SECRET = 'digimonSecretKey123';

let mongoServer;
let server;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const user = new User({
    username: 'testuser',
    password: 'fakehash',
    cards: [],
    balance: 10 // Suficiente para abrir pack comum
  });
  await user.save();
  userId = user._id;
  token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

  server = app.listen(4003);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

describe('Pack Flow (Generate + Open)', () => {
  const rarity = 'common';
  const cardCount = 9;
  const packSource = 'Phantom Nightmare'; // ✅ Corrigido para um nome válido da API

  it('should generate a pack', async () => {
    const res = await request(server)
      .post('/packs/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ rarityType: rarity, cardCount, packSource });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.packs)).toBe(true);
    expect(res.body.packs[0]).toHaveProperty('name');
    expect(res.body.packs[0]).toHaveProperty('rarity');
    expect(res.body.packs[0]).toHaveProperty('price');
  });

  it('should open a pack and return 9 cards', async () => {
    const res = await request(server)
      .post('/packs/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ rarity, cardCount, packSource });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.cards)).toBe(true);
    expect(res.body.cards.length).toBe(9);
    expect(res.body.cards[0]).toHaveProperty('name');
    expect(res.body.cards[0]).toHaveProperty('rarity');
    expect(res.body.cards[0]).toHaveProperty('image_url');
  });

  it('should fail to open a pack due to insufficient funds', async () => {
    await User.findByIdAndUpdate(userId, { balance: 0 });

    const res = await request(server)
      .post('/packs/open')
      .set('Authorization', `Bearer ${token}`)
      .send({ rarity: 'legendary', cardCount: 5, packSource });

    expect(res.statusCode).toBe(402);
    expect(res.body.message).toMatch(/Insufficient balance/i);
  });

  it('should quick sell a card and receive money', async () => {
    const user = await User.findById(userId);
    const firstCard = user.cards[0];

    const res = await request(server)
      .post('/cards/quick-sell')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cardId: firstCard.id,
        rarity: firstCard.rarity,
        pack: firstCard.pack,
        price: 1.25
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.balance).toBeGreaterThan(0);
  });
});
