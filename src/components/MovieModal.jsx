import React from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

const MovieModal = ({ movie, onClose, onSave }) => {
  return ReactDOM.createPortal(
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        exit={{ y: -100 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">{movie.title}</h2>
        <p>{movie.overview}</p>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add to Watchlist
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.getElementById("modal-root")
  );
};

export default MovieModal;
