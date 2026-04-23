# Product Requirement Document (PRD)
## Mass Gain Tracker (82.5 -> 90kg)

**Author:** Alice (Product Manager)
**Goal:** A strictly structured 70-day PWA tracker for mass gaining (April 24 - July 2).

### 1. MVP Scope
- **Dashboard:** Today's view. Displays current date, day of the plan (Day X/70), and daily checklist.
- **Workout Screen:** Detailed view of the day's workout (if any) with checkboxes for exercises.
- **Analytics:** Chart displaying weight progression vs goal (82.5 -> 90kg).
- **Shopping List:** Weekly shopping list view, auto-selecting the list based on the current week.

### 2. Core Journeys
- **Daily Blocking Prompt:** Upon opening the app for the first time each day, a modal/fullscreen prompt demands the user's morning weight. The app cannot be used until the weight is logged.
- **Meal & Workout Tracking:** Checkboxes to mark meals (Breakfast, Post-workout, Lunch, Dinner, Before Bed) and workouts as completed.
- **Calendar Navigation:** Horizontal scroll/swipe to view past days and future days. 

### 3. Business Logic (Triggers)
- **Weight Plateau:** 
  - **Condition:** If the 7-day rolling average weight changes by < 0.1 kg for 10 consecutive days.
  - **Action:** Generate an alert and automatically add +200 kcal to the "Dinner" meal for all subsequent days.
- **Rapid Gain (Fat Prevention):**
  - **Condition:** After Week 4 (from May 18), if the 7-day rolling average weight increases by > 0.7 kg in a week.
  - **Action:** Subtract -150 kcal from the "Dinner" meal.
  
### 4. Non-Functional Requirements
- **Mobile-first PWA:** Must feel like a native iOS app.
- **Offline support:** Basic service worker to cache assets and allow viewing the plan offline.
