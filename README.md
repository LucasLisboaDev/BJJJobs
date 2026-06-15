# BJJJobs.com

The #1 job board for Brazilian jiu-jitsu coaches and gyms.

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: Clerk
- **Database**: PostgreSQL via Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Railway (recommended)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local` and fill in your keys:

- **Clerk**: Create a project at https://clerk.com, copy your publishable and secret keys
- **Database**: Spin up a PostgreSQL instance on Railway (https://railway.app)

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Project structure

```
src/
  app/
    page.tsx              # Landing page
    jobs/page.tsx         # Job listings
    post-job/page.tsx     # Gym job posting form
    register/
      coach/page.tsx      # Coach signup flow
      gym/page.tsx        # Gym signup flow
    dashboard/page.tsx    # User dashboard
    login/page.tsx        # Clerk sign in
  components/             # Shared components (to build out)
  lib/
    prisma.ts             # Prisma client singleton
    utils.ts              # Helper functions + constants
  types/index.ts          # Shared TypeScript types
  middleware.ts           # Clerk auth middleware
prisma/
  schema.prisma           # Database schema
```

## Deployment (Railway)

1. Push repo to GitHub
2. Create new project on Railway, connect your repo
3. Add a PostgreSQL plugin
4. Set environment variables in Railway dashboard
5. Deploy — Railway auto-detects Next.js

## Roadmap

- [ ] Job detail pages
- [ ] Coach profile pages
- [ ] Application flow (apply button → message)
- [ ] Gym dashboard (manage listings, view applicants)
- [ ] Job alerts via email (Resend)
- [ ] Belt verification system
- [ ] Featured gym profiles
- [ ] Search + filter (Postgres full-text → Algolia at scale)
