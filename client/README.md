# Mini Hakathon — Client

React + Vite frontend.

## Quick Start

```bash
cd client
npm install
cp .env.example .env   # fill in your values
npm run dev            # starts on http://localhost:5173
```

## Folder Structure

```
src/
├── assets/          # Static images, fonts, icons
├── components/      # Reusable UI components (Navbar, Button, ProtectedRoute)
├── context/         # React context providers (AuthContext)
├── hooks/           # Custom hooks (useAuth, useFetch)
├── layouts/         # Page shell layouts (MainLayout, AuthLayout)
├── pages/           # One component per route (HomePage, LoginPage...)
├── services/        # API call wrappers (api.js, authService.js)
├── utils/           # Helpers + constants
├── App.jsx          # Root router
└── main.jsx         # React entry point
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_API_BASE_URL | Backend API base URL |
| VITE_STRIPE_PUBLISHABLE_KEY | Stripe publishable key |
