# Database Design

Schema design decisions, indexes, and relationships. For the full field-by-field reference, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).

## Datastore

- **MongoDB** accessed via **Mongoose**.
- Database name: `resume-builder` (set in `configs/db.js`).
- Two collections: `users`, `resumes`.

## Design Approach

The design favors **document embedding over normalization**. A resume embeds its personal info, experience, education, and projects as sub-documents, so a complete resume loads in a single read with no joins. This matches the access pattern: resumes are almost always read/written as a whole.

The only reference relationship is `Resume.userId → User._id`.

## Entity Relationship

```
┌────────────┐          owns          ┌─────────────────────────────┐
│   User     │ 1 ───────────────── *  │   Resume                    │
│────────────│                        │─────────────────────────────│
│ _id        │◀───────────────────────│ userId (ref User)           │
│ name       │                        │ title, public, template     │
│ email (U)  │                        │ accent_color                │
│ password   │                        │ professional_summary, skills│
│ timestamps │                        │ personal_info {…}  (embedded)│
└────────────┘                        │ experience [ {…} ] (embedded)│
                                       │ project    [ {…} ] (embedded)│
                                       │ education  [ {…} ] (embedded)│
                                       │ timestamps                   │
                                       └─────────────────────────────┘
(U) = unique
```

## Indexes

| Collection | Field | Index | Source |
| ---------- | ----- | ----- | ------ |
| `users` | `email` | **unique** | `unique: true` in `User` schema |
| `users` | `_id` | default (primary) | MongoDB |
| `resumes` | `_id` | default (primary) | MongoDB |

### Recommended Additional Indexes
These aren't defined yet but match actual query patterns:

| Collection | Suggested index | Why |
| ---------- | --------------- | --- |
| `resumes` | `{ userId: 1 }` | `getUserResumes` and owner-scoped lookups filter by `userId` |
| `resumes` | `{ public: 1, _id: 1 }` | `getPublicResumeById` filters on `public` + `_id` |

Example (Mongoose):
```js
ResumeSchema.index({ userId: 1 });
ResumeSchema.index({ public: 1 });
```

## Schema Options & Rationale

| Option | Value | Rationale |
| ------ | ----- | --------- |
| `timestamps` | `true` (both models) | Automatic `createdAt`/`updatedAt` |
| `minimize` | `false` (Resume) | Keep empty embedded objects (e.g., empty `personal_info`) so the client always sees the full shape |
| defaults | many | Resume fields default to empty strings/arrays so new resumes render cleanly |

## Data Integrity Notes

- **Uniqueness**: enforced on `email`; registration also checks for an existing user before insert.
- **Referential integrity**: `userId` is a reference but not a hard FK (MongoDB doesn't enforce FKs). Deleting a user does **not** cascade to their resumes — a cleanup step would be needed if user deletion is added.
- **Ownership checks** happen in application code (controllers), not the DB.

## Access Patterns → Query Mapping

| Operation | Query |
| --------- | ----- |
| List my resumes | `Resume.find({ userId })` |
| Open my resume | `Resume.findOne({ userId, _id })` |
| Public view | `Resume.findOne({ public: true, _id })` |
| Save resume | `Resume.findByIdAndUpdate(...)` |
| Delete resume | `Resume.findOneAndDelete({ userId, _id })` |
| Login lookup | `User.findOne({ email })` |

## Scaling Considerations

- Embedded documents keep resumes atomic and read-efficient; the 16 MB BSON document limit is far beyond realistic resume size.
- Adding the `userId` and `public` indexes above is the highest-value optimization as data grows.
- No multi-document transactions are needed since each operation touches a single document.
