# Frontend (`fe`)

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

| Variable       | Default                     | Description          |
| -------------- | --------------------------- | -------------------- |
| `VITE_API_URL` | `http://localhost:5005/api` | Backend API base URL |

## Available Scripts

```bash
npm run dev         # Start local Vite development server
npm test            # Run Vitest unit & integration tests
npm run test:watch  # Run Vitest in watch mode
npm run build       # Type-check with tsc and build production bundle to dist/
npm run lint        # Run ESLint on src/
npm run format      # Format code with Prettier
```

## Technical Notes

- `useProducts`: Data-fetching hook with `AbortController` cancellation and 300ms search debouncing via `useDebounce`.
- `services/api.ts`: Hydrates incoming ISO date strings (`price.validFrom` -> `Date`) to prevent component date formatting errors.
- Vitest + `@testing-library/react` configured with `jsdom` for fast component and hook tests.
