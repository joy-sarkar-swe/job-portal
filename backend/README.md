# 🚀 Job Portal Backend API

A comprehensive job portal backend built with **NestJS**, **MongoDB (Mongoose)**, **JWT Authentication**, and **Passport.js**. This RESTful API provides complete functionality for job seekers, employers, and administrators to manage job postings, applications, and user accounts.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Key Features](#key-features)
- [Testing](#testing)
- [License](#license)

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** with Passport.js
- **Role-based access control** (Job Seeker, Employer, Admin)
- **Password hashing** using bcrypt
- **Auto-generated admin user** on first startup
- **User blocking/unblocking** by admin

### 👥 User Management

- Multi-role user system (Job Seeker, Employer, Admin)
- Profile management for job seekers (bio, skills, resume)
- Employer approval workflow
- User listing with pagination and filtering

### 💼 Job Management

- Job posting by approved employers
- Job editing (employers can only edit their own jobs)
- Public job browsing with filters (location, job type)
- Job applicant viewing for employers
- Pagination support

### 📝 Application System

- Job application by job seekers
- Duplicate application prevention
- Application history tracking
- Pagination for applications

### 👨‍💼 Admin Panel

- Employer approval/rejection
- User blocking/unblocking
- View all jobs and applications
- User management with filters

## 🛠️ Tech Stack

- **Framework:** NestJS 11
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Passport.js + JWT
- **Validation:** class-validator & class-transformer
- **Password Hashing:** bcrypt
- **Language:** TypeScript
- **API Versioning:** v1 (prefix: `/api/v1`)

## 📁 Project Structure

```
common/                       # Auth decorators and guards
database/                     # Database initialization service for the pre admin creation
src/
├── admin/                    # Admin module (user & employer management)
├── applications/             # Job application management
├── auth/                     # Authentication (register, login, JWT)
│   ├── dto/                  # Data Transfer Objects
│   ├── strategies/           # Passport JWT strategy
├── common/
│   ├── decorators/           # Custom decorators (@GetUser, @Roles)
│   └── guards/               # Reusable guards (JWT, Roles, EmployerApproval)
├── employer/                 # Employer-specific features
├── jobs/                     # Job CRUD operations
│   └── dto/                  # Job DTOs with validation
├── schemas/                  # Mongoose schemas
│   ├── user.schema.ts        # User model
│   ├── job.schema.ts         # Job model
│   └── application.schema.ts # Application model
├── user/                     # User profile management
├── app.module.ts             # Root module
└── main.ts                   # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/JoySarkarBD/job-portal.git
   cd job-portal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/job-portal
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRATION=7d
   DEFAULT_ADMIN_EMAIL=admin@jobportal.com
   DEFAULT_ADMIN_PASSWORD=Admin@123
   ```

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**

   ```bash
   # Development mode with hot reload
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Access the API**
   ```
   http://localhost:3000/api/v1
   ```

### First-Time Setup

On the first startup, the application automatically creates a default admin user if none exists:

- **Email:** `admin@jobportal.com` (or from `DEFAULT_ADMIN_EMAIL`)
- **Password:** `Admin@123` (or from `DEFAULT_ADMIN_PASSWORD`)

⚠️ **Important:** Change the default admin password after first login!

## 🔐 Environment Variables

| Variable                 | Description                 | Default                                | Required |
| ------------------------ | --------------------------- | -------------------------------------- | -------- |
| `NODE_ENV`               | Environment mode            | `development`                          | No       |
| `PORT`                   | Server port                 | `3000`                                 | No       |
| `MONGODB_URI`            | MongoDB connection string   | `mongodb://localhost:27017/job-portal` | Yes      |
| `JWT_SECRET`             | Secret key for JWT signing  | -                                      | Yes      |
| `JWT_EXPIRATION`         | Token expiration time       | `7d`                                   | No       |
| `DEFAULT_ADMIN_NAME`     | Auto-created admin name     | `System Admin`                         | No       |
| `DEFAULT_ADMIN_EMAIL`    | Auto-created admin email    | `admin@jobportal.com`                  | No       |
| `DEFAULT_ADMIN_PASSWORD` | Auto-created admin password | `Admin@123`                            | No       |
| `BCRYPT_SALT_ROUNDS`     | Password hashing rounds     | `10`                                   | No       |

## 📚 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Authentication (`/auth`)

| Method | Endpoint         | Description       | Access |
| ------ | ---------------- | ----------------- | ------ |
| POST   | `/auth/register` | Register new user | Public |
| POST   | `/auth/login`    | Login user        | Public |

**Register Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "jobseeker" // or "employer" or "admin"
}
```

**Login Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Module (`/user`)

| Method | Endpoint             | Description                          | Access        |
| ------ | -------------------- | ------------------------------------ | ------------- |
| GET    | `/user/me`           | Get current user profile             | Authenticated |
| PATCH  | `/user/profile`      | Update profile (bio, skills, resume) | Job Seeker    |
| GET    | `/user/applied-jobs` | Get applied jobs with pagination     | Job Seeker    |

**Update Profile Request:**

```json
{
  "bio": "Experienced developer",
  "skills": ["JavaScript", "React", "Node.js"],
  "resumeUrl": "https://example.com/resume.pdf"
}
```

### Employer Module (`/employer`)

| Method | Endpoint           | Description           | Access   |
| ------ | ------------------ | --------------------- | -------- |
| GET    | `/employer/status` | Check approval status | Employer |

### Jobs Module (`/jobs`)

| Method | Endpoint               | Description                              | Access            |
| ------ | ---------------------- | ---------------------------------------- | ----------------- |
| POST   | `/jobs`                | Create new job                           | Approved Employer |
| PATCH  | `/jobs/:id`            | Update own job                           | Approved Employer |
| GET    | `/jobs`                | Get all jobs (with filters & pagination) | Public            |
| GET    | `/jobs/:id`            | Get job details                          | Public            |
| GET    | `/jobs/:id/applicants` | View job applicants                      | Job Owner         |

**Create Job Request:**

```json
{
  "title": "Senior Full Stack Developer",
  "company": "Tech Corp",
  "location": "Dhaka",
  "jobType": "full-time", // or "part-time" or "remote"
  "salaryRange": "$50,000 - $70,000",
  "description": "Looking for an experienced developer..."
}
```

**Query Parameters for GET /jobs:**

- `location` - Filter by location (case-insensitive)
- `jobType` - Filter by job type (full-time, part-time, remote)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

Example: `/api/v1/jobs?location=Dhaka&jobType=full-time&page=1&limit=10`

### Applications Module (`/applications`)

| Method | Endpoint               | Description                         | Access     |
| ------ | ---------------------- | ----------------------------------- | ---------- |
| POST   | `/applications/:jobId` | Apply for a job                     | Job Seeker |
| GET    | `/applications/my`     | Get my applications with pagination | Job Seeker |

**Query Parameters for GET /applications/my:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Admin Module (`/admin`)

| Method | Endpoint                       | Description                             | Access |
| ------ | ------------------------------ | --------------------------------------- | ------ |
| GET    | `/admin/users`                 | Get all users with filters & pagination | Admin  |
| PATCH  | `/admin/user/block/:userId`    | Block/unblock user                      | Admin  |
| GET    | `/admin/employers/pending`     | Get pending employers                   | Admin  |
| PATCH  | `/admin/employers/approve/:id` | Approve employer                        | Admin  |
| GET    | `/admin/jobs`                  | View all jobs with pagination           | Admin  |
| GET    | `/admin/applications`          | View all applications                   | Admin  |

**Query Parameters for GET /admin/users:**

- `role` - Filter by role (jobseeker, employer, admin)
- `isBlocked` - Filter by blocked status (true/false)
- `page` - Page number
- `limit` - Items per page

## 🗄️ Database Schema

### User Schema

```typescript
{
  name: string;              // required
  email: string;             // required, unique, lowercase
  password: string;          // required, hashed
  role: enum;                // jobseeker | employer | admin
  bio?: string;              // optional (job seekers)
  skills: string[];          // array of skills (job seekers)
  resumeUrl?: string;        // optional (job seekers)
  isEmployerApproved: boolean; // default: false (employers)
  isBlocked: boolean;        // default: false
  createdAt: Date;           // auto-generated
  updatedAt: Date;           // auto-generated
}
```

### Job Schema

```typescript
{
  title: string;             // required
  company: string;           // required
  location: string;          // required
  jobType: enum;             // full-time | part-time | remote
  salaryRange: string;       // required
  description: string;       // required
  employer: ObjectId;        // reference to User
  createdAt: Date;           // auto-generated
  updatedAt: Date;           // auto-generated
}
```

### Application Schema

```typescript
{
  job: ObjectId; // reference to Job
  jobseeker: ObjectId; // reference to User
  appliedAt: Date; // auto-generated
}
// Unique compound index: (job, jobseeker)
```

## 🔒 Authentication & Authorization

### JWT Authentication

- All protected routes require a valid JWT token
- Token is sent in the `Authorization` header: `Bearer <token>`
- Token expiration: 7 days (configurable)

### Role-Based Access Control

**Guards:**

1. **JwtAuthGuard** - Validates JWT token and extracts user
2. **RolesGuard** - Checks if user has required role(s)
3. **EmployerApprovalGuard** - Ensures employer is approved

**Decorators:**

- `@GetUser()` - Extracts current user from request
- `@Roles(...roles)` - Defines required roles for route

### Access Matrix

| Feature           | Public | Job Seeker | Employer (Pending) | Employer (Approved) | Admin |
| ----------------- | ------ | ---------- | ------------------ | ------------------- | ----- |
| Register/Login    | ✅     | ✅         | ✅                 | ✅                  | ✅    |
| Browse Jobs       | ✅     | ✅         | ✅                 | ✅                  | ✅    |
| Apply for Jobs    | ❌     | ✅         | ❌                 | ❌                  | ❌    |
| Update Profile    | ❌     | ✅         | ❌                 | ❌                  | ❌    |
| Check Status      | ❌     | ❌         | ✅                 | ✅                  | ❌    |
| Create Jobs       | ❌     | ❌         | ❌                 | ✅                  | ❌    |
| Edit Own Jobs     | ❌     | ❌         | ❌                 | ✅                  | ❌    |
| View Applicants   | ❌     | ❌         | ❌                 | ✅ (own)            | ✅    |
| Approve Employers | ❌     | ❌         | ❌                 | ❌                  | ✅    |
| Block Users       | ❌     | ❌         | ❌                 | ❌                  | ✅    |

## 🎯 Key Features

### 🛡️ Security

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Role-based authorization
- ✅ Input validation on all endpoints
- ✅ CORS enabled
- ✅ Passwords never returned in responses

### ✨ Edge Cases Handled

- ✅ Employer can login but can't create jobs until approved
- ✅ Job seeker can't apply twice for the same job (unique index)
- ✅ Employer can only edit their own jobs
- ✅ Blocked users can't login
- ✅ Admin has read-only access to jobs/applications
- ✅ Email uniqueness validation
- ✅ Case-insensitive email storage

### 📊 Pagination & Filtering

- All list endpoints support pagination
- Configurable page size (default: 10)
- Filtering by role, status, location, job type
- Sorting by creation date

### 🚀 Auto-Initialization

- Automatic admin user creation on first startup
- Database connection health check
- Graceful error handling

## 🧪 Testing

### Manual Testing

1. **Register an admin user** (or use auto-created admin)
2. **Register an employer**
3. **Login as admin** and approve the employer
4. **Login as employer** and create jobs
5. **Register a job seeker** and apply for jobs
6. **Test edge cases** (duplicate applications, unauthorized access, etc.)

### Using Tools

- **Postman** - Import API collection
- **Insomnia** - REST client
- **Thunder Client** - VS Code extension
- **cURL** - Command line testing

### Example cURL Request

```bash
# Register a user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "jobseeker"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 📝 Scripts

```bash
# Development
npm run start:dev          # Start with hot reload

# Production
npm run build             # Build the project
npm run start:prod        # Run production build

# Code Quality
npm run format            # Format code with Prettier
npm run lint              # Lint and fix code

# Testing
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Generate coverage report
npm run test:e2e          # Run end-to-end tests
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Joy Sarkar**

- GitHub: [@JoySarkarBD](https://github.com/JoySarkarBD)

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database: [MongoDB](https://www.mongodb.com/)
- Authentication: [Passport.js](http://www.passportjs.org/)

---

**⭐ Star this repository if you find it helpful!**
