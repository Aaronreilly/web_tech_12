# TechShowcase (Next.js + Prisma/MongoDB)

## Setup
1. `npm install`
2. `cp .env.example .env` and fill in DATABASE_URL (MongoDB Atlas, replica set required for transactions) and NEXTAUTH_SECRET
3. `npx prisma db push`
4. `npm run dev`

## Done
Prisma schema, Zod schemas shared by API and UI, NextAuth credentials + roles, all /api/v1 endpoints
(register, login, products list/create/update/delete, upvote toggle, comments), discovery page with
debounced search, filters, sorting (React Query + Zustand).

## TODO (next iterations)
Product detail page (+ generateMetadata, OpenGraph, JSON-LD), multi-step submit form, user dashboard
and analytics, admin moderation/users/metrics, image upload, Shadcn UI components, theme toggle,
tsconfig/next.config/postcss config (run `npx create-next-app` defaults to generate them).
