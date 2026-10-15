# Design Patterns

Patterns observed in the codebase and where they appear.

## Backend

### MVC-ish Layered Architecture
Routes → Controllers → Models. Routes map HTTP to handlers, controllers hold logic, models own persistence. This keeps responsibilities separated and testable.
- *Where*: `routes/`, `controllers/`, `models/`.

### Middleware (Chain of Responsibility)
Express middleware processes requests in a pipeline. `protect` either passes control to the next handler (`next()`) or short-circuits with `401`.
- *Where*: `middlewares/authMiddleware.js`, `express.json()`, `cors()`, `upload.single("image")`.

### Singleton (Shared Clients)
External clients (OpenAI, ImageKit) and the DB connection are created once in a config module and reused across the app.
- *Where*: `configs/ai.js`, `configs/imageKit.js`, `configs/db.js`.

### Factory / Helper Function
`generateToken(userId)` centralizes JWT creation so signing options (payload, 7-day expiry) live in one place.
- *Where*: `controllers/userController.js`.

### Active Record–style Models
Mongoose models combine data shape and behavior; `User.comparePassword()` attaches domain logic to the model instance.
- *Where*: `models/User.js`.

### DTO / Response Shaping
Sensitive or noisy fields are stripped before responses (`user.password = undefined`, hiding `__v`/`createdAt`/`updatedAt` on resumes).
- *Where*: `userController.js`, `resumeController.js`.

### Strategy (via Prompt + Config)
AI behavior is parameterized by a system prompt and a model from env (`OPENAI_MODEL`), so the "strategy" for enhancement/parsing can change without code edits.
- *Where*: `controllers/aiController.js`, `configs/ai.js`.

## Frontend

### Flux / Centralized Store (Redux Toolkit)
Predictable, unidirectional state updates through slices and reducers.
- *Where*: `app/store.js`, `app/features/authSlice.js`.

### Container / Presentational Split
Pages act as containers (data fetching, orchestration); components (templates, forms) are mostly presentational.
- *Where*: `pages/*` vs `components/*`.

### Strategy (Template Selection)
The active resume template is chosen at runtime; each template is an interchangeable renderer for the same resume data.
- *Where*: `components/templates/*`, `ResumePreview.jsx`.

### Controlled Components
Form sections are controlled inputs driven by resume state and change handlers.
- *Where*: `components/*Form.jsx`.

### Adapter / Facade (HTTP)
A single axios instance wraps base URL and config so the rest of the app talks to one simple interface instead of raw HTTP.
- *Where*: `configs/api.js`.

### Provider Pattern
Redux `<Provider>` and the router provide shared context to the component tree.
- *Where*: `main.jsx`, `App.jsx`.

## Cross-Cutting

### Token-based Stateless Auth
JWT carries identity; no server session store, enabling horizontal scaling.

### Configuration via Environment
All secrets and tunables (DB URI, keys, model, base URL, port) are injected via env vars rather than hardcoded.

## Anti-patterns / Opportunities

- **No repository abstraction**: controllers call Mongoose directly. Fine at this size; a repository layer would help if logic grows.
- **Inconsistent validation**: some endpoints check required fields, others assume valid input. A shared validation layer (e.g., schema validation middleware) would standardize this.
- **Temp file cleanup missing**: Multer writes to disk but files aren't removed after ImageKit upload.
