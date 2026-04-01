# CLAUDE.md — SnapSell

## Project Overview
SnapSell is an image-first MERN marketplace. Sellers register (with required profile image), create/manage product listings, and handle buyer inquiries. Buyers browse, filter, search, and contact sellers without accounts (v1). Admins manage sellers and listings.

## Locked Product Decisions
- Roles: `admin`, `seller` (buyers are unauthenticated in v1)
- Auth: JWT in HTTP-only cookies
- Communication: thread-based inquiry system (no real-time chat in v1)
- Categories: backend-controlled from `categories` MongoDB collection, seeded at setup
- Media: backend-signed direct-to-Cloudinary upload flow
- Sold workflow: removed from public feed, kept in seller history, blocks new inquiries, auto-closes open inquiries

## Tech Stack
- **Frontend:** React + Vite, JavaScript, Tailwind CSS v4, React Router, TanStack Query, Redux Toolkit (auth/UI only), Axios, React Hook Form, Zod
- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT + bcrypt, Cloudinary SDK, Zod
- **Testing:** Vitest + React Testing Library (frontend), Jest + Supertest (backend)

## Project Structure
```
package.json          # root — concurrently runs client + server
client/               # Vite React app
  src/
    app/              # store, providers
    components/       # shared UI components
    features/         # Redux slices
    hooks/
      queries/        # TanStack Query read hooks
      mutations/      # TanStack Query write hooks
    lib/              # axios client
    pages/            # route pages
    routes/           # route definitions
    services/         # API call functions
    utils/
  test/
server/
  config/             # env.js, db.js, cloudinary.js, cookie.js
  controllers/
  middleware/
  models/
  routes/
  services/           # business logic
  utils/
  tests/
```

## Key Rules
- API calls live in `client/src/services/`, not in components
- Read hooks in `hooks/queries/`, write hooks in `hooks/mutations/`
- Server state via TanStack Query, client-only state via Redux Toolkit
- No raw `process.env` outside `server/config/`
- Validate env vars at startup with Zod (fail fast)
- Frontend API base URL from `import.meta.env.VITE_API_URL`
- Store media as `{ url, publicId }` — clean up on replace/delete
- Standardized API responses: `{ success, message, data }` or `{ success, error: { code, message, details } }`

## Commands
```bash
npm run dev       # start both client and server
npm run client    # start frontend only
npm run server    # start backend only (nodemon)
npm start         # production server start
```

## Environment Variables
- Server: see `server/.env.example`
- Client: see `client/.env.example`
- `VITE_` prefix required for all frontend env vars
