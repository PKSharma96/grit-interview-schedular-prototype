# GRIT Track Badge Interview Scheduling System
## System Architecture & Technical Design Document (2-Page Specification)

---

### 1. Context & Business Problem
**GRIT** (Global Readiness Immersion Trips) is a year-long competitive skilling program organized by **NIAT** (NxtWave Institute of Advanced Technologies). Engineering students clear technical skill contests across domains (AI Systems, AI Product, AI Models, Full-Stack Mastery) to accumulate **Miles** on a national leaderboard. 

When a student clears every prerequisite skill contest required for a Track Badge, they unlock the right to a **live 1:1 online interview** with an industry interviewer to defend their code, demonstrate conceptual depth, and earn their verified **Track Badge**. 

#### Core Requirements:
1. **Student Dashboard**: Real-time eligibility detection, self-serve booking calendar, live status tracking, before-and-after interview outcomes.
2. **Interviewer Hub**: Set recurring/ad-hoc availability, daily roster, live meeting launcher, structured outcome recording (Pass, Retake Later, Fail, Malpractice Flag).
3. **Interview Operations / Admin**: Live cohort funnel (who is eligible, who has booked vs. unbooked), 1-click reminders, and audit-level **Badge Nullification** if malpractice is flagged post-interview.

---

### 2. State Machine: Student Interview Journey

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

#### Detailed State Transition Matrix

| # | Current State | Trigger / Event | Next State | System Actions & Invariants |
|---|---|---|---|---|
| 1 | `INELIGIBLE` | Student clears final required contest in Track | `ELIGIBLE_UNBOOKED` | Mint eligibility record; send celebratory email + push; open 14-day booking window. |
| 2 | `ELIGIBLE_UNBOOKED` | Student selects interviewer slot | `SLOT_RESERVED` | Optimistic lock on slot for 5 mins; prevents double-booking. |
| 3 | `SLOT_RESERVED` | Student confirms booking checklist | `BOOKED_CONFIRMED` | Commit slot lock; generate unique Google Meet link; sync calendar ICS; notify interviewer. |
| 4 | `BOOKED_CONFIRMED` | Student reschedules (>12h before) | `ELIGIBLE_UNBOOKED` | Release slot; mark previous booking `RESCHEDULED`; quota decrement (max 1 self-reschedule). |
| 5 | `BOOKED_CONFIRMED` | Interviewer cancels due to emergency | `ELIGIBLE_UNBOOKED` | Emergency SMS/email to student; grant "VIP Priority Booking" slot access. |
| 6 | `BOOKED_CONFIRMED` | Slot time starts & participants join | `IN_PROGRESS` | Enable meeting room token; interviewer rubric modal unlocks. |
| 7 | `BOOKED_CONFIRMED` | Student does not join within 10 mins | `STUDENT_NO_SHOW` | Strike logged against student; 7-day cooldown before rebooking; slot recorded. |
| 8 | `IN_PROGRESS` | Call concludes | `PENDING_EVALUATION` | 24-hour SLA timer starts for interviewer to submit structured rubric score. |
| 9 | `PENDING_EVALUATION` | Interviewer records **PASS** | `PASSED_BADGE_AWARDED` | Mint verifiable digital badge on NIAT profile; credit +500/1000 Miles; post to leaderboard. |
| 10| `PENDING_EVALUATION` | Interviewer records **RETAKE LATER** | `RETAKE_COOLDOWN` | Send detailed diagnostic rubric; start 14-day study timer; student cannot book until cooldown expires. |
| 11| `RETAKE_COOLDOWN` | Cooldown timer elapses (Retakes < 2) | `ELIGIBLE_UNBOOKED` | Booking re-opens with "Retake Attempt #2" tag; historical feedback attached to dossier. |
| 12| `PENDING_EVALUATION` | Interviewer records **FAIL** (or Retake 2 failed) | `FAILED_EXHAUSTED` | Track locked for current cohort; student must re-qualify through future contests. |
| 13| `IN_PROGRESS` / `PENDING` | Blatant fraud detected (proxy, lip sync) | `UNDER_AUDIT` | Immediate escalation to Integrity Board; candidate frozen from all tracks. |
| 14| `PASSED_BADGE_AWARDED` | Post-award contest plagiarism confirmed | `BADGE_NULLIFIED` | Revoke badge; stamp watermark "NULLIFIED"; deduct Miles from leaderboard; dispatch integrity letter. |

---

### 3. Edge Cases, Corner Scenarios & Assumptions Handled

| Category | Edge Case Scenario | Architectural Mitigation & Business Rule |
|---|---|---|
| **Concurrency** | 2 students click the same interviewer slot at the exact same millisecond. | **Optimistic Locking with Distributed TTL**: Database row level lock (`SELECT FOR UPDATE`) sets slot to `RESERVED` for 300 seconds. If confirmation fails or times out, Redis TTL releases slot back to pool. |
| **Interviewer Drop** | Interviewer cancels 2 hours before the interview or no-shows. | **Auto-Failover / VIP Fast-Track**: System alerts Ops desk. If backup interviewer is available, swap seamlessly with student consent. Otherwise, candidate receives an immediate VIP booking pass that bypasses waitlists. |
| **Student No-Show** | Student forgets or fails to show up without prior notice. | **10-minute Grace Period & 1-Strike Policy**: Interviewer marks "No-Show" only after 10 min. First instance enforces 7-day rebooking cooldown. Second instance locks the track for the season. |
| **Integrity / Fraud** | Malpractice detected **after** badge issuance (e.g. AI-assisted contest code flagged 3 weeks later). | **Immutable Audit Log & Cascading Revocation**: Integrity Admin triggers `NULLIFY_BADGE`. System performs atomic database transaction: (1) Marks badge `NULLIFIED`, (2) Deducts awarded Miles from Leaderboard, (3) Dispatches formal notice. |
| **Retake Limits** | Student repeatedly books retakes without studying. | **Cap & Mandatory Cooldown**: Hard cap of **2 retakes max**. 14-day mandatory cooling period. Student must review rubric feedback before booking unlock. |
| **Capacity Crunch** | 300 students qualify in the final week before cohort graduation. | **Dynamic Slot Scaling & Priority Queue**: System flags interviewer supply deficit to Ops. Students ranked by Contest Milestone Timestamp (first to finish gets priority booking windows). |
| **Timezone Ambiguity** | Students and interviewers across different regions. | **UTC Canonical Storage with Local Display**: All timestamps stored strictly in UTC ISO-8601. Frontend parses to browser locale (IST default: Asia/Kolkata). |

---

### 4. Relational Data Model & Schema (PostgreSQL)

```
┌─────────────────┐       ┌────────────────────────┐       ┌─────────────────┐
│    students     │1     *│student_badge_eligibility│*     1│  track_badges   │
├─────────────────┤◄──────├────────────────────────┤──────►├─────────────────┤
│ student_id (PK) │       │ eligibility_id (PK)    │       │ track_id (PK)   │
│ email           │       │ student_id (FK)        │       │ track_name      │
│ full_name       │       │ track_id (FK)          │       │ required_skills │
│ grit_miles      │       │ status (ENUM)          │       │ miles_reward    │
│ integrity_status│       │ retake_count           │       │ cooldown_days   │
└────────┬────────┘       │ cooldown_until         │       └─────────────────┘
         │                └───────────┬────────────┘
         │1                           │1
         │                            │
         │*                           │*
┌────────┴────────┐       ┌───────────┴────────────┐       ┌─────────────────┐
│interview_booking│       │  interview_evaluations │*     1│  interviewers   │
├─────────────────┤       ├────────────────────────┤◄──────├─────────────────┤
│ booking_id (PK) │       │ eval_id (PK)           │       │ interviewer_id  │
│ eligibility_id  │       │ booking_id (FK)        │       │ full_name       │
│ interviewer_id  │       │ outcome (ENUM)         │       │ email           │
│ slot_id (FK)    │       │ rubric_scores (JSONB)  │       │ track_specialties│
│ scheduled_at    │       │ feedback_public        │       │ max_daily_slots │
│ meeting_url     │       │ internal_notes         │       └────────┬────────┘
│ booking_status  │       │ malpractice_flag (BOOL)│                │1
└────────┬────────┘       └───────────┬────────────┘                │
         │1                           │1                            │*
         │                            │                     ┌───────┴─────────┐
         │*                           │*                    │interviewer_slots│
┌────────┴────────┐       ┌───────────┴────────────┐        ├─────────────────┤
│ malpractice_logs│       │  system_notifications  │        │ slot_id (PK)    │
├─────────────────┤       ├────────────────────────┤        │ interviewer_id  │
│ audit_id (PK)   │       │ notif_id (PK)          │        │ start_time (UTC)│
│ student_id (FK) │       │ user_id (FK)           │        │ end_time (UTC)  │
│ track_id (FK)   │       │ channel (EMAIL/SMS/APP)│        │ is_booked (BOOL)│
│ reason_code     │       │ template_id            │        │ is_reserved     │
│ evidence_url    │       │ sent_at (TIMESTAMP)    │        └─────────────────┘
│ revoked_by (FK) │       └────────────────────────┘
└─────────────────┘
```

#### SQL Schema DDL & Constraints

```sql
-- 1. Track Badges Definition
CREATE TABLE track_badges (
    track_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    domain VARCHAR(50) NOT NULL, -- e.g. 'AI Systems', 'AI Product'
    miles_value INT NOT NULL DEFAULT 500,
    required_contest_ids TEXT[] NOT NULL,
    max_retakes INT NOT NULL DEFAULT 2,
    cooldown_days INT NOT NULL DEFAULT 14,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Students Master Table
CREATE TABLE students (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grit_roll_no VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    total_miles INT NOT NULL DEFAULT 0,
    integrity_status VARCHAR(30) DEFAULT 'CLEAN' CHECK (integrity_status IN ('CLEAN', 'UNDER_INVESTIGATION', 'SUSPENDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Student Badge Eligibility & Journey State
CREATE TYPE eligibility_state AS ENUM (
    'INELIGIBLE', 'ELIGIBLE_UNBOOKED', 'BOOKED', 'IN_PROGRESS', 
    'PENDING_EVAL', 'PASSED', 'RETAKE_COOLDOWN', 'FAILED_EXHAUSTED', 'BADGE_NULLIFIED'
);

CREATE TABLE student_badge_eligibility (
    eligibility_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    track_id VARCHAR(50) NOT NULL REFERENCES track_badges(track_id),
    current_state eligibility_state NOT NULL DEFAULT 'INELIGIBLE',
    contests_completed_at TIMESTAMP WITH TIME ZONE,
    retake_count INT NOT NULL DEFAULT 0,
    cooldown_until TIMESTAMP WITH TIME ZONE,
    badge_issued_at TIMESTAMP WITH TIME ZONE,
    badge_nullified_at TIMESTAMP WITH TIME ZONE,
    nullification_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, track_id)
);

-- 4. Interviewers & Availability Slots
CREATE TABLE interviewers (
    interviewer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    expertise_tracks TEXT[] NOT NULL,
    daily_quota INT NOT NULL DEFAULT 6,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE interviewer_slots (
    slot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interviewer_id UUID NOT NULL REFERENCES interviewers(interviewer_id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'BOOKED', 'BLOCKED')),
    reserved_until TIMESTAMP WITH TIME ZONE,
    reserved_by_student_id UUID REFERENCES students(student_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT slot_time_check CHECK (end_time > start_time)
);
CREATE INDEX idx_slot_lookup ON interviewer_slots(interviewer_id, start_time, status);

-- 5. Interview Bookings
CREATE TABLE interview_bookings (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eligibility_id UUID NOT NULL REFERENCES student_badge_eligibility(eligibility_id),
    interviewer_id UUID NOT NULL REFERENCES interviewers(interviewer_id),
    slot_id UUID UNIQUE NOT NULL REFERENCES interviewer_slots(slot_id),
    meeting_url VARCHAR(255) NOT NULL,
    reschedule_count INT NOT NULL DEFAULT 0,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Interview Evaluations & Outcomes
CREATE TYPE eval_outcome AS ENUM ('PASS', 'RETAKE_LATER', 'FAIL', 'NO_SHOW', 'MALPRACTICE_SUSPECTED');

CREATE TABLE interview_evaluations (
    eval_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES interview_bookings(booking_id),
    outcome eval_outcome NOT NULL,
    conceptual_score INT CHECK (conceptual_score BETWEEN 1 AND 5),
    code_defense_score INT CHECK (code_defense_score BETWEEN 1 AND 5),
    problem_solving_score INT CHECK (problem_solving_score BETWEEN 1 AND 5),
    student_feedback TEXT NOT NULL,
    confidential_notes TEXT,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Malpractice & Badge Nullification Audit Log
CREATE TABLE malpractice_audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id),
    track_id VARCHAR(50) NOT NULL REFERENCES track_badges(track_id),
    prior_state eligibility_state NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'BADGE_REVOKED_AND_NULLIFIED'
    evidence_type VARCHAR(100) NOT NULL, -- 'CODE_SIMILARITY_FLAG', 'PROXY_IMPERSONATION', 'AI_PROMPT_INJECTION'
    evidence_summary TEXT NOT NULL,
    miles_deducted INT NOT NULL,
    authorized_by_email VARCHAR(150) NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### 5. Architectural & Design Highlights
1. **Concurrency Safety**: Using Redis distributed locks or PostgreSQL row-level locks on `interviewer_slots` with a 5-minute reservation TTL guarantees zero double-bookings even during flash booking spikes.
2. **Malpractice Resilience**: The state model handles both live interview red flags and retrospective post-award contest malpractice, preserving historical auditability with immutable logs.
3. **Operational Visibility**: The Interview Ops engine continuously segments students into `ELIGIBLE_BOOKED` vs `ELIGIBLE_UNBOOKED`, automating targeted multichannel nudges (Email, WhatsApp, Push) to maximize badge completion velocity.

