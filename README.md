# Product Catalog Full-Stack Application

Full-stack catalog with a React (Vite) frontend and Express + MongoDB backend in Docker.

## Quick Start

### Prerequisites

- Docker & Docker Compose (e.g., [Docker Desktop](https://www.docker.com/products/docker-desktop/) on macOS/Windows, Docker Engine on Linux)
- Node.js 20+

```bash
# All commands below are run from the repository root:

# 1. Install dependencies (installs monorepo workspaces & configures git hooks)
npm install

# 2. Start Backend & MongoDB in Docker (auto-seeds on startup)
npm run dev:be

# 3. Start Frontend (in a separate terminal)
npm run dev:fe
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5005 (Health check: `GET /health`)

### Troubleshooting

- **Docker daemon connection error:** Ensure Docker Desktop (macOS/Windows) or the Docker service (Linux) is running before launching `npm run dev:be`.
- **Port conflicts:** The backend binds to port `5005` by default to prevent collisions with host OS daemons (e.g., macOS AirPlay on port `5000`).

### Tests & Code Quality

```bash
npm test -w be      # Backend Vitest integration tests
npm test -w fe      # Frontend Vitest hook/service tests
npm run lint -w be  # Backend ESLint
npm run lint -w fe  # Frontend ESLint
```

---

## Technical Notes

- **Backend Architecture (`be/`)**: Express 5 structured into routes, controllers, services, and models. Uses Mongoose with `.lean()` queries and an index on `code: 1`.
- **Validation**: Strict runtime query validation via Zod (`product.schema.ts`). Unsupported parameters or invalid enum values return structured `400 Bad Request` responses.
- **Frontend Optimization (`fe/`)**:
  - `useProducts` hook manages API integration with `AbortController` cancellation to eliminate race conditions.
  - Search queries are throttled with a custom `useDebounce` hook (300ms) to prevent request flooding while keeping input typing.
  - Hydrates incoming ISO dates (`price.validFrom` -> `Date`) to prevent client-side formatting runtime errors.
  - Responsive Grid: Replaced rigid desktop grids with responsive CSS Grid breakpoints across filters and product cards for tablet and mobile viewports.
- **Tooling & CI**:
  - Native `.githooks/` (`pre-commit` for linting, `pre-push` for full test suites) via Git `core.hooksPath` (zero dependencies).
  - GitHub Actions workflow (`ci.yml`) running linting, TypeScript compilation, and all tests on PRs and pushes.
  - Root `.npmrc` configured with `audit=false` for fast local installs.

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
