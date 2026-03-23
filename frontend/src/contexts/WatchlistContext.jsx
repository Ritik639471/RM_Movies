import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const WatchlistContext = createContext();

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/watchlist` : "http://localhost:5000/api/watchlist";

export const WatchlistProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user || !token) {
        setWatchlist([]);
        return;
      }
      try {
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setWatchlist(data);
      } catch (err) {
        console.error("Failed to fetch watchlist", err);
      }
    };
    fetchWatchlist();
  }, [user, token]);

  const addToWatchlist = async (movie) => {
    if (!token) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId: movie.id.toString(),
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average
        })
      });
      const data = await res.json();
      if (res.ok) {
        setWatchlist((prev) => [...prev, data]);
      }
    } catch (err) {
      console.error("Error adding to watchlist", err);
    }
  };

  const updateWatchlistStatus = async (id, status) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setWatchlist((prev) => prev.map((m) => m.movieId === updated.movieId ? updated : m));
      }
    } catch (err) {
      console.error("Error updating watchlist status", err);
    }
  };

  const removeFromWatchlist = async (id) => {
    // id could be TMDB id or MongoDB _id, assuming TMDB id for frontend matching
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setWatchlist((prev) => prev.filter((m) => m.movieId !== id.toString()));
      }
    } catch (err) {
      console.error("Error removing from watchlist", err);
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, updateWatchlistStatus }}>
      {children}
    </WatchlistContext.Provider>
  );
};
