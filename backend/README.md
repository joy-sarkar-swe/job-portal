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
