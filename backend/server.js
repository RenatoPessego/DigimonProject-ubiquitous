const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const cardRoutes = require('./routes/cards'); // ok
require('./config/passport')(passport);
const packRoutes = require('./routes/packs');
const marketRoutes = require('./routes/market');
const messageRoutes = require('./routes/message');



const path = require('path');



const app = express();
const PORT = 5000;

// MongoDB Atlas
mongoose.connect('mongodb+srv://Ubiquitous:8gl4dWSOoskdAl8o@cluster0.cixc7gb.mongodb.net/Ubiquos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas connected'))
.catch((err) => console.error('MongoDB error:', err));

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/cards', cardRoutes);
app.use('/packs', packRoutes);
app.use('/market', marketRoutes);
app.use('/messages', messageRoutes);
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
