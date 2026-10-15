# System Design

A higher-level view of how the system is put together, how data flows, and how it scales and stays secure.

## 1. Overview

The Resume Builder is a two-tier web application:

- **Client**: a React single-page app (Vite build) that handles the UI, editing experience, and live preview.
- **Server**: a stateless Express REST API that owns business logic, auth, and persistence.
- **Datastore**: MongoDB for users and resumes.
- **External services**: OpenAI (AI content), ImageKit (image processing + CDN).

Because the API is stateless (JWT-based auth, no server sessions), it can be scaled horizontally behind a load balancer.

## 2. Core Components

| Component | Responsibility |
| --------- | -------------- |
| React SPA | Rendering, form editing, template preview, client-side routing, PDF text extraction |
| Express API | Auth, CRUD, AI orchestration, image upload handling |
| MongoDB | Persistent storage for users and resumes |
| OpenAI | Content enhancement and resume text → structured JSON |
| ImageKit | Image upload, face-aware crop, background removal, CDN hosting |

## 3. Key Data Flows

### Authentication
```
Client → POST /api/users/login → verify (bcrypt) → sign JWT (7d) → return token
Client stores token in localStorage → sends it on each request → protect verifies
```

### Resume Editing & Save
```
Editor (ResumeBuilder) → PUT /api/resumes/update (multipart)
  → protect (JWT) → Multer (disk) → ImageKit upload (transforms)
  → write CDN URL into personal_info.image → update MongoDB doc → return resume
```

### AI Resume Import
```
Client extracts PDF text (react-pdftotext)
  → POST /api/ai/upload-resume { resumeText, title }
  → OpenAI (JSON mode) structures the text
  → create Resume document → return resumeId
```

### Public Sharing
```
Owner sets public: true → shares /view/:resumeId
Visitor → GET /api/resumes/public/:resumeId (no auth) → read-only resume
```

## 4. Scalability Considerations

- **Stateless API** → horizontal scaling is straightforward; no sticky sessions needed.
- **CDN offload** → images are served from ImageKit, keeping load off the app server.
- **Document model** → a resume is a single self-contained document, so reads/writes avoid joins.
- **External AI calls** are the main latency source; they are request-scoped and could be moved to a queue/background job if volume grows.

## 5. Security Design

- **Password storage**: bcrypt hashing (never stored or returned in plaintext; `password` field is stripped from responses).
- **Auth**: short-lived-ish JWT (7 days) verified on every protected route.
- **Authorization**: private resume operations are scoped by `userId`; public reads require `public: true`.
- **Secrets**: all credentials (DB URI, JWT secret, OpenAI/ImageKit keys) are injected via environment variables, not committed.
- **Input checks**: controllers validate required fields and return explicit error messages.

### Known Hardening Opportunities
- Add rate limiting on auth and AI endpoints.
- Validate/limit upload file size and MIME type in Multer.
- Clean up temporary files written to disk by Multer after upload.
- Consider refresh tokens / token revocation instead of long-lived JWTs.
- Add schema-level validation on AI-extracted data before persisting.

## 6. Environment Configuration

**Server (`server/.env`)**
```env
MONGODB_URI=...
JWT_SECRET=...
GEMINI_API_KEY=...
MODEL=...        # model used by AI endpoints
IMAGEKIT_PRIVATE_KEY=...
PORT=3000
```

**Client (`client/.env`)**
```env
VITE_BASE_URL=http://localhost:3000
```

## 7. Deployment Topology

```
[ Vercel static (client) ] ──▶ [ Express API (Vercel/Node host) ] ──▶ [ MongoDB Atlas ]
                                        │
                                        ├──▶ OpenAI
                                        └──▶ ImageKit (CDN)
```

The server ships a `vercel.json`; the client builds to static assets via `vite build`. MongoDB is expected to be a managed cluster (e.g., Atlas) in production.

## 8. Future Extensions

- Server-side PDF export.
- Resume versioning / history.
- Template marketplace or additional templates.
- Analytics on public resume views.
- Background job queue for AI processing.
