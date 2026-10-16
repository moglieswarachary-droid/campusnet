# 🎓 CampusNet+ — India's Premier National Academic & Innovation Network

[![Live Platform](https://img.shields.io/badge/Live%20Platform-CampusNet%2B%20Railway-00C7B7?style=for-the-badge&logo=railway)](https://campusnet-production.up.railway.app)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

**CampusNet+** is a state-of-the-art national-level student, mentor, project, research, and events networking ecosystem connecting higher education institutions, faculty guides, PhD scholars, and national hackathons across all 28 states and Union Territories in India.

---

## 🌐 1. Live Deployment & Portal Routing

The platform features a **dedicated 3-tier portal routing architecture** strictly isolating organizational event management and super-admin controls from the public website while staying securely synchronized through a unified reactive backend layer.

| Portal | Live Deployed Link | Production Subdomain | Target Audience |
| :--- | :--- | :--- | :--- |
| **🌐 Public CampusNet** | [https://campusnet-production.up.railway.app/](https://campusnet-production.up.railway.app/) | `https://campusnet.in` | Students, Faculty Mentors, PhD Scholars |
| **🏢 Institutional Organizer Portal** | [https://campusnet-production.up.railway.app/?portal=organizer](https://campusnet-production.up.railway.app/?portal=organizer) | `https://organizer.campusnet.in` | Colleges, Universities & Event Chairs |
| **🛡️ Super Admin Console** | [https://campusnet-production.up.railway.app/?portal=admin](https://campusnet-production.up.railway.app/?portal=admin) | `https://admin.campusnet.in` | National Governance & Accreditation |

> 📱 **Mobile Access**: The platform is 100% responsive. When navigating on mobile, an interactive **floating switcher dock** is located at the bottom-right corner for 1-tap switching between all portals.

---

## 🔑 2. Master System Login Keys & Demo Credentials

### 🛡️ A. National Super Admin Console
👉 **Link**: [https://campusnet-production.up.railway.app/?portal=admin](https://campusnet-production.up.railway.app/?portal=admin)

* **Username / Email**: `superadmin.demo` or `superadmin@campusnet-demo.in`
* **Master Password**: `Admin@CampusNet2026`
* **Hardware MFA Security Token**: `849201` *(or any 6-digit code)*
* **Key Actions**: Master event moderation queue, college accreditation, global user moderation, and tamper-proof certificate revocation.
* **Quick Login**: Click **"⚡ Autofill Super Admin Credentials"** on screen.

---

### 🏢 B. Institutional Event Organizer Portal
👉 **Link**: [https://campusnet-production.up.railway.app/?portal=organizer](https://campusnet-production.up.railway.app/?portal=organizer)

#### Account 1 — Kuppam Engineering College (KEC)
* **Institution ID**: `KEC-DEMO-001`
* **Official Coordinator Email**: `organizer.demo@campusnet-demo.in`
* **Password**: `CampusNet@Demo2026`
* **Coordinator**: Demo Event Coordinator (*Dean of Innovation & Hackathons*)
* **Hosted Event**: *KEC National AI & Smart Robotics Hackathon 2026* (`KEC-AI26-HACK`)
* **Quick Login**: Click **"⚡ Autofill Kuppam Engineering College"**.

#### Account 2 — CampusNet Demo University
* **Institution ID**: `CNU-DEMO-002`
* **Official Coordinator Email**: `events@campusnet-demo.in`
* **Password**: `CampusNet@Demo2026`
* **Coordinator**: Prof. Sudhir Sen (*Convener National Technical Conclave*)
* **Quick Login**: Click **"⚡ Autofill CampusNet Demo University"**.

---

### ⚖️ C. External Jury & Judge Scoring Access Keys
Used in the Organizer Portal under **"Jury Console"** to grade live student submissions:

* **Judge 1 (Dr. Arvind Rao - IIT Bombay)**:
  - **Access Key**: `JUDGE-KEC-RAO-99`
  - **Email**: `arvind.rao@iitb.ac.in`
  - **Assigned Event**: `ev-kec-001` (KEC National AI Hackathon)
* **Judge 2 (Dr. Priya Sundaram - IISc Bangalore)**:
  - **Access Key**: `JUDGE-KEC-PRIYA-88`
  - **Email**: `priya.sundaram@iisc.ac.in`
  - **Assigned Event**: `ev-kec-001` (KEC National AI Hackathon)

---

### 🎓 D. Public Role Switcher Accounts
👉 **Link**: [https://campusnet-production.up.railway.app/](https://campusnet-production.up.railway.app/)

Switch roles directly via the top navbar dropdown:
1. **Student Mode**: `Aarav Sharma` (*NITK Surathkal*) — Team Lead of *AgriVision AI*, QR verified attendance, project workspace.
2. **Faculty Mentor Mode**: `Dr. Arvind Rao` (*IIT Bombay*) — Project guidance, milestone reviews, mentorship certificate issuance.
3. **PhD Scholar Mode**: `Kavya Ramanathan` (*IISc Bangalore*) — Peer review, research publications registry, national lab collaborations.

---

## 🛠️ 3. Key Feature Modules

### 🏛️ Dedicated Institutional Organizer Portal (`src/components/organizer/...`)
- **Event Creation Wizard**: 30+ field creation wizard with Venue GPS coordinates, radius in meters for anti-proxy geofencing, prizes, tracks, rules, and schedules.
- **Event Lifecycle Manager**: Status flow (`Draft → Review → Approved → Published → Live → Completed`) with safe event duplication.
- **Participant Roster**: Team rosters, search, filter, and CSV data export.
- **Attendance QR Scanner**: Optical QR camera scanner simulator, manual roll number override, duplicate check-in prevention, and timestamped audit logs.
- **Project Submissions Inbox**: Review proposals, GitHub repository links, and live demo videos.
- **Judging & Criteria Management**: Multi-criteria weighted rubrics, judge access keys, and real-time weighted score calculation.
- **Winner Management & Leaderboard**: Competition leaderboard with 1-click binding to Winner / Runner-Up certificates.
- **Certificate Management Center**: Custom template builder, bulk minting (`CN-KEC-AI26-PART-000101`), and certificate revocation.
- **Push Announcements & Reports**: Push notifications and printable NAAC/NIRF accreditation reports.

### 🛡️ Dedicated Super Admin Portal (`src/components/admin/...`)
- **Event Moderation Approval Queue**: National review queue to inspect, approve, or return college events with comments.
- **Institution Accreditation Manager**: Verify AISHE bonafide college credentials or suspend unverified organizers.
- **National User Moderator**: Global student/mentor/scholar moderation and bonafide badge verification.
- **Certificate Fraud Auditor**: Pan-India certificate search with immutable fraud revocation.
- **National Intelligence & Audit Logs**: State-wise innovation metrics and exportable security logs.

### 🌟 Public CampusNet Platform
- **Zero Public Exposure**: `Navbar` and `Footer` contain **zero** organizer or super admin links.
- **National Discovery**: Search across 10,000+ students, 850+ mentors, 520+ PhD scholars, and 450+ colleges.
- **Verified Credentials**: Instant QR code verifiable credential lookup for participants and mentors.

---

## 🏗️ 4. Monorepo Repository Architecture

The CampusNet codebase is structured as a clean, production-oriented monorepo with physically separated frontend and backend workspaces:

```text
campusnet/
├── frontend/               # React 19 + Vite client workspace
│   ├── src/
│   │   ├── components/     # Portal-specific and shared UI components
│   │   ├── context/        # AppContext reactive global client state
│   │   ├── data/           # Mock data and seed structures
│   │   ├── styles/         # Tailwind CSS design system
│   │   ├── utils/          # Client utilities & shared re-exports
│   │   └── types/          # Client types & shared re-exports
│   ├── tests/              # 168-case portal, rbac, and verification test suite
│   ├── index.html          # SPA HTML entry point
│   ├── vite.config.ts      # Vite configuration & proxy to backend
│   ├── vercel.json         # Standalone Vercel deployment configuration
│   └── package.json        # Frontend workspace package (@campusnet/frontend)
│
├── backend/                # Native Node.js HTTP server workspace
│   ├── src/
│   │   ├── server.js       # Native Node.js HTTP server (zero heavy framework overhead)
│   │   └── database/       # PrismaClient connection pool singleton
│   ├── prisma/
│   │   └── schema.prisma   # PostgreSQL canonical relational schema (Task 1.1)
│   ├── data/               # Persistent file-backed JSON store
│   ├── tests/              # 41-case backend API, auth & RBAC test suite
│   ├── railway.json        # Standalone Railway deployment configuration
│   └── package.json        # Backend workspace package (@campusnet/backend)
│
├── shared/                 # Pure browser-safe shared contracts & constants
│   ├── src/
│   │   ├── types/          # Core domain models (User, Project, Event, Certificate)
│   │   ├── constants/      # RBAC canonical roles, permissions matrix, location data
│   │   └── validation/     # Validation rules and portal routing logic
│   └── package.json        # Shared workspace package (@campusnet/shared)
│
├── docs/                   # PDF, HTML, and Markdown platform documentation
├── package.json            # Root workspace orchestrator
├── tsconfig.json           # Solution-level TypeScript references
└── .gitignore              # Environment, build, and node_modules ignore rules
```

---

## 💻 5. Development & Workspace Commands

### Root Workspace Commands
```bash
# Run frontend development server (Vite on port 3000):
npm run dev:frontend

# Run backend API server (Native Node.js HTTP on port 3199):
npm run dev:backend

# Run complete production build:
npm run build

# Run all 209 automated regression tests across all workspaces:
npm test

# Validate Prisma relational database schema:
npm run prisma:validate

# Generate Prisma client:
npm run prisma:generate
```

### Independent Workspace Execution
Each workspace can be operated completely independently:

#### Frontend (`frontend/`):
```bash
cd frontend
npm run dev       # Starts Vite dev server on http://localhost:3000
npm run build     # Runs tsc and compiles production bundle to frontend/dist
npm run test      # Runs portal route, RBAC, verification, and demo login suites (168 tests)
```

#### Backend (`backend/`):
```bash
cd backend
npm run dev       # Starts native Node.js HTTP server on http://localhost:3199
npm run test      # Runs backend API, auth, session, and RBAC suite (41 tests)
npm run prisma:validate  # Validates backend/prisma/schema.prisma
```

---

## 🚀 6. Separate Deployment Instructions

### Frontend Deployment (Vercel)
1. Set the **Root Directory** in Vercel to `frontend` (or deploy from repository root using the included `vercel.json`).
2. Build command: `npm run build`
3. Output directory: `dist` (or `frontend/dist` when deploying from root).
4. Set environment variable: `VITE_API_BASE_URL` pointing to your deployed backend URL.

### Backend Deployment (Railway)
1. Deploy the backend service from the `backend/` directory or root using `railway.json`.
2. Start command: `npm start`
3. Expose port `3199` (or map via `PORT` environment variable).
4. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, and `CORS_ALLOWED_ORIGINS`.

---

## 📄 License

© 2026 CampusNet National Academic & Innovation Network. All rights reserved.