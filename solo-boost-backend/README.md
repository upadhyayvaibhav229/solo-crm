# Solo Boost CRM

Solo Boost CRM is a private CRM and sales automation platform designed
for a **solo freelance web developer**.

## 🎯 Project Goal

The system helps one freelancer:

-   Discover potential clients
-   Research businesses
-   Score and qualify leads
-   Manage outreach and calls
-   Schedule follow-ups
-   Convert prospects into projects
-   Manage project capacity
-   Use AI-assisted lead research
-   Eventually use AI voice calling

### Core workflow

``` text
Find Businesses
      ↓
Create Leads
      ↓
Research / Audit
      ↓
Lead Score
      ↓
Contact / AI Call
      ↓
Conversation Result
      ↓
Follow-up
      ↓
Meeting
      ↓
Proposal
      ↓
Won
      ↓
Create Project
      ↓
Manage One Active Project
      ↓
Project Completed
      ↓
Capacity Available Again
```

------------------------------------------------------------------------

# 🧱 Architecture

``` text
┌─────────────────────────────────────────────┐
│                  FRONTEND                   │
│                                             │
│          React + Tailwind + shadcn/ui       │
│                                             │
│ Dashboard | Leads | Calls | Projects        │
│ Follow-ups | AI Agent | Services | Settings │
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API / JWT
                       ▼
┌─────────────────────────────────────────────┐
│                  BACKEND                    │
│                                             │
│             Django + DRF                   │
│                                             │
│ Auth | Leads | Calls | Projects | AI        │
│ Follow-ups | Services | Analytics           │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                DATABASE                     │
│                                             │
│       PostgreSQL (production)               │
│       SQLite (development)                  │
└─────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 🛠️ Technology Stack

## Frontend

-   React
-   JavaScript
-   Tailwind CSS
-   shadcn/ui
-   Lucide Icons
-   REST API
-   JWT authentication

## Backend

-   Python
-   Django
-   Django REST Framework
-   Simple JWT
-   Django ORM

## Database

-   SQLite for development
-   PostgreSQL for production

## AI Research

Planned low-cost approach:

-   Ollama
-   Open-source LLMs
-   Optional OpenAI
-   Optional Claude

Paid AI APIs are **not required for V1**.

## Voice Calling

Potential future integrations:

-   Retell
-   Vapi
-   Twilio
-   Other compatible voice providers

------------------------------------------------------------------------

# 📁 Backend Structure

``` text
solo-boost-backend/
│
├── manage.py
├── requirements.txt
├── .gitignore
│
├── config/
│
├── accounts/
│
├── leads/
│
├── calls/
├── followups/
├── projects/
├── services/
└── ai/
```

Apps will be added as the corresponding features are implemented.

------------------------------------------------------------------------

# 🔐 Authentication

Authentication uses:

``` text
Django User
      ↓
Django REST Framework
      ↓
Simple JWT
      ↓
React
```

Current endpoints:

``` http
POST /api/auth/register/
POST /api/auth/login/
GET  /api/auth/me/
POST /api/auth/logout/
```

## Authentication flow

``` text
React
  ↓
Login
  ↓
Django validates credentials
  ↓
JWT access + refresh token
  ↓
React stores token
  ↓
Protected API requests
```

Protected endpoints use:

``` python
IsAuthenticated
```

User-specific CRM data is filtered by the authenticated user.

------------------------------------------------------------------------

# 👤 Accounts

The Accounts module handles:

-   Registration
-   Login
-   Logout
-   Current user
-   JWT authentication
-   User-specific data access
-   Future profile settings

Django's built-in User model is used initially.

------------------------------------------------------------------------

# 🎯 Leads

A lead represents a potential client/business.

## Lead information

Target fields include:

-   Business name
-   Category
-   Contact person
-   Phone
-   Email
-   Website
-   Google Maps URL
-   Instagram URL
-   Facebook URL
-   LinkedIn URL
-   Location
-   Lead score
-   Status
-   Priority
-   Lead source
-   Potential service
-   Notes
-   Created date
-   Updated date

## Lead statuses

``` text
New
Contacted
Interested
Meeting
Proposal
Won
Lost
```

## Lead sources

``` text
Google Maps
Website
Referral
LinkedIn
Job Board
Manual
Other
```

## Potential services

``` text
Website Development
Website Redesign
SEO
Landing Page
E-commerce
Custom Web Application
Maintenance
Other
```

------------------------------------------------------------------------

# 📊 Lead Scoring

Each lead can receive a score from:

``` text
0 - 100
```

Example:

``` text
90 - 100 → Excellent
75 - 89  → Good
50 - 74  → Medium
0 - 49   → Low
```

Potential scoring signals:

-   No website
-   Outdated website
-   Poor mobile experience
-   Poor SEO
-   Strong Google presence
-   Strong social presence
-   Number of reviews
-   Online enquiry opportunity
-   Business category
-   Location
-   Service fit

------------------------------------------------------------------------

# 🤖 AI Lead Research

AI research analyzes a business and identifies potential freelance
opportunities.

``` text
Business
   ↓
Website / Business information
   ↓
AI analysis
   ↓
Business overview
   ↓
Problems / opportunities
   ↓
Potential services
   ↓
Lead score
   ↓
Suggested pitch
   ↓
Recommended action
```

Example:

``` text
Lead Score: 92/100

Potential Service:
Website Development

Reasons:
- No dedicated website
- Strong Google presence
- Active social media
- Multiple customer reviews

Suggested Pitch:
Offer a professional website focused on
course information and student enquiries.

Recommended Action:
Call the owner.
```

------------------------------------------------------------------------

# 💰 AI Cost Strategy

The project is designed around a limited budget.

OpenAI and Claude APIs are **not required for V1**.

Planned local architecture:

``` text
Business information
       ↓
Normal application processing
       ↓
Ollama
       ↓
Local open-source model
       ↓
AI lead analysis
```

Possible models:

-   Qwen
-   Llama
-   Gemma
-   Other suitable open-source models

Paid providers can be added later if better quality is required.

------------------------------------------------------------------------

# 📞 AI Calling

AI calling is a future feature.

Conceptual workflow:

``` text
Lead
 ↓
AI Research
 ↓
Select Service
 ↓
Select Call Strategy
 ↓
Voice Agent
 ↓
Phone Call
 ↓
Prospect Response
 ↓
AI understands response
 ↓
Conversation continues
 ↓
Result
```

Possible results:

``` text
Interested
Not Interested
Follow-up
No Answer
Wrong Number
Meeting Booked
Transferred
```

Actual voice integration is intentionally postponed until the CRM and AI
workflow are stable.

------------------------------------------------------------------------

# 🗣️ Call Script System

The freelancer controls the sales strategy.

## Freelancer controls

-   Opening script
-   Closing script
-   Services
-   Objectives
-   Questions
-   Objection rules
-   Pricing rules
-   Transfer conditions
-   Maximum duration
-   Tone
-   Languages

## AI controls

-   Natural wording
-   Understanding responses
-   Follow-up questions
-   Normal objection handling
-   Interest detection
-   Transfer decisions

Workflow:

``` text
Fixed opening
      ↓
AI conversation
      ↓
Understand requirement
      ↓
Handle questions
      ↓
Determine interest
      ↓
Controlled closing
```

------------------------------------------------------------------------

# 🧪 Conversation Simulator

A free V1 simulator allows testing scripts without making real calls.

Features:

-   Start test
-   Reset
-   Clear conversation
-   Mock responses
-   Script testing

No external AI API is required for the initial simulator.

------------------------------------------------------------------------

# 📅 Follow-ups

Tracks tasks after contacting leads.

Sections:

``` text
Today
Tomorrow
This Week
Overdue
Completed
```

Follow-up fields:

-   Lead
-   Task
-   Due date
-   Time
-   Priority
-   Notes
-   Status

Actions:

-   Complete
-   Reschedule
-   Call
-   Email
-   Open Lead

------------------------------------------------------------------------

# 📞 Calls

Stores calling activity.

Call records can contain:

-   Lead
-   Date
-   Time
-   Duration
-   Result
-   AI summary
-   Transcript
-   Recording reference
-   Next action

Possible outcomes:

``` text
Interested
Not Interested
Follow-up
No Answer
Wrong Number
Meeting Booked
Transferred
```

------------------------------------------------------------------------

# 💼 Projects

Projects represent clients converted from leads.

The system is designed for a **solo freelancer**.

## Project capacity

Default:

``` text
Maximum active projects = 1
```

Capacity:

``` text
0 / 1
AVAILABLE

1 / 1
BUSY
```

When busy:

``` text
Currently working on one project.
```

New project conversion can be paused while an active project exists.

------------------------------------------------------------------------

# 🔄 Lead → Project

When a lead becomes:

``` text
Won
```

the system can offer:

``` text
Create Project
```

If capacity is available:

``` text
Lead
 ↓
Won
 ↓
Create Project
 ↓
Project Active
 ↓
Capacity = 1 / 1
```

If capacity is full:

``` text
Lead
 ↓
Won
 ↓
Capacity full
 ↓
Show warning
```

------------------------------------------------------------------------

# 📋 Project Management

Project fields:

-   Client
-   Project name
-   Description
-   Budget
-   Start date
-   Deadline
-   Progress
-   Status
-   Notes

Statuses:

``` text
Planning
Active
On Hold
Completed
Cancelled
```

------------------------------------------------------------------------

# ✅ Project Tasks

Example:

``` text
Homepage
Contact form
Mobile responsive
SEO setup
Deployment
```

Statuses:

``` text
Todo
In Progress
Done
```

Progress can be calculated from completed tasks.

------------------------------------------------------------------------

# 🧰 Services

The freelancer can define services.

Examples:

``` text
Website Development
Website Redesign
SEO
Custom Web Application
Landing Pages
E-commerce
Maintenance
```

Each service can have:

-   Name
-   Description
-   Starting price
-   Estimated delivery time
-   Active/inactive

These values can later be used by AI research and calls.

------------------------------------------------------------------------

# 📈 Sales Pipeline

``` text
New
 ↓
Contacted
 ↓
Interested
 ↓
Meeting
 ↓
Proposal
 ↓
Won / Lost
```

Pipeline cards show:

-   Business
-   Lead score
-   Potential value
-   Next action

------------------------------------------------------------------------

# 📊 Dashboard

KPI cards:

-   Active project
-   Total leads
-   Hot leads
-   Calls this week
-   Interested leads
-   Meetings
-   Follow-ups due
-   Conversion rate

Sections:

-   Lead Pipeline
-   Recent Leads
-   Recent Calls
-   Upcoming Follow-ups
-   Active Project
-   Weekly Activity

------------------------------------------------------------------------

# 🔎 Lead Discovery

Future lead-generation interface:

-   Category
-   Location
-   Number of leads
-   Minimum lead score
-   Website requirement
-   Website quality
-   Service type

Example:

``` text
Category:
Coaching Classes

Location:
Mumbai

Number:
20

Service:
Website Development
```

The implementation should use approved/appropriate data sources.

------------------------------------------------------------------------

# 🌐 Business Audit

Possible audit checks:

``` text
Website exists
Mobile friendly
HTTPS
Page speed
SEO
Contact form
WhatsApp
Google Business Profile
Social presence
```

Values can be:

``` text
Good
Average
Poor
Yes
No
Unknown
```

------------------------------------------------------------------------

# 📊 Analytics

Metrics:

-   Leads generated
-   Calls made
-   Calls answered
-   Interested leads
-   Meetings
-   Proposals
-   Projects won
-   Revenue

Conversion rates:

``` text
Lead → Contact
Contact → Interested
Interested → Meeting
Meeting → Won
```

------------------------------------------------------------------------

# 🔔 Notifications

Examples:

``` text
🔥 ABC Coaching is interested.

📞 Call completed with XYZ Classes.

⏰ Follow-up due today.

💼 Project deadline in 3 days.
```

------------------------------------------------------------------------

# 🔍 Global Search

Search across:

-   Leads
-   Calls
-   Projects
-   Follow-ups

Example:

``` text
Search: ABC
```

Results:

``` text
ABC Coaching
ABC Coaching call
ABC Coaching follow-up
ABC Coaching project
```

------------------------------------------------------------------------

# ⚙️ Settings

## Profile

-   Name
-   Email
-   Phone
-   Business name
-   Profile photo

## Calling

-   Default call duration
-   Calling hours
-   Transfer number
-   Recording settings

## AI Agent

-   AI instructions
-   Lead scoring settings
-   Model/provider configuration

## Notifications

-   Follow-up reminders
-   Interested lead alerts
-   Project deadline alerts
-   Call result alerts

## Appearance

-   Light
-   Dark
-   System

## Integrations

Potential integrations:

``` text
Twilio
Retell
Vapi
OpenAI
Claude
Ollama
Google Calendar
Email
```

These integrations are optional.

------------------------------------------------------------------------

# 🔌 Planned API Structure

## Authentication

``` http
POST /api/auth/register/
POST /api/auth/login/
GET  /api/auth/me/
POST /api/auth/logout/
```

## Leads

``` http
GET    /api/leads/
POST   /api/leads/
GET    /api/leads/{id}/
PUT    /api/leads/{id}/
PATCH  /api/leads/{id}/
DELETE /api/leads/{id}/
```

## AI Research

``` http
POST /api/leads/{id}/research/
```

## Calls

``` http
GET  /api/calls/
POST /api/calls/
GET  /api/calls/{id}/
```

## Follow-ups

``` http
GET  /api/follow-ups/
POST /api/follow-ups/
PUT  /api/follow-ups/{id}/
```

## Projects

``` http
GET  /api/projects/
POST /api/projects/
GET  /api/projects/{id}/
PUT  /api/projects/{id}/
```

## Services

``` http
GET  /api/services/
POST /api/services/
PUT  /api/services/{id}/
```

## Dashboard

``` http
GET /api/dashboard/
```

## Analytics

``` http
GET /api/analytics/
```

------------------------------------------------------------------------

# 🔒 Security

Principles:

-   JWT authentication
-   Protected CRM endpoints
-   User-level data isolation
-   Never expose passwords
-   Django password hashing
-   Secrets in environment variables
-   `.env` excluded from Git
-   Database credentials excluded from Git
-   `DEBUG = False` in production
-   Proper `ALLOWED_HOSTS`
-   HTTPS in production

------------------------------------------------------------------------

# 💸 Budget Philosophy

V1 should not require paid:

``` text
OpenAI API
Claude API
Retell
Vapi
Twilio
WhatsApp API
Google Maps API
```

Local AI experiments can use:

``` text
Ollama + open-source LLM
```

Real phone calling should be added only after the CRM and AI workflow
work correctly.

------------------------------------------------------------------------

# 🚀 Development Roadmap

## Phase 1 --- Foundation

-   [x] Django project
-   [x] Django REST Framework
-   [x] JWT authentication
-   [x] Registration
-   [x] Login
-   [x] Logout
-   [x] Current-user endpoint
-   [x] Lead model
-   [x] Lead serializer
-   [x] Lead CRUD
-   [x] User-specific lead filtering
-   [x] DRF ViewSet
-   [x] DRF Router

## Phase 2 --- CRM

-   [ ] Complete Lead fields
-   [ ] Lead statuses
-   [ ] Lead priorities
-   [ ] Lead sources
-   [ ] Services
-   [ ] Follow-ups
-   [ ] Calls
-   [ ] Activity timeline
-   [ ] Notifications
-   [ ] Dashboard statistics
-   [ ] Analytics

## Phase 3 --- Projects

-   [ ] Project model
-   [ ] Project tasks
-   [ ] Project milestones
-   [ ] Project capacity
-   [ ] Lead → Project conversion
-   [ ] Project completion workflow

## Phase 4 --- AI Research

-   [ ] Business research service
-   [ ] Website analysis
-   [ ] Lead scoring
-   [ ] AI recommendations
-   [ ] Suggested pitch
-   [ ] Ollama integration
-   [ ] AI research history

## Phase 5 --- AI Sales Agent

-   [ ] Script builder
-   [ ] Agent instructions
-   [ ] Conversation simulator
-   [ ] Objection handling
-   [ ] Service-specific scripts
-   [ ] Transfer rules
-   [ ] Call result classification

## Phase 6 --- Voice Calling

-   [ ] Voice provider integration
-   [ ] Phone number configuration
-   [ ] Outbound calls
-   [ ] Speech-to-text
-   [ ] Text-to-speech
-   [ ] AI conversation
-   [ ] Call recording
-   [ ] Transcription
-   [ ] Call summaries
-   [ ] Human transfer

## Phase 7 --- Production

-   [ ] PostgreSQL
-   [ ] Environment variables
-   [ ] Backend deployment
-   [ ] Frontend deployment
-   [ ] HTTPS
-   [ ] CORS
-   [ ] Logging
-   [ ] Error monitoring
-   [ ] Backups
-   [ ] Security review

------------------------------------------------------------------------

# 🧑‍💻 Development Philosophy

This is both a real product and a Django/DRF learning project.

Important concepts to learn while building:

-   Django project vs app
-   Django models
-   Migrations
-   Django ORM
-   Serializers
-   APIViews
-   Function-based API views
-   Decorators
-   Permissions
-   JWT authentication
-   Generic views
-   ViewSets
-   Routers
-   Relationships
-   REST API design
-   React ↔ Django integration

The project should avoid unnecessary complexity until the underlying
concepts are understood.

------------------------------------------------------------------------

# 🧪 Local Development

## Backend

Create virtual environment:

``` bash
python -m venv venv
```

Windows:

``` bash
venv\Scriptsctivate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

Migrate:

``` bash
python manage.py migrate
```

Create admin user:

``` bash
python manage.py createsuperuser
```

Run server:

``` bash
python manage.py runserver
```

Backend:

``` text
http://127.0.0.1:8000/
```

Django Admin:

``` text
http://127.0.0.1:8000/admin/
```

------------------------------------------------------------------------

# 🧩 Git

Commit:

``` text
Source code
Django migrations
requirements.txt
.env.example
README.md
```

Do not commit:

``` text
venv/
.env
db.sqlite3
__pycache__/
*.pyc
```

Django migration files **should be committed**.

------------------------------------------------------------------------

# 📌 Current Status

The project is currently in **backend foundation / CRM API
development**.

Completed:

``` text
React/Lovable frontend
        ↓
Django backend
        ↓
JWT authentication
        ↓
Lead CRUD
        ↓
DRF ViewSet + Router
```

Next:

``` text
Complete Lead system
        ↓
Follow-ups
        ↓
Calls
        ↓
Projects
        ↓
Dashboard / Analytics
        ↓
AI Lead Research
        ↓
AI Conversation Simulator
        ↓
Real Voice Calling
```

------------------------------------------------------------------------

# 🎯 Final Vision

Solo Boost CRM should become a personal sales operating system for a
solo freelancer.

Instead of manually doing:

``` text
Find business
↓
Research website
↓
Decide if good lead
↓
Write pitch
↓
Call
↓
Remember follow-up
↓
Track conversation
↓
Send proposal
↓
Start project
↓
Track project
```

the system organizes the process:

``` text
                    SOLO BOOST CRM
                          │
             ┌────────────┴────────────┐
             │                         │
       LEAD GENERATION             AI RESEARCH
             │                         │
             └────────────┬────────────┘
                          ↓
                    LEAD PIPELINE
                          ↓
                 CALL / OUTREACH
                          ↓
                    FOLLOW-UP
                          ↓
                     MEETING
                          ↓
                    PROPOSAL
                          ↓
                       WON
                          ↓
                      PROJECT
                          ↓
                  PROJECT COMPLETE
                          ↓
                   CAPACITY FREE
                          ↓
                  NEXT CLIENT
```

The objective is not to replace the freelancer.

It is to automate repetitive lead-generation and sales administration so
the freelancer can focus on building projects, talking to serious
prospects, delivering quality work, and growing revenue without
immediately building a large team.

------------------------------------------------------------------------