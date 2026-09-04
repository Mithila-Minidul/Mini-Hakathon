# Mini Hackathon

Full-stack web application built with **React + Vite** (frontend) and **Express + MongoDB** (backend).

## Repository Structure

```
Mini-Hakathon/
├── client/     # React frontend (Vite)
└── server/     # Express REST API
```

## Getting Started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # add your MongoDB URI, JWT secret, Stripe keys
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env   # add VITE_API_BASE_URL and Stripe publishable key
npm run dev
```

The client runs on `http://localhost:5173` and proxies API calls to `http://localhost:5000`.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express 4, Mongoose |
| Database | MongoDB |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Payments | Stripe |

## Architecture

- **MVC pattern** on the server — Routes → Controllers → Services → Models
- **Context + Hooks** on the client — AuthContext + custom hooks
- **Reusable components** and **layout shells** keep pages small and focused