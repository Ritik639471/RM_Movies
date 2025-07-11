import React, { useContext, useState } from "react";
import { WatchlistContext } from "../contexts/WatchlistContext";
import MovieModal from "./MovieModal";

const MovieCard = ({ movie, onRemove }) => {
  const { addToWatchlist } = useContext(WatchlistContext);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = () => {
    if (!onRemove) {
      setShowModal(true);
    }
  };

  const handleSave = () => {
    addToWatchlist(movie);
    setShowModal(false);
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Image";

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`bg-white rounded shadow flex flex-col ${
          !onRemove ? "hover:shadow-lg cursor-pointer" : ""
        }`}
      >
        <img src={posterUrl} alt={movie.title} className="w-full rounded-t" />
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold mt-2 flex-grow">{movie.title}</h2>
          {onRemove && (
            <button
              onClick={() => onRemove(movie.id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded w-full"
            >
              Remove
            </button>
          )}
        </div>
      </div>

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
