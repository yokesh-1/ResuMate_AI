# Tech Stack

Technologies, libraries, and tooling used across the project, with the role each one plays.

## Frontend (`client/`)

| Package | Version | Role |
| ------- | ------- | ---- |
| `react` / `react-dom` | ^19.1.1 | UI library |
| `react-router-dom` | ^7.9.4 | Client-side routing |
| `@reduxjs/toolkit` | ^2.9.2 | State management (auth/app state) |
| `react-redux` | ^9.2.0 | React bindings for Redux |
| `tailwindcss` + `@tailwindcss/vite` | ^4.1.14 | Utility-first styling |
| `axios` | ^1.13.1 | HTTP client (configured in `src/configs/api.js`) |
| `react-hot-toast` | ^2.6.0 | Toast notifications |
| `react-pdftotext` | ^1.3.4 | Extract text from uploaded PDFs |
| `lucide-react` | ^0.545.0 | Icon set |
| `vite` | ^7.1.7 | Dev server & build tool |
| `eslint` + plugins | ^9.36.0 | Linting |

**Build scripts** (`client/package.json`): `dev`, `build`, `lint`, `preview`.

## Backend (`server/`)

| Package | Version | Role |
| ------- | ------- | ---- |
| `express` | ^5.1.0 | Web framework / routing |
| `mongoose` | ^8.19.2 | MongoDB ODM |
| `jsonwebtoken` | ^9.0.2 | JWT auth tokens |
| `bcrypt` | ^6.0.0 | Password hashing |
| `multer` | ^2.0.2 | Multipart/form-data (image uploads) |
| `@imagekit/nodejs` | ^7.1.1 | Image upload, transforms, CDN |
| `openai` | ^6.7.0 | AI content enhancement & resume parsing |
| `cors` | ^2.8.5 | Cross-origin requests |
| `dotenv` | ^17.2.3 | Environment variable loading |
| `nodemon` (dev) | ^3.1.10 | Auto-restart during development |

**Run scripts** (`server/package.json`): `start` (`node server.js`), `server` (`nodemon server.js`).

## Data & External Services

- **MongoDB** — primary datastore (database name `resume-builder`, see `configs/db.js`).
- **OpenAI** — chat completions API, including JSON mode for structured resume extraction. Supports a custom `OPENAI_BASE_URL`.
- **ImageKit** — image hosting, face-aware cropping, and background removal.

## Deployment

- **Vercel** — the backend includes a `vercel.json`; the frontend is a static Vite build suitable for Vercel/static hosting.

## Language & Module System

- JavaScript (ES Modules) across both client and server (`"type": "module"`).
- Node.js 18+ recommended.
