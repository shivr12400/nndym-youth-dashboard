Review the files touched in this conversation and confirm they follow the project's file organization rules. Flag any violations and move or rename files as needed.

## Current structure

```
pages/              # One file per route (Next.js Pages Router)
  _app.js           # Global auth state, ThemeProvider, Layout-level guards
  index.js          # Home / mandir selector / leaderboard
  login.js
  kids-attendance.js
  register.js
  submit-satsang.js
  information.js
  tiers.js
  feedback.js
  chatbot.js

components/         # Reusable UI — no data fetching, no API calls
  Layout.js         # Wraps every page: Navbar + main + Footer
  NavBar.js
  Footer.js
  LeaderboardSection.js
  NotAuthenticated.js
  RefreshButton.js
  common/           # Truly generic, page-agnostic UI primitives
    CustomButton.js
    HoverButton.js
    tierColors.js
  kids-attendance/  # Components used only by pages/kids-attendance.js
    AttendanceCharts.js
    AgeDistributionChart.js
    GenderDistributionChart.js
    KidsOverTimeChart.js
    KidsListTable.js
    LeaderContactSection.js
    LeaderInfoCard.js
    SatsangForm.js
    StatsCards.js
    UpcomingEvents.js

hooks/              # Custom React hooks — data fetching and business logic
  useKidsAttendance.js
  useLeaderboard.js

utils/              # Pure functions and static data, no React
  api.js            # All API endpoint URLs
  auth.js           # Cognito auth helpers
  mandirs.js        # Master list of active mandirs
  activities.js     # Age/gender/interest calculation helpers

styles/
  theme.js          # MUI theme (single source of truth for colors + typography)
  global.css        # Base CSS reset + Inter font import

public/             # Static assets served at /
  nndym.png, favicon.png, logo.svg, blacknndym.png
```

## Rules to enforce

**pages/**
- One file per route, named after the route path (e.g. `kids-attendance.js` → `/kids-attendance`).
- Pages wire together hooks + components. Keep business logic out of pages — it belongs in `hooks/` or `utils/`.
- No new subdirectories inside `pages/` unless adding a Next.js dynamic route segment.

**components/**
- No API calls or data fetching inside components. Props only.
- If a component is used by exactly one page, it lives in `components/<page-name>/` (e.g. `components/kids-attendance/`). Create a subfolder when adding the second page-specific component for a page.
- If a component is used by two or more pages, it lives directly in `components/`.
- `components/common/` is for stateless, page-agnostic primitives (buttons, color helpers, etc.). Do not put complex domain components here.

**hooks/**
- One hook file per data domain (e.g. one hook owns all kids-attendance API calls).
- Hooks may call `utils/auth.js` for tokens and `utils/api.js` for endpoint URLs — no raw URLs inside hook files.

**utils/**
- Pure functions and static data only — no React, no hooks, no side effects.
- `api.js` is the single place for endpoint URLs. Never hardcode an API URL outside this file.
- `mandirs.js` is the single source of truth for which mandirs are active. Never duplicate this list.

**styles/**
- `theme.js` is the only place palette and typography are defined. Do not add a second `ThemeProvider` anywhere.
- `global.css` handles only the CSS reset and font import. Page-specific styles go in `sx` props, not CSS files.

**General**
- Do not create `constants/`, `config/`, `services/`, `store/`, or `context/` directories unless the work clearly cannot fit the existing structure.
- Do not add an `index.js` barrel file to any directory — import directly from the source file.
