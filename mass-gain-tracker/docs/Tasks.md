# Sprint Backlog
**Author:** Eve (Project Manager)

### [Task 1] Project Setup & PWA Configuration
- Scaffold Next.js + Tailwind.
- Configure `manifest.json`, PWA meta tags in `layout.tsx`.
- Add basic service worker.

### [Task 2] Database & Prisma Setup
- Initialize Prisma with SQLite (for MVP simplicity).
- Create schema as defined by Bob.
- Write a `seed.ts` script to populate the 70 days using Charlie's data.

### [Task 3] UI/UX Foundation (Fiona's Specs)
- Configure Tailwind colors: `bg-slate-900`, `text-slate-100`, accents `text-emerald-400`.
- Create sticky date selector component.
- Create large, tap-friendly Checkbox component.

### [Task 4] Daily Weight Blocking Flow
- Create the weight input modal.
- Hook it to the database (save `WeightLog`).
- Logic: Check if weight is logged for today, if not, force the modal.

### [Task 5] Dashboard (Daily Plan View)
- Fetch today's `DailyPlan`, `Meal`s, and `Exercise`s.
- Render meals with checkboxes.
- If it's a workout day, render the workout link/preview.

### [Task 6] Workout Screen
- Render exercises for the day with sets, reps, weights.
- Add tap-to-complete checkboxes.

### [Task 7] Business Logic: Plateaus & Rapid Gain (Cron)
- Implement utility functions for `calculateRollingAverage`.
- Implement API route `/api/cron/evaluate-triggers`.
- Update meal calories based on trigger rules.

### [Task 8] Analytics & Shopping List
- Render Weight chart (Recharts).
- Render static shopping lists per week.
