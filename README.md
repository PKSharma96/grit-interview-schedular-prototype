# GRIT Track Badge Interview Scheduling System
### Built for NIAT (NxtWave Institute of Advanced Technologies) • GRIT Skilling Competition

An enterprise-grade, high-integrity interview scheduling platform designed for **GRIT**—a year-long competitive skilling program where engineering students clear rigorous technical contests to earn Miles, defend their technical mastery in live 1:1 online interviews with expert interviewers, and unlock verified Track Badges.

---

## 🌟 Key System Capabilities

1. **Student Dashboard & Frictionless Booking Flow**:
   - Automated prerequisite detection (clearing 4/4 skill contests unlocks the booking window).
   - Self-serve slot discovery by track, date, and verified interviewer profiles.
   - Optimistic concurrency locking (5-minute TTL) to prevent double-booking during flash reservation spikes.
   - Live preparation hub: Google Meet integration, calendar invites (.ICS), and defense syllabus checklist.

2. **Interviewer Hub & Availability Engine**:
   - Set recurring active days, operating hours, and buffer intervals between sessions.
   - Add ad-hoc custom slots directly into the booking pool.
   - Daily schedule view with student repository links, contest scores, and instant Google Meet launcher.
   - Structured multi-dimensional evaluation rubric: **Pass**, **Retake Later** (with cooling-off period), **Fail**, and **Suspected Malpractice Red Flag**.

3. **Interview Operations & Cohort Intelligence**:
   - Real-time conversion funnel: Total Eligible, Booked (%), Unbooked (%), and Completed rates.
   - Cohort roster with 1-click WhatsApp/Email nudge sequences for unbooked students.
   - **Malpractice Audit & Revocation Desk**: Atomic badge revocation, automated Miles retraction from national leaderboard, and 72-hour formal appeal tracking.

4. **Before vs. After Result Transformations**:
   - Interactive side-by-side comparison illustrating how the student dashboard dynamically morphs across every state in the lifecycle.

5. **The 3 Core Student Messages (Verbatim Copy)**:
   - Message 1: Slot Confirmation & Live Defense Readiness Pack.
   - Message 2: Post-Interview Result & Badge Verification / Retake Guidance.
   - Message 3: Academic Integrity Audit & Badge Nullification Notice.

---

## 🏗️ State Machine Architecture

```
                        [ Ineligible: Skill Contests Incomplete ]
                                      │
                                      ▼ (Clears all contests for Track)
                          [ ELIGIBLE_UNBOOKED ] ◄─────────────────────────┐
                                      │                                   │ (Cooldown ends &
                                      ▼ (Selects slot & confirms)         │  retake attempts < 2)
                             [ BOOKED_CONFIRMED ]                         │
                                      │                                   │
              ┌───────────────────────┼────────────────────────┐          │
              ▼ (Time arrives)        ▼ (>12h cancel/reschedule)▼         │
        [ IN_PROGRESS ]         [ RESCHEDULED / REBOOK ]   [ NO_SHOW ]    │
              │                                                │          │
              ▼ (Call concludes)                               ▼          │
      [ PENDING_EVALUATION ] (24h SLA)                  (Cooldown 7d)     │
              │                                                           │
     ┌────────┼───────────────────────┬────────────────────────┐          │
     ▼        ▼                       ▼                        ▼          │
  [ PASS ] [ FAIL ]          [ RETAKE_COOLDOWN ]      [ FLAGGED_AUDIT ]   │
     │        │                       │                        │          │
     │        ▼                       └────────────────────────┘          │
     │    [ EXHAUSTED ]                                                   ▼
     ▼ (Badge Awarded, +Miles)                                   [ BADGE_NULLIFIED ]
     │                                                            (Badge revoked,
     └─────────────────(Post-award malpractice confirmed)─────────►Miles deducted)
```

---

## 🛡️ Edge Cases Handled & Architectural Guarantees

| Category | Challenge | Engineered Solution |
|---|---|---|
| **Concurrency** | Multiple students booking the same slot simultaneously. | **Optimistic Row-Level Lock (`SELECT FOR UPDATE`)** with 5-minute Redis reservation TTL. Alternate slot suggestions on collision. |
| **Integrity / Fraud** | Malpractice detected weeks after badge issuance. | **Atomic Badge Revocation (`BADGE_NULLIFIED`)**, immutable audit log (`malpractice_audit_logs`), leaderboard Miles deduction, and formal appeal dispatch. |
| **Interviewer Drop** | Interviewer cancels 2 hours prior due to emergency. | **Automated Peer-Match Failover** or instant "VIP Fast-Track" rebooking pass. |
| **Student No-Show** | Candidate fails to join the call. | **10-minute Grace Window** followed by a 1-strike 7-day rebooking cooldown. |
| **Retake Burnout** | Rapid rebooking without addressing weaknesses. | **Hard Cap (2 Retakes Max)** + mandatory **14-day study cooling period** with diagnostic rubric recommendations. |
| **Timezone Safety** | Cross-region interviewers & candidates. | **UTC Canonical Storage (ISO-8601)**; localized display in client's detected timezone (IST default). |

---

## 🗄️ Relational Data Model (PostgreSQL)

The system is built on a normalized relational schema:
- `track_badges`: Definition of tracks, skills, rewards, and retry policies.
- `students`: Student identity, leaderboard Miles, and integrity standing.
- `student_badge_eligibility`: Deterministic state tracker for each student-track pairing.
- `interviewers`: Verified expert profiles, domains, and quotas.
- `interviewer_slots`: Granular 30-minute availability blocks with reservation states.
- `interview_bookings`: Scheduled appointments and Google Meet room bindings.
- `interview_evaluations`: Multi-dimensional rubric scores and feedback.
- `malpractice_audit_logs`: Immutable audit trails for disciplinary and nullification events.

*(The full DDL schema is provided in `docs/GRIT_INTERVIEW_SCHEDULING_DESIGN_DOC.md` and accessible in the prototype's Specs tab).*

---

## 📁 Repository Structure

```
grit-interview-scheduler/
├── docs/
│   ├── GRIT_INTERVIEW_SCHEDULING_DESIGN_DOC.md  # 2-Page technical design document
│   ├── STUDENT_MESSAGES.md                      # The 3 core messages verbatim
│   └── LOOM_RECORDING_SCRIPT.md                 # Word-for-word Loom video presentation guide
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                           # Navigation + Journey State Simulator
│   │   ├── StudentPortal.jsx                    # Student booking & lifecycle views
│   │   ├── InterviewerHub.jsx                   # Availability manager & outcome rubric
│   │   ├── AdminHub.jsx                         # Funnel metrics & malpractice desk
│   │   ├── StudentMessagesTab.jsx               # Production message copy viewer
│   │   ├── ArchitectureDocTab.jsx               # In-app technical spec viewer
│   │   └── BeforeAfterShowcase.jsx              # Side-by-side before/after comparison
│   ├── data/
│   │   └── mockData.js                          # Rich seed data & initial state
│   ├── App.jsx                                  # Reactive state controller & toasts
│   ├── index.css                                # Tailwind CSS imports & styles
│   └── main.jsx                                 # React root entry
├── index.html                                   # HTML5 shell
├── package.json                                 # Node package configuration
├── vite.config.js                               # Vite & Tailwind configuration
└── README.md                                    # Project documentation
```

---

## 🚀 Quickstart: Running the Prototype Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch
```bash
# 1. Clone or navigate to the repository
cd /Users/pushpendrakumar/Desktop/grit-interview-scheduler

# 2. Dependencies are already installed; start the local Vite development server:
npm run dev
```

The application will run on `http://localhost:5173/`. Open it in your browser to interact with all roles and features!

### Production Build
```bash
npm run build
npm run preview
```

---

## 🎥 Loom Recording Walkthrough
For the video submission, a step-by-step presentation script is included in [docs/LOOM_RECORDING_SCRIPT.md](docs/LOOM_RECORDING_SCRIPT.md), featuring talking points, screen directions, and timing marks.
