# Job Recruitment Management System — Backend & API

Node.js + Express + MongoDB backend for the Job Recruitment Management System.
Covers everything under **Member 2 — Backend & API Development**:

- Node.js/Express server setup
- MongoDB connection (Mongoose)
- REST APIs for registration, login, jobs, applications, profiles, and recruiter operations
- Request validation & centralized error handling
- JWT authentication with role-based access (`job_seeker`, `recruiter`, `admin`)
- Ready for the frontend to consume (CORS enabled, JSON in/out)

## 1. Project Structure

```
backend/
├── config/db.js                 MongoDB connection
├── models/                      Mongoose schemas (User, Company, Job, Application)
├── middleware/
│   ├── auth.js                  JWT verification + role-based access (protect, authorize)
│   ├── validate.js              express-validator error formatter
│   └── errorHandler.js          Central error handler + 404 handler
├── controllers/                 Route handler logic
├── routes/                      Express routers per resource
├── utils/                       asyncHandler, ApiError, generateToken
├── database/                    Your teammate's sample JSON (users/companies/jobs/applications)
├── scripts/seedDatabase.js      Loads database/*.json into MongoDB via the models
├── server.js                    App entry point
└── .env.example                 Copy to .env and fill in
```

## 2. Setup

```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET as needed
```

Make sure MongoDB is running locally (or point `MONGO_URI` at Atlas), then:

```bash
npm run seed     # loads database/*.json into job_recruitment_db
npm run dev      # starts the API on http://localhost:5000 (nodemon)
# or
npm start
```

### About the seed data

Your teammate's `users.json` was exported before authentication existed, so it has
**no password field**. `npm run seed` imports all four collections and gives every
seeded user the password `Password123` (each password is hashed individually, so
login works immediately). Override the default via `SEED_DEFAULT_PASSWORD` in `.env`
if you want something else. For example, after seeding you can log in as a recruiter with:

```
email: rahul@techcorp.example
password: Password123
```

The seed script also recreates the `location` index on `jobs` and preserves the
existing `jobId` / `applicationId` values, so it matches `database_setup.md` exactly.

## 3. Auth model

- **JWT-based**: `POST /api/auth/login` returns a token; send it as
  `Authorization: Bearer <token>` on protected routes.
- **Roles**: `job_seeker`, `recruiter`, `admin`. Each protected route uses
  `protect` (must be logged in) and `authorize('role1', 'role2', ...)` (must have
  one of those roles).
- Recruiters are additionally scoped to their own `company` — a recruiter can only
  edit/delete their own jobs and only view/manage applicants for their own postings.

## 4. API Reference

All responses are JSON in the shape `{ success, message?, ...data }`. Errors are
`{ success: false, message, details? }`.

### Auth — `/api/auth`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a `job_seeker` or `recruiter`. Body: `name, email, password, role, skills[]` (job_seeker) or `company` (recruiter). |
| POST | `/login` | Public | Body: `email, password`. Returns `{ token, user }`. |
| GET | `/me` | Private | Returns the logged-in user. |

### Profile — `/api/profile`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/me` | Private | View your own profile. |
| PUT | `/me` | Private | Update your profile. job_seeker: `name, skills, resumeUrl`. recruiter: `name, company`. |
| GET | `/:id` | admin | View any user's profile. |

### Jobs — `/api/jobs`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List jobs. Query params: `location, jobType, experience, skill, search, page, limit`. |
| GET | `/:id` | Public | Get one job by Mongo `_id` or `jobId` (e.g. `JOB003`). |
| POST | `/` | recruiter, admin | Create a job. Recruiters post under their own company automatically. |
| PUT | `/:id` | recruiter (own company), admin | Update a job. |
| DELETE | `/:id` | recruiter (own company), admin | Delete a job. |

### Applications — `/api/applications`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | job_seeker | Apply to a job. Body: `{ jobId }`. Rejects duplicate applications. |
| GET | `/me` | job_seeker | View your own applications (with job details attached). |
| GET | `/stats` | recruiter, admin | Application counts grouped by status (the aggregation from `database_setup.md`). Recruiters see only their own company's numbers. |
| GET | `/job/:jobId` | recruiter (own job), admin | View all applicants for a specific job. |
| PUT | `/:id/status` | recruiter (own job), admin | Update an applicant's status: `Applied, Shortlisted, Interview, Selected, Rejected`. |

### Companies — `/api/companies`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all companies. |
| GET | `/:id` | Public | Get one company. |
| POST | `/` | admin | Create a company. |

### Recruiter operations — `/api/recruiter`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/jobs` | recruiter, admin | All jobs posted under the logged-in recruiter's company. |
| GET | `/dashboard` | recruiter, admin | Job count, total applicants, and status breakdown for their company. |

## 5. Example requests

**Register a job seeker**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret123","skills":["JavaScript","React"]}'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@techcorp.example","password":"Password123"}'
```

**Apply to a job (with token)**
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"jobId":"JOB001"}'
```

## 6. Validation & error handling

- Input validation uses `express-validator` on every write route (register, login,
  job create, application status, etc.) and returns `400` with a `details` array
  naming each invalid field.
- A central error handler (`middleware/errorHandler.js`) normalizes Mongoose
  `CastError`, `ValidationError`, duplicate-key (`11000`), and JWT errors into
  consistent JSON responses, plus a catch-all `404` for unknown routes.

## 7. Frontend integration notes

- CORS is open via `CLIENT_ORIGIN` in `.env` — set it to your frontend's dev URL.
- Store the JWT from `/api/auth/login` (e.g. in localStorage) and attach it as
  `Authorization: Bearer <token>` on every subsequent request.
- `GET /api/jobs` supports pagination (`page`, `limit`) so the frontend can build
  a paged job listing directly against it.
