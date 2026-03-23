# 🎬 CineVault — Full-Stack Movie Discovery App ([App](https://vault-cine.netlify.app))

CineVault is a feature-rich, full-stack web application built on the **MERN Stack** (MongoDB, Express.js, React, Node.js) that lets users discover, track, and review movies using live data from the **TMDB API**. It supports user authentication, personalized watchlists, YouTube trailer playback, community reviews, and intelligent recommendations.

---

## ✨ Features

### 🔍 Dynamic Movie Search & Discovery
Users can search for any movie by title using TMDB's extensive database. As they type a query and hit Search, the app fetches live results from the TMDB Search API and displays them in a responsive, animated movie grid. When no search query is entered, the app automatically shows the current **Trending Movies** pulled from TMDB's trending endpoint, so there is always fresh content to discover without needing to search.

---

### 🎛️ Advanced Sorting & Filtering
When browsing the default trending feed (no search active), three filter/sort dropdowns appear below the search bar:
- **Sort By:** Choose between Most Popular, Top Rated, or Newest Releases. This uses TMDB's `/discover/movie` endpoint with various `sort_by` parameters.
- **Genre Filter:** Narrow results to a specific genre such as Action, Comedy, Drama, Fantasy, Horror, Romance, Sci-Fi, or Thriller. Each option uses the official TMDB genre ID.
- **Year Filter:** Limit results to movies released in a specific year (2020–2024). All three filters work together simultaneously and update the grid instantly without needing a page refresh.

---

### 🎯 Personalized Recommendations
When a user is logged in and has movies saved in their watchlist, a **"Recommended For You"** section automatically appears at the top of the home page above the Trending feed. The app picks the most recently added movie from the user's watchlist and queries TMDB's `/movie/{id}/recommendations` endpoint to retrieve a curated list of similar titles. This gives each user a tailored discovery experience based on what they already love.

---

### 🎥 Movie Details Modal with Embedded YouTube Trailers
Clicking on any movie poster opens a rich detail modal overlay without leaving the page. The modal displays:
- **High-resolution backdrop image** of the movie
- **Title, year, and TMDB Rating** in a styled badge
- **Full plot synopsis** pulled from TMDB
- **Embedded YouTube Trailer** — The app queries TMDB's `/videos` endpoint to find an official Trailer or Teaser on YouTube. A glowing **Play button** appears on top of the poster; clicking it fades in a full YouTube `<iframe>` player directly inside the modal so the user can watch the trailer without opening a new tab or leaving the page.

---

### 💾 Secure User Authentication
The app uses a completely custom-built authentication system with no third-party auth services:
- **Registration:** Users sign up with their name, email, and password. Passwords are hashed using `bcryptjs` before being stored in MongoDB — raw passwords are never saved.
- **Login:** Credentials are verified against the stored hash. On success, a signed **JSON Web Token (JWT)** is returned and stored in `localStorage`.
- **Persistent Sessions:** When a user visits the app again, the stored token is loaded automatically, keeping them logged in without needing to sign in again.
- **Protected Routes:** All watchlist and review API endpoints verify the JWT on every request using Express middleware, so only authenticated users can mutate data.

---

### 🎬 Personal Watchlist
Every authenticated user has their own private watchlist stored in MongoDB. From any movie's detail modal, they can click **"+ Add to Watchlist"** to save a movie. The Watchlist page shows all saved titles in the familiar responsive grid layout and supports one-click removal. The entire watchlist is fetched fresh from the database on every login, so it stays in sync across multiple devices.

---

### ✅ Watch Status Tracking — "Plan to Watch" vs "Watched"
The Watchlist page features a **tab switcher** that organizes movies into two buckets:
- **Plan to Watch** — Movies saved but not yet seen. Each card shows a green **"✓ Mark Watched"** button.
- **Watched** — Movies the user has already seen. Each card shows a grey **"↩ Move to Plan"** button to revert it.

Clicking a status button sends a `PUT` request to the backend which updates the movie's `status` field in the database. The UI updates instantly with no page reload required, giving a smooth and satisfying tracking experience.

---

### ⭐ Community Reviews & Ratings
Inside every movie detail modal, there is a full **User Reviews section** below the synopsis:
- **Viewing Reviews:** Any visitor (logged in or not) can read all community reviews for a movie, sorted from newest to oldest. Each review shows the reviewer's username, their star rating (1–5 stars), and their written thoughts.
- **Writing a Review:** Logged-in users see a review form with a star rating dropdown and a text area. Submitting the form sends a POST request to the backend which saves the review to MongoDB tied to their account. If the user has already reviewed that movie, the form intelligently **upserts** (updates the existing review) instead of creating a duplicate.
- **Persisted & Real-time:** Reviews are stored in MongoDB and loaded fresh every time the modal opens, so everyone sees the latest community feedback in real time.

---

### ✨ Premium UI & Animations
The entire interface is designed to feel premium and responsive:
- All page transitions and content loads use **Framer Motion** animations with staggered card reveals, smooth spring transitions, and fade effects.
- The UI uses a dark **glassmorphism** design system with gradient text, frosted panels, and glowing purple/pink accent colors.
- Movie cards have hover scale effects and a sliding synopsis overlay.
- All buttons have subtle hover animations and active states.

---

## 📂 Project Structure

```
CineVault/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # MovieCard, MovieModal, Pagination, etc.
│   │   ├── contexts/         # AuthContext, WatchlistContext (global state)
│   │   ├── pages/            # Home, Watchlist
│   │   ├── App.jsx           # Router setup
│   │   └── index.css         # Tailwind CSS + Global Styles
│   ├── .env                  # VITE_TMDB_API_KEY, VITE_API_URL
│   └── package.json
│
├── backend/                  # Node.js + Express REST API
│   ├── models/
│   │   ├── User.js           # Auth schema (name, email, hashed password)
│   │   ├── Watchlist.js      # Watchlist schema (userId, movieId, status)
│   │   └── Review.js         # Reviews schema (userId, rating, reviewText)
│   ├── .env                  # PORT, MONGO_URI, JWT_SECRET
│   ├── server.js             # All API route handlers
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Tokens (JWT) + bcryptjs |
| Movie Data | TMDB API (The Movie Database) |
| Trailers | YouTube IFrame embed via TMDB video endpoint |

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js v18 or later
- A free [TMDB API key](https://developer.themoviedb.org/docs/getting-started)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier works fine)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/CineVault.git
cd CineVault
```

### 2. Configure Environment Variables

**Frontend** — create `frontend/.env`:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_API_URL=http://localhost:5000
```

**Backend** — create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_secret_string
```
> ⚠️ If your MongoDB Atlas password contains special characters like `@`, URL-encode them (e.g., `@` becomes `%40`) in the connection string.

### 3. Install & Run

Open **two separate terminals**.

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run start
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The app will be live at `http://localhost:5173`!

---

## 📦 Deployment Guide

Since the app uses a custom Node.js backend, the deployment is split across two hosting platforms.

### Step 1: Deploy the Backend to Render (Free)
1. Go to [render.com](https://render.com) and create a free account.
2. Click **New > Web Service** and connect your GitHub repository.
3. Set the **Root Directory** to `backend`.
4. Set the **Build Command** to `npm install` and **Start Command** to `node server.js`.
5. In the **Environment Variables** section, add:
   - `MONGO_URI` — your Atlas connection string
   - `JWT_SECRET` — your secret key
6. Click **Deploy**. Once done, copy your live URL (e.g. `https://cinevault-api.onrender.com`).

### Step 2: Deploy the Frontend to Netlify
1. Go to your existing [Netlify](https://netlify.com) site dashboard.
2. Under **Site Configuration > Environment Variables**, add:
   - `VITE_TMDB_API_KEY` — your TMDB key
   - `VITE_API_URL` — the Render URL from Step 1 (e.g. `https://cinevault-api.onrender.com`)
3. Under **Build Settings**, set the **Base Directory** to `frontend` and **Build Command** to `npm run build`.
4. Trigger a redeploy. Your site will now talk to the live production backend!

---

## 📜 License
This project is open-source and built for learning purposes.