# 🎬 RM Movie Info App

A responsive movie search and info web app built with **React**, **TMDB API**, **Firebase Auth**, and **Framer Motion**.

## 🚀 Features

- 🔍 **Search Movies:** Search for movies via TMDB’s free API.
- 🎞️ **Responsive Grid:** 2–4 cards per row, works on all devices.
- 💾 **Watchlist:** Google login with Firebase to save personal watchlists.
- ⏭️ **Pagination:** Navigate through multiple pages of results.
- ✨ **Smooth Animations:** Page transitions and UI animations with Framer Motion.

## 📂 Tech Stack

- **React 19**
- **Vite**
- **Firebase Auth & Firestore**
- **TMDB API**
- **Tailwind CSS**
- **Framer Motion**

## 🔑 Environment Variables

Create a `.env` file at the root:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```
🛠️ Setup
bash
Copy
Edit
# Install dependencies
npm install

# Start dev server
npm run dev

🔐 Firebase Auth
Uses Google Login.

Stores watchlists in Firestore 

📦 Deployment
Push to GitHub.

Connect repo to Netlify.

Add your .env variables in Netlify → Site Settings → Environment Variables.

Deploy!

✨ Netlify Deployed site
https://rmmovies.netlify.app/

📜 License
This project is open-source for learning purposes.