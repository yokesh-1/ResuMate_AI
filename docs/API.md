# API Reference

Base URL: `http://localhost:3000` (default; set via `PORT`).

All protected endpoints require a JWT in the `Authorization` header (the raw token, no `Bearer` prefix):

```
Authorization: <token>
```

Unauthorized requests return `401 { "message": "Unauthorized" }`.

---

## Users — `/api/users`

### POST `/register`
Register a new user.

**Body**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

**201 Response**
```json
{
  "message": "User created successfully",
  "token": "<jwt>",
  "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com" }
}
```

Errors: `400` for missing fields or an already-registered email.

### POST `/login`
Authenticate and receive a token.

**Body**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**200 Response**
```json
{ "message": "Login successful", "token": "<jwt>", "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com" } }
```

Errors: `400 { "message": "Invalid email or password" }`.

### GET `/data` 🔒
Return the authenticated user (password omitted).

### GET `/resumes` 🔒
Return all resumes owned by the authenticated user.

**200 Response**
```json
{ "resumes": [ { "_id": "...", "title": "Untitled Resume", "template": "classic" } ] }
```

---

## Resumes — `/api/resumes`

### POST `/create` 🔒
Create a new resume.

**Body**
```json
{ "title": "Backend Engineer Resume" }
```

**201 Response**
```json
{ "message": "Resume created successfully", "resume": { "_id": "...", "title": "Backend Engineer Resume" } }
```

### PUT `/update` 🔒
Update a resume. Accepts `multipart/form-data` so an image can be attached.

**Form fields**
- `resumeId` — the resume ID.
- `resumeData` — the resume object (JSON string or object).
- `removeBackground` — optional flag; when truthy, applies background removal to the uploaded image.
- `image` — optional file field (processed by Multer → ImageKit).

**200 Response**
```json
{ "message": "Saved successfully", "resume": { "_id": "...", "personal_info": { "image": "https://ik.imagekit.io/..." } } }
```

### DELETE `/delete/:resumeId` 🔒
Delete a resume owned by the user.

**200 Response**
```json
{ "message": "Resume deleted successfully" }
```

### GET `/get/:resumeId` 🔒
Get a single resume owned by the user (`__v`, `createdAt`, `updatedAt` omitted).

**200 Response**
```json
{ "resume": { "_id": "...", "title": "...", "skills": [], "experience": [] } }
```

Errors: `404 { "message": "Resume not found" }`.

### GET `/public/:resumeId`
Get a publicly shared resume (only returns resumes with `public: true`). No auth required.

---

## AI — `/api/ai`

### POST `/enhanced-pro-sum` 🔒
Enhance a professional summary into a 1–2 sentence, ATS-friendly version.

**Body**
```json
{ "userContent": "Software developer with 3 years experience building web apps." }
```

**200 Response**
```json
{ "enhancedContent": "Results-driven software developer with 3+ years..." }
```

### POST `/enhanced-job-desc` 🔒
Enhance a job/experience description using action verbs and quantifiable results.

**Body**
```json
{ "userContent": "Responsible for maintaining the payments service." }
```

**200 Response**
```json
{ "enhancedContent": "Maintained and optimized the payments service, reducing..." }
```

### POST `/upload-resume` 🔒
Parse extracted resume text into the structured schema and create a new resume.

**Body**
```json
{ "title": "Imported Resume", "resumeText": "<raw text extracted from a PDF>" }
```

**200 Response**
```json
{ "resumeId": "<new resume id>" }
```

Errors: `400 { "message": "Missing required fields" }` when `resumeText` is absent.

---

## Conventions

- 🔒 = requires a valid JWT.
- Error responses use the shape `{ "message": "<reason>" }`.
- Most handlers return `400` on failure and `401` for auth failures.

## cURL Example

```bash
# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'

# Create a resume (using the returned token)
curl -X POST http://localhost:3000/api/resumes/create \
  -H "Content-Type: application/json" \
  -H "Authorization: <token>" \
  -d '{"title":"My Resume"}'
```
