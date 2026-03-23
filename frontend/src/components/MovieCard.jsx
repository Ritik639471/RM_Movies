import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { WatchlistContext } from "../contexts/WatchlistContext";
import MovieModal from "./MovieModal";

const MovieCard = ({ movie, onRemove, isActiveTab }) => {
  const { addToWatchlist, updateWatchlistStatus } = useContext(WatchlistContext);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = () => {
    if (!onRemove) setShowModal(true);
  };

  const handleSave = () => {
    addToWatchlist(movie);
    setShowModal(false);
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <>
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleCardClick}
        className="relative group rounded-2xl overflow-hidden glass-panel flex flex-col cursor-pointer"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p className="text-white text-sm line-clamp-3 mb-2">{movie.overview || 'No synopsis available.'}</p>
            <div className="flex items-center gap-2 text-purple-300 text-sm font-semibold">
              <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-grow bg-black/40">
          <h2 className="text-lg font-bold truncate text-white mb-2">{movie.title || movie.name}</h2>
          {onRemove && (
            <div className="mt-auto flex flex-col gap-2">
              {isActiveTab === 'plan_to_watch' ? (
                <button
                  onClick={(e) => { e.stopPropagation(); updateWatchlistStatus(movie.movieId, 'watched'); }}
                  className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/80 text-emerald-200 hover:text-white border border-emerald-500/50 rounded-lg transition-all text-sm font-semibold flex justify-center items-center gap-1"
                >
                  ✓ Mark Watched
                </button>
              ) : isActiveTab === 'watched' ? (
                <button
                  onClick={(e) => { e.stopPropagation(); updateWatchlistStatus(movie.movieId, 'plan_to_watch'); }}
                  className="w-full py-2 bg-gray-500/20 hover:bg-gray-500/80 text-gray-200 hover:text-white border border-gray-500/50 rounded-lg transition-all text-sm font-semibold flex justify-center items-center gap-1"
                >
                  ↩ Move to Plan
                </button>
              ) : null}
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(movie.id || movie.movieId); }}
                className="w-full py-2 bg-red-500/20 hover:bg-red-500/80 text-red-200 hover:text-white border border-red-500/50 rounded-lg transition-all text-sm font-semibold"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {!onRemove && showModal && (
        <MovieModal
          movie={movie}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default MovieCard;
