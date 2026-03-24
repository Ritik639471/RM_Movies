import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { WatchlistProvider } from "./contexts/WatchlistContext.jsx";

import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import MoviePage from "./pages/MoviePage.jsx";
import Squares from "./components/bits/Squares.jsx";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <BrowserRouter>
          <div className="fixed inset-0 -z-50 bg-[#060608]">
            <Squares 
              direction="diagonal"
              speed={0.3}
              squareSize={40}
              borderColor="#ffffff08"
              hoverFillColor="#ffffff05"
            />
            {/* Soft Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-pink-900/10 pointer-events-none" />
          </div>
          
          <Header />
          <main className="relative z-0 min-h-screen">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/movie/:id" element={<MoviePage />} />
              </Routes>
            </AnimatePresence>
          </main>
        </BrowserRouter>
      </WatchlistProvider>
    </AuthProvider>
  );
}

