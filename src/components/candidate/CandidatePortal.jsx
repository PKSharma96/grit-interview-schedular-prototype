import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink, 
  Download, 
  ChevronRight, 
  Code2, 
  Share2, 
  ArrowRight,
  BookOpen,
  ShieldCheck,
  RotateCcw,
  Sliders
} from 'lucide-react';

export default function CandidatePortal({ 
  studentState, 
  setStudentState, 
  tracks, 
  interviewers, 
  slots, 
  onBookSlot,
  onCancelBooking 
}) {
  const [candidateSubTab, setCandidateSubTab] = useState('interview'); // 'interview', 'before-after', 'prereqs'
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(studentState.activeTrackId);
  const [selectedDate, setSelectedDate] = useState('2026-10-24');
  const [selectedInterviewerId, setSelectedInterviewerId] = useState('int-1');
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [comparisonOutcome, setComparisonOutcome] = useState('PASS');

  const activeTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0];
  const journeyState = studentState.journeyState;

  // Filter slots for chosen date & interviewer
  const availableSlots = slots.filter(s => 
    s.date === selectedDate && 
    (selectedInterviewerId ? s.interviewerId === selectedInterviewerId : true) &&
    s.status === 'AVAILABLE'
  );

  const handleConfirmBooking = () => {
    if (!selectedSlotId) return;
    const chosenSlot = slots.find(s => s.id === selectedSlotId);
    const interviewer = interviewers.find(i => i.id === chosenSlot.interviewerId);

    onBookSlot({
      slotId: chosenSlot.id,
      date: chosenSlot.date,
      time: chosenSlot.time,
      interviewerId: interviewer.id,
      interviewerName: interviewer.name,
      meetingUrl: `https://meet.grit.niatindia.com/room/grit-${activeTrack.id}-${Math.floor(1000 + Math.random() * 9000)}`
    });

    setIsBookingModalOpen(false);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Candidate Profile Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={studentState.avatar} 
              alt={studentState.name} 
              className="w-14 h-14 rounded-xl ring-2 ring-indigo-500/30 object-cover"
            />
            <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-[9px] font-bold px-1.5 py-0.2 rounded text-white font-mono">
              NIAT
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{studentState.name}</h2>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {studentState.rollNo}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Enrolled Track: <strong className="text-indigo-300">{activeTrack.name}</strong> • {activeTrack.level}
            </p>
          </div>
        </div>

        {/* Miles & Leaderboard Standing */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-2.5 px-4">
          <div className="text-center pr-3 border-r border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Rank</span>
            <span className="text-sm font-bold text-white font-mono">
              #{journeyState === 'PASSED' ? 28 : studentState.currentRank}
            </span>
          </div>
          <div className="text-center pl-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium block">Total Miles</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-black text-amber-400 font-mono">
                ⚡ {
                  journeyState === 'PASSED' ? studentState.baseMiles + studentState.badgeMiles :
                  journeyState === 'BADGE_NULLIFIED' ? studentState.baseMiles - 500 :
                  studentState.baseMiles
                }
              </span>
              {journeyState === 'PASSED' && (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-1 rounded">▲ 500</span>
              )}
              {journeyState === 'BADGE_NULLIFIED' && (
                <span className="text-[9px] font-bold text-rose-400 bg-rose-500/15 px-1 rounded">▼ 500</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <nav className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-xl gap-1">
          <button
            onClick={() => setCandidateSubTab('interview')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              candidateSubTab === 'interview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Track Interview Dashboard</span>
          </button>

          <button
            onClick={() => setCandidateSubTab('before-after')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              candidateSubTab === 'before-after'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Before vs. After Result</span>
          </button>

          <button
            onClick={() => setCandidateSubTab('prereqs')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              candidateSubTab === 'prereqs'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Skill Contest Prerequisites</span>
            <span className="sm:hidden">Prerequisites</span>
            <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              4/4
            </span>
          </button>
        </nav>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Cohort 2026 Season</span>
        </div>
      </div>

      {/* SUB-VIEW 1: ACTIVE INTERVIEW STATE */}
      {candidateSubTab === 'interview' && (
        <div className="space-y-6">

          {/* 1. STATE: ELIGIBLE UNBOOKED */}
          {journeyState === 'ELIGIBLE_UNBOOKED' && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Prerequisites Cleared
                </span>
                <span className="text-xs text-slate-400 font-mono">AI Systems Mastery</span>
              </div>

              <div className="space-y-2 max-w-2xl">
                <h3 className="text-2xl font-extrabold text-white">
                  Schedule Your Track Badge Defense Interview
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You have cleared all 4 prerequisite technical contests! To earn the official <strong className="text-indigo-300">AI Systems Master Badge</strong> and claim <strong className="text-amber-400">+500 Miles</strong>, schedule a 30-minute live defense with one of our verified industry architects.
                </p>
              </div>

              {/* Format Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">Format</span>
                  <p className="text-white font-semibold">30-Min Live Technical Defense</p>
                  <p className="text-slate-400 text-[11px]">Walkthrough contest code & architecture</p>
                </div>
                <div className="space-y-1 sm:border-l border-slate-800 sm:pl-3">
                  <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">Platform</span>
                  <p className="text-white font-semibold">Google Meet</p>
                  <p className="text-slate-400 text-[11px]">Webcam and screen share mandatory</p>
                </div>
                <div className="space-y-1 sm:border-l border-slate-800 sm:pl-3">
                  <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">Window</span>
                  <p className="text-amber-400 font-semibold">14 Days Remaining</p>
                  <p className="text-slate-400 text-[11px]">Expires on November 7, 2026</p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Interview Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 2. STATE: BOOKED */}
          {journeyState === 'BOOKED' && studentState.currentBooking && (
            <div className="rounded-2xl bg-slate-900 border border-indigo-500/40 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    <Calendar className="w-3.5 h-3.5" />
                    Interview Confirmed
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Ref: {studentState.currentBooking.bookingId}</span>
                </div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Calendar Synced
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Your Defense Interview is Scheduled
                </h3>
                <p className="text-xs text-slate-300">
                  Track: <strong className="text-indigo-300">{activeTrack.name}</strong> • Level: {activeTrack.level}
                </p>
              </div>

              {/* Slot Details Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">Date & Time</span>
                  <p className="text-white font-bold text-sm">{studentState.currentBooking.date}</p>
                  <p className="text-indigo-400 font-mono">{studentState.currentBooking.time}</p>
                </div>

                <div className="space-y-1 md:border-l border-slate-800 md:pl-4">
                  <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">Interviewer</span>
                  <p className="text-white font-bold text-sm">{studentState.currentBooking.interviewerName}</p>
                  <p className="text-slate-400">Senior Systems Architect, ex-Directi</p>
                </div>

                <div className="space-y-1 md:border-l border-slate-800 md:pl-4">
                  <span className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">Location</span>
                  <p className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> Google Meet Video Room
                  </p>
                  <p className="text-slate-400">ID Verification required</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={studentState.currentBooking.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/25 transition flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Google Meet Room</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => alert('Calendar invite (.ICS file) downloaded to your local computer.')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download .ICS Calendar Invite</span>
                </button>

                <button
                  onClick={onCancelBooking}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/60 border border-rose-900/40 transition ml-auto"
                >
                  Reschedule / Cancel Slot
                </button>
              </div>

              {/* Readiness Guidelines */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <span className="font-bold text-indigo-300 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> Defense Day Checklist:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Have your local IDE open with Contest #4 (Distributed Caching repository) cloned.</li>
                  <li>Ensure working webcam and valid college ID card ready for camera verification.</li>
                  <li>Free cancellation or rescheduling is allowed up to 12 hours prior to the slot.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 3. STATE: PASSED (BADGE AWARDED 🎉) */}
          {journeyState === 'PASSED' && (
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Sparkles className="w-3.5 h-3.5" />
                  Interview Result: PASSED
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  +500 Miles Credited • New Rank #28
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Badge Visual Stamp */}
                <div className="w-36 h-36 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 p-4 flex flex-col items-center justify-center text-center shadow-lg shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                    <Award className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">NIAT GRIT</span>
                  <span className="text-xs font-extrabold text-white mt-0.5 leading-tight">AI Systems Master</span>
                  <span className="text-[9px] text-emerald-400 font-mono mt-1">Level 3 • Expert</span>
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-extrabold text-white">
                    Congratulations! Track Badge Verified & Minted
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Interviewer <strong className="text-white">{studentState.evaluation.evaluatedBy}</strong> has approved your technical defense. Your verified digital badge is now active on your NIAT profile and visible to recruiters.
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      onClick={triggerCelebration}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Celebrate Confetti
                    </button>

                    <button
                      onClick={() => alert('Verified credential link copied to clipboard: https://grit.niatindia.com/verify/badge-aisys-99281')}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 transition"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share Credential
                    </button>
                  </div>
                </div>
              </div>

              {/* Rubric Breakdown */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Official Defense Rubric Scores:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Conceptual Depth</span>
                    <span className="text-amber-400 font-bold">★★★★★ (5/5)</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Code Authorship</span>
                    <span className="text-amber-400 font-bold">★★★★★ (5/5)</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block">Problem Solving</span>
                    <span className="text-amber-400 font-bold">★★★★☆ (4/5)</span>
                  </div>
                </div>
                <p className="text-slate-300 italic pt-1 border-t border-slate-900 text-[11px]">
                  "{studentState.evaluation.feedback}"
                </p>
              </div>
            </div>
          )}

          {/* 4. STATE: RETAKE COOLDOWN */}
          {journeyState === 'RETAKE_COOLDOWN' && (
            <div className="rounded-2xl bg-slate-900 border border-orange-500/40 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  <Clock className="w-3.5 h-3.5" />
                  Outcome: Retake Required (Attempt 1 of 2)
                </span>
                <span className="text-xs text-orange-400 font-mono font-bold">
                  14-Day Study Cooldown
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Skill Revision Required Before Next Defense
                </h3>
                <p className="text-xs text-slate-300">
                  Your interviewer identified areas for growth during the live architecture defense. A cooling-off period is enforced to ensure adequate preparation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Cooldown Remaining</span>
                  <span className="text-xl font-black text-orange-400 font-mono">
                    {studentState.retakeDetails.cooldownDaysLeft} Days Remaining
                  </span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Booking re-opens on {studentState.retakeDetails.eligibleRebookDate}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Attempts Remaining</span>
                  <span className="text-xl font-bold text-white font-mono">1 Remaining</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Max 2 defense attempts allowed per track</p>
                </div>
              </div>

              <div className="bg-orange-950/20 p-4 rounded-xl border border-orange-900/40 text-xs text-slate-300 space-y-1.5">
                <span className="font-bold text-orange-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-orange-400" /> Remedial Recommendations:
                </span>
                <p className="italic text-[11px] text-slate-300">
                  "{studentState.retakeDetails.diagnosticFeedback}"
                </p>
              </div>
            </div>
          )}

          {/* 5. STATE: BADGE NULLIFIED */}
          {journeyState === 'BADGE_NULLIFIED' && (
            <div className="rounded-2xl bg-slate-900 border-2 border-rose-500/60 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Academic Integrity Notice: BADGE NULLIFIED
                </span>
                <span className="text-xs text-rose-400 font-mono font-bold">
                  -500 Miles Deducted
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Nullified Stamp Badge */}
                <div className="w-36 h-36 rounded-2xl bg-slate-950 border border-rose-500/40 p-4 flex flex-col items-center justify-center text-center opacity-70 grayscale relative overflow-hidden shrink-0">
                  <Award className="w-10 h-10 text-slate-500 mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase">NIAT GRIT</span>
                  <span className="text-xs font-bold text-slate-400 mt-0.5">AI Systems Master</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="transform -rotate-45 bg-rose-600 text-white text-xs font-black px-4 py-0.5 uppercase tracking-widest shadow-xl">
                      NULLIFIED
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white">
                    Track Badge Revoked Due to Contest Irregularity
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Following a scheduled post-contest audit, the Academic Review Board identified an integrity violation on <strong className="text-white">{studentState.malpracticeDetails.contestFlagged}</strong>.
                  </p>

                  <div className="bg-slate-950 p-3 rounded-lg border border-rose-900/40 text-[11px] text-slate-400 space-y-1">
                    <p><strong className="text-rose-400">Audit Ref:</strong> {studentState.malpracticeDetails.auditRef}</p>
                    <p><strong className="text-slate-300">Finding:</strong> {studentState.malpracticeDetails.evidenceSummary}</p>
                    <p><strong className="text-slate-300">Sanction:</strong> 500 Miles retracted • 60-day interview booking freeze</p>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => alert(`Appeal submitted for Audit Ref: ${studentState.malpracticeDetails.auditRef}. A review panel will evaluate your local commit logs within 72 hours.`)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition shadow-md cursor-pointer"
                    >
                      Submit Formal 72-Hour Appeal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-VIEW 2: BEFORE VS AFTER SCREEN COMPARISON */}
      {candidateSubTab === 'before-after' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Student Home Screen: Before vs. After Result Comparison
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspect how the student interface transitions before the interview takes place versus after each outcome.
                </p>
              </div>

              {/* Outcome filter with consistent segmented styling */}
              <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1 text-xs">
                <button
                  onClick={() => setComparisonOutcome('PASS')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    comparisonOutcome === 'PASS' 
                      ? 'bg-emerald-600 text-white shadow-sm border border-emerald-400/40' 
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  After: Pass 🎉
                </button>
                <button
                  onClick={() => setComparisonOutcome('RETAKE')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    comparisonOutcome === 'RETAKE' 
                      ? 'bg-orange-600 text-white shadow-sm border border-orange-400/40' 
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  After: Retake
                </button>
                <button
                  onClick={() => setComparisonOutcome('NULLIFIED')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    comparisonOutcome === 'NULLIFIED' 
                      ? 'bg-rose-600 text-white shadow-sm border border-rose-400/40' 
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  After: Nullified ⚠️
                </button>
              </div>
            </div>

            {/* Side-by-Side Comparison Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Left Column: BEFORE Result */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  BEFORE THE RESULT (Scheduled State)
                </span>
                
                <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Miles: <strong>2,350</strong></span>
                    <span>Rank: <strong>#42</strong></span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-indigo-400 font-bold block">Interview Confirmed: Sarah Chen</span>
                    <p className="text-slate-300">Thu, Oct 24 • 04:00 PM IST</p>
                    <p className="text-[11px] text-emerald-400 font-mono">Google Meet room ready</p>
                  </div>
                  <div className="text-[11px] text-slate-400 italic">
                    Focus: Student is preparing code defense and reviewing distributed systems rubric.
                  </div>
                </div>
              </div>

              {/* Right Column: AFTER Result */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider block flex items-center gap-1.5 text-white">
                  <span className={`w-2 h-2 rounded-full ${
                    comparisonOutcome === 'PASS' ? 'bg-emerald-400' :
                    comparisonOutcome === 'RETAKE' ? 'bg-orange-400' : 'bg-rose-400'
                  }`} />
                  AFTER THE RESULT ({comparisonOutcome})
                </span>

                {comparisonOutcome === 'PASS' && (
                  <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Miles: <strong className="text-amber-400">2,850 (+500)</strong></span>
                      <span>Rank: <strong className="text-emerald-400">#28 (▲14)</strong></span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-emerald-500/20 space-y-1">
                      <span className="text-emerald-400 font-bold block">🎉 Track Badge Awarded: AI Systems Master</span>
                      <p className="text-slate-300">Rubric: Conceptual (5/5) • Defense (5/5)</p>
                      <p className="text-[11px] text-amber-400 font-mono">Verified Credential issued</p>
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      Outcome: Badge active, miles added, public credential unlocked.
                    </div>
                  </div>
                )}

                {comparisonOutcome === 'RETAKE' && (
                  <div className="bg-slate-950 border border-orange-500/40 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Miles: <strong>2,350</strong></span>
                      <span>Rank: <strong>#42</strong></span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-orange-500/20 space-y-1">
                      <span className="text-orange-400 font-bold block">Outcome: Retake Required (Attempt 1 of 2)</span>
                      <p className="text-slate-300">14-Day Cooldown active (9 days left)</p>
                      <p className="text-[11px] text-orange-300 font-mono">Rebooking re-opens Nov 7, 2026</p>
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      Outcome: Student reviews diagnostic feedback and practice labs.
                    </div>
                  </div>
                )}

                {comparisonOutcome === 'NULLIFIED' && (
                  <div className="bg-slate-950 border border-rose-500/40 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Miles: <strong className="text-rose-400">1,850 (-500)</strong></span>
                      <span>Rank: <strong className="text-rose-400">Demoted</strong></span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-rose-500/20 space-y-1">
                      <span className="text-rose-400 font-bold block">⚠️ Badge Nullified: Integrity Finding</span>
                      <p className="text-slate-300">Contest #4 code similarity 94% confirmed</p>
                      <p className="text-[11px] text-rose-400 font-mono">60-day interview freeze active</p>
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      Outcome: Badge revoked, miles retracted, formal 72h appeal allowed.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: PREREQUISITES */}
      {candidateSubTab === 'prereqs' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Contest Prerequisite Clearance Status</span>
          </h3>
          <p className="text-xs text-slate-400">
            All 4 technical contests must score above 85% to unlock the live Track Badge interview.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {activeTrack.requiredSkills.map((sk, i) => (
              <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{sk.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Score: <strong className="text-indigo-300">{sk.score}/100</strong></p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Cleared
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Select Interview Slot</span>
                </h3>
                <p className="text-xs text-slate-400">Track: <strong className="text-indigo-300">{activeTrack.name}</strong></p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Interviewer */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                1. Select Verified Interviewer
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {interviewers.map(int => {
                  const isSel = selectedInterviewerId === int.id;
                  return (
                    <div
                      key={int.id}
                      onClick={() => { setSelectedInterviewerId(int.id); setSelectedSlotId(null); }}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        isSel 
                          ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <p className="font-bold text-white text-xs">{int.name}</p>
                      <p className="text-[10px] text-slate-400">{int.company}</p>
                      <p className="text-[10px] text-amber-400 mt-1 font-mono">★ {int.rating}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                2. Select Date
              </label>
              <div className="flex gap-2">
                {['2026-10-24', '2026-10-25'].map(d => (
                  <button
                    key={d}
                    onClick={() => { setSelectedDate(d); setSelectedSlotId(null); }}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition ${
                      selectedDate === d 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {d === '2026-10-24' ? 'Thu, Oct 24' : 'Fri, Oct 25'}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Slot */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                3. Choose 30-Min Time Slot (Asia/Kolkata IST)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSlots.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSlotId(s.id)}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium transition ${
                      selectedSlotId === s.id
                        ? 'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/50'
                    }`}
                  >
                    {s.timeOnly}
                  </button>
                ))}
              </div>
            </div>

            {/* Concurrency safety */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Optimistic row-level lock engages for 5 minutes during confirmation.</span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={!selectedSlotId}
                onClick={handleConfirmBooking}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition ${
                  selectedSlotId
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Confirm Slot
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

