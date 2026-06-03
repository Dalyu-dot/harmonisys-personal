# Harmonisys (Project Sakuna)

An integrated web-based platform for Disaster Risk Reduction and Management (DRRM) that incorporates multiple DRRM-H tools for emergency response, health monitoring, hazard assessment, and resource management.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Database Models](#database-models)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Development & Deployment](#development--deployment)
- [External Services](#external-services)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

Harmonisys is a modular DRRM platform integrating tools for incident reporting, mental health screening, responder wellness, hazard mapping, and more. It is designed for use by emergency response teams, health professionals, and disaster management agencies in the Philippines.

---

## Architecture & Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **UI:** Tailwind CSS, HeroUI, Lucide, Heroicons
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** NextAuth.js (JWT, Prisma Adapter)
- **State/Data:** SWR, React Context, Server Actions
- **External Services:** Firebase (Firestore, Admin SDK), Google Apps Script (for REDAS)
- **Mapping:** Leaflet, React-Leaflet
- **Charts:** Recharts

---

## Features

### 1. **Dashboard**

- Centralized overview of DRR-H tools and user data.
- Accessible after authentication.

### 2. **IRS (Incident Reporting System)**

- Automates emergency drill reporting and real-time documentation.
- Uses Firebase Firestore for event data.
- Event detail pages and summary statistics.

### 3. **MiSalud**

- Monitors responder wellness (mental, emotional, physical).
- Questionnaire submissions stored in PostgreSQL via Prisma.
- Team-based views and recommendations.

### 4. **REDAS (Rapid Earthquake Damage Assessment System)**

- Provides real-time hazard and training data.
- Integrates with Google Sheets via Apps Script for data.
- GIS mapping and appointment booking for trainings.

### 5. **Unahon**

- Mental health screening for disaster-affected individuals.
- Confidential forms, checklists, and summary views.
- Access controlled by user competency.

### 6. **HazardHunter**

- Rapid hazard assessment for any location in the Philippines.
- Static/dynamic overview and integration with other tools.

### 7. **User Management**

- Admin-only user table and role management.
- Access control for sensitive features.

### 8. **Authentication & Authorization**

- NextAuth with JWT sessions and Prisma adapter.
- Role-based access (Admin, Responder, Standard).

---

## Directory Structure

```
project-sakuna/
├── prisma/                # Prisma schema and migrations
├── public/                # Static assets (images, icons, etc.)
├── src/
│   ├── app/               # Next.js app directory (routing, pages, API)
│   │   ├── (pages)/       # Main feature pages (dashboard, irs, misalud, etc.)
│   │   ├── api/           # API routes for each feature
│   │   ├── layout.tsx     # Global layout and font setup
│   │   ├── globals.css    # Tailwind/global styles
│   │   ├── components/    # Reusable and feature-specific React components
│   │   ├── constants/     # Shared constants (tool info, UI, etc.)
│   │   ├── lib/           # Utilities (prisma, firebase, auth, server actions)
│   │   ├── types/         # TypeScript types for features and models
│   │   ├── middleware.ts  # Next.js middleware (if any)
│   │   ├── routes.ts      # Route definitions (if any)
│   ├── package.json       # Project dependencies and scripts
│   ├── README.md          # Project documentation
│   └── ...
```

---

## Database Models

The project uses **Prisma** with a PostgreSQL database. Key models include:

- **User**: Authentication, roles, competency, and relations to forms.
- **Incident**: IRS incident reports (location, date, category, severity, etc.).
- **Unahon**: Mental health screening forms, checklists, and assessment types.
- **Checklist**: Linked to Unahon, stores checklist responses.
- **Submission**: MiSalud questionnaire submissions.
- **QuestionResponse**: Linked to Submission, stores answers.
- **PlaceCoordinate**: Used for mapping and GIS features.

See `prisma/schema.prisma` for full details.

---

## Setup & Installation

1. **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd project-sakuna
    ```
2. **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3. **Set up environment variables:**
    - Copy `.env.example` to `.env` and fill in all required values (see below).
4. **Set up the database:**
    ```bash
    npx prisma migrate deploy
    # or for development:
    npx prisma migrate dev
    ```
5. **Run the development server:**
    ```bash
    npm run dev
    # or yarn dev
    ```
6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Environment Variables

You will need to configure the following (see `.env.example`):

- `DATABASE_URL` (PostgreSQL connection string)
- **Firebase (IRS, MiSalud):**
    - `IRS_API_KEY`, `IRS_AUTH_DOMAIN`, `IRS_PROJECT_ID`, ...
    - `MISALUD_TYPE`, `MISALUD_PROJECT_ID`, `MISALUD_PRIVATE_KEY`, ...
- **NextAuth:**
    - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- **Other:**
    - Any additional secrets for email, third-party APIs, etc.

---

## Development & Deployment

- **Development:**
    - Use `npm run dev` to start the local server.
    - Use `npx prisma studio` to view/edit the database.
- **Build:**
    - `npm run build` for production build.
    - `npm start` to run the production server.
- **Linting:**
    - `npm run lint` to check code quality.
- **Deployment:**
    - Can be deployed to Vercel or any Node.js-compatible host.
    - Ensure all environment variables are set in your deployment environment.

---

## External Services

- **Firebase:** Used for IRS (event data) and MiSalud (admin SDK for health data).
- **Google Apps Script:** Used by REDAS to fetch training and hazard data from Google Sheets.
- **Leaflet/React-Leaflet:** For GIS and mapping features.
- **NextAuth:** For authentication and session management.

---

## Contributing

1. Fork the repository and create a new branch for your feature or bugfix.
2. Follow the existing code style and naming conventions.
3. Add tests or documentation as needed.
4. Submit a pull request with a clear description of your changes.

---

## Troubleshooting

- **Database errors:** Ensure your `DATABASE_URL` is correct and the database is running.
- **Auth issues:** Check NextAuth and Prisma setup, and ensure JWT secrets are set.
- **Firebase errors:** Double-check all Firebase environment variables and service account keys.
- **Build issues:** Run `npm run lint` and fix any reported issues.
- **General:** Check the console and server logs for detailed error messages.

---

## License

This project is proprietary and intended for use by authorized organizations and collaborators only.
