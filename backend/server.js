require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Watchlist = require('./models/Watchlist');
const Review = require('./models/Review');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    // and any origin in development or if origin ends with netlify.app or onrender.com
    if (!origin || origin.includes('localhost') || origin.includes('netlify.app') || origin.includes('onrender.com') || origin.includes('github.io')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now; narrow down after confirming deployment URL
    }
  },
  credentials: true
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Default MongoDB URI if not provided
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinevault';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_cinevault_key_123';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains userId
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// --- Watchlist Routes ---
app.get('/api/watchlist', authMiddleware, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user.userId });
    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/watchlist', authMiddleware, async (req, res) => {
  try {
    const { movieId, title, poster_path, vote_average } = req.body;
    const existing = await Watchlist.findOne({ userId: req.user.userId, movieId });
    if (existing) return res.status(400).json({ error: 'Movie already in watchlist' });

    const newWatchlistItem = new Watchlist({
      userId: req.user.userId,
      movieId,
      title,
      poster_path,
      vote_average,
    });
    const saved = await newWatchlistItem.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/watchlist/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['plan_to_watch', 'watched'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await Watchlist.findOneAndUpdate(
      { userId: req.user.userId, movieId: req.params.id },
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found in watchlist' });
    
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/watchlist/:id', authMiddleware, async (req, res) => {
  try {
    // Note: id here could be the unique MongoDB _id or the TMDB movieId
    // We'll assume it's the TMDB movieId for easier frontend usage
    const result = await Watchlist.findOneAndDelete({ userId: req.user.userId, movieId: req.params.id });
    if (!result) return res.status(404).json({ error: 'Not found in watchlist' });
    
    res.status(200).json({ success: true, movieId: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Review Routes ---
app.get('/api/reviews/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/reviews', authMiddleware, async (req, res) => {
  try {
    const { movieId, rating, reviewText } = req.body;
    
    // Find user to get the username
    const user = await User.findById(req.user.userId);
    
    // Use findOneAndUpdate with upsert to create or update existing review
    const review = await Review.findOneAndUpdate(
      { userId: req.user.userId, movieId },
      { rating, reviewText, userName: user.name },
      { new: true, upsert: true }
    );
    
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/reviews/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!result) return res.status(404).json({ error: 'Review not found or unauthorized' });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve frontend for deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'dist', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
