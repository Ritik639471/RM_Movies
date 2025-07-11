import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { signIn, logout } from "../firebase";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="flex justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">🎬RM Movie Info</h1>
      <nav className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/watchlist">Watchlist</Link>
        {user ? (
          <>
            <span>{user.displayName}</span>
            <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <button onClick={signIn} className="bg-green-500 px-2 py-1 rounded">
            Login with Google
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
