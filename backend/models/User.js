const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: 'profile-placeholder.png' },
  birthDate: { type: Date, required: true },
  balance: { type: Number, default: 0 },
  cards: [
  {
    id: { type: String, required: true },
    quantity: { type: Number, default: 1 }
  }
],

});

module.exports = mongoose.model('User', userSchema);
