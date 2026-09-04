# Frontend (`fe`)

React application built with TypeScript, Vite, and Tailwind CSS.

## Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Vitest & React Testing Library

## Quick Start

```bash
# From repository root:
npm install              # Installs all monorepo dependencies (fe + be)
npm run dev:fe           # Starts frontend dev server (or: npm run dev -w fe)

# To install or target only the frontend from root:
npm install -w fe

# Or directly in fe/ directory:
npm install
npm run dev
```
The application runs at `http://localhost:5173`.

## Environment Variables

Configured in `.env` (or inherited from defaults):

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |

## Available Scripts

```bash
npm run dev         # Start local Vite development server
npm test            # Run Vitest unit & integration tests
npm run test:watch  # Run Vitest in watch mode
npm run build       # Type-check with tsc and build production bundle to dist/
npm run lint        # Run ESLint on src/
npm run format      # Format code with Prettier
```

## Key Implementation Details

- **Data Fetching Hook (`useProducts`)**: Manages `products`, `loading`, and `error` states. Integrates `useDebounce` to throttle text search queries by 300ms, and `AbortController` to cancel in-flight requests when filters change, preventing race conditions.
- **Custom `useDebounce` Hook**: Decouples UI input state from network dispatch, fully tested with fake timers and rapid-typing edge cases.
- **Date Deserialization (`services/api.ts`)**: Converts incoming ISO date strings (`price.validFrom`) into native JavaScript `Date` instances to avoid runtime crashes during date formatting.
- **Vitest & JSDOM Setup**: Migrated from legacy Jest to Vitest with `@testing-library/react` and `jsdom` for fast component and hook testing.

