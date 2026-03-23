import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieModal = ({ movie, onClose, onSave }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const type = movie.media_type === 'tv' ? 'tv' : 'movie';
        const res = await fetch(`https://api.themoviedb.org/3/${type}/${movie.id || movie.movieId}/videos?api_key=${API_KEY}`);
        const data = await res.json();
        if (data.results) {
          const trailer = data.results.find(vid => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser"));
          if (trailer) setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error("Failed to fetch trailer:", err);
      }
    };
    if (movie.id || movie.movieId) fetchTrailer();
  }, [movie]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_BASE}/api/reviews/${movie.id || movie.movieId}`);
        if(res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    if (movie.id || movie.movieId) fetchReviews();
  }, [movie]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          movieId: movie.id || movie.movieId, 
          rating: newReview.rating, 
          reviewText: newReview.text 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(prev => {
          const exists = prev.find(r => r._id === data._id);
          if (exists) return prev.map(r => r._id === data._id ? data : r);
          return [data, ...prev];
        });
        setNewReview({ rating: 5, text: "" });
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const posterUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/1280x720?text=No+Image";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(168,85,247,0.15)] bg-[#121214]"
          initial={{ scale: 0.95, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 30, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Backdrop Image & Trailer Section */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-black shrink-0 flex">
            
            {/* Keep Image rendered to maintain structural sizing boundaries */}
            <img 
              src={posterUrl} 
              alt={movie.title || movie.name} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
            />
            
            {/* Trailer Iframe absolutely positioned over the image footprint */}
            {isPlaying && trailerKey && (
              <iframe
                className="absolute inset-0 w-full h-full border-0 z-10"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
            
            {/* Play Button Overlay */}
            {!isPlaying && trailerKey && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }}
                  className="w-16 h-16 bg-black/50 hover:bg-purple-600/80 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-all group shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                >
                  <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[14px] border-l-white relative left-1 group-hover:scale-110 transition-transform"></div>
                </button>
              </div>
            )}
            
            {/* Gradient overlay hiding right edge to blend into content */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#121214] pointer-events-none z-20"></div>
            )}
          </div>

          {/* Wrapper for right side Content */}
          <div className="w-full md:w-1/2 flex flex-col relative max-h-[60vh] md:max-h-full">
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10 z-30"
            >
              ✕
            </button>

            {/* Scrollable Content Section */}
            <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1">
              
              <h2 className="text-3xl md:text-4xl font-extrabold mb-2 pr-10 text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                {movie.title || movie.name}
              </h2>
              
              <div className="flex items-center gap-4 mb-6 text-sm font-medium text-purple-300 bg-purple-500/10 w-fit px-3 py-1 rounded-full border border-purple-500/20">
                <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                <span>•</span>
                <span>{movie.release_date ? movie.release_date.substring(0,4) : movie.first_air_date ? movie.first_air_date.substring(0,4) : 'Unknown'}</span>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-8 shrink-0">
                {movie.overview || "No overview available for this title."}
              </p>

              {/* Reviews Section */}
              <div className="mt-4 border-t border-white/10 pt-6 shrink-0">
                <h3 className="text-xl font-bold text-white mb-4">User Reviews</h3>
                
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4 mb-3">
                      <label className="text-gray-300 text-sm font-medium">Your Rating:</label>
                      <select 
                        value={newReview.rating} 
                        onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                        className="bg-black text-white p-1 rounded border border-white/20 outline-none focus:border-purple-500"
                      >
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                      </select>
                    </div>
                    <textarea 
                      value={newReview.text}
                      onChange={e => setNewReview({...newReview, text: e.target.value})}
                      placeholder="Write a review..."
                      className="w-full bg-black/50 text-white p-3 rounded-lg border border-white/10 focus:border-purple-500 outline-none resize-none mb-3 h-20"
                      required
                    />
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting..." : "Post Review"}
                    </button>
                  </form>
                ) : (
                  <p className="text-gray-500 text-sm mb-6 bg-white/5 p-4 rounded-xl border border-white/5 text-center">Sign in to leave a review.</p>
                )}

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 italic text-sm text-center py-4">No reviews yet. Be the first!</p>
                  ) : (
                    reviews.map(rev => (
                      <div key={rev._id} className="bg-white/5 p-4 rounded-xl border border-white/5 relative group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-purple-300">{rev.userName}</span>
                          <span className="text-yellow-400 text-sm">{"★".repeat(rev.rating)}<span className="text-gray-600">{"★".repeat(5-rev.rating)}</span></span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{rev.reviewText}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Static Footer for Watchlist Button */}
            {onSave && (
              <div className="p-6 md:p-8 bg-[#121214] border-t border-white/10 shrink-0">
                <button
                  onClick={onSave}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 font-bold rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white"
                >
                  + Add to Watchlist
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieModal;
