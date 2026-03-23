import React, { useContext, useState } from "react";
import { WatchlistContext } from "../contexts/WatchlistContext";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import MovieCard from "../components/MovieCard";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useContext(WatchlistContext);
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('plan_to_watch');

  if (!user) {
    return (
      <motion.main
        className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="glass-panel p-12 rounded-3xl text-center max-w-lg">
          <h2 className="text-3xl font-bold mb-4 text-white">Oops!</h2>
          <p className="text-gray-400 mb-6">You need to be signed in to view and manage your watchlist.</p>
        </div>
      </motion.main>
    );
  }

  const displayedWatchlist = watchlist.filter(movie => (movie.status || 'plan_to_watch') === activeTab);

  return (
    <motion.main
      className="p-6 md:p-10 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <div>
          <motion.h2
            className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 140 }}
          >
            My Watchlist
          </motion.h2>
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Your curated collection of movies and shows.
          </motion.p>
        </div>
        
        {/* Tabs */}
        <motion.div
          className="flex bg-[#121214] p-1 rounded-2xl border border-white/10 self-start md:self-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <motion.button 
            onClick={() => setActiveTab('plan_to_watch')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'plan_to_watch' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Plan to Watch
          </motion.button>
          <motion.button 
            onClick={() => setActiveTab('watched')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'watched' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Watched
          </motion.button>
        </motion.div>
      </motion.div>

      {displayedWatchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
          <span className="text-6xl mb-4 opacity-50">{activeTab === 'watched' ? '✅' : '🍿'}</span>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">
            {activeTab === 'watched' ? 'No watched movies yet' : 'Your watchlist is empty'}
          </h3>
          <p className="text-gray-500">
            {activeTab === 'watched' ? 'Mark some movies as watched to see them here!' : 'Start exploring and save some titles for later!'}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          initial="hidden" animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {displayedWatchlist.map((movie) => (
            <motion.div key={movie.movieId || movie.id} variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}>
              <MovieCard movie={movie} onRemove={removeFromWatchlist} isActiveTab={activeTab} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.main>
  );
};

export default Watchlist;
