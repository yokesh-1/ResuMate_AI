# Features

A breakdown of what the Resume Builder currently does, grounded in the actual implementation.

## Authentication

- **Register** with name, email, and password. Passwords are hashed with bcrypt (salt rounds: 10) before storage.
- **Login** validates credentials and returns a JWT valid for 7 days.
- **Session persistence** — the token and user are stored in `localStorage` and rehydrated on app load (`App.jsx` calls `/api/users/data`).
- **Protected routes** — a `protect` middleware verifies the JWT from the `Authorization` header and attaches `req.userId`.

## Resume Management

- **Create** a new resume (defaults to the title "Untitled Resume" and the `classic` template).
- **Read** a single resume (owner-only) or list all of the current user's resumes.
- **Update** resume content, including a nested structure for personal info, experience, projects, and education.
- **Delete** a resume (owner-scoped).
- **Multiple resumes per user** — resumes are linked to a user via `userId`.

## Templates & Styling

- **Four templates**: Classic, Modern, Minimal, and Minimal Image (with a profile photo).
- **Accent color** customization per resume via a color picker (default `#3B82F6`).
- **Live preview** — a `ResumePreview` component renders the selected template as the user edits.

## AI Enhancement (OpenAI)

- **Enhance professional summary** — rewrites the summary into a compelling, ATS-friendly 1–2 sentence version.
- **Enhance job description** — rewrites experience descriptions using action verbs and quantifiable results.
- **Import / parse resume** — accepts extracted resume text, uses OpenAI (JSON mode) to structure it into the resume schema, and creates a new resume from it.

## Media Handling

- **Profile image upload** via Multer (disk storage) forwarded to ImageKit.
- **Face-aware cropping** — images are transformed to 300×300 with face detection (`fo-face`) on upload.
- **Optional background removal** — when `removeBackground` is set, ImageKit's `e-bgremove` transformation is applied.
- **CDN delivery** — the returned ImageKit URL is stored on the resume.

## Sharing

- **Public resumes** — a resume with `public: true` is accessible without authentication via `/api/resumes/public/:resumeId`.
- **Public view route** — the frontend exposes `/view/:resumeId` for read-only sharing.

## Resume Import (Frontend)

- **PDF to text** — the client uses `react-pdftotext` to extract text from an uploaded PDF before sending it to the AI import endpoint.

## Notes / Current Limitations

- No password reset or email verification flow.
- No role-based access control.
- PDF export is not implemented server-side; sharing is via public links.
- AI endpoints depend on `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL` being configured.
