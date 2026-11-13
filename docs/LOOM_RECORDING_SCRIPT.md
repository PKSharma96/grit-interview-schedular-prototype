# Loom Video Walkthrough Script
## GRIT Interview Scheduling System — Thought Process & Prototype Demonstration

**Suggested Video Length:** 4–5 Minutes  
**Speaker Tone:** Confident, structured, engineering-led, product-minded  
**Target Audience:** NIAT Evaluation Panel & GRIT Program Leadership  

---

### [0:00 – 0:45] Section 1: Introduction, Problem Statement & Context
* **Camera / Screen:** Show the GRIT Interview Platform Landing / Student Dashboard.
* **Talking Points:**
  > "Hi everyone, today I'm presenting the technical design and working prototype for the **GRIT Track Badge Interview Scheduling System** at NIAT.
  > 
  > As we know, GRIT is our flagship year-long skilling competition. Students battle it out in technical skill contests to earn Miles and climb the national leaderboard. Once a student clears every prerequisite skill contest required for a Track Badge—such as *AI Systems Mastery* or *AI Product Mastery*—they must defend their knowledge in a live 1:1 online interview with an industry expert before that badge is verified and minted.
  > 
  > However, operating this with a small team of interviewers introduces significant operational and technical challenges:
  > 1. Ensuring frictionless self-serve slot booking for eligible students without double-booking or race conditions.
  > 2. Allowing interviewers to configure flexible availability and record rigorous multi-dimensional rubrics (Pass, Fail, Retake).
  > 3. Giving the Interview Operations team full real-time cohort visibility into who has booked vs. who hasn't.
  > 4. And critically, upholding academic integrity—handling retrospective malpractice audits where a previously awarded badge must be gracefully nullified and Miles retracted."

---

### [0:45 – 1:45] Section 2: Architecture, State Machine & Edge Cases
* **Camera / Screen:** Switch to the "Architecture & Specs" Tab in the prototype (showing the State Machine Diagram and Edge Cases Matrix).
* **Talking Points:**
  > "Before jumping into the UI, let's look at the underlying architecture.
  > 
  > **The State Machine:**
  > A student's journey spans 9 deterministic states:
  > From `INELIGIBLE` to `ELIGIBLE_UNBOOKED` when all contest prerequisites are met. 
  > Once a student picks a slot, our system initiates an optimistic lock transitioning to `SLOT_RESERVED` for 5 minutes, preventing race conditions before reaching `BOOKED_CONFIRMED`.
  > During the live call, it transitions to `IN_PROGRESS`, followed by `PENDING_EVALUATION` with a 24-hour SLA.
  > The interviewer can issue three primary outcomes:
  > 1. **PASS** — instantly minting the verified Track Badge and adding +500 Miles to their leaderboard.
  > 2. **RETAKE_COOLDOWN** — initiating a mandatory 14-day study period with targeted diagnostic rubric feedback before rebooking unlocks.
  > 3. **FAIL** — exhausted attempts, requiring re-qualifying through future contests.
  > 
  > **The Critical Edge Case — Malpractice & Badge Nullification:**
  > What happens if a student cleared contests and their interview, but an automated plagiarism audit or proctoring review flags unauthorized AI prompt injection or proxy assistance 3 weeks later?
  > In our system, the Integrity Admin can trigger `BADGE_NULLIFIED`. This atomically revokes the badge, stamps a 'NULLIFIED' watermark on public profiles, deducts Miles from the leaderboard, logs an immutable audit event, and dispatches a formal notice with a 72-hour appeal protocol."

---

### [1:45 – 2:45] Section 3: Live Prototype Walkthrough — Student Experience (Before vs After)
* **Camera / Screen:** Switch to the "Student Portal" Tab. Show the "Before vs After State Switcher".
* **Talking Points:**
  > "Now let's see this in action in our working prototype.
  > 
  > **State 1: Eligible (Before Booking)**
  > Aarav has cleared all 4 contests for AI Systems Mastery. You can see the celebratory banner, his prerequisite contest scores, and the prominent 'Book Your 30-Min Interview' CTA.
  > Let's click 'Book Interview Slot'.
  > Here, Aarav browses available dates, views interviewer profiles with their domain expertise, and selects Thursday at 4:00 PM.
  > 
  > **State 2: Booked (Awaiting Interview)**
  > Instantly, the dashboard transforms! Aarav gets a live countdown timer, the Google Meet launch link, an ICS calendar download, and a defense readiness checklist with the exact syllabus.
  > 
  > **State 3 & 4: Before vs. After the Result**
  > Using our state switcher:
  > • When Aarav **Passes**, the screen erupts with celebration confetti! The AI Systems Master badge is unlocked, +500 Miles are credited (bringing his total to 2,850 Miles), his national rank jumps from #42 to #28, and his verified credential link is live.
  > • If he was marked **Retake Later**, the dashboard presents a constructive diagnostic breakdown with a 14-day countdown showing exact days remaining until rebooking.
  > • And if a **Malpractice Finding** is confirmed, the dashboard displays a prominent high-priority red alert with the audit reference ID, retracted miles breakdown, and an appeal submission button."

---

### [2:45 – 3:45] Section 4: Interviewer Hub & Outcome Recording
* **Camera / Screen:** Switch to "Interviewer Hub".
* **Talking Points:**
  > "Next, let's look at the **Interviewer Experience**.
  > 
  > On Sarah Chen's dashboard:
  > 1. **Availability Management:** She can set recurring weekly hours, add ad-hoc slots, toggle vacation mode, and set buffer times between calls.
  > 2. **Daily Schedule:** Sarah sees today's scheduled candidates with direct links to their contest code repositories and the live 'Launch Google Meet' button.
  > 3. **Outcome Recording:** When the interview concludes, Sarah clicks 'Record Outcome'.
  > A comprehensive evaluation rubric appears:
  > • Conceptual Depth (1 to 5 stars)
  > • Code Authorship & System Defense (verifying original code understanding)
  > • Problem Solving & Communication
  > She selects 'Pass', 'Retake Later', 'Fail', or can toggle the 'Malpractice Red Flag' if impersonation was observed during the live call.
  > Submitting this instantly updates the student's dashboard and recalculates leaderboard miles in real time!"

---

### [3:45 – 4:30] Section 5: Operations & Admin Dashboard (Cohort Funnel & Malpractice Desk)
* **Camera / Screen:** Switch to "Operations / Admin Hub".
* **Talking Points:**
  > "Finally, let's examine the **Interview Operations & Cohort Intelligence Hub**.
  > 
  > The interview team has complete visibility:
  > • **Funnel Metrics:** Total Eligible (124 students), Booked (78%), Unbooked (22%), Completed, and Pass Rate.
  > • **Eligible Roster Filter:** With one toggle, Ops can see which eligible students have booked and which haven't. For students who haven't booked, Ops can trigger 1-click WhatsApp or Email nudges to ensure nobody slips through the cracks.
  > • **Malpractice Desk:** Ops can review flagged candidates, inspect automated code similarity evidence, and execute a formal 'Nullify Badge' action with an immutable audit reason."

---

### [4:30 – 5:00] Section 6: Summary & Student Communications
* **Camera / Screen:** Briefly showcase the "Student Messages" tab.
* **Talking Points:**
  > "To ensure complete clarity across all touchpoints, we have also drafted the exact verbatim student communications:
  > 1. The **Booking Confirmation & Prep Guide**
  > 2. The **Post-Interview Result & Badge Award Announcement**
  > 3. The **Academic Integrity Notice & Revocation Letter**
  > 
  > All source code, database schemas, and documentation are organized in the repository. Thank you for your time, and I look forward to your feedback!"
