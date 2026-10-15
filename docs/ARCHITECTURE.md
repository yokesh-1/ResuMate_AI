# Architecture

This document covers both the high-level system layout and the low-level structure of each part of the codebase.

## High-Level Architecture

The project is a classic **MERN** app split into two deployable units: a React SPA and an Express API, backed by MongoDB and two external services (OpenAI, ImageKit).

```
┌──────────────┐        HTTPS/JSON        ┌──────────────┐
│   Client     │ ───────────────────────▶ │   Server     │
│ React + Vite │                          │  Express API │
│  (SPA)       │ ◀─────────────────────── │              │
└──────┬───────┘        JWT auth          └──────┬───────┘
       │                                         │
       │ localStorage (token/user)               │ Mongoose
       │                                         ▼
       │                                  ┌──────────────┐
       │                                  │   MongoDB    │
       │                                  │ users/resumes│
       │                                  └──────────────┘
       │                                         │
       │                         ┌───────────────┴────────────────┐
       │                         ▼                                ▼
       │                  ┌─────────────┐                 ┌─────────────┐
       │                  │   OpenAI    │                 │  ImageKit   │
       │                  │ (AI content)│                 │ (images/CDN)│
       │                  └─────────────┘                 └─────────────┘
```

**Request flow (example — save a resume with an image):**
1. User edits a resume in the builder; the client sends `PUT /api/resumes/update` as `multipart/form-data`.
2. `protect` middleware verifies the JWT and sets `req.userId`.
3. Multer stores the uploaded file to disk; the controller streams it to ImageKit with face-crop (and optional background removal) transforms.
4. The returned CDN URL is written into `personal_info.image`, and the resume document is updated in MongoDB.
5. The updated resume is returned to the client, which re-renders the live preview.

## Low-Level Architecture

### Frontend (`client/src/`)

```
src/
├── app/
│   ├── store.js              # Redux store configuration
│   └── features/
│       └── authSlice.js      # auth state (token, user, loading)
├── assets/
│   └── templates/            # template preview assets
├── components/
│   ├── templates/            # Classic, Modern, Minimal, MinimalImage renderers
│   ├── home/                 # landing page sections (Hero, Features, Footer, ...)
│   ├── *Form.jsx             # section editors (PersonalInfo, Experience, Education, Skills, Project, Summary)
│   ├── ColorPicker.jsx       # accent color selection
│   ├── ResumePreview.jsx     # renders the selected template live
│   ├── Navbar.jsx / Loader.jsx
├── configs/
│   └── api.js                # axios instance (baseURL from VITE_BASE_URL)
├── pages/
│   ├── Home.jsx              # landing page
│   ├── Login.jsx             # auth
│   ├── Layout.jsx            # authenticated shell (/app)
│   ├── Dashboard.jsx         # resume list
│   ├── ResumeBuilder.jsx     # main editor (/app/builder/:resumeId)
│   └── Preview.jsx           # public view (/view/:resumeId)
└── App.jsx                   # routes + auth bootstrap
```

**State management**: `authSlice` holds `{ token, user, loading }`. On `login`, the token/user are persisted to `localStorage`; `App.jsx` rehydrates on load by calling `/api/users/data`.

**Routing** (`App.jsx`):
- `/` → `Home`
- `/app` → `Layout` → index `Dashboard`, `builder/:resumeId` → `ResumeBuilder`
- `/view/:resumeId` → `Preview` (public)

### Backend (`server/`)

```
server/
├── server.js                 # app entry: middleware, DB connect, route mounting
├── configs/
│   ├── db.js                 # Mongoose connection (db name: resume-builder)
│   ├── ai.js                 # OpenAI client (apiKey + optional baseURL)
│   ├── imageKit.js           # ImageKit client (privateKey)
│   └── multer.js             # disk-storage upload middleware
├── middlewares/
│   └── authMiddleware.js     # protect: JWT verification → req.userId
├── models/
│   ├── User.js               # user schema + comparePassword
│   └── Resume.js             # resume schema (embedded sub-docs)
├── controllers/
│   ├── userController.js     # register, login, getUserById, getUserResumes
│   ├── resumeController.js   # create, update, delete, getById, getPublicById
│   └── aiController.js       # enhance summary, enhance job desc, upload-resume
└── routes/
    ├── userRoutes.js         # /api/users
    ├── resumeRoutes.js       # /api/resumes
    └── aiRoutes.js           # /api/ai
```

**Layered design**: routes → middleware (auth) → controllers (business logic) → models (data). Config modules isolate external integrations (DB, OpenAI, ImageKit, uploads).

### Cross-Cutting Concerns

- **Authentication**: stateless JWT (7-day expiry). Token sent in the `Authorization` header; verified per-request by `protect`.
- **Authorization**: owner-scoped queries (`{ userId, _id }`) for private resume operations; a separate public path gated on `public: true`.
- **CORS**: enabled globally on the server.
- **Error handling**: controllers wrap logic in try/catch and return `{ message }` with a `400`/`401`/`404` status.

## Design Decisions & Trade-offs

- **Embedded sub-documents** keep a resume in one document — simple reads and writes, at the cost of cross-resume querying on nested fields.
- **Disk-based Multer storage** is simple but means uploaded temp files should be cleaned up and the server needs writable storage; the file is streamed to ImageKit immediately.
- **Configurable OpenAI base URL/model** allows swapping providers or self-hosted/proxy endpoints without code changes.
- **Token in `Authorization` without `Bearer`** — clients must send the raw token string to match the middleware.
