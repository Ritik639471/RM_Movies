import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { motion } from "framer-motion";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Home = () => {
  const [query, setQuery] = useState("spiderman");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
    );
    const data = await res.json();
    setMovies(data.results || []);
    setTotalPages(data.total_pages);
  };

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies();
  };

  return (
    <motion.main
      className="p-4 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <form
        onSubmit={handleSearch}
        className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="border p-3 rounded w-full sm:w-1/2"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </motion.main>
  );
};

export default Home;
