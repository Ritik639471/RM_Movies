import React, { useEffect, useState, useContext } from "react";
import MovieCard from "../components/MovieCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { WatchlistContext } from "../contexts/WatchlistContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Home = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  
  const [filterGenre, setFilterGenre] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  
  const { watchlist } = useContext(WatchlistContext);

  // Fetch Recommended Movies based on watchlist
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!watchlist || watchlist.length === 0) {
        setRecommendations([]);
        return;
      }
      // Get the most recently added movie
      const lastMovie = watchlist[watchlist.length - 1];
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${lastMovie.movieId}/recommendations?api_key=${API_KEY}`);
        const data = await res.json();
        if (data.results) {
          setRecommendations(data.results.slice(0, 5)); // Show top 5
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecommendations();
  }, [watchlist]);

  const fetchMovies = async () => {
    setIsSearching(true);
    try {
      let endpoint = "";
      if (query.trim()) {
        endpoint = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
      } else {
        endpoint = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}`;
        if (filterGenre) endpoint += `&with_genres=${filterGenre}`;
        if (filterYear) endpoint += `&primary_release_year=${filterYear}`;
      }
      
      const res = await fetch(endpoint);
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB limits to 500 pages
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, sortBy, filterGenre, filterYear]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies();
  };

  return (
    <motion.main
      className="p-6 md:p-10 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center mb-16 mt-8">
        <motion.h1 
          className="text-5xl md:text-7xl font-black text-center mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Discover Your Next <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Favorite Story</span>
        </motion.h1>
        
        <motion.form
          onSubmit={handleSearch}
          className="w-full max-w-2xl relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex bg-[#121214] border border-white/10 rounded-2xl overflow-hidden glass-panel">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies, TV shows..."
                className="w-full bg-transparent p-5 pl-6 text-lg text-white placeholder-gray-500 outline-none"
              />
              <button
                type="submit"
                className="px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 font-bold text-white transition-opacity"
              >
                Search
              </button>
            </div>
          </div>
        </motion.form>

        {/* Filters */}
        {!query.trim() && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-4 mt-6"
          >
            <select value={sortBy} onChange={e => {setSortBy(e.target.value); setPage(1);}} className="bg-[#121214] text-white/80 p-3 rounded-xl border border-white/10 outline-none focus:border-purple-500 transition-colors cursor-pointer hover:bg-white/5">
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Top Rated</option>
              <option value="primary_release_date.desc">Newest Releases</option>
            </select>
            
            <select value={filterGenre} onChange={e => {setFilterGenre(e.target.value); setPage(1);}} className="bg-[#121214] text-white/80 p-3 rounded-xl border border-white/10 outline-none focus:border-purple-500 transition-colors cursor-pointer hover:bg-white/5">
              <option value="">All Genres</option>
              <option value="28">Action</option>
              <option value="35">Comedy</option>
              <option value="18">Drama</option>
              <option value="14">Fantasy</option>
              <option value="27">Horror</option>
              <option value="10749">Romance</option>
              <option value="878">Sci-Fi</option>
              <option value="53">Thriller</option>
            </select>

            <select value={filterYear} onChange={e => {setFilterYear(e.target.value); setPage(1);}} className="bg-[#121214] text-white/80 p-3 rounded-xl border border-white/10 outline-none focus:border-purple-500 transition-colors cursor-pointer hover:bg-white/5">
              <option value="">Any Year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </motion.div>
        )}
      </div>

      {recommendations.length > 0 && !query.trim() && page === 1 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">Recommended For You</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendations.map((movie) => (
              <motion.div key={`rec-${movie.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white border-l-4 border-pink-500 pl-4">
          {query.trim() ? `Search Results for "${query}"` : "Trending Now"}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div key="loading" className="flex justify-center items-center py-20" exit={{ opacity: 0 }}>
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial="hidden" animate="show" exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {movies.map((movie) => (
              <motion.div key={movie.id} variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}>
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isSearching && movies.length > 0 && (
        <div className="mt-16 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </motion.main>
  );
};

export default Home;
