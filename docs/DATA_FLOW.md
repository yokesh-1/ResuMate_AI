# Data Flow

Diagrams of how data moves through the system for the main use cases.

## Legend
- `──▶` request/data direction
- `[ ]` component or service
- `( )` data store / external service

---

## 1. App Load / Session Rehydration

```
[Browser load]
   │
   ▼
[App.jsx] ── read token from localStorage
   │
   ├── no token ──▶ setLoading(false) ──▶ render app (logged out)
   │
   └── token present
         │ GET /api/users/data (Authorization: token)
         ▼
     [api.js] ──▶ [protect] ──verify JWT──▶ [userController.getUserById]
         │                                        │ find User by req.userId
         ▼                                        ▼
     dispatch(login{token,user}) ◀──── user ──── (MongoDB)
         │
         ▼
     setLoading(false) ──▶ render app (logged in)
```

## 2. Register / Login

```
[Login page] ── submit {name?, email, password}
   │ POST /api/users/register | /login
   ▼
[userController]
   │  register: hash password (bcrypt) ──▶ create User
   │  login: find User ──▶ comparePassword()
   ▼
generateToken(userId)  ──▶  JWT (7d)
   │
   ▼
response {token, user}  ──▶  [authSlice.login]  ──▶  localStorage(token,user)
```

## 3. Create & Edit Resume

```
[Dashboard] ── "New" ──▶ POST /api/resumes/create {title}
   │                         │ protect ──▶ resumeController.createResume
   │                         ▼
   │                     (MongoDB: insert Resume{userId,title})
   ▼
redirect ──▶ [ResumeBuilder /app/builder/:resumeId]
   │ GET /api/resumes/get/:resumeId (protect, owner-scoped)
   ▼
[Forms] edit sections ──update──▶ page-local resume state
   │                                   │
   ▼                                   ▼
[ResumePreview] ◀── renders ──── active template + accent_color
```

## 4. Save Resume (with optional image)

```
[ResumeBuilder] ── PUT /api/resumes/update (multipart)
   │   fields: resumeId, resumeData(JSON), removeBackground?, image?
   ▼
[protect] ──▶ [multer] write temp file to disk
   │
   ├── image present
   │      │ stream file ──▶ (ImageKit upload)
   │      │   transform: w-300,h-300,fo-face,z-0.75 [,e-bgremove]
   │      ▼
   │   CDN url ──▶ resumeData.personal_info.image
   │
   ▼
[resumeController.updateResume] ──▶ (MongoDB: findByIdAndUpdate)
   │
   ▼
response {resume} ──▶ [ResumeBuilder] refresh preview
```

## 5. AI Resume Import (PDF → structured resume)

```
[Client] user uploads PDF
   │ react-pdftotext extracts text
   ▼
POST /api/ai/upload-resume {title, resumeText}
   │ protect ──▶ aiController.uploadResume
   ▼
(OpenAI chat.completions, response_format: json_object)
   │ system+user prompt → structured JSON
   ▼
JSON.parse ──▶ (MongoDB: create Resume{userId,title,...parsed})
   │
   ▼
response {resumeId} ──▶ redirect to builder
```

## 6. AI Field Enhancement

```
[Form field] "Enhance" ── POST /api/ai/enhanced-pro-sum | enhanced-job-desc
   │ {userContent}
   ▼
[protect] ──▶ [aiController] ──▶ (OpenAI chat.completions)
   │                                   │ system prompt (ATS-friendly, 1–2 sentences)
   ▼                                   ▼
response {enhancedContent} ──▶ update form field
```

## 7. Public Resume View (unauthenticated)

```
[Visitor] open /view/:resumeId
   │ GET /api/resumes/public/:resumeId   (no auth)
   ▼
[resumeController.getPublicResumeById]
   │ find Resume where {public:true, _id}
   ▼
   ├── found ──▶ response {resume} ──▶ [Preview] render template
   └── not public/not found ──▶ 404 {message}
```

## Trust Boundaries

```
┌─────────── Untrusted (browser) ───────────┐
│  localStorage token, user input, uploads  │
└───────────────────┬───────────────────────┘
                    │ JWT + validation
┌───────────────────▼───────────────────────┐
│          Trusted (API server)              │
│  controllers, models, generated tokens     │
└───────┬───────────────────────┬────────────┘
        │                       │
   (MongoDB)            (OpenAI / ImageKit)
```
