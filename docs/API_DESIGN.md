# API Design

Design principles and contracts behind the REST API. For concrete request/response examples, see [API.md](./API.md).

## Design Principles

- **Resource-oriented base paths**: `/api/users`, `/api/resumes`, `/api/ai`.
- **JSON everywhere** except file upload (`/api/resumes/update` uses `multipart/form-data`).
- **Stateless**: every request carries its own JWT; the server stores no session.
- **Owner-scoped access**: private resume operations always filter by `userId`.
- **Explicit, flat error contract**: failures return `{ "message": "<reason>" }` with an appropriate status code.

## Conventions

### Authentication Header
The raw JWT is sent in the `Authorization` header (no `Bearer` prefix):
```
Authorization: <token>
```

### Status Codes
| Code | Meaning in this API |
| ---- | ------------------- |
| 200 | Successful read/update/delete |
| 201 | Resource created (register, resume create) |
| 400 | Validation error / business rule failure |
| 401 | Missing or invalid token |
| 404 | Resource not found / not accessible |

### Response Envelopes
Responses are not uniformly wrapped; shapes vary by endpoint:
- Auth: `{ message, token, user }`
- Resume reads: `{ resume }` or `{ resumes }`
- AI: `{ enhancedContent }` or `{ resumeId }`

> Consistency note: `getUserById` returns the user object directly, while most others nest under a key. A future revision could standardize on a single envelope.

## Contracts by Resource

### Users
| Method | Path | Auth | Request | Success |
| ------ | ---- | ---- | ------- | ------- |
| POST | `/register` | — | `{name,email,password}` | `201 {message,token,user}` |
| POST | `/login` | — | `{email,password}` | `200 {message,token,user}` |
| GET | `/data` | ✅ | — | `200 user` |
| GET | `/resumes` | ✅ | — | `200 {resumes:[]}` |

### Resumes
| Method | Path | Auth | Request | Success |
| ------ | ---- | ---- | ------- | ------- |
| POST | `/create` | ✅ | `{title}` | `201 {message,resume}` |
| PUT | `/update` | ✅ | multipart: `resumeId, resumeData, removeBackground?, image?` | `200 {message,resume}` |
| DELETE | `/delete/:resumeId` | ✅ | — | `200 {message}` |
| GET | `/get/:resumeId` | ✅ | — | `200 {resume}` / `404` |
| GET | `/public/:resumeId` | — | — | `200 {resume}` / `404` |

### AI
| Method | Path | Auth | Request | Success |
| ------ | ---- | ---- | ------- | ------- |
| POST | `/enhanced-pro-sum` | ✅ | `{userContent}` | `200 {enhancedContent}` |
| POST | `/enhanced-job-desc` | ✅ | `{userContent}` | `200 {enhancedContent}` |
| POST | `/upload-resume` | ✅ | `{title, resumeText}` | `200 {resumeId}` |

## Idempotency & Side Effects

| Endpoint | Idempotent? | Side effects |
| -------- | ----------- | ------------ |
| `GET` reads | Yes | none |
| `POST /create`, `/upload-resume` | No | inserts a document |
| `PUT /update` | Yes (same payload → same state) | may upload to ImageKit |
| `DELETE /delete/:id` | Yes | removes a document |
| AI enhance endpoints | No (non-deterministic output) | external OpenAI call |

## Security Contract

- Protected routes reject requests without a valid JWT (`401`).
- `/public/:resumeId` only returns resumes explicitly marked `public: true`.
- Passwords are never returned; `password` is stripped from user responses.

## Versioning & Evolution Notes

- No API version prefix today (`/api/...`). If breaking changes are introduced, add `/api/v1/...`.
- Recommended future improvements: uniform response envelope, request validation middleware, pagination on `GET /api/users/resumes`, and rate limiting on auth + AI routes.

## Design Trade-offs

- **Multipart on a single update endpoint** keeps image upload and data save atomic from the client's perspective, at the cost of a mixed content type.
- **Raw token header** (no `Bearer`) is simple but non-standard; clients must match it exactly.
- **Non-deterministic AI endpoints** mean responses shouldn't be cached and should be treated as suggestions.
