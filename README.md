# Portfolio Frontend

React + Vite frontend for my [Portfolio REST API](LINK_REPO_BACKEND).
Public pages show profile, skills and projects; a protected admin area
(JWT login) manages them.

**Live demo:** LINK_VERCEL (sẽ điền sau)
**Backend:** LINK_REPO_BACKEND · [Swagger](LINK_SWAGGER)

## Run locally
    npm install
    cp .env.example .env   # set VITE_API_URL to the backend address
    npm run dev

## Tech
React 18, Vite, React Router, fetch API, JWT auth (token in localStorage).