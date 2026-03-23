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

const GlassBackground = React.memo(() => {
  const ballData = React.useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => ({
      size: Math.random() * 600 + 400,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#db2777" : "#4f46e5",
      opacity: Math.random() * 0.12 + 0.08
    })), []);

  const shardData = React.useMemo(() => 
    Array.from({ length: 8 }).map(() => ({
      width: Math.random() * 300 + 200,
      height: Math.random() * 400 + 300,
      left: Math.random() * 100,
      top: Math.random() * 100,
      rotate: Math.random() * 360,
    })), []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#020203]">
      {/* Soft Glows */}
      {ballData.map((ball, i) => (
        <motion.div
          key={`ball-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: ball.size,
            height: ball.size,
            background: `radial-gradient(circle, ${ball.color}, transparent)`,
            left: `${ball.left}%`,
            top: `${ball.top}%`,
            filter: 'blur(100px)',
            opacity: ball.opacity,
          }}
          animate={{ x: [0, 80, -80, 0], y: [0, -60, 60, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: Math.random() * 20 + 20, repeat: Infinity, ease: "easeInOut", delay: Math.random() * -20 }}
        />
      ))}

      {/* Glass Shards */}
      {shardData.map((shard, i) => (
        <motion.div
          key={`shard-${i}`}
          className="absolute bg-white/[0.03] backdrop-blur-[2px] border border-white/5 pointer-events-none"
          style={{
            width: shard.width,
            height: shard.height,
            left: `${shard.left}%`,
            top: `${shard.top}%`,
            rotate: shard.rotate,
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
          }}
          animate={{ 
            x: [0, -50, 50, 0], 
            y: [0, 100, -100, 0], 
            rotate: [shard.rotate, shard.rotate + 20, shard.rotate - 20, shard.rotate],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: Math.random() * 30 + 30, repeat: Infinity, ease: "linear" }}
        />
      ))}

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
    </div>
  );
});

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
