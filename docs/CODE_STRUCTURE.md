# Code Structure

How the repository is organized and where to find things.

## Repository Root

```
resume-builder/
├── client/          # React + Vite frontend (SPA)
├── server/          # Express + MongoDB REST API
├── docs/            # Developer documentation (this folder)
├── README.md        # Project overview & setup
├── LICENSE          # ISC license
├── UI.png           # Screenshot (UI)
└── Dashboard.png    # Screenshot (dashboard)
```

The repo is a **monorepo** with two independently installable/deployable packages (`client` and `server`), each with its own `package.json`.

## Client (`client/`)

```
client/
├── index.html               # Vite HTML entry
├── package.json             # frontend deps & scripts
├── eslint.config.js         # ESLint flat config
├── public/                  # static files served as-is (favicon, logo)
└── src/
    ├── main.jsx             # React root render + providers
    ├── App.jsx              # routes + auth bootstrap
    ├── index.css            # global styles / Tailwind
    ├── app/
    │   ├── store.js         # Redux store
    │   └── features/
    │       └── authSlice.js # auth slice (token, user, loading)
    ├── configs/
    │   └── api.js           # axios instance (VITE_BASE_URL)
    ├── pages/               # route-level screens
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Layout.jsx
    │   ├── Dashboard.jsx
    │   ├── ResumeBuilder.jsx
    │   └── Preview.jsx
    ├── components/
    │   ├── templates/       # resume template renderers
    │   ├── home/            # landing-page sections
    │   ├── *Form.jsx        # section editors
    │   ├── ColorPicker.jsx
    │   ├── ResumePreview.jsx
    │   ├── Navbar.jsx
    │   └── Loader.jsx
    └── assets/              # images, icons, template assets
```

### Folder Responsibilities (client)

| Folder | Responsibility |
| ------ | -------------- |
| `app/` | Global state (Redux store + slices) |
| `configs/` | Cross-cutting config (HTTP client) |
| `pages/` | One component per route; composes components |
| `components/` | Reusable UI; `templates/` render resumes, `*Form` edit sections, `home/` build the landing page |
| `assets/` | Static media |

## Server (`server/`)

```
server/
├── server.js                # entry: middleware, DB, route mounting
├── package.json             # backend deps & scripts
├── vercel.json              # Vercel deploy config
├── configs/
│   ├── db.js                # Mongoose connection
│   ├── ai.js                # OpenAI client
│   ├── imageKit.js          # ImageKit client
│   └── multer.js            # upload middleware
├── middlewares/
│   └── authMiddleware.js    # JWT protect
├── models/
│   ├── User.js
│   └── Resume.js
├── controllers/
│   ├── userController.js
│   ├── resumeController.js
│   └── aiController.js
└── routes/
    ├── userRoutes.js
    ├── resumeRoutes.js
    └── aiRoutes.js
```

### Folder Responsibilities (server)

| Folder | Responsibility |
| ------ | -------------- |
| `configs/` | External integrations and connections (DB, OpenAI, ImageKit, uploads) |
| `middlewares/` | Request-scoped cross-cutting logic (auth) |
| `models/` | Mongoose schemas & model methods |
| `controllers/` | Business logic per domain |
| `routes/` | HTTP endpoint → controller wiring |

## Naming Conventions

- **Components**: PascalCase `.jsx` (e.g., `ResumePreview.jsx`).
- **Controllers/routes/models**: camelCase or PascalCase matching the domain (`resumeController.js`, `Resume.js`).
- **Redux slices**: `<domain>Slice.js`.
- **ES Modules** everywhere (`import`/`export`, `"type": "module"`).

## Where to Make Common Changes

| Task | Edit |
| ---- | ---- |
| Add an API endpoint | `routes/*` + `controllers/*` |
| Change a data model | `models/*` (and dependent controllers) |
| Add a resume template | `components/templates/*` + selector wiring |
| Add a form section | `components/*Form.jsx` + builder page |
| Change auth rules | `middlewares/authMiddleware.js` |
| Configure an external service | `configs/*` |
