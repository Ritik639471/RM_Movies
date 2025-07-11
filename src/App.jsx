import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { WatchlistProvider } from "./contexts/WatchlistContext.jsx";

import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import "./index.css"; // Ensure your styles are imported

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <BrowserRouter>
          <Header />
          <main>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watchlist" element={<Watchlist />} />
              </Routes>
            </AnimatePresence>
          </main>
        </BrowserRouter>
      </WatchlistProvider>
    </AuthProvider>
  );
}
