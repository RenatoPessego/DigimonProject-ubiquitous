const mongoose = require('mongoose');
const User = require('./models/User'); // ajusta o path se necessário

const MONGO_URI = 'mongodb+srv://Ubiquitous:8gl4dWSOoskdAl8o@cluster0.cixc7gb.mongodb.net/Ubiquos?retryWrites=true&w=majority';

const exampleCards = [
  { id: 'BT1-003', quantity: 1 },
  { id: 'BT1-004', quantity: 2 },
  { id: 'BT1-005', quantity: 1 },
  { id: 'BT1-006', quantity: 3 },
  { id: 'BT1-007', quantity: 1 },
  { id: 'BT1-008', quantity: 2 },
  { id: 'BT1-009', quantity: 1 },
  { id: 'BT1-010', quantity: 1 },
  { id: 'BT1-011', quantity: 2 },
  { id: 'BT1-012', quantity: 1 },
];

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const user = await User.findOne({ username: 'RenatoPessego' }); // ajusta o username correto

    if (!user) {
      console.error('❌ User not found');
      return;
    }

    user.cards = exampleCards;
    await user.save();
    console.log('✅ Cards added with success!');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ MongoDB error:', err);
    mongoose.disconnect();
  });
