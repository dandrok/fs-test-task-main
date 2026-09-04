# Backend (`be`)

REST API built with Express, TypeScript, Mongoose, and Zod.

## Stack
- Node.js (v20)
- Express 5
- MongoDB with Mongoose 9
- Zod 4 for input validation
- Vitest & Supertest for testing

## Quick Start

### 1. Run with Docker (Recommended)
From the repository root:
```bash
npm run dev:be
```
This starts MongoDB and the Express API. The database is automatically seeded on the first run if empty.

### 2. Run Locally (requires local MongoDB)

```bash
# 1. Copy environment configuration:
cp be/.env.example be/.env

# 2. Run from repository root:
npm run dev -w be

# Or directly inside be/:
npm install
npm run dev
```

## Environment Variables

Defined in `.env` (copied from `.env.example`):

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port Express listens on |
| `MONGO_URI` | `mongodb://localhost:27017/product_catalog` | MongoDB connection string |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

## Available Scripts

```bash
npm run dev        # Start dev server with hot reload (tsx watch)
npm run build      # Compile TypeScript to dist/
npm run start      # Run compiled code (node dist/server.js)
npm run seed       # Manually wipe and seed database with initial products
npm test           # Run Vitest test suite
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## API Endpoints

### `GET /health`
Health check endpoint.
- **Response:** `200 OK` `{ "status": "ok", "timestamp": "..." }`

### `GET /api/products`
Fetch products with optional query parameters.

| Parameter | Type | Example | Description |
|---|---|---|---|
| `search` | string | `?search=QuickDrive` | Matches code or name (case-insensitive) |
| `capacity` | number | `?capacity=9` | Allowed values: 8, 9, 10.5 |
| `energyClass` | string | `?energyClass=A` | Allowed values: A, B, C |
| `feature` | string | `?feature=Silnik+inwerterowy` | Filter by feature name |
| `sort` | string | `?sort=price` | Sort by `price` or `capacity` (ascending) |

#### Error Responses
- If an invalid query parameter is passed (e.g. `?energyClass=X`), the API returns **`400 Bad Request`** with field error details:
```json
{
  "error": "Validation Error",
  "details": {
    "energyClass": ["Invalid option: expected one of \"A\"|\"B\"|\"C\""]
  }
}
```
- If an unexpected error occurs, returns **`500 Internal Server Error`**.

## Project Structure

```text
src/
├── app.ts                 # Express app configuration & middleware
├── server.ts              # Server bootstrapper & DB connection
├── config/
│   └── db.ts              # MongoDB connection manager
├── controllers/
│   └── product.controller.ts # Request/response handling
├── middlewares/
│   └── errorHandler.ts    # Central error handler (Zod 400 vs 500)
├── models/
│   └── product.model.ts   # Mongoose product schema with index on code
├── routes/
│   └── product.routes.ts  # Express route definitions
├── schemas/
│   └── product.schema.ts  # Zod validation schema & inferred types
├── scripts/
│   ├── data.ts            # Seed fixtures
│   ├── seed.ts            # Standalone seed CLI script
│   └── seeding.ts         # Auto-seed logic on server startup
├── services/
│   └── product.service.ts # MongoDB query builder & .lean() queries
└── tests/
    └── app.test.ts        # Integration tests using Supertest
```
