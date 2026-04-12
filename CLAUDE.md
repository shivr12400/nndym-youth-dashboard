# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (webpack — Turbopack is disabled due to macOS permissions issue)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # Next.js ESLint
```

There are no tests.

## Architecture

**Next.js Pages Router** app (not App Router). MUI v6 for all UI components. Framer Motion for animations.

### Auth flow (`utils/auth.js`, `pages/_app.js`)

Authentication uses **AWS Cognito** (`amazon-cognito-identity-js`). The Cognito SDK stores session tokens under the user's UUID, not their email. A fallback key `app_last_auth_user` in localStorage stores the UUID so sessions survive page refreshes.

`_app.js` owns global auth state (`isAuthenticated`, `userEmail`) and passes them as props to every page component. After login, `setUserEmail` must also be called — it's passed as a prop alongside `setIsAuthenticated`. The auth check runs once on mount only.

### Mandir routing (`utils/mandirs.js`, `pages/index.js`)

`utils/mandirs.js` is the source of truth for active mandirs (many are commented out). Non-admin users are matched to their mandir by normalizing their email prefix against mandir names: `colonia@nndym.org` → `"colonia"` → matches `"Colonia"`. The normalize function strips spaces and hyphens and lowercases. Users whose email prefix doesn't match any active mandir will have the "My Mandir" button disabled.

Admin accounts have an email prefix of `admin` (e.g. `admin@nndym.org`) and see all mandirs.

### Layout (`components/Layout.js`)

`Layout` wraps every page with `Navbar` + `Footer`. On `/login`, the navbar hides all nav items and the footer is hidden entirely. The main content area is vertically centered on `/login`.

### API (`utils/api.js`)

All data goes through AWS API Gateway → Lambda. The raw Cognito JWT is passed as the `Authorization` header (not `Bearer <token>`). Endpoints for: satsang count, kids list, upcoming events, leader info, feedback, goals. The chatbot uses a separate API Gateway endpoint in `us-east-2`.

### Data fetching

All data fetching is client-side via custom hooks — no `getServerSideProps` or `getStaticProps`. Key hooks:
- `hooks/useKidsAttendance.js` — all data for the kids-attendance dashboard (kids list, satsang counts, leader info, events). Reads `?mandirName=` from the URL query string.
- `hooks/useLeaderboard.js` — fetches data for every active mandir in parallel to build the leaderboard on the home page.

### Kids attendance page (`pages/kids-attendance.js`)

The main dashboard. Accessed via `/kids-attendance?mandirName=<name>` (admin selecting) or directly for mandir users. Uses `useKidsAttendance` hook and renders multiple sub-components from `components/kids-attendance/`. The `activities` utility in `utils/activities.js` computes interest breakdowns by age group and gender from the kids list.

### Tier system

Tier thresholds are defined inline in `pages/kids-attendance.js` (the `TIERS` array). Tiers display info is in `pages/information.js` and `pages/tiers.js` — both share the same `columns`/`rows` data structure but are separate pages.
