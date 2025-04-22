// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');
const JWT_SECRET = 'digimonSecretKey123';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Invalid password' });
  
      // create token with userid
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '3h' });
  
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { email: user.email },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  });


  router.get('/profile', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch user data' });
    }
  });
module.exports = router;
