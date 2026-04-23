# Architecture & System Design
**Authors:** Bob (Architect) & Steve (PWA Specialist)

## 1. Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Dark Mode only)
- **Database/ORM:** SQLite + Prisma (Fast, local MVP feel, easily deployable to Turso or just use Vercel Postgres if serverless)
- **Deployment:** Vercel

## 2. Database Schema (Prisma)
```prisma
datasource db {
  provider = "sqlite" // or postgres
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  name      String?
  weights   WeightLog[]
}

model WeightLog {
  id             String   @id @default(uuid())
  date           DateTime @unique // YYYY-MM-DD
  weight         Float
  weekly_average Float?
  userId         String
  user           User     @relation(fields: [userId], references: [id])
}

model DailyPlan {
  date         DateTime @id // YYYY-MM-DD
  dayNumber    Int
  phase        String   // "Week 1", "Deload", etc.
  type         String   // "UPPER", "LOWER", "REST"
  baseCalories Int
  isCompleted  Boolean  @default(false)
  meals        Meal[]
  exercises    Exercise[]
}

model Meal {
  id          String    @id @default(uuid())
  time        String    // "09:00"
  name        String    // "Завтрак"
  calories    Int
  items       String    // JSON string or text
  isCompleted Boolean   @default(false)
  dailyPlanId DateTime
  dailyPlan   DailyPlan @relation(fields: [dailyPlanId], references: [date])
}

model Exercise {
  id          String    @id @default(uuid())
  order       Int
  name        String
  sets        Int
  reps        String    // "8", "6-8"
  weight      String    // "80 кг", "+5 кг"
  isCompleted Boolean   @default(false)
  dailyPlanId DateTime
  dailyPlan   DailyPlan @relation(fields: [dailyPlanId], references: [date])
}
```

## 3. PWA Specification
- **manifest.json:** name "Mass Gain", short_name "Gain", display "standalone", theme_color "#0f172a" (slate-900), background_color "#0f172a".
- **Meta tags:** `<meta name="apple-mobile-web-app-capable" content="yes">`, `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`, `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">`.
