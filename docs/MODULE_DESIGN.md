# Module Design

Each module's responsibility and how it interacts with the others.

## Server Modules

### `server.js` (Composition Root)
- Boots the app: loads env (`dotenv`), connects to MongoDB (`connectDB`), applies middleware (`express.json`, `cors`), mounts routers, and starts listening.
- **Interacts with**: all route modules and `configs/db.js`.

### `configs/`
| Module | Responsibility | Depends on |
| ------ | -------------- | ---------- |
| `db.js` | Establish the Mongoose connection to the `resume-builder` database | `MONGODB_URI` |
| `ai.js` | Instantiate the OpenAI client | `OPENAI_API_KEY`, `OPENAI_BASE_URL` |
| `imageKit.js` | Instantiate the ImageKit client | `IMAGEKIT_PRIVATE_KEY` |
| `multer.js` | Provide the upload middleware (disk storage) | — |

These are **singletons** imported by controllers/middleware; they isolate all external I/O setup.

### `middlewares/authMiddleware.js`
- `protect`: reads the `Authorization` header, verifies the JWT, and sets `req.userId`; otherwise responds `401`.
- **Interacts with**: `JWT_SECRET`, and every protected route.

### `models/`
| Module | Responsibility |
| ------ | -------------- |
| `User.js` | User schema + `comparePassword()` instance method |
| `Resume.js` | Resume schema with embedded sub-documents (personal info, experience, projects, education) |

- **Interacts with**: controllers (data access), Mongoose/MongoDB.

### `controllers/`
| Module | Responsibility | Collaborators |
| ------ | -------------- | ------------- |
| `userController.js` | Register, login, fetch current user, list user resumes; token generation | `User`, `Resume`, `bcrypt`, `jsonwebtoken` |
| `resumeController.js` | Create/update/delete/read resumes, public read, image upload | `Resume`, `imageKit`, `fs` |
| `aiController.js` | Enhance summary & job description, parse & import resume text | `ai` (OpenAI), `Resume` |

Controllers hold business logic and are the only layer that touches both models and external services.

### `routes/`
| Module | Mounts | Wires |
| ------ | ------ | ----- |
| `userRoutes.js` | `/api/users` | register, login, data, resumes |
| `resumeRoutes.js` | `/api/resumes` | create, update (+upload), delete, get, public |
| `aiRoutes.js` | `/api/ai` | enhance-pro-sum, enhance-job-desc, upload-resume |

Routes only map HTTP verbs/paths to controllers and attach middleware (`protect`, `upload`).

## Client Modules

### `App.jsx`
- Declares routes and bootstraps auth (fetches `/api/users/data` if a token exists), renders the global `Toaster`.
- **Interacts with**: `authSlice`, `configs/api`, all pages.

### `app/` (State)
| Module | Responsibility |
| ------ | -------------- |
| `store.js` | Configure the Redux store |
| `features/authSlice.js` | `login`/`logout`/`setLoading` reducers; persists token/user to `localStorage` |

### `configs/api.js`
- Pre-configured axios instance using `VITE_BASE_URL`. All API calls go through it.

### `pages/`
- Route-level containers that fetch data and compose components. `ResumeBuilder` is the main orchestrator for editing; `Preview` renders a public resume; `Dashboard` lists resumes.

### `components/`
| Group | Responsibility |
| ----- | -------------- |
| `templates/` | Pure render components turning resume data into a styled layout |
| `*Form.jsx` | Controlled form sections that edit a slice of the resume |
| `ResumePreview.jsx` | Selects and renders the active template with live data |
| `ColorPicker.jsx` | Accent color selection |
| `home/` | Landing-page presentation sections |
| `Navbar`, `Loader` | Shared UI |

## Interaction Summary

```
pages ──uses──▶ components ──render──▶ templates
  │                 │
  │ dispatch        │ edit data
  ▼                 ▼
authSlice ◀──────── resume state (page-local)
  │
  └── api.js ──HTTP──▶ routes ──▶ controllers ──▶ models/MongoDB
                                      │
                                      ├──▶ OpenAI (ai.js)
                                      └──▶ ImageKit (imageKit.js)
```

## Coupling & Cohesion Notes

- **Low coupling** between layers: routes don't know model details; components don't know HTTP specifics beyond `api.js`.
- **High cohesion** per module: each controller owns one domain; each config owns one integration.
- **Shared contract**: the `Resume` schema is the common shape used by templates, forms, controllers, and the AI import prompt.
