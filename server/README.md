# Mini Hackathon — Server

Express + MongoDB REST API with Stripe payments.

## Quick Start

```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev            # starts with nodemon
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Production start |
| `npm run dev` | Development with auto-reload |

## Folder Structure

```
src/
├── config/         # db.js, stripe.js
├── controllers/    # Thin HTTP layer (req → service → res)
├── middleware/     # auth, error, validation
├── models/         # Mongoose schemas
├── routes/         # Express routers (routing only)
├── services/       # Reusable business logic
├── utils/          # asyncHandler, apiResponse helpers
├── app.js          # Express app setup
└── server.js       # DB connect + HTTP listen
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | Bearer | Current user |
| POST | `/api/payments/create-intent` | Bearer | Create Stripe PaymentIntent |
| POST | `/api/payments/webhook` | Stripe sig | Stripe webhook |

## Environment Variables

See `.env.example` for a full list.
