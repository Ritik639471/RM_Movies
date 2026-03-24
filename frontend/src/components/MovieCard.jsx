import React, { useContext, useState, memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { WatchlistContext } from "../contexts/WatchlistContext";
import MovieModal from "./MovieModal";
import SpotlightCard from "./bits/SpotlightCard";

const MovieCard = memo(({ movie, onRemove, isActiveTab }) => {
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
      <SpotlightCard className="rounded-2xl shadow-xl shadow-purple-500/5">
        <motion.div
          whileHover={{ y: -5, scale: 1.01 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleCardClick}
          className="relative group rounded-2xl overflow-hidden glass-panel flex flex-col cursor-pointer h-full border border-white/5 active:scale-[0.98] transition-transform"
        >
          <div className="relative aspect-[2/3] overflow-hidden">
            <img 
              src={posterUrl} 
              alt={movie.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <p className="text-white text-[13px] leading-relaxed line-clamp-4 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                {movie.overview || 'No synopsis available.'}
              </p>
              <div className="flex items-center gap-2 text-purple-300 text-sm font-bold transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                <span className="bg-purple-500/20 px-2 py-0.5 rounded backdrop-blur-md border border-purple-500/20">
                  ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-4 flex flex-col flex-grow bg-[#121214]/80 backdrop-blur-md">
            <Link 
              to={`/movie/${movie.id || movie.movieId}`} 
              onClick={(e) => e.stopPropagation()}
              className="text-[17px] font-bold truncate text-white mb-2 hover:text-purple-400 transition-colors w-full block tracking-tight"
            >
              {movie.title || movie.name}
            </Link>
            {onRemove && (
              <div className="mt-auto flex flex-col gap-2">
                {isActiveTab === 'plan_to_watch' ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); updateWatchlistStatus(movie.movieId, 'watched'); }}
                    className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/80 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-lg transition-all text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-1"
                  >
                    ✓ Mark Watched
                  </button>
                ) : isActiveTab === 'watched' ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); updateWatchlistStatus(movie.movieId, 'plan_to_watch'); }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 rounded-lg transition-all text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-1"
                  >
                    ↩ Move to Plan
                  </button>
                ) : null}
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(movie.id || movie.movieId); }}
                  className="w-full py-2 bg-red-500/10 hover:bg-red-500/80 text-red-400 hover:text-white border border-red-500/20 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </SpotlightCard>

      {!onRemove && showModal && (
        <MovieModal
          movie={movie}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
});

export default MovieCard;
