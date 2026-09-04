# Product Catalog Full-Stack Application

Full-stack product catalog with a React frontend and an Express + MongoDB backend, orchestrated via Docker.

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) (v20+ recommended)

### 1. Install Dependencies

Run from the repository root to install dependencies for **both frontend and backend workspaces** in one command:

```bash
npm install
```

> **Note:** `npm install` automatically activates the native Git hooks (`pre-commit` & `pre-push`) via the root `prepare` script without requiring Husky.

### 2. Start Backend & Database

```bash
# Starts MongoDB and Express API in Docker with automatic database seeding
npm run dev:be
```

Backend API will be live at `http://localhost:5000` (Health check: `http://localhost:5000/health`).

### 3. Start Frontend

In a separate terminal:

```bash
npm run dev:fe
```

Frontend application will be live at `http://localhost:5173`.

### 4. Run Test Suites

```bash
npm test -w be   # Backend integration tests (Supertest + Vitest)
npm test -w fe   # Frontend unit & hook tests (Testing Library + Vitest)
```

---

## What Was Implemented

### Backend (`be/`)

- **Express 5 REST API**: Structured in a 3-tier architecture (`routes` -> `controllers` -> `services` -> `models`) with centralized error handling.
- **Mongoose instead of Raw MongoDB Driver**:
  - _Why_: Provides schema enforcement, automatic type inference, and index definitions (`code: 1` unique index for O(1) lookups). All read queries use `.lean()` to bypass Mongoose document hydration overhead for fast serialization.
- **Zod Validation**:
  - _Why_: Adds a strict validation layer before queries hit the database. Query parameters (`search`, `capacity`, `energyClass`, `feature`, `sort`) are parsed and type-coerced. Invalid input immediately returns a structured `400 Bad Request` instead of failing unexpectedly.
- **Automated Database Seeding**:
  - Automatically seeds initial products on server startup (`seedIfEmpty`) when running inside Docker or on cold start. Also includes a standalone CLI seeder (`npm run seed -w be`).
- **Vitest & Supertest Integration Tests**: Tests covering filter combinations, sorting, search regex, and validation error scenarios.

### Frontend (`fe/`)

- **Real API Integration**: Replaced static mock data with dynamic fetching from `GET /api/products`.
- **Custom `useProducts` Hook**:
  - Manages `products`, `loading`, and `error` states.
  - Implements search debouncing via a custom generic `useDebounce` hook (300ms delay) to prevent network request spamming during rapid typing.
  - Implements `AbortController` cancellation to discard in-flight requests when filters change, eliminating race conditions.
- **Safe Date Deserialization**: Incoming ISO date strings are converted into native `Date` objects in `services/api.ts` to prevent runtime crashes during date formatting.
- **Vitest Migration**: Replaced deprecated/broken Jest configuration with modern Vitest and React Testing Library, adding unit and edge-case tests for hook state transitions, debounce coalescing, and API query serialization.

---

## Extras & Above-and-Beyond Additions

1. **GitHub Actions CI (`.github/workflows/ci.yml`)**:
   - Automated pipeline running on pull requests and pushes to `main`.
   - Runs `npm ci`, backend linting, TypeScript compilation (`tsc`), frontend production build, and both test suites.
2. **Native Git Hooks (`pre-commit` & `pre-push`)**:
   - Zero-dependency hooks configured via native `core.hooksPath .githooks` (eliminates third-party wrappers like Husky).
   - **`pre-commit`**: Runs ESLint across both `be` and `fe` to prevent lint regressions from entering Git history.
   - **`pre-push`**: Runs the complete Vitest test suites to guarantee broken code never reaches GitHub.
   - Auto-activated upon running `npm install` via the root `"prepare"` lifecycle script.
3. **Search Input Debouncing (`useDebounce`)**:
   - Implemented a custom generic `useDebounce` hook that decouples real-time input rendering (60 FPS) from asynchronous network dispatch, backed by fake-timer unit tests.
4. **Containerization & Networking**:
   - Multi-container `docker-compose.yml` with isolated internal networking connecting the Express API to MongoDB.
   - Host-mapped ports (`5000` and `27017`) allow both containerized and local hybrid development workflows.
5. **Consistent Code Quality Tooling**:
   - Added matching ESLint and Prettier configurations to the backend workspace to ensure consistent styling and linting across the monorepo.
6. **Tailwind CSS Fix**:
   - Fixed broken frontend styling build configuration and updated PostCSS/Tailwind dependencies.

---

## Project Structure

- [`be/`](./be) - Express + TypeScript + Mongoose + Zod backend. See [be/README.md](./be/README.md) for endpoint specifications and local setup.
- [`fe/`](./fe) - React + TypeScript + Vite + Tailwind frontend. See [fe/README.md](./fe/README.md) for script details and frontend architecture.

---

# Recruitment Full Stack Test Task

Welcome to the Recruitment Full Stack Test Task! This task is designed to assess your skills in building a full-stack application where you'll create the backend using MongoDB as the database and connect it to the frontend located in the 'fe' folder of this repository.

## Task Description

Your challenge is to develop the backend using MongoDB as the database and establish a connection to the provided frontend. The frontend contains mock data, and your objective is to replace this mock data with actual data fetched from the backend.

### Backend Requirements:

1. **MongoDB Database**: Set up a MongoDB database to store product information.
2. **Express.js Server**: Create an Express.js server to handle HTTP requests and responses.
3. **RESTful API**: Implement RESTful API endpoints to perform Read operation for products.
4. **Connect to Frontend**: Ensure that the frontend can make requests to the backend to fetch product data.
5. **Docker**: Optionally, you can containerize your backend application using Docker for easier deployment.
6. **Flexible Backend Structure**: You have the flexibility to structure the backend as you see fit. You can choose the folder structure, naming conventions.

### Frontend Requirements:

1. **Replace Mock Data**: Replace the mock product data in the frontend with real data fetched from the backend.
2. **Display Products**: Ensure that the frontend can display the list of products fetched from the backend.

## Getting Started

To get started with the task, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the 'fe' folder to access the frontend code.
3. Set up the backend using MongoDB as per the backend requirements mentioned above.
4. Replace the mock data in the frontend with data fetched from the backend.
5. Test the integration between the frontend and the backend to ensure proper communication.

## Submission

Once you have completed the task, please push your code to your own repository. Provide the repository link along with any necessary instructions or documentation for running the application.

## Evaluation Criteria

Your solution will be evaluated based on the following criteria:

1. **Functionality**: Does the application meet the specified requirements?
2. **Code Quality**: Is the code well-structured, readable, and maintainable?
3. **Database Design**: Is the MongoDB database designed appropriately for storing product information?
4. **Integration**: Is there successful integration between the frontend and the backend?
5. **Error Handling**: Are errors handled gracefully, with appropriate error messages displayed to the user?
6. **Documentation**: Is there sufficient documentation provided to understand how the application works and how to run it?

## Questions or Issues

If you have any questions or encounter any issues while completing the task, please don't hesitate to reach out to us for assistance. We're here to help!

Good luck with the task, and we look forward to reviewing your submission!
