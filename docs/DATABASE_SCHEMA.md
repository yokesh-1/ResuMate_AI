# Database Schema

The app uses **MongoDB** via Mongoose. Database name: `resume-builder`. There are two collections: `users` and `resumes`.

## Collections Overview

```
users (1) ───< (many) resumes
      userId reference
```

A user can own many resumes; each resume references a single user through `userId`.

---

## `User`

| Field | Type | Constraints / Default |
| ----- | ---- | --------------------- |
| `_id` | ObjectId | auto |
| `name` | String | required |
| `email` | String | required, unique |
| `password` | String | required (bcrypt hash) |
| `createdAt` | Date | auto (timestamps) |
| `updatedAt` | Date | auto (timestamps) |

**Methods**
- `comparePassword(password)` → compares a plaintext password against the stored hash using `bcrypt.compareSync`.

**Notes**
- `password` is set to `undefined` before returning the user in API responses.

---

## `Resume`

| Field | Type | Default |
| ----- | ---- | ------- |
| `_id` | ObjectId | auto |
| `userId` | ObjectId (ref `User`) | — |
| `title` | String | `"Untitled Resume"` |
| `public` | Boolean | `false` |
| `template` | String | `"classic"` |
| `accent_color` | String | `"#3B82F6"` |
| `professional_summary` | String | `""` |
| `skills` | String[] | `[]` |
| `personal_info` | Object | see below |
| `experience` | Object[] | see below |
| `project` | Object[] | see below |
| `education` | Object[] | see below |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

Schema option `minimize: false` keeps empty nested objects in the document.

### `personal_info` (embedded object)

| Field | Type | Default |
| ----- | ---- | ------- |
| `image` | String | `""` |
| `full_name` | String | `""` |
| `profession` | String | `""` |
| `email` | String | `""` |
| `phone` | String | `""` |
| `location` | String | `""` |
| `linkedin` | String | `""` |
| `website` | String | `""` |

### `experience[]` (embedded array)

| Field | Type |
| ----- | ---- |
| `company` | String |
| `position` | String |
| `start_date` | String |
| `end_date` | String |
| `description` | String |
| `is_current` | Boolean |

### `project[]` (embedded array)

| Field | Type |
| ----- | ---- |
| `name` | String |
| `type` | String |
| `description` | String |

### `education[]` (embedded array)

| Field | Type |
| ----- | ---- |
| `institution` | String |
| `degree` | String |
| `field` | String |
| `graduation_date` | String |
| `gpa` | String |

---

## Relationships & Access Rules

- **Ownership**: resume queries are scoped by `userId` for owner-only operations (`get`, `update`, `delete`, `list`).
- **Public access**: `getPublicResumeById` only matches documents where `public: true`, allowing unauthenticated reads.
- **Embedded design**: experience, education, projects, and personal info are embedded sub-documents rather than separate collections, keeping a resume self-contained in a single document.

## Example `Resume` Document

```json
{
  "_id": "66f...",
  "userId": "66a...",
  "title": "Backend Engineer Resume",
  "public": false,
  "template": "modern",
  "accent_color": "#3B82F6",
  "professional_summary": "Results-driven engineer...",
  "skills": ["Node.js", "MongoDB", "React"],
  "personal_info": {
    "image": "https://ik.imagekit.io/...",
    "full_name": "Jane Doe",
    "profession": "Backend Engineer",
    "email": "jane@example.com",
    "phone": "+1 555 0100",
    "location": "Remote",
    "linkedin": "https://linkedin.com/in/janedoe",
    "website": "https://janedoe.dev"
  },
  "experience": [
    {
      "company": "Acme Corp",
      "position": "Engineer",
      "start_date": "2022-01",
      "end_date": "",
      "description": "Built services...",
      "is_current": true
    }
  ],
  "project": [],
  "education": []
}
```
