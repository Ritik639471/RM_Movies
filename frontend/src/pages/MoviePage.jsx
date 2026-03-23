import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { WatchlistContext } from "../contexts/WatchlistContext";
import { AuthContext } from "../contexts/AuthContext";
import MovieCard from "../components/MovieCard";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addToWatchlist } = useContext(WatchlistContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsPlaying(false);
    
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        // Fetch Movie Details
        const detailRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
        const detailData = await detailRes.json();
        setMovie(detailData);

        // Fetch Trailer
        const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
        const videoData = await videoRes.json();
        if (videoData.results) {
          const trailer = videoData.results.find(vid => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser"));
          if (trailer) setTrailerKey(trailer.key);
        }

        // Fetch Recommendations
        const recRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}`);
        const recData = await recRes.json();
        if (recData.results) {
          setRecommendations(recData.results.slice(0, 10)); // Top 10 recommendations
        }
      } catch (err) {
        console.error("Failed to fetch movie data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie || movie.success === false) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <h2 className="text-2xl font-bold">Movie not found</h2>
      </div>
    );
  }

  const posterUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/1280x720?text=No+Image";

  return (
    <motion.main
      className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen pt-24"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Movie Details Hero Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden glass-panel flex flex-col md:flex-row shadow-[0_0_50px_rgba(168,85,247,0.15)] bg-[#121214] mb-16">
        
        {/* Left Side: Trailer / Media Focus */}
        <div className="w-full md:w-3/5 h-[400px] md:h-[600px] relative bg-black shrink-0 flex">
          <img 
            src={posterUrl} 
            alt={movie.title} 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
          />
          
          {isPlaying && trailerKey && (
            <iframe
              className="absolute inset-0 w-full h-full border-0 z-10"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          
          {!isPlaying && trailerKey && (
            <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer" onClick={() => setIsPlaying(true)}>
              {/* Play Button */}
              <button className="w-20 h-20 bg-black/50 group-hover:bg-purple-600/80 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)]">
                <div className="w-0 h-0 border-y-[12px] border-y-transparent border-l-[20px] border-l-white relative left-1 group-hover:scale-110 transition-transform"></div>
              </button>
            </div>
          )}

          {!isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#121214] pointer-events-none z-20"></div>
          )}
        </div>

        {/* Right Side: Information Details */}
        <div className="w-full md:w-2/5 flex flex-col p-8 md:p-12 relative z-30">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-medium">
            <span className="text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.2)]">
              ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </span>
            <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full">{movie.release_date?.substring(0,4)}</span>
            <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full">{movie.runtime} min</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="text-xs font-bold text-white uppercase tracking-wider bg-purple-600/50 px-3 py-1.5 rounded-md border border-purple-500/30">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-1">
            {movie.overview || "No synopsis available."}
          </p>

          <div className="mt-auto">
            {user ? (
               <button
                 onClick={() => addToWatchlist(movie)}
                 className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white text-lg"
               >
                 + Add to Watchlist
               </button>
            ) : (
                <p className="text-gray-400 text-center bg-white/5 p-4 rounded-xl border border-white/10">
                  Sign in to add this to your watchlist.
                </p>
            )}
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      {recommendations.length > 0 && (
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <motion.span
              className="block w-1 h-8 rounded-full bg-gradient-to-b from-pink-400 to-purple-600"
              animate={{ scaleY: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Similar Movies You Might Like
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendations.map((rec, i) => (
              <motion.div key={rec.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}>
                <MovieCard movie={rec} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.main>
  );
};

export default MoviePage;
