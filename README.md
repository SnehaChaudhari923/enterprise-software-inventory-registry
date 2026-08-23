# Enterprise Software Inventory Registry

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A modern, responsive full-stack enterprise web application for centralized corporate software inventory governance, tracking technology stacks, departmental ownership, lifecycle status, risk criticality, and compliance metadata.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Database Setup & Prisma Seeding](#-database-setup--prisma-seeding)
- [Running the Application](#-running-the-application)
- [Demo Admin Credentials](#-demo-admin-credentials)
- [REST API Reference](#-rest-api-reference)
- [Deployment Guide](#-deployment-guide)
  - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
  - [Backend Deployment (Render)](#backend-deployment-render)
  - [PostgreSQL Database (Neon / Supabase / Render)](#postgresql-database-neon--supabase--render)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## 🌟 Overview

Large organizations maintain dozens or hundreds of internal software platforms, custom microservices, third-party enterprise tools, and legacy systems. Without centralized inventory governance, organizations face security blindspots, duplicate development costs, and compliance risks.

The **Enterprise Software Inventory Registry** provides corporate architecture review boards, engineering leaders, and compliance officers with a single source of truth to:

- Register, track, and audit internal software applications.
- Map business domains and designated point-of-contact owners.
- Monitor technology stacks, frameworks, databases, and hosting infrastructure.
- Track lifecycle stages (*Active*, *Under Maintenance*, *Deprecated*, *Planned*).
- Classify business criticality tiers (*Critical*, *High*, *Medium*, *Low*).
- Generate interactive visual metrics and downloadable CSV compliance reports.

---

## ✨ Key Features

### 1. Enterprise Authentication & Security
- Secure JWT-based authentication with Bearer token authorization header.
- Robust password encryption using `bcryptjs`.
- Session expiration detection and graceful redirect.
- Protected workspace routes with role-based access tokens.
- Demo 1-click credential autofill for easy evaluation.

### 2. Executive Dashboard & Metrics
- **Real-time KPI Cards**: Total software systems, Active systems, Under Maintenance, Deprecated systems, Planned systems, and Tier-1 Critical platforms.
- **Interactive Recharts Visualizations**:
  - Systems by Lifecycle Status (Donut Chart)
  - Systems by Technology Stack (Bar Chart)
  - Systems by Business Domain (Horizontal Bar Chart)
  - Systems by Risk & Criticality Tier (Donut Chart)
- **Recent Systems Feed**: Instant overview of the latest updated platforms.

### 3. Comprehensive Software Registry Table
- Search across system names, system IDs, domain owners, descriptions, and technology stacks.
- Multi-criteria filtering by **Status**, **Environment**, **Criticality**, and **Business Domain**.
- Interactive column sorting (Name, System ID, Domain, Status, Criticality, Last Updated).
- Configurable pagination controls (5, 10, 25, 50 rows per page).
- Inline action controls with accessible **Confirmation Modal** for destructive delete operations.

### 4. Software System Lifecycle Management (CRUD)
- **Add Software System**: Clean, sectioned form with input validation (Basic Information, Technical Specifications, Deployment Status, Governance & Security Notes).
- **System Profile View**: Tabbed architectural profile displaying badges, tags, contact email links, repository/docs URLs, dependencies, and audit timestamps.
- **Edit System**: Pre-populated update workflow with duplicate System ID prevention.
- **Delete System**: Two-step modal confirmation to prevent accidental removals.

### 5. Reports & CSV Export
- Comprehensive data export button generating RFC 4180-compliant CSV spreadsheets with all system fields and metadata.
- Technology footprint and organizational ownership analytics.

### 6. Settings & Profile
- User profile management, organization department, and theme selection.
- Infrastructure and ORM connection status inspection.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React + TS + Vite)               │
│  - Tailwind CSS Enterprise Theme  - React Router v6         │
│  - Recharts Visualizations        - Lucide React Icons      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (Bearer JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Server (Node.js + Express)                │
│  - TypeScript (ESM)              - Zod Schema Validation    │
│  - JWT Auth & RBAC Middleware    - CSV Streaming Engine     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma ORM Client
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Prisma Schema)            │
│  - User Model (Credentials, Role, Department)               │
│  - SoftwareSystem Model (Specs, Tech, Domain, Lifecycle)    │
│  - Indexes on systemId, status, domain, criticality, env    │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend
- **Framework**: React 18 / 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js v18+ (tested on Node v20/v24)
- **Framework**: Express.js
- **Language**: TypeScript (ES2022 / ESM)
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Logging & CORS**: Morgan, CORS

### Database & ORM
- **Database**: PostgreSQL (Compatible with Neon, Supabase, Render Postgres, AWS RDS)
- **ORM**: Prisma ORM v6 with typed client generation

---

## 📁 Project Structure

```
enterprise-software-registry/
├── client/                               # Frontend Application (Vite + React + TS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                  # Reusable badges, modals, spinners, empty states
│   │   │   │   ├── ConfirmationModal.tsx
│   │   │   │   ├── CriticalityBadge.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── EnvironmentBadge.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── StatusBadge.tsx
│   │   │   ├── dashboard/               # Metric cards and Recharts components
│   │   │   │   ├── Charts.tsx
│   │   │   │   └── StatCard.tsx
│   │   │   ├── layout/                  # Enterprise AppLayout, Sidebar, Header
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── software/                # Table, Filter bar, and Add/Edit Form
│   │   │       ├── SoftwareFilterBar.tsx
│   │   │       ├── SoftwareForm.tsx
│   │   │       └── SoftwareTable.tsx
│   │   ├── context/                     # AuthContext and ToastContext
│   │   │   ├── AuthContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── pages/                       # Route view components
│   │   │   ├── AddSoftwarePage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── EditSoftwarePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   ├── RegistryPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── SoftwareDetailsPage.tsx
│   │   ├── services/                    # Axios/fetch API and exporter services
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── dashboardService.ts
│   │   │   └── softwareService.ts
│   │   ├── types/                       # Shared TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── App.tsx                      # App component & route declarations
│   │   ├── index.css                    # Tailwind CSS definitions
│   │   └── main.tsx                     # React DOM bootstrap
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                               # Backend REST API (Node.js + Express + TS)
│   ├── prisma/
│   │   ├── schema.prisma                # Database schema models (User, SoftwareSystem)
│   │   └── seed.ts                      # Seeder script for 14+ enterprise records
│   ├── src/
│   │   ├── config/                      # Typed environment config
│   │   │   └── env.ts
│   │   ├── controllers/                 # Auth, Software CRUD, Dashboard controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   └── software.controller.ts
│   │   ├── data/                        # Enterprise seed definitions
│   │   │   └── seedData.ts
│   │   ├── lib/                         # Prisma singleton client
│   │   │   └── prisma.ts
│   │   ├── middleware/                  # JWT auth, Zod validation, error handler
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validate.ts
│   │   ├── routes/                      # Express route definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   └── software.routes.ts
│   │   ├── services/                    # Database data access repository
│   │   │   └── db.service.ts
│   │   ├── validations/                 # Zod request validation schemas
│   │   │   ├── auth.validation.ts
│   │   │   └── software.validation.ts
│   │   └── server.ts                    # Main Express bootstrap
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example                         # Environment variables template
├── .gitignore                           # Git ignore rules
├── package.json                         # Monorepo orchestration scripts
└── README.md                            # Comprehensive documentation
```

---

## ⚡ Prerequisites

Ensure you have the following installed:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL Database** (optional for cloud / local hosting: Neon, Supabase, Render, Docker, or native Postgres)

---

## 🔐 Environment Variables

Copy `.env.example` into `server/.env`:

```bash
cp server/.env.example server/.env
```

### Key Environment Variables (`server/.env`):

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/enterprise_inventory?schema=public` |
| `PORT` | Backend HTTP port | `5000` |
| `NODE_ENV` | Application environment | `development` |
| `JWT_SECRET` | Secret key used for signing JWT tokens | `enterprise_super_secret_jwt_key_2026_secure` |
| `JWT_EXPIRES_IN` | JWT token validity lifespan | `7d` |
| `CLIENT_URL` | Allowed client origin for CORS | `http://localhost:5173` |
| `ADMIN_EMAIL` | Default administrator seed email | `admin@enterprise.internal` |
| `ADMIN_PASSWORD` | Default administrator seed password | `Admin@123456` |
| `ADMIN_NAME` | Default administrator display name | `Enterprise System Administrator` |

### Frontend Variables (`client/.env` - optional):

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API base URL for production deployment | `""` (uses `/api` reverse proxy in dev) |

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/enterprise-software-registry.git
   cd enterprise-software-registry
   ```

2. **Install all dependencies** (Monorepo root, backend, and frontend):
   ```bash
   npm run install:all
   ```

---

## 🗄️ Database Setup & Prisma Seeding

1. **Generate Prisma Client**:
   ```bash
   cd server
   npm run prisma:generate
   ```

2. **Push schema or run migrations on your PostgreSQL database**:
   ```bash
   npm run prisma:push
   # Or for migration tracking:
   # npm run prisma:migrate
   ```

3. **Seed database with 14+ realistic enterprise software systems and the demo admin**:
   ```bash
   npm run seed
   ```

---

## 💻 Running the Application

### Option A: Run Both Client & Server Concurrently (Recommended)
From the project root:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Option B: Run Individually
- **Start Backend**:
  ```bash
  cd server
  npm run dev
  ```
- **Start Frontend**:
  ```bash
  cd client
  npm run dev
  ```

---

## 🔑 Demo Admin Credentials

Use the pre-seeded enterprise administrator account to sign in:

| Field | Value |
| :--- | :--- |
| **Email / Username** | `admin@enterprise.internal` *(or simply `admin`)* |
| **Password** | `Admin@123456` |
| **Role** | `ADMIN` (Full Access) |

*(You can also click the **"Fill Demo Admin Credentials"** button on the login screen for instant 1-click login).*

---

## 📡 REST API Reference

All protected endpoints require the HTTP header:
`Authorization: Bearer <JWT_TOKEN>`

### Authentication

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate with email/username and password | No |
| `POST` | `/api/auth/logout` | Invalidate current user session | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

### Software Registry

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/software` | List software systems with search, filter, sort, and pagination | Yes |
| `GET` | `/api/software/:id` | Fetch software system details by ID or systemId | Yes |
| `POST` | `/api/software` | Register a new software system | Yes |
| `PUT` | `/api/software/:id` | Update an existing software system record | Yes |
| `DELETE` | `/api/software/:id` | Delete a software system | Yes |
| `GET` | `/api/software/export/csv` | Download filtered/all software systems as CSV file | Yes |

#### Query Parameters for `GET /api/software`:
- `search`: String (searches across name, systemId, owner, technologyStack, description)
- `status`: `Active` \| `Under Maintenance` \| `Deprecated` \| `Planned` \| `ALL`
- `environment`: `Production` \| `Staging` \| `Development` \| `Testing` \| `ALL`
- `criticality`: `Critical` \| `High` \| `Medium` \| `Low` \| `ALL`
- `businessDomain`: `Finance` \| `HR` \| `Sales` \| `Operations` \| `IT` \| `Customer Service` \| `Marketing` \| `Other` \| `ALL`
- `page`: Integer (default: `1`)
- `limit`: Integer (default: `10`)
- `sortBy`: String (`name`, `systemId`, `businessDomain`, `status`, `criticality`, `lastUpdated`)
- `sortOrder`: `asc` \| `desc` (default: `desc`)

### Dashboard & Analytics

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | KPI summary statistics (total, active, maintenance, etc.) | Yes |
| `GET` | `/api/dashboard/recent` | List of recently updated software systems | Yes |
| `GET` | `/api/dashboard/technology-distribution` | Frequency breakdown of languages, frameworks & clouds | Yes |
| `GET` | `/api/dashboard/domain-distribution` | Count breakdown by business domain | Yes |
| `GET` | `/api/dashboard/criticality-distribution` | Count breakdown by risk criticality | Yes |
| `GET` | `/api/dashboard/status-distribution` | Count breakdown by lifecycle status | Yes |

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel)
1. Push your repository to GitHub.
2. In Vercel, import the repository and set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Configure Environment Variables:
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://enterprise-registry-api.onrender.com`).
5. Click **Deploy**.

### Backend Deployment (Render)
1. In Render, create a new **Web Service**.
2. Connect your GitHub repository and set **Root Directory** to `server`.
3. Set **Environment** to `Node`.
4. **Build Command**: `npm install && npm run build && npx prisma generate`
5. **Start Command**: `npm start`
6. Add Environment Variables:
   - `DATABASE_URL`: Hosted PostgreSQL connection URI (e.g. from Render Postgres, Neon, Supabase).
   - `JWT_SECRET`: Secure production secret.
   - `CLIENT_URL`: URL of your deployed frontend (e.g. `https://enterprise-registry.vercel.app`).
   - `NODE_ENV`: `production`
7. Deploy the service.

### PostgreSQL Database (Neon / Supabase / Render)
1. Provision a free PostgreSQL database on [Neon.tech](https://neon.tech), [Supabase.com](https://supabase.com), or Render.
2. Copy the connection string and assign it to `DATABASE_URL`.
3. Run `npm run prisma:push` and `npm run seed` to initialize schema and seed records.

---

## 🔮 Future Enhancements

- **Single Sign-On (SSO)**: Okta / Microsoft Entra ID SAML 2.0 and OIDC integration.
- **Automated Dependency Discovery**: Scheduled GitHub/GitLab repository scanning for `package.json`, `pom.xml`, and Dockerfiles.
- **Service Level Objective (SLO) Health Checks**: Real-time HTTP ping monitoring with uptime percentages.
- **Audit Log Trail**: Complete immutable event log of all field changes and user actions.
- **Slack / Teams Webhooks**: Automated notification alerts on system status changes or deprecations.

---

## 📄 License

This project is licensed under the **MIT License**.
