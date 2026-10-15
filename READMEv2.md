# 📄 Resume Builder

A full-stack MERN app for building, editing, and sharing professional resumes — with AI content enhancement, skill suggestions, and an agentic ATS reviewer.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)

## ✨ Highlights

- **4 templates** (Classic, Modern, Minimal, Minimal Image) with live preview and custom accent colors
- **AI enhance** — improve summaries and job descriptions (OpenAI)
- **AI skill suggestions** — get relevant skills from your profession & experience
- **AI Resume Reviewer agent** — scores ATS readiness, suggests fixes, and can apply them (tool-calling agent)
- **PDF import** — upload an existing resume and auto-fill it
- **Shareable public links** and JWT-secured accounts

## 🛠 Stack

**Frontend:** React 19, Redux Toolkit, React Router 7, Tailwind 4, Vite, Axios
**Backend:** Express 5, MongoDB (Mongoose), JWT, bcrypt, Multer
**Services:** OpenAI (content + agent), ImageKit (image CDN)

## 🚀 Quick Start

```bash
# install
cd client && npm install
cd ../server && npm install

# run (two terminals)
cd server && npm run server   # API → http://localhost:3000
cd client && npm run dev      # app → http://localhost:5173
```

### Environment

**server/.env**
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
OPENAI_BASE_URL=optional_custom_endpoint
OPENAI_MODEL=your_model          # required for AI + agent features
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
PORT=3000
```

**client/.env**
```env
VITE_BASE_URL=http://localhost:3000
```

## 📚 Documentation

Full developer docs live in [`docs/`](./docs/README.md):

| Area | Docs |
| ---- | ---- |
| Overview | [Features](./docs/FEATURES.md) · [Tech Stack](./docs/TECH_STACK.md) · [Code Structure](./docs/CODE_STRUCTURE.md) |
| Architecture | [Architecture](./docs/ARCHITECTURE.md) · [System Design](./docs/SYSTEM_DESIGN.md) · [Module Design](./docs/MODULE_DESIGN.md) · [Design Patterns](./docs/DESIGN_PATTERNS.md) · [Data Flow](./docs/DATA_FLOW.md) |
| API | [API Reference](./docs/API.md) · [API Design](./docs/API_DESIGN.md) |
| Data & Auth | [DB Schema](./docs/DATABASE_SCHEMA.md) · [DB Design](./docs/DATABASE_DESIGN.md) · [Auth Flow](./docs/AUTH_FLOW.md) |

## 📄 License

ISC
