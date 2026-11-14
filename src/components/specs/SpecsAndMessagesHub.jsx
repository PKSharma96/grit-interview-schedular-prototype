import React, { useState } from 'react';
import ArchitectureDocTab from '../ArchitectureDocTab';
import StudentMessagesTab from '../StudentMessagesTab';
import { FileText, Mail, Video } from 'lucide-react';

export default function SpecsAndMessagesHub() {
  const [subTab, setSubTab] = useState('specs'); // 'specs', 'messages', 'loom'

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Sub-Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSubTab('specs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            subTab === 'specs'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>2-Page Technical Design Spec</span>
        </button>

        <button
          onClick={() => setSubTab('messages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            subTab === 'messages'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>The 3 Core Student Messages</span>
        </button>

        <button
          onClick={() => setSubTab('loom')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            subTab === 'loom'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Loom Presentation Script</span>
        </button>
      </div>

      {subTab === 'specs' && <ArchitectureDocTab />}
      {subTab === 'messages' && <StudentMessagesTab />}

      {subTab === 'loom' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-xs text-slate-300 leading-relaxed">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400" />
              <span>Loom Video Walkthrough Script (Word-for-Word Guide)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target duration: 4–5 minutes • Tone: Confident, architectural, product-minded.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-indigo-400 font-mono">[0:00 – 0:45] Intro & Context</span>
              <p className="text-slate-300 italic">
                "Hi everyone, today I'm presenting the technical design and working prototype for the GRIT Track Badge Interview Scheduling System at NIAT. GRIT is a year-long skilling competition where students clear skill contests to earn Miles and climb the leaderboard. When they clear all required skills for a Track Badge, they take a live 1:1 online interview with an expert interviewer to defend their code and earn that badge. Our goal is to make this seamless for students, flexible for interviewers, transparent for ops, and resilient against malpractice."
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-indigo-400 font-mono">[0:45 – 1:45] Architecture, State Machine & Edge Cases</span>
              <p className="text-slate-300 italic">
                "Our state machine governs 9 deterministic states: from Ineligible to Eligible Unbooked, through an optimistic concurrency lock (Slot Reserved with 5-minute TTL) to Booked Confirmed, In Progress, Pending Evaluation (with 24h SLA), and the outcomes: Pass, Retake Cooldown, Fail, and Badge Nullified. We also handled crucial edge cases: race conditions during flash bookings, interviewer emergencies, student no-shows with a 1-strike policy, and post-issuance malpractice nullification."
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-indigo-400 font-mono">[1:45 – 2:45] Candidate Portal & Before/After Screens</span>
              <p className="text-slate-300 italic">
                "In our working prototype, the Candidate Portal gives students self-serve slot booking with real-time slot locks. Notice how the dashboard dynamically transforms before vs after the result: from a countdown and meeting room before the call, to a verified minted badge with +500 Miles on a Pass, a 14-day study cooldown on a Retake, or a formal nullification alert if malpractice is detected."
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-indigo-400 font-mono">[2:45 – 3:45] Interviewer Hub & Outcome Recording</span>
              <p className="text-slate-300 italic">
                "In the Interviewer Hub, Sarah Chen manages her weekly working days, buffers, and ad-hoc slots. On her daily schedule, she can launch Google Meet directly, and submit a 3-criteria rubric (Conceptual Depth, Code Authorship, Problem Solving) for Pass, Retake, Fail, or flag for suspected malpractice."
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-indigo-400 font-mono">[3:45 – 4:45] Operations Hub & Malpractice Nullification</span>
              <p className="text-slate-300 italic">
                "In the Operations Desk, the interview team monitors the cohort funnel: 124 eligible students, 97 booked (78%), and 27 unbooked. Ops can send 1-click WhatsApp nudges to unbooked candidates. And in the Academic Integrity Desk, Ops can inspect code similarity findings and execute a Badge Nullification that immediately revokes the badge and retracts miles."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

