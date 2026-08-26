# Freelance AI Manager

Build a modern, professional admin dashboard called "Freelance AI Lead Manager" —

a private CRM for a solo freelance web developer to manage leads, calls, 

follow-ups, and one active project at a time.

STACK

- React + JavaScript (no TypeScript)

- Tailwind CSS + shadcn/ui components

- Lucide icons

- React Router

- Mock/local data only — no backend calls yet (will connect to Django REST API later)

DESIGN DIRECTION

- Clean, minimal SaaS admin aesthetic (think Linear, Vercel dashboard, or Notion — not a marketing site)

- Rounded cards (rounded-xl), subtle borders, soft shadows, generous whitespace

- Strong type hierarchy: bold headings, muted secondary text

- One accent color for primary actions/status highlights, neutral grays elsewhere

- Light + dark mode toggle

- Desktop-first, fully responsive down to mobile

- NO gradients, NO hero sections, NO decorative illustrations, NO heavy animation

LAYOUT

- Collapsible left sidebar: Dashboard, Leads, Calls, Follow-ups, Projects, 

  AI Agent, Services, Settings

- Bottom of sidebar: capacity widget showing "1/1 Project" + status badge (AVAILABLE/BUSY)

- Top header: global search, notifications bell, user profile menu

- Mobile: sidebar collapses to hamburger drawer

PAGES (all with mock Indian business data, INR pricing)

1. Dashboard

   - KPI cards: Active Project, Total Leads, Hot Leads, Calls This Week, 

     Interested, Meetings, Follow-ups Due, Conversion Rate

   - Pipeline snapshot (New → Contacted → Interested → Meeting → Proposal → Won → Lost)

   - Recent leads table, recent calls table, upcoming follow-ups list

   - Active project summary card

   - Weekly activity chart

2. Leads

   - Filterable/sortable table + mobile card view

   - Columns: Business, Category, Location, Lead Score (color-coded), 

     Website, Phone, Status, Last Contact, Next Follow-up

   - Add Lead modal, AI Research button (mock loading → mock result)

   - Lead detail page: business info, contact info, online presence, 

     website audit checklist, AI research panel (mock), activity timeline

3. Calls

   - KPI row + call log table (Business, Date, Duration, Result, AI Summary)

   - Call detail modal: transcript, mock audio player, next action

   - "Start AI Call" button shows a clean "not connected yet" placeholder state

4. AI Agent

   - Agent status toggle, voice/language settings, call duration limit

   - Large editable AI instructions textarea

   - Split-screen conversation simulator (mock chat, no real API)

5. Follow-ups — grouped by Today / Tomorrow / This Week / Overdue / Completed

6. Projects

   - Capacity widget (0/1 or 1/1), project table, project detail with 

     task checklist and auto-calculated progress bar

7. Services — service cards with name, price, delivery time, active toggle

8. Settings — tabs: Profile, Calling, AI Agent, Services, Notifications, 

   Appearance, Integrations (all integrations shown as "Not Connected" 

   with a placeholder connect modal)

COMPONENTS TO BUILD REUSABLE

Sidebar, Header, StatCard, LeadTable, LeadCard, LeadScoreBadge, StatusBadge, 

CallTable, FollowUpList, ProjectCard, CapacityWidget, PipelineBoard, 

ActivityTimeline, AIResearchPanel, ServiceCard, NotificationDropdown, 

EmptyState, LoadingSkeleton

STATES TO HANDLE

- Empty states for every list/table (with a clear next action)

- Skeleton loaders for dashboard, tables, lists

- Friendly error state ("Something went wrong. Please try again.")

DATA LAYER

Structure all mock data behind a simple service/API abstraction 

(e.g. /src/services/leads.js) so it can later be swapped for real 

Django REST endpoints without touching component code.

Do not require any paid API (OpenAI, Claude, Twilio, Retell, Vapi, 

Google Maps) to run this V1.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/74aff19c-1d52-4194-a587-686a37d3693c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
