import React, { useContext } from "react";
import { WatchlistContext } from "../contexts/WatchlistContext";
import { motion } from "framer-motion";
import MovieCard from "../components/MovieCard";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useContext(WatchlistContext);

  return (
    <motion.main
      className="p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-2xl font-bold mb-4">My Watchlist</h2>

      {watchlist.length === 0 ? (
        <p>You have no movies saved.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRemove={removeFromWatchlist}
            />
          ))}
        </div>
      )}
    </motion.main>
  );
};

export default Watchlist;
