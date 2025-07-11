import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { AuthContext } from "./AuthContext";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (!user) {
        setWatchlist([]);
        return;
      }
      const colRef = collection(db, "users", user.uid, "watchlist");
      const snapshot = await getDocs(colRef);
      setWatchlist(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetch();
  }, [user]);

  const addToWatchlist = async (movie) => {
    const docRef = await addDoc(collection(db, "users", user.uid, "watchlist"), movie);
    setWatchlist((prev) => [...prev, { id: docRef.id, ...movie }]);
  };

  const removeFromWatchlist = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "watchlist", id));
    setWatchlist((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
