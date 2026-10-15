# Documentation

Developer documentation for the Resume Builder project. Everything here reflects the actual implementation in `client/` and `server/`.

## Index

### Overview
| Doc | What's inside |
| --- | ------------- |
| [FEATURES.md](./FEATURES.md) | Everything the app currently does, plus known limitations |
| [TECH_STACK.md](./TECH_STACK.md) | Libraries, tools, and the role each plays |
| [CODE_STRUCTURE.md](./CODE_STRUCTURE.md) | Repository layout and folder responsibilities |

### Architecture & Design
| Doc | What's inside |
| --- | ------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level system layout and low-level code structure |
| [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) | Scalability, security, and deployment topology |
| [MODULE_DESIGN.md](./MODULE_DESIGN.md) | Module responsibilities and how they interact |
| [DESIGN_PATTERNS.md](./DESIGN_PATTERNS.md) | Design patterns used across the stack |
| [DATA_FLOW.md](./DATA_FLOW.md) | Data flow diagrams for the main use cases |

### API
| Doc | What's inside |
| --- | ------------- |
| [API.md](./API.md) | REST endpoints with request/response examples |
| [API_DESIGN.md](./API_DESIGN.md) | API contracts, conventions, and design trade-offs |

### Data & Auth
| Doc | What's inside |
| --- | ------------- |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | MongoDB collections, fields, and relationships |
| [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) | Schema design, indexes, and query patterns |
| [AUTH_FLOW.md](./AUTH_FLOW.md) | Authentication and authorization flows |

## Quick Context

- **Stack**: MERN (MongoDB, Express 5, React 19, Node.js) + Redux Toolkit + Tailwind CSS 4.
- **External services**: OpenAI (AI content + resume parsing), ImageKit (image processing + CDN).
- **Auth**: JWT (7-day expiry), bcrypt-hashed passwords.
- **Default ports**: API on `3000`, Vite dev server on `5173`.

See the root `README.md` for setup and run instructions.
