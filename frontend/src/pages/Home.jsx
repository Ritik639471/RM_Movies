import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import MovieCard from "../components/MovieCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { WatchlistContext } from "../contexts/WatchlistContext";
import SplitText from "../components/bits/SplitText";
import Squares from "../components/bits/Squares";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Home = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  
  const [filterGenre, setFilterGenre] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  
  const { watchlist } = useContext(WatchlistContext);
  const searchTimeout = useRef(null);

  // Debounce search query
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms debounce

    return () => clearTimeout(searchTimeout.current);
  }, [query]);

  // Fetch Recommended Movies based on watchlist
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!watchlist || watchlist.length === 0) {
        setRecommendations([]);
        return;
      }
      const lastMovie = watchlist[watchlist.length - 1];
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${lastMovie.movieId}/recommendations?api_key=${API_KEY}`);
        const data = await res.json();
        if (data.results) {
          setRecommendations(data.results.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecommendations();
  }, [watchlist]);

  const fetchMovies = useCallback(async () => {
    setIsSearching(true);
    try {
      let endpoint = "";
      if (debouncedQuery.trim()) {
        endpoint = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${debouncedQuery}&page=${page}`;
      } else {
        endpoint = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}`;
        if (filterGenre) endpoint += `&with_genres=${filterGenre}`;
        if (filterYear) endpoint += `&primary_release_year=${filterYear}`;
      }
      
      const res = await fetch(endpoint);
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }, [debouncedQuery, page, sortBy, filterGenre, filterYear]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setDebouncedQuery(query);
  };

  return (
    <motion.main
      className="p-6 md:p-10 max-w-7xl mx-auto relative min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Squares 
        direction="diagonal"
        speed={0.5}
        squareSize={40}
        borderColor="#ffffff10"
        hoverFillColor="#ffffff05"
      />

      {/* ── Hero Section ── */}
      <div className="flex flex-col items-center justify-center mb-16 mt-8 relative">
        {/* Animated headline — words stagger in */}
        <div className="text-5xl md:text-7xl font-black text-center mb-6 tracking-tight leading-tight">
          <SplitText 
            text="Discover Your Next"
            className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500"
            delay={0.1}
          />
          <br />
          <SplitText 
            text="Favorite Story"
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-600"
            delay={0.5}
            initial={{ y: 40, opacity: 0, filter: 'blur(10px)' }}
          />
        </div>

        {/* Animated subtitle */}
        <motion.p
          className="text-gray-400 text-lg mb-8 text-center max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Millions of movies. Personalized for you. All in one vault.
        </motion.p>

        {/* Search form */}
        <motion.form
          onSubmit={handleSearch}
          className="w-full max-w-2xl relative"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
        >
          <div className="relative group">
            {/* Glow border */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-500"
              animate={{ opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex bg-[#121214]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full bg-transparent p-5 pl-6 text-lg text-white placeholder-gray-500 outline-none"
              />
              <motion.button
                type="submit"
                className="px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-white relative overflow-hidden"
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSearching ? "..." : "Search"}
              </motion.button>
            </div>
          </div>
        </motion.form>

        {/* Filters */}
        {!query.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
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
          <motion.h2
            className="text-3xl font-bold text-white mb-6 flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-1 h-8 rounded-full bg-purple-500" />
            Recommended For You
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendations.map((movie, i) => (
              <MovieCard key={`rec-${movie.id}`} movie={movie} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-pink-500" />
          {debouncedQuery.trim() ? `Results for "${debouncedQuery}"` : "Trending Now"}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
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
