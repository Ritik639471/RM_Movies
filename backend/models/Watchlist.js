const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  poster_path: { type: String },
  vote_average: { type: Number },
  status: { type: String, enum: ['plan_to_watch', 'watched'], default: 'plan_to_watch' },
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
