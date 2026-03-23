import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-black/70 backdrop-blur-md shadow-lg" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <span className="text-4xl">🎬</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">RM</span>
            Movies
          </Link>
          <nav className="flex space-x-8 items-center font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-purple-400 ${
                location.pathname === "/" ? "text-purple-400 font-semibold" : "text-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              to="/watchlist"
              className={`transition-colors hover:text-pink-400 ${
                location.pathname === "/watchlist" ? "text-pink-400 font-semibold" : "text-gray-300"
              }`}
            >
              Watchlist
            </Link>
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
                <span className="text-gray-200">Hi, <span className="text-purple-400 font-semibold">{user.name}</span></span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-gray-300 rounded-lg transition-all border border-white/10 hover:border-red-500/50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="ml-4 px-6 py-2 bg-white/10 hover:bg-purple-600/30 text-white rounded-lg transition-all border border-white/20 hover:border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0)] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>
      {/* Spacer to prevent content hiding under fixed header */}
      <div className="h-24"></div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Header;
