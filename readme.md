
<div align="center">

# 🚀 ResumePilot

### Build a Resume That Gets You Noticed.

An AI-powered resume builder that helps you create, customize, preview, and share professional resumes with ease.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Create • Customize • Enhance • Share**

[Features](#-features) ·
[Tech Stack](#-tech-stack) ·
[Installation](#-getting-started) ·
[API](#-api-reference) ·
[Deployment](#-deployment)

</div>

---

## 📌 Table of Contents

- [🌟 Overview](#-overview)
- [🌟 UI ](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [⚡ Getting Started](#-getting-started)
- [🤖 AI Capabilities](#-ai-capabilities)
- [🎨 Resume Customization](#-resume-customization)
- [🔌 API Reference](#-api-reference)
- [🚀 Deployment](#-deployment)
- [🔐 Security](#-security)
- [🗺️ Future Improvements](#️-future-improvements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Overview

**ResuMate AI** is a full-stack resume-building application designed to simplify the process of creating professional resumes.

Built using the MERN stack, it combines a React-based interface, an Express.js backend, MongoDB data storage, and AI-powered content enhancement.

Whether you're a student preparing your first resume, a developer exploring new opportunities, or a professional updating your career profile, ResuMate AI provides tools to create and manage your resume in one place.

### 🎯 Why ResuMate AI?

- 📝 Create and edit resumes using structured forms.
- 🤖 Improve job descriptions with AI-powered suggestions.
- 🎨 Customize resume templates and accent colors.
- 👀 Preview changes while editing.
- 💾 Save resume information to a database.
- 🔗 Share resumes through public links.
- 🖼️ Upload a profile image and integrate image processing.
- 📱 Work with a responsive user interface.

---

## 🌟 UI Screenshots 
### Home Page
<img width="1920" height="3144" alt="UI" src="https://github.com/user-attachments/assets/684fab1d-6c7a-4e5d-a728-d8e29175360e" />

---
---


### User Page
<img width="1418" height="651" alt="Dashboard" src="https://github.com/user-attachments/assets/5af08e5f-ae50-4f1d-aeac-f55590c581dc" />

---
---


### Multiple Resume Templates  and Color Accents

<img width="1169" height="574" alt="Screenshot from 2026-10-12 08-34-58" src="https://github.com/user-attachments/assets/8f7fac01-2838-4ac0-b082-3339f6667e02" />

---

<img width="1469" height="922" alt="Template-1" src="https://github.com/user-attachments/assets/d9fa698e-c882-4640-a996-d3b7593bdb98" />

---

<img width="1259" height="855" alt="Screenshot from 2026-10-12 08-38-46" src="https://github.com/user-attachments/assets/0168400f-5ae5-47af-a279-56a85af47c0e" />

---

<img width="1167" height="658" alt="Screenshot from 2026-10-12 08-37-38" src="https://github.com/user-attachments/assets/ca753c68-d9b2-41ff-a65a-5485b2dc19bc" />

---


## ✨ Features

### 🔐 Authentication & User Management

- User registration and login.
- JWT-based authentication.
- Protected API endpoints.
- User-specific resume management.

### 📝 Resume Builder

Create resumes using dedicated sections for:

| Section | Description |
|---|---|
| 👤 Personal Information | Name, profession, contact details, and profile image |
| 📄 Professional Summary | Introduce your professional background |
| 💼 Experience | Add positions, companies, employment dates, and descriptions |
| 🎓 Education | Record institutions, degrees, fields of study, and graduation dates |
| 🚀 Projects | Showcase projects and relevant accomplishments |
| ⚡ Skills | Highlight technical and professional skills |

### 🎨 Customization & Preview

- Choose from available resume templates.
- Customize the resume accent color.
- Preview resume content while editing.
- Navigate between resume sections.
- Print or save the resume as a PDF through the browser's print dialog.

### 🤖 AI-Powered Assistance

- Enhance professional experience descriptions.
- Improve the wording of job responsibilities.
- Generate more polished descriptions with AI assistance.

### 🗂️ Resume Management

- Create multiple resumes.
- Retrieve saved resumes from MongoDB.
- Update existing resume information.
- Delete resumes.
- Manage resume visibility.
- Share public resumes using a link.

### 🖼️ Image Handling

- Upload a profile image.
- Process images through ImageKit integration.
- Support image transformations where configured.

---

## 🛠️ Tech Stack

ResuMate AI uses modern JavaScript technologies across its frontend and backend.

### Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and build tooling |
| Redux Toolkit | Application state management |
| React Router | Client-side routing |
| Tailwind CSS | Responsive styling |
| Lucide React | Icons |
| Axios | HTTP requests |
| React Hot Toast | Notifications |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API and server |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JSON Web Token | Authentication |
| bcrypt | Password hashing |
| Multer | File upload handling |
| CORS | Cross-origin request configuration |

### AI & Media

| Technology | Purpose |
|---|---|
| AI API integration | Enhance resume content |
| ImageKit | Image hosting and processing |

> **Note:** Configure the AI provider and ImageKit credentials before using features that depend on these services.

---

## 🏗️ Architecture

ResuMate AI follows a client-server architecture.
```
resume-builder/
│
├── client/                         # Frontend - React + Vite
│   ├── public/                     # Static assets
│   │
│   ├── src/
│   │   ├── app/                    # Redux store configuration
│   │   ├── features/               # Redux slices and state management
│   │   ├── assets/                 # Images and other assets
│   │   │
│   │   ├── components/             # Reusable UI components
│   │   │   ├── templates/          # Resume templates
│   │   │   ├── PersonalInfoForm.jsx
│   │   │   ├── ProfessionalSummaryForm.jsx
│   │   │   ├── ExperienceForm.jsx
│   │   │   ├── EducationForm.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── SkillsForm.jsx
│   │   │   ├── ResumePreview.jsx
│   │   │   ├── TemplateSelector.jsx
│   │   │   └── ColorPicker.jsx
│   │   │
│   │   ├── configs/                # API configuration
│   │   ├── pages/                  # Application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeBuilder.jsx
│   │   │   ├── Preview.jsx
│   │   │   └── Layout.jsx
│   │   │
│   │   ├── App.jsx                 # Root component and routing
│   │   ├── main.jsx                # Application entry point
│   │   └── index.css               # Global styles
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Backend - Node.js + Express
│   ├── configs/                    # Service configurations
│   │   ├── db.js                   # MongoDB connection
│   │   ├── ai.js                   # AI service configuration
│   │   ├── imageKit.js              # ImageKit configuration
│   │   └── multer.js               # File upload configuration
│   │
│   ├── controllers/                # Application business logic
│   │   ├── userController.js       # Authentication and users
│   │   ├── resumeController.js     # Resume CRUD operations
│   │   └── aiController.js         # AI-powered features
│   │
│   ├── middleware/                 # Express middleware
│   │   └── authMiddleware.js       # JWT authentication
│   │
│   ├── models/                     # MongoDB data models
│   │   ├── User.js                 # User schema
│   │   └── Resume.js               # Resume schema
│   │
│   ├── routes/                     # REST API routes
│   │   ├── userRoutes.js           # User endpoints
│   │   ├── resumeRoutes.js         # Resume endpoints
│   │   └── aiRoutes.js              # AI endpoints
│   │
│   ├── .env                        # Backend environment variables
│   ├── package.json
│   └── server.js                   # Backend entry point
│
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
└── LICENSE                         # Project license


```

### Application Flow

1. A user registers or logs in.
2. The frontend sends authenticated requests to the backend.
3. The backend validates requests and identifies the authenticated user.
4. Resume data is created, retrieved, updated, or deleted.
5. MongoDB stores resume and user information.
6. AI and image services handle their respective operations.
7. The frontend displays the saved information and updated resume preview.

---

## ⚡ Getting Started

Follow these steps to run ResuMate AI locally.

### Prerequisites

Install or configure the following:

- [Node.js](https://nodejs.org/) — preferably an active LTS release.
- npm — included with Node.js.
- [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB instance.
- An AI API key for AI-powered features.
- An ImageKit account and private key if using ImageKit features.
- Git.

### 1. Clone the Repository
```

git clone https://github.com/elyse502/resume-builder.git cd resume-builder

```

### 2. Install Dependencies

If your repository contains `client` and `server` directories, run:

**Frontend**
```

cd client npm install

```

**Backend**

Open another terminal:
```

cd server npm install

```

> If your repository uses different directory names, replace `client` and `server` with the actual directory names.

### 3. Configure Environment Variables

Create the environment files in the appropriate project directories.

**Backend `.env`**
```

PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_secret

OPENAI_API_KEY=your_ai_api\_key

IMAGEKIT_PRIVATE_KEY=your_imagekit_private\_key

```

Only configure variables required by your actual backend implementation.

For example, if your AI integration uses a different provider, configure that provider's API key instead of `OPENAI_API_KEY`.

**Frontend `.env`**
```

VITE_API_BASE\_URL=http://localhost:3000

```

If your frontend directly uses additional public configuration values, add them according to your implementation.

**Important:** Never expose private API keys, database credentials, or JWT secrets in frontend environment variables. Vite exposes variables prefixed with `VITE_` to browser code.

### 4. Start the Backend

From the backend directory:
```

npm run server

```

If that script does not exist in your `package.json`, use the appropriate script defined by your project.

For example:
```

npm start

```

The backend should start on the port configured by your environment variables.

### 5. Start the Frontend

From the frontend directory:
```

npm run dev

```

Vite normally serves the application at:
```

http://localhost:5173

```

The backend API in this example runs at:
```

http://localhost:3000

```

### 6. Open the Application

Visit:

**http://localhost:5173**

Register an account, log in, and start building your resume.

---

## 🤖 AI Capabilities

ResuMate AI integrates AI assistance into resume editing.

### ✨ Experience Description Enhancement

Users can provide a company, job title, and existing description to request improved wording.

The application can use AI-generated suggestions to help make descriptions clearer and more professional.

### 💼 Professional Writing

AI-assisted content enhancement can help users:

- Improve sentence structure.
- Use stronger action verbs.
- Communicate responsibilities more clearly.
- Present experience in a professional tone.

### 🔑 API Configuration

AI functionality depends on a valid API key and a correctly configured backend.

Keep provider credentials on the server and handle API failures gracefully.

> AI-generated content should always be reviewed for accuracy. Do not include achievements, qualifications, or experience that you cannot substantiate.

---

## 🎨 Resume Customization

ResuMate AI supports resume customization through its editor.

### Available Customization Options

**Templates**

Choose from the templates implemented in the application, such as:

- Modern
- Classic
- Minimal
- Minimal with profile image

The exact available options depend on the template components in your repository.

**Accent Colors**

Customize the resume's accent color to match your preferred style.

**Resume Sections**

Edit personal information, professional summaries, work experience, education, projects, and skills.

**Preview & Export**

Review the resume and use the browser's print functionality to print it or save it as a PDF.

---

## 🔌 API Reference

The backend exposes REST API endpoints for authentication, resume management, and AI-assisted operations.

The following routes reflect the route structure used in the application. Verify each endpoint against the corresponding Express router before relying on this table.

### 👤 Authentication

Base path: `/api/user`
```

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/register` | Register a user |
| POST | `/login` | Authenticate a user |

Additional profile endpoints depend on the backend implementation.

### 📝 Resume Management

Base path: `/api/resumes`

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| POST | `/create` | Create a resume | Required |
| GET | `/get/:resumeId` | Retrieve a specific resume | Required |
| PUT | `/update` | Update resume information | Required |
| DELETE | `/delete/:resumeId` | Delete a resume | Required |
| GET | `/public/:resumeId` | Retrieve a public resume | Not required |

### 🤖 AI Endpoints

Base path: `/api/ai`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/enhanced-job-desc` | Enhance a job description |

Other AI endpoints depend on the routes implemented in the backend.

### 🔐 Authentication Headers

For protected endpoints, provide the JWT token in the `Authorization` header.

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Use the authentication format expected by your backend middleware.

### 📦 Example: Update a Resume

```
PUT /api/resumes/update
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

The request can contain:

- `resumeId` — ID of the resume being updated.
- `resumeData` — serialized resume data.
- `image` — optional profile image.
- `removeBackground` — optional background-removal flag.

The exact request format depends on the backend controller and upload middleware.

---

## 🚀 Deployment

ResuMate AI can be deployed using separate frontend and backend hosting services.

### Frontend

Potential hosting options:

- Vercel
- Netlify

Configure the frontend build command and output directory according to your Vite project.

Typical settings:

```
Build command: npm run build
Output directory: dist
```

Set the production API URL in the frontend environment variables.

For example:

```
VITE_API_BASE_URL=https://your-backend.example.com
```

### Backend

Potential hosting options include:

- Render
- Railway

Configure the backend start command and production environment variables.

Ensure the backend accepts requests from your deployed frontend origin.

### Database

MongoDB Atlas can host your MongoDB database.

Before deployment:

1. Create a database.
2. Configure database access.
3. Add the production connection string to the backend environment.
4. Verify that the backend can connect successfully.

### Production Checklist

- [ ]Configure production environment variables.
- [ ]Use a strong JWT secret.
- [ ]Restrict CORS to trusted frontend origins.
- [ ]Verify database connectivity.
- [ ]Verify authentication and authorization.
- [ ]Configure AI and ImageKit credentials.
- [ ]Test image uploads in production.
- [ ]Verify resume creation and updates.
- [ ]Configure client-side routing for the deployed frontend.
- [ ]Test public resume links.

---

## 🔐 Security

Security is important when handling personal information and resumes.

Recommended practices include:

- Hash passwords before storing them.
- Keep API keys and database credentials on the backend.
- Protect private resume endpoints with authentication.
- Verify resume ownership before updating or deleting records.
- Validate uploaded files and request data.
- Configure CORS appropriately.
- Avoid logging authentication tokens or sensitive personal information.
- Use HTTPS in production.

---

## 🗺️ Future Improvements

Potential enhancements for future releases include:

- [ ]Automatic saving while editing.
- [ ]Resume version history.
- [ ]PDF import and content extraction.
- [ ]Additional resume templates.
- [ ]Job-description-based keyword recommendations.
- [ ]ATS-oriented resume analysis.
- [ ]More advanced resume analytics.
- [ ]Improved accessibility.
- [ ]Automated testing.
- [ ]Multilingual resume support.

These are proposed improvements, not claims about currently implemented functionality.

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

### Contribution Workflow

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test your changes locally.
5. Commit your changes.
6. Push the branch to your fork.
7. Open a pull request.

### Example

```
git checkout -b feature/new-resume-template

git add .

git commit -m "Add new resume template"

git push origin feature/new-resume-template
```

When contributing, please:

- Keep changes focused.
- Follow the existing code style.
- Avoid committing secrets or `.env` files.
- Update documentation when functionality changes.
- Include tests where appropriate.

---

## 📄 License

This project is distributed under the license specified in the repository.

If you intend to release it under the MIT License, include an appropriate `LICENSE` file in the repository root before describing it as MIT-licensed.

---

\<div align="center"\>

### 💙 Built to Make Resume Creation Simpler

**ResuMate AI** — Your experience deserves a better presentation.

⭐ If you find this project useful, consider giving the repository a star!

GitHub Repository

