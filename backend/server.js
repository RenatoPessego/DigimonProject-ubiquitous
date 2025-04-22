const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const JWT_SECRET = 'digimonSecretKey123';

const app = express();
const PORT = 5000;

// Load passport config
require('./config/passport')(passport);

// MongoDB Atlas connection (uses database "Ubiquos")
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
