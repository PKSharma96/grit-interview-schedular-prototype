import React, { useState } from 'react';
import { 
  Columns2, 
  ArrowRight, 
  Sparkles, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function BeforeAfterShowcase({ studentState, setStudentState }) {
  const [comparisonMode, setComparisonMode] = useState('PASS'); // 'PASS', 'RETAKE', 'NULLIFIED'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Core Requirement
              </span>
              <span className="text-xs text-slate-400 font-mono">Before & After Result Comparison</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Student Home Screen: Before vs. After the Interview Result
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Demonstrating the exact visual, structural, and behavioral transformations that occur on the student's dashboard before an interview takes place versus after each possible interview outcome.
            </p>
          </div>

          {/* Outcome Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setComparisonMode('PASS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                comparisonMode === 'PASS' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>After: Pass (Badge Earned)</span>
            </button>

            <button
              onClick={() => setComparisonMode('RETAKE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                comparisonMode === 'RETAKE' 
                  ? 'bg-orange-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>After: Retake Later</span>
            </button>

            <button
              onClick={() => setComparisonMode('NULLIFIED')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                comparisonMode === 'NULLIFIED' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>After: Badge Nullified</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: BEFORE INTERVIEW RESULT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <h3 className="font-bold text-white text-sm">BEFORE THE RESULT</h3>
            </div>
            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              State: Booked / Awaiting Defense
            </span>
          </div>

          {/* Before Mock UI Card */}
          <div className="rounded-2xl bg-slate-900 border border-indigo-500/40 p-5 space-y-4 shadow-xl">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Student Dashboard</span>
                <h4 className="text-base font-bold text-white">Aarav Sharma (NIAT-2024-CS-0419)</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Miles & Rank</span>
                <span className="text-xs font-mono font-bold text-amber-400">⚡ 2,350 Miles • #42</span>
              </div>
            </div>

            {/* Scheduled Slot Banner */}
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Interview Confirmed</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/15 px-2 py-0.5 rounded">
                  Live in 2 Days
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <p>Track: <strong className="text-indigo-300">AI Systems Mastery</strong></p>
                <p>Interviewer: <strong className="text-white">Sarah Chen</strong> (ex-Directi)</p>
                <p className="font-mono text-indigo-400">Thu, Oct 24 • 04:00 PM – 04:30 PM IST</p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <span>Join Google Meet Room</span>
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300">
                  Reschedule Slot
                </button>
              </div>
            </div>

            {/* Prereq Contests */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-semibold block">Prerequisite Contests:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-emerald-400 font-mono">✓ Python GIL (98%)</div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-emerald-400 font-mono">✓ Dist. Sys (92%)</div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-emerald-400 font-mono">✓ Docker/K8s (95%)</div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-emerald-400 font-mono">✓ Redis Cache (89%)</div>
              </div>
            </div>

            {/* Defense Guide */}
            <div className="bg-indigo-950/20 p-3 rounded-xl border border-indigo-900/30 text-[11px] text-slate-400">
              💡 <em>Student is in preparation phase. Have working webcam & local IDE open for defense.</em>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-1">
            <strong className="text-indigo-400 block">Key Before State Characteristics:</strong>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              <li>Track badge is locked/unearned.</li>
              <li>Miles are at baseline (2,350 Miles) and leaderboard rank is #42.</li>
              <li>Meeting link, calendar invite, and syllabus defense checklist are prominent.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: AFTER INTERVIEW RESULT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                comparisonMode === 'PASS' ? 'bg-emerald-400' :
                comparisonMode === 'RETAKE' ? 'bg-orange-400' : 'bg-rose-400'
              }`} />
              <h3 className="font-bold text-white text-sm">AFTER THE RESULT</h3>
            </div>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
              comparisonMode === 'PASS' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
              comparisonMode === 'RETAKE' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' :
              'text-rose-400 bg-rose-500/10 border-rose-500/20'
            }`}>
              Outcome: {comparisonMode}
            </span>
          </div>

          {/* After Mock UI Card - PASS */}
          {comparisonMode === 'PASS' && (
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Student Dashboard</span>
                  <h4 className="text-base font-bold text-white">Aarav Sharma (NIAT-2024-CS-0419)</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Miles & Rank</span>
                  <span className="text-xs font-mono font-bold text-amber-400">⚡ 2,850 Miles • #28 (▲ 14)</span>
                </div>
              </div>

              {/* Awarded Badge Hero */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">AI Systems Master</span>
                    <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded uppercase">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Evaluated & Approved by Sarah Chen</p>
                  <p className="text-[11px] text-amber-400 font-bold font-mono">+500 Miles Credited • Rank Advanced to #28</p>
                </div>
              </div>

              {/* Rubric */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Conceptual: ★★★★★</span>
                  <span>Code Defense: ★★★★★</span>
                  <span>Problem Solving: ★★★★☆</span>
                </div>
                <p className="text-slate-400 italic pt-1 border-t border-slate-900">
                  "{studentState.evaluation.feedback}"
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-slate-950">
                  Share Badge Credential
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300">
                  View on National Leaderboard
                </button>
              </div>
            </div>
          )}

          {/* After Mock UI Card - RETAKE */}
          {comparisonMode === 'RETAKE' && (
            <div className="rounded-2xl bg-slate-900 border border-orange-500/40 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">Student Dashboard</span>
                  <h4 className="text-base font-bold text-white">Aarav Sharma (NIAT-2024-CS-0419)</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Miles & Rank</span>
                  <span className="text-xs font-mono font-bold text-amber-400">⚡ 2,350 Miles • #42</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-orange-500/30 space-y-2">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider block">
                  Outcome: Retake Required (Attempt 1 of 2)
                </span>
                <p className="text-xs text-slate-300">
                  Mandatory 14-day study period active. Calendar re-opens on <strong>Nov 7, 2026</strong> (9 days remaining).
                </p>
                <div className="bg-orange-950/30 p-2.5 rounded-lg text-[11px] text-orange-300 italic">
                  "{studentState.retakeDetails.diagnosticFeedback}"
                </div>
              </div>
            </div>
          )}

          {/* After Mock UI Card - NULLIFIED */}
          {comparisonMode === 'NULLIFIED' && (
            <div className="rounded-2xl bg-gradient-to-br from-rose-950/50 via-slate-900 to-slate-900 border-2 border-rose-500/60 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Academic Review Board</span>
                  <h4 className="text-base font-bold text-white">Aarav Sharma (NIAT-2024-CS-0419)</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Miles & Rank</span>
                  <span className="text-xs font-mono font-bold text-rose-400">⚡ 1,850 Miles (-500)</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/50 space-y-2 relative overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Track Badge Nullified & Miles Deducted</span>
                </div>
                <p className="text-xs text-slate-300">
                  Plagiarism finding on Contest #4 confirmed by Academic Integrity Committee. Ref: AUD-MALP-2026-0812.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white">
                    Submit 72-Hour Formal Appeal
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-1">
            <strong className="text-emerald-400 block">Key After State Transformations:</strong>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              <li>Meeting room CTAs are cleared and replaced by the definitive credential or cooldown action.</li>
              <li>Miles and leaderboard rank are updated immediately in real time.</li>
              <li>Multi-criteria rubric scores and diagnostic recommendations are permanently logged.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
