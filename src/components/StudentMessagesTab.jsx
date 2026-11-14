import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink,
  Calendar,
  AlertTriangle,
  Award
} from 'lucide-react';

export default function StudentMessagesTab() {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messages = [
    {
      id: 1,
      title: 'Message 1: Slot Booking Confirmation & Readiness Pack',
      trigger: 'Triggered immediately when student confirms an interview slot on dashboard',
      channel: 'Email + Push Notification + In-App Calendar Card',
      importance: 'Eliminates candidate no-shows, provides meeting room access, and sets crystal-clear technical defense expectations.',
      push: {
        title: '🎯 Interview Confirmed: AI Systems Mastery',
        body: 'Your 30-min live defense is set for Thursday, Oct 24 at 4:00 PM IST with Sarah Chen. Tap to view preparation checklist and meeting link.'
      },
      email: {
        subject: 'Confirmed: Your GRIT Track Badge Interview for AI Systems Mastery (Thu, Oct 24, 4:00 PM IST)',
        sender: 'Mahima Sharma • HR & Interview Operations <operations@grit.niatindia.com>',
        recipient: 'Pushpendra Kumar <pushpendra.kumar@niat.edu.in>',
        body: `Hi Pushpendra,

Congratulations on clearing all prerequisite skill contests for the AI Systems Mastery Track! Your 1:1 live defense interview has been officially scheduled.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Track Badge:       AI Systems Mastery (Level 3 - Expert)
• Interviewer:       Sarah Chen (Senior Systems Architect, ex-Directi)
• Date & Time:       Thursday, October 24, 2026 • 4:00 PM – 4:30 PM IST
• Video Room:        https://meet.grit.niatindia.com/room/grit-aisys-8492
• Calendar Invite:   [Add to Google Calendar] | [Download .ICS]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO EXPECT (30-MINUTE DEFENSE FORMAT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Architecture Defense (10 mins): Walk through your contest submission for the Distributed Cache & Redis challenge.
2. Live Concept Probing (15 mins): Live Q&A on Concurrency, CAP Theorem, and Fault Tolerance trade-offs.
3. Feedback & Q&A (5 mins): Real-time industry feedback on your code and architecture.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY PREPARATION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Working webcam and microphone (ID verification required at start).
✓ Stable internet connection and screen sharing permissions enabled.
✓ Your local IDE open with your original contest repository cloned.
✓ Rescheduling Policy: You may reschedule up to 12 hours prior via your dashboard. Late cancellations or no-shows enforce a mandatory 7-day cooldown.

👉 Open Student Dashboard & Join Room: https://grit.niatindia.com/dashboard/interview

Best of luck,
Mahima Sharma & The GRIT Interview Operations Team
NIAT (NxtWave Institute of Advanced Technologies)`
      }
    },
    {
      id: 2,
      title: 'Message 2: Post-Interview Outcome & Badge Verification',
      trigger: 'Triggered within 24 hours of interview conclusion once interviewer submits rubric',
      channel: 'Email + In-App Celebratory Modal + Leaderboard Alert',
      importance: 'Delivers the definitive outcome (Pass or Retake Cooldown), updates leaderboard rank, and provides tangible growth feedback.',
      push: {
        title: '🎉 BADGE EARNED! AI Systems Mastery Cleared',
        body: '+500 GRIT Miles credited to your account! National rank advanced to #28. Tap to view your verified credential.'
      },
      email: {
        subject: '🎉 Result: You Cleared the AI Systems Mastery Track Badge Interview!',
        sender: 'Mahima Sharma • GRIT Evaluation Committee <evaluations@grit.niatindia.com>',
        recipient: 'Pushpendra Kumar <pushpendra.kumar@niat.edu.in>',
        body: `Hi Pushpendra,

Outstanding performance! Following your live technical defense on October 24, your interviewer Sarah Chen has approved your Track Badge with Distinction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVALUATION SUMMARY & RUBRIC SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Conceptual Depth:          ★★★★★ (5/5) — "Demonstrated deep clarity on eventual consistency vs linearizability."
• Code Authorship & Defense:  ★★★★★ (5/5) — "Explained cache eviction algorithms and memory footprint with precision."
• Problem Solving:           ★★★★☆ (4/5) — "Solid approach to partitioning strategies under network partitions."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR REWARDS UNLOCKED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 Track Badge:        AI Systems Master (Expert Level)
⚡ Miles Earned:       +500 Miles added (New Total: 2,850 Miles)
📊 Leaderboard Rank:    Moved up from #42 ➔ #28 Nationwide
📜 Verifiable Credential: https://grit.niatindia.com/verify/badge-aisys-99281

Your digital badge is now displayed on your NIAT Profile and is verified for upcoming recruiter showcases. Keep pushing for the Grand Master milestone!

👉 View Badge on Leaderboard & Share on LinkedIn: https://grit.niatindia.com/badges/ai-systems-mastery

Proud of your dedication,
Mahima Sharma & The GRIT Evaluation Committee, NIAT`
      }
    },
    {
      id: 3,
      title: 'Message 3: Academic Integrity Audit & Badge Nullification Notice',
      trigger: 'Triggered when post-award plagiarism or contest irregularities are confirmed by the Academic Review Board',
      channel: 'High-Priority Email + Registered Student Account Alert + In-App Red Banner',
      importance: 'The critical integrity fail-safe: transparently revokes badge and miles, explains violation evidence, and provides formal 72-hour appeal rights.',
      push: {
        title: '⚠️ URGENT: Track Badge Revocation Notice',
        body: 'The AI Systems Mastery Badge has been nullified due to an Academic Integrity finding. Tap to review findings and appeal window.'
      },
      email: {
        subject: 'URGENT & CONFIDENTIAL: Official Notice of Badge Nullification & Miles Retraction (Track: AI Systems Mastery)',
        sender: 'NIAT Academic Integrity Review Board <integrity-board@niatindia.com>',
        recipient: 'Pushpendra Kumar <pushpendra.kumar@niat.edu.in>',
        body: `Dear Pushpendra Kumar,
Student Roll No: NIAT-2024-CS-0419

This is an official communication from the NIAT Academic Integrity Board regarding your participation in the GRIT Skilling Competition.

Following a scheduled post-issuance audit of technical contest submissions, our automated code integrity engine identified severe anomalies in your submission for Contest #4 (Distributed Caching & In-Memory Storage). A subsequent manual review by two independent Senior Technical Architects has confirmed the following finding:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUDIT FINDINGS & SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Violation Category:    Direct Code Plagiarism & Unauthorized Secondary AI Model Injection
• Specific Incident:     94% semantic code match with an unpermitted external repository during Contest #4, combined with incongruous authorship explanations during the defense phase.
• Audit Reference ID:    AUD-MALP-2026-0812
• Reviewing Authority:   NIAT Central Academic Integrity Committee

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADMINISTRATIVE ACTIONS TAKEN (EFFECTIVE IMMEDIATELY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Badge Nullification: The "AI Systems Mastery" Track Badge has been formally revoked and marked NULLIFIED across all public and recruiter directories.
2. Miles Retraction: The 500 Miles awarded for this track have been deducted from your profile. Your leaderboard rank has been recalculated.
3. Scheduling Hold: You are placed on a 60-day interview booking freeze across all GRIT tracks.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPEAL PROCEDURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If you believe this determination was made in error or have documented version-control proof of original authorship:
• You may submit a formal appeal within 72 hours (by Monday, October 28, 2026, 11:59 PM IST).
• Submit your rebuttal repository, local git commit timestamps, and statement at: https://grit.niatindia.com/integrity/appeal/AUD-MALP-2026-0812

NIAT maintains an uncompromising standard of technical excellence and integrity. We urge you to review the GRIT Honor Code.

Sincerely,
Prof. K. Rajagopalan
Chair, Academic Integrity Review Board
NIAT (NxtWave Institute of Advanced Technologies)`
      }
    }
  ];

  const currentMsg = messages[activeMessageIndex];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <Mail className="w-6 h-6 text-indigo-400" />
          <span>The 3 Most Important Student Messages (Verbatim Production Copy)</span>
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
          In a high-stakes competition like GRIT, clear, empathetic, and unambiguous communication directly governs student trust, show-up rates, learning outcomes, and program integrity. Here is exactly how each critical message appears to the student.
        </p>

        {/* Message Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          {messages.map((m, idx) => {
            const isSelected = activeMessageIndex === idx;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMessageIndex(idx)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    idx === 0 ? 'bg-indigo-500/20 text-indigo-300' :
                    idx === 1 ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-rose-500/20 text-rose-300'
                  }`}>
                    Message #{m.id}
                  </span>
                  {idx === 0 && <Calendar className="w-3.5 h-3.5 text-indigo-400" />}
                  {idx === 1 && <Award className="w-3.5 h-3.5 text-emerald-400" />}
                  {idx === 2 && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <h4 className="text-xs font-bold text-white mt-2 line-clamp-1">{m.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{m.importance}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Message Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Context & Mobile Push Preview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Metadata Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 text-xs shadow-lg">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">Lifecycle Metadata</h3>
            
            <div>
              <span className="text-slate-500 block">Trigger Point</span>
              <p className="text-slate-200 mt-0.5">{currentMsg.trigger}</p>
            </div>

            <div>
              <span className="text-slate-500 block">Delivery Channels</span>
              <p className="text-indigo-300 mt-0.5 font-medium">{currentMsg.channel}</p>
            </div>

            <div>
              <span className="text-slate-500 block">Behavioral Impact</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">{currentMsg.importance}</p>
            </div>
          </div>

          {/* Mobile Push Notification Mock */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>Mobile Lockscreen Push Alert</span>
            </span>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-300">
                  <Award className="w-3 h-3 text-indigo-400" /> GRIT NIAT App
                </span>
                <span>Just now</span>
              </div>
              <p className="text-xs font-bold text-white">{currentMsg.push.title}</p>
              <p className="text-[11px] text-slate-300 leading-snug">{currentMsg.push.body}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Full Email Body View */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Official Student Email (Verbatim Production Copy)</span>
            </span>

            <button
              onClick={() => handleCopy(currentMsg.email.body, activeMessageIndex)}
              className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg transition"
            >
              {copiedIndex === activeMessageIndex ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          {/* Email Container */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
            {/* Email Header */}
            <div className="bg-slate-950 p-4 border-b border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16">Subject:</span>
                <span className="font-bold text-white text-sm">{currentMsg.email.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16">From:</span>
                <span className="text-slate-300 font-mono text-[11px]">{currentMsg.email.sender}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-16">To:</span>
                <span className="text-indigo-300 font-mono text-[11px]">{currentMsg.email.recipient}</span>
              </div>
            </div>

            {/* Email Body Preformatted */}
            <div className="p-6 bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-indigo-600">
              {currentMsg.email.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

