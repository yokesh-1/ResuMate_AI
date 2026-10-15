# Authentication & Authorization Flow

How users are authenticated and how access to resources is controlled.

## Mechanism

- **Scheme**: stateless **JWT** (JSON Web Token).
- **Signing**: `jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })`.
- **Password security**: `bcrypt` hashing with 10 salt rounds.
- **Token transport**: sent in the `Authorization` header as the raw token (no `Bearer` prefix).
- **Client persistence**: token and user stored in `localStorage`.

## Registration Flow

```
[Client] POST /api/users/register {name,email,password}
   │
   ▼
[userController.registerUser]
   ├─ validate required fields            → 400 if missing
   ├─ check email not already used        → 400 if exists
   ├─ bcrypt.hash(password, 10)
   ├─ User.create({name,email,password:hash})
   ├─ generateToken(user._id)             → JWT (7d)
   └─ strip password
   │
   ▼
201 {message, token, user}  →  [authSlice.login] → localStorage(token,user)
```

## Login Flow

```
[Client] POST /api/users/login {email,password}
   │
   ▼
[userController.loginUser]
   ├─ User.findOne({email})               → 400 "Invalid email or password" if none
   ├─ user.comparePassword(password)      → 400 if mismatch (bcrypt.compareSync)
   ├─ generateToken(user._id)
   └─ strip password
   │
   ▼
200 {message, token, user}  →  [authSlice.login] → localStorage(token,user)
```

## Session Rehydration (on app load)

```
[App.jsx useEffect]
   ├─ read token from localStorage
   ├─ none → dispatch setLoading(false)   (logged-out state)
   └─ token present
        │ GET /api/users/data  (Authorization: token)
        ▼
     [protect] verify JWT
        ├─ valid   → getUserById → dispatch login{token,user}
        └─ invalid → 401 (caught; setLoading(false))
```

## Authorization (per request)

```
Incoming request to a protected route
   │
   ▼
[protect middleware]
   ├─ no Authorization header            → 401 Unauthorized
   ├─ jwt.verify(token, JWT_SECRET)
   │     ├─ fails                        → 401 Unauthorized
   │     └─ ok → req.userId = decoded.userId → next()
   ▼
[controller] uses req.userId to scope data access
```

### Resource-Level Authorization
Authentication proves *who* you are; authorization decides *what you can touch*:

| Rule | Implementation |
| ---- | -------------- |
| Users only access their own resumes | queries use `{ userId, _id }` (e.g., `findOne`, `findOneAndDelete`) |
| Resume lists are per-user | `Resume.find({ userId })` |
| Public resumes bypass auth | `getPublicResumeById` matches `{ public: true, _id }` and the route omits `protect` |

## Logout

```
[authSlice.logout]
   ├─ token → ""
   ├─ user  → null
   └─ localStorage.removeItem("token")
```
> Note: `logout` removes `token` from `localStorage` but leaves the stored `user` key; a minor cleanup opportunity.

## Protected vs Public Endpoints

| Endpoint | Protected |
| -------- | --------- |
| `POST /api/users/register` | No |
| `POST /api/users/login` | No |
| `GET /api/users/data` | Yes |
| `GET /api/users/resumes` | Yes |
| `POST /api/resumes/create` | Yes |
| `PUT /api/resumes/update` | Yes |
| `DELETE /api/resumes/delete/:id` | Yes |
| `GET /api/resumes/get/:id` | Yes |
| `GET /api/resumes/public/:id` | No |
| `POST /api/ai/*` | Yes |

## Security Properties & Gaps

**In place**
- Passwords hashed, never returned.
- Short-lived-ish tokens (7 days), verified on every protected call.
- Owner-scoped data access.
- Secrets via environment variables.

**Gaps / hardening opportunities**
- No token revocation or refresh-token rotation; a leaked token is valid until expiry.
- `localStorage` tokens are exposed to XSS; consider httpOnly cookies if the threat model requires it.
- No rate limiting on login/register (brute-force risk).
- Error messages for login are appropriately generic ("Invalid email or password"), which is good; keep it that way.
