# 🎓 CampusNet — India's Premier National Academic & Innovation Network

[![Live Platform](https://img.shields.io/badge/Live%20Platform-CampusNet%20Railway-00C7B7?style=for-the-badge&logo=railway)](https://campusnet-production.up.railway.app)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

**CampusNet** is a state-of-the-art national-level student, mentor, project, research, and events networking ecosystem connecting higher education institutions, faculty guides, PhD scholars, and national hackathons across all 28 states and Union Territories in India.

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

## 💻 4. Local Development

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/moglieswarachary-droid/campusnet.git
cd campusnet

# Install dependencies
npm install

# Start local development server with network host
npm run dev -- --host
```

### Local URLs:
- **Public Platform**: `http://localhost:3000/`
- **Organizer Portal**: `http://localhost:3000/?portal=organizer`
- **Super Admin Console**: `http://localhost:3000/?portal=admin`

### Build Production Bundle:
```bash
npm run build
```

---

## 📄 License

© 2026 CampusNet National Academic & Innovation Network. All rights reserved.