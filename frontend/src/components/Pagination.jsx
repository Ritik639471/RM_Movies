import React from "react";
import { motion } from "framer-motion";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center my-8 space-x-6 glass-panel px-8 py-4 rounded-full w-fit mx-auto">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors font-semibold px-4 py-2 hover:bg-white/5 rounded-full"
      >
        ← Previous
      </button>
      
      <div className="flex items-center space-x-2 font-medium">
        <span className="text-white text-lg">{currentPage}</span>
        <span className="text-gray-500">/</span>
        <span className="text-gray-400">{totalPages}</span>
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors font-semibold px-4 py-2 hover:bg-white/5 rounded-full"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
