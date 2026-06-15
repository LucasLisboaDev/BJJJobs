# BJJJobs

A full-stack job board connecting Brazilian jiu-jitsu coaches with gyms — built with Next.js 14, Clerk, Prisma, and PostgreSQL.

---

## Features

**For coaches**
- Create a public profile with belt rank, specialties, bio, and competition record
- Browse and filter open positions by keyword, city, or belt requirement
- Apply to jobs with an optional cover message
- Track application status (pending, shortlisted, declined) from a personal dashboard
- Receive email when a gym views or updates your application

**For gyms**
- Register a gym profile and post job listings in minutes
- Manage listings — toggle active/inactive without deleting
- Review applicants inline: view belt rank, specialties, and cover message
- Shortlist or decline applicants directly from the dashboard
- Receive email when a coach applies to your listing

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | Clerk |
| Database | PostgreSQL (Railway) |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Deployment | Railway |

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.com) account
- A PostgreSQL database (e.g. [Railway](https://railway.app))

### 1. Clone and install

```bash
git clone https://github.com/LucasLisboaDev/BJJJobs.git
cd BJJJobs
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database
DATABASE_URL=postgresql://...

# Resend (email notifications)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=BJJJobs <notifications@yourdomain.com>

# App URL (used in email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── jobs/
│   │   ├── page.tsx                    # Job listings with search & filters
│   │   └── [id]/page.tsx               # Job detail + apply flow
│   ├── coaches/
│   │   └── [id]/page.tsx               # Public coach profile
│   ├── register/
│   │   ├── coach/page.tsx              # Coach onboarding
│   │   └── gym/page.tsx                # Gym onboarding
│   ├── post-job/page.tsx               # Two-step job posting form
│   ├── dashboard/page.tsx              # Role-aware dashboard (gym or coach)
│   └── api/
│       ├── coach/route.ts              # Coach profile CRUD
│       ├── gym/route.ts                # Gym profile CRUD
│       ├── coaches/[id]/route.ts       # Public coach lookup
│       ├── dashboard/route.ts          # Aggregated dashboard data
│       └── jobs/
│           ├── route.ts                # List + create jobs
│           └── [id]/
│               ├── route.ts            # Job detail, update, delete
│               ├── apply/route.ts      # Submit / check application
│               └── applications/       # Gym views & manages applicants
├── lib/
│   ├── prisma.ts                       # Prisma client singleton
│   └── email/
│       ├── resend.ts                   # Resend client + config
│       ├── get-user-email.ts           # Clerk email lookup/sync
│       └── send.ts                     # Email templates & senders
└── middleware.ts                        # Clerk auth (protects /dashboard, /post-job, /register/*)
prisma/
└── schema.prisma                        # Database schema
```

---

## Deployment

The project is designed to deploy on Railway with zero additional configuration.

1. Push the repository to GitHub
2. Create a new Railway project and connect the repo
3. Add a PostgreSQL plugin from the Railway dashboard
4. Set the environment variables listed above
5. Deploy — Railway auto-detects Next.js and handles builds

---

## Roadmap

- [x] Email notifications on new applications (Resend)
- [ ] Belt verification system
- [ ] Featured gym and coach profiles
- [ ] Full-text search (upgrade path: Algolia)
- [ ] Mobile-optimised experience
