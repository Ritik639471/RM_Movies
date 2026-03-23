import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { WatchlistProvider } from "./contexts/WatchlistContext.jsx";

import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import MoviePage from "./pages/MoviePage.jsx";
import "./index.css"; // Ensure your styles are imported

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <BrowserRouter>
          {/* Global Animated Background */}
          <div className="fixed inset-0 -z-50 overflow-hidden bg-[#09090b]">
            <motion.div
              className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, #4c1d95, transparent)" }}
              animate={{ x: [0, 50, -30, 0], y: [0, 30, -50, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, #be185d, transparent)" }}
              animate={{ x: [0, -40, 20, 0], y: [0, -40, 30, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
              className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-15 pointer-events-none"
              style={{ background: "radial-gradient(circle, #1d4ed8, transparent)" }}
              animate={{ x: [0, 30, -20, 0], y: [0, -50, 20, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />
            {/* Subtle noise overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
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
