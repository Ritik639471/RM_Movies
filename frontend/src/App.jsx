import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { WatchlistProvider } from "./contexts/WatchlistContext.jsx";

import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import MoviePage from "./pages/MoviePage.jsx";
import "./index.css"; // Ensure your styles are imported

const GlassBackground = () => {
  const balls = Array.from({ length: 20 });
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#050505]">
      {balls.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[80px] opacity-20 pointer-events-none transition-colors"
          style={{
            width: Math.random() * 400 + 100,
            height: Math.random() * 400 + 100,
            background: i % 2 === 0 ? "radial-gradient(circle, #7c3aed, transparent)" : "radial-gradient(circle, #db2777, transparent)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
        />
      ))}
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <BrowserRouter>
          <GlassBackground />
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
