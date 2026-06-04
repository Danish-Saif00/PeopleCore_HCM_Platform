<p align="center">
  <img src="src/assets/peoplecore_logo_kit/peoplecore-logo-light-horizontal-long.png" alt="PeopleCore logo" width="360" />
</p>

<h1 align="center">PeopleCore HCM</h1>

<p align="center">
  A mocked cloud HCM platform built with Next.js App Router, TypeScript, Tailwind CSS, CSS design tokens, and D3.js.
</p>

## Overview

PeopleCore HCM is a multi-page demo HR operations application for small to mid-size companies. It demonstrates role-gated dashboards and realistic mocked workflows for employee management, payroll, payslips, time off, org charts, onboarding, reviews, company settings, billing, and role administration.

The app uses a mocked backend/data layer. There is no real payment processing, outbound email delivery, identity provider, or production compliance/security implementation. Demo records and state live locally in the repository and in the in-memory mock database.

## Tech Stack

| Area | Implementation |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS 4 plus global CSS variables in `src/app/globals.css` |
| Charts | D3.js for the org chart |
| Icons | `lucide-react` |
| Data | Seeded local mock data in `src/data/seed.ts` |
| Mock backend | Next route handlers under `src/app/api/*` plus `src/data/mock-db.ts` |
| Auth | Mock session cookie and client auth context |

## Project Structure

```txt
src/
  app/                 App Router pages and API route handlers
  assets/              PeopleCore logo kit and static brand assets
  components/          Shared layout, UI, tables, modals, charts, and side panels
  data/                Seed data and mutable in-memory mock database
  hooks/               Shared React hooks
  lib/                 Auth, permissions, workflow services, utilities, formatters
  types/               PeopleCore domain types
docs/
  BUILD_AND_RUN.md     Short build/run reference
  ACCEPTANCE_CHECKLIST.md
```

## Main App Modules

### Marketing Site

Route: `/`

The public landing page presents PeopleCore features, pricing, customer quotes, and links into signup or login. It uses `src/components/layout/MarketingNav.tsx` and the reusable logo assets from `src/components/ui/Logo.tsx`.

### Auth and Session Flow

Routes:

- `/login`
- `/signup`
- `/verify-email`
- `/invite`

API routes:

- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/session/route.ts`
- `src/app/api/auth/signup/route.ts`

Core files:

- `src/lib/auth.ts`
- `src/lib/auth-context.tsx`
- `src/proxy.ts`

The app implements mocked login, signup, verification, invite acceptance, failed login tracking, lockout after 5 failed attempts, and an 8-hour session concept. Sessions are stored in the `pc_session` cookie for the demo.

### Role Gating and Navigation

Core files:

- `src/lib/permissions.ts`
- `src/proxy.ts`
- `src/components/layout/sidebar.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/TopNav.tsx`

Supported roles:

- Guest
- Employee
- Manager
- HR Admin
- Super Admin

Protected routes are checked by `src/proxy.ts` and by client page behavior. Unauthorized users are redirected to `/restricted`.

### Dashboard

Route: `/dashboard`

The dashboard is the authenticated landing area. It adapts to the logged-in demo user's role and pulls data from the mock APIs and shared service modules.

### Employees

Route: `/employees`

API route:

- `src/app/api/employees/route.ts`

Core files:

- `src/components/modals/AddEmployeeModal.tsx`
- `src/components/tables/DataTable.tsx`
- `src/data/mock-db.ts`

HR Admin and Super Admin users can view and manage employee records. Employee records come from `src/data/seed.ts` and are mutated in memory during the current server process.

### Payroll

Route: `/payroll`

API routes:

- `src/app/api/payroll/route.ts`
- `src/app/api/payroll/run/route.ts`

Core files:

- `src/lib/payroll.ts`
- `src/components/modals/RunPayrollModal.tsx`

Payroll supports a mocked payroll run flow with date ranges, employee counts, estimated gross totals, completed status, generated payslips, notifications, and mocked email event records.

### Payslips

Route: `/payslips`

API route:

- `src/app/api/payslips/route.ts`

Core files:

- `src/components/side-panels/PayslipSidePanel.tsx`

Users can view available payslips. The payslip download action is mocked and does not generate a real PDF file.

### Time Off

Route: `/time-off`

API routes:

- `src/app/api/time-off/route.ts`
- `src/app/api/time-off/[id]/route.ts`

Core files:

- `src/lib/time-off.ts`
- `src/components/modals/RequestTimeOffModal.tsx`
- `src/components/side-panels/TimeOffRequestSidePanel.tsx`

Employees can submit time-off requests. Managers, HR Admins, and Super Admins can approve or reject relevant requests. The flow generates mocked notifications and email events.

### Team

Route: `/team`

The team page is available to Manager, HR Admin, and Super Admin roles. It focuses on team-level visibility and manager-facing actions.

### Org Chart

Route: `/org-chart`

Core files:

- `src/components/charts/OrgChartD3.tsx`
- `src/data/seed.ts`

The org chart is built with D3.js and supports expand/collapse, pan/zoom, search highlighting, dimmed non-matches, PNG export, and responsive behavior for smaller screens.

### Onboarding

Route: `/onboarding`

API route:

- `src/app/api/onboarding/route.ts`

Core files:

- `src/lib/onboarding.ts`
- `src/components/modals/CreateTemplateModal.tsx`

Onboarding supports template creation, tasks, employee assignments, checklist completion, and progress tracking. Seed data includes onboarding templates, tasks, and employee onboarding assignments.

### Reviews

Route: `/reviews`

API route:

- `src/app/api/reviews/route.ts`

Core files:

- `src/lib/reviews.ts`
- `src/components/modals/CreateReviewCycleModal.tsx`
- `src/components/ui/RatingSlider.tsx`

Reviews support HR-created review cycles, manager review submission, rating input, strengths, improvement areas, goals, and completed read-only review views.

### Company, Billing, and Roles

Routes:

- `/company`
- `/billing`
- `/roles`

API routes:

- `src/app/api/company/route.ts`
- `src/app/api/roles/route.ts`

These modules are Super Admin oriented. They cover company settings, billing UI, and role assignment surfaces. Billing is a UI-only demo and does not process real payments.

### Notifications

API route:

- `src/app/api/notifications/route.ts`

Core files:

- `src/lib/notifications.ts`
- `src/components/ui/NotificationDropdown.tsx`

Notifications support unread state, newest-first display, mark-all-read behavior, and event generation from payroll, time off, reviews, and onboarding flows.

### Logo and Brand Assets

Core files:

- `src/assets/peoplecore_logo_kit/`
- `src/assets/peoplecore_logo_kit/README.md`
- `src/components/ui/Logo.tsx`

The logo kit includes PNG and SVG variants for light/dark, horizontal/vertical, long/short, and mark-only lockups. Use the `Logo` component throughout the app instead of hand-built text marks.

Example:

```tsx
import { Logo } from '@/components/ui/Logo';

<Logo variant="light-horizontal-short" size="sm" />
<Logo variant="dark-mark-only" size="sm" />
```

## Demo Credentials

All demo accounts use the password `Demo@12345`.

| Role | Email | Typical Access |
| --- | --- | --- |
| Super Admin | `aaron.loeb@peoplecore-demo.com` | Dashboard, employees, payroll, payslips, time off, team, org chart, onboarding, reviews, company, billing, roles |
| HR Admin | `halima.fayed@peoplecore-demo.com` | Dashboard, employees, payroll, payslips, time off, team, org chart, onboarding, reviews |
| Manager | `jane.cooper@peoplecore-demo.com` | Dashboard, payslips, time off approvals, team, org chart, onboarding, reviews |
| Employee | `john.doe@peoplecore-demo.com` | Dashboard, payslips, time off, org chart, onboarding, reviews |

## Seed Data

Primary seed file:

- `src/data/seed.ts`

Mutable in-memory database:

- `src/data/mock-db.ts`

Seed data includes:

- 1 company
- departments
- employees
- auth users
- demo credentials
- payroll runs
- payslips
- time-off policy and requests
- onboarding templates and tasks
- employee onboarding assignments
- review cycles and reviews
- notifications
- mocked email events
- marketing page content

The mock database is initialized from seed data and resets when the server process restarts.

## Prerequisites

Install:

- Node.js 18 or newer
- npm 9 or newer

This repository uses `package-lock.json`, so `npm install` is the expected install command.

## Install

From the project root:

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

If port `3000` is already in use, stop the existing server or run Next on another port:

```bash
npx next dev -p 3001
```

## Build

Create a production build:

```bash
npm run build
```

Run the production build locally:

```bash
npm run start
```

Run the production build on a specific port:

```bash
npm run start -- -p 3001
```

## Validation

Run lint:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

Optional TypeScript-only check:

```bash
npx tsc --noEmit
```

## Troubleshooting

### `localhost:3000` keeps loading

Check whether a stuck Next dev process owns port `3000`:

```powershell
netstat -ano | Select-String ":3000"
```

If a stale Next dev process is blocking the port, stop it by PID:

```powershell
taskkill /PID <PID> /F
```

Then clear the dev cache and restart:

```powershell
Remove-Item -Recurse -Force .next\dev
npm run dev
```

### Production works but development hangs

Validate the production bundle:

```bash
npm run build
npm run start -- -p 3001
```

Then open:

```txt
http://localhost:3001
```

If production responds but development hangs, the issue is likely a stuck dev server or dev cache state rather than a production build failure.

## Documentation

Additional project documentation:

- `docs/BUILD_AND_RUN.md`
- `docs/ACCEPTANCE_CHECKLIST.md`
- `src/assets/peoplecore_logo_kit/README.md`

## Current Limitations

- The backend is mocked and in-memory.
- State resets when the server restarts.
- Emails are logged as mocked events only.
- Billing is a UI/demo flow only.
- PDF download actions are mocked.
- Auth and session handling are demo-oriented and not production security infrastructure.
