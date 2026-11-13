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
  User, 
  Code2, 
  Terminal, 
  Share2, 
  ArrowRight,
  BookOpen,
  ShieldCheck,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export default function StudentPortal({ 
  studentState, 
  setStudentState, 
  tracks, 
  interviewers, 
  slots, 
  onBookSlot,
  onCancelBooking 
}) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(studentState.activeTrackId);
  const [selectedDate, setSelectedDate] = useState('2026-10-24');
  const [selectedInterviewerId, setSelectedInterviewerId] = useState('int-1');
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const activeTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0];
  const journeyState = studentState.journeyState;

  // Filter slots for chosen date & interviewer
  const availableSlots = slots.filter(s => 
    s.date === selectedDate && 
    (selectedInterviewerId ? s.interviewerId === selectedInterviewerId : true) &&
    s.status === 'AVAILABLE'
  );

  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

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

  return (
    <div className="space-y-8">
      {/* Student Profile & Gamification Stats Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                src={studentState.avatar} 
                alt={studentState.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-2 ring-indigo-500/40 object-cover shadow-md"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider border border-slate-900">
                NIAT
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{studentState.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-md font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {studentState.rollNo}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  Cohort 2026
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Enrolled Track: <span className="text-indigo-300 font-semibold">{activeTrack.name}</span> • {activeTrack.level}
              </p>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 sm:px-5">
            <div className="text-center pr-4 border-r border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">National Rank</span>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <span className="text-lg sm:text-xl font-bold text-white font-mono">
                  #{journeyState === 'PASSED' ? 28 : studentState.currentRank}
                </span>
                {journeyState === 'PASSED' && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1 rounded">▲ 14</span>
                )}
              </div>
            </div>

            <div className="text-center pl-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Total GRIT Miles</span>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <span className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">
                  ⚡ {
                    journeyState === 'PASSED' 
                      ? studentState.baseMiles + studentState.badgeMiles 
                      : journeyState === 'BADGE_NULLIFIED'
                      ? studentState.baseMiles - 500
                      : studentState.baseMiles
                  }
                </span>
                {journeyState === 'PASSED' && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-1 rounded">+500</span>
                )}
                {journeyState === 'BADGE_NULLIFIED' && (
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 px-1 rounded">-500</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BEFORE / AFTER JOURNEY VIEW CONTAINER */}
      <div className="space-y-6">

        {/* ---------------- STATE 1: ELIGIBLE UNBOOKED ---------------- */}
        {journeyState === 'ELIGIBLE_UNBOOKED' && (
          <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Prerequisite Skill Contests Cleared (4/4)
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  You’ve Unlocked the <span className="text-indigo-400">{activeTrack.name}</span> Badge Interview!
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Congratulations! You cleared all required technical contests with distinction. Book your 30-minute live online defense with an industry interviewer to verify your knowledge and claim your official badge and <strong className="text-amber-400">+500 Miles</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-400" /> 30-Min Live Technical Defense</span>
                  <span className="flex items-center gap-1.5"><Video className="w-4 h-4 text-indigo-400" /> Google Meet (Webcam Required)</span>
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-indigo-400" /> +500 GRIT Miles on Completion</span>
                </div>
              </div>

              <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full lg:w-64 py-3.5 px-6 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Interview Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  ⚡ 14-day booking window expires on Nov 7, 2026
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- STATE 2: BOOKED (SCHEDULED) ---------------- */}
        {journeyState === 'BOOKED' && studentState.currentBooking && (
          <div className="rounded-2xl bg-slate-900 border border-indigo-500/40 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-md flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Slot Confirmed
            </div>

            <div className="max-w-3xl space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  <Clock className="w-3.5 h-3.5" />
                  Upcoming Live Defense
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Your Interview is Scheduled!
                </h2>
                <p className="text-slate-300 text-sm">
                  Prepare to defend your contest architecture and code implementations for <strong className="text-indigo-300">{activeTrack.name}</strong>.
                </p>
              </div>

              {/* Slot Details Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Date & Time</span>
                  <p className="text-white font-semibold text-base">{studentState.currentBooking.date}</p>
                  <p className="text-indigo-400 text-sm font-mono">{studentState.currentBooking.time}</p>
                </div>

                <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Interviewer</span>
                  <p className="text-white font-semibold text-base">{studentState.currentBooking.interviewerName}</p>
                  <p className="text-slate-400 text-xs">Senior Systems Architect, ex-Directi</p>
                </div>

                <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Booking ID</span>
                  <p className="text-slate-300 font-mono text-sm">{studentState.currentBooking.bookingId}</p>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Calendar invite sent
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={studentState.currentBooking.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 text-sm"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Google Meet Room</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  onClick={() => alert('Calendar invite downloaded (.ics file generated)')}
                  className="px-4 py-3 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Download .ICS Invite</span>
                </button>

                <button
                  onClick={onCancelBooking}
                  className="px-4 py-3 rounded-xl font-semibold text-rose-400 hover:text-white hover:bg-rose-950/60 border border-rose-900/40 transition-all text-sm ml-auto"
                >
                  Reschedule / Cancel
                </button>
              </div>

              {/* Readiness Guidelines */}
              <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-indigo-300">
                  <ShieldCheck className="w-4 h-4" />
                  Defense Day Protocol:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Please join 5 minutes early. A valid college ID must be presented on camera.</li>
                  <li>Have your local IDE open with Contest #4 (Distributed Caching repository) ready for screen share.</li>
                  <li>Cancellations within 12 hours of the slot incur a 7-day rebooking cooldown.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- STATE 3: PASSED (BADGE AWARDED 🎉) ---------------- */}
        {journeyState === 'PASSED' && (
          <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider px-5 py-1.5 rounded-bl-xl shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Verified & Minted
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Badge Visual Stamp */}
              <div className="relative group shrink-0">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-indigo-600 p-1 shadow-2xl shadow-emerald-500/20 transform group-hover:scale-105 transition duration-300">
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center p-4 text-center border border-white/10">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                      <Award className="w-10 h-10" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">NIAT GRIT</span>
                    <span className="text-sm font-extrabold text-white leading-tight mt-0.5">AI Systems Master</span>
                    <span className="text-[10px] text-emerald-400 font-mono mt-1">Level 3 • Expert</span>
                  </div>
                </div>
                <button
                  onClick={handleTriggerConfetti}
                  className="mt-3 w-full py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Celebrate Again!
                </button>
              </div>

              {/* Success Info & Rubric Breakdown */}
              <div className="space-y-5 flex-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                    Official Interview Result: PASSED
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    Congratulations, Aarav! You Earned Your Track Badge!
                  </h2>
                  <p className="text-slate-300 text-sm mt-1">
                    Your technical defense was evaluated and approved by <strong className="text-white">Sarah Chen</strong>. <span className="text-amber-400 font-bold">+500 GRIT Miles</span> have been added to your profile, moving you up to <strong className="text-white">#28 Nationally</strong>!
                  </p>
                </div>

                {/* Rubric Scores */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Rubric Scores</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1">Conceptual Depth</span>
                      <span className="text-amber-400 font-bold text-sm">★★★★★ (5/5)</span>
                      <p className="text-[11px] text-slate-400 mt-1">Exemplary clarity on linearizability & CAP tradeoffs.</p>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1">Code Authorship</span>
                      <span className="text-amber-400 font-bold text-sm">★★★★★ (5/5)</span>
                      <p className="text-[11px] text-slate-400 mt-1">Original implementation verified down to byte buffers.</p>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1">Problem Solving</span>
                      <span className="text-amber-400 font-bold text-sm">★★★★☆ (4/5)</span>
                      <p className="text-[11px] text-slate-400 mt-1">Effective approach to network partitioning resilience.</p>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-300 border-t border-slate-800">
                    <strong className="text-indigo-400">Interviewer Feedback:</strong> "{studentState.evaluation.feedback}"
                  </div>
                </div>

                {/* Credential CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => alert('Public verified credential link copied to clipboard: https://grit.niatindia.com/verify/badge-aisys-99281')}
                    className="px-4 py-2.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition text-xs flex items-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Verified Badge</span>
                  </button>
                  <a
                    href="#leaderboard"
                    onClick={(e) => { e.preventDefault(); alert('Redirecting to National Leaderboard: Rank #28'); }}
                    className="px-4 py-2.5 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition text-xs flex items-center gap-2"
                  >
                    <span>View Leaderboard Rank</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- STATE 4: RETAKE COOLDOWN ---------------- */}
        {journeyState === 'RETAKE_COOLDOWN' && (
          <div className="rounded-2xl bg-slate-900 border border-orange-500/40 p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-500 text-slate-950 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-md flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Retake Cooldown Active
            </div>

            <div className="max-w-3xl space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/15 px-3 py-1 rounded-full border border-orange-500/30">
                  Result: Retake Required (Attempt 1 of 2)
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Skill Revision Needed Before Badge Re-attempt
                </h2>
                <p className="text-slate-300 text-sm">
                  Your interviewer appreciated your contest foundation, but identified gaps during the live architecture defense. A mandatory <strong className="text-orange-400">14-day study period</strong> has been initiated so you can address the feedback and succeed on your next attempt.
                </p>
              </div>

              {/* Cooldown Timer Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Cooldown Remaining</span>
                  <p className="text-2xl font-black text-orange-400 font-mono">
                    {studentState.retakeDetails.cooldownDaysLeft} Days
                  </p>
                  <p className="text-xs text-slate-400">Out of {studentState.retakeDetails.cooldownDaysTotal} days total</p>
                </div>

                <div className="space-y-1 sm:border-l border-slate-800 sm:pl-4">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Booking Re-Opens</span>
                  <p className="text-sm font-semibold text-white mt-1">{studentState.retakeDetails.eligibleRebookDate}</p>
                  <p className="text-xs text-slate-400">Calendar unlocks at 00:01 AM IST</p>
                </div>

                <div className="space-y-1 sm:border-l border-slate-800 sm:pl-4">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Retake Attempts</span>
                  <p className="text-sm font-semibold text-white mt-1">
                    Attempt #{studentState.retakeDetails.attemptNumber} of {studentState.retakeDetails.maxAttempts}
                  </p>
                  <p className="text-xs text-slate-400">1 remaining attempt permitted</p>
                </div>
              </div>

              {/* Diagnostic Notes */}
              <div className="bg-orange-950/20 border border-orange-900/40 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-orange-300">
                  <BookOpen className="w-4 h-4" />
                  Interviewer Diagnostic Recommendations:
                </div>
                <p className="text-slate-300 italic">
                  "{studentState.retakeDetails.diagnosticFeedback}"
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <a 
                    href="#resources"
                    onClick={(e) => { e.preventDefault(); alert('Opening NIAT Distributed Caching deep-dive practice labs'); }}
                    className="text-xs font-semibold text-orange-400 hover:text-orange-300 underline flex items-center gap-1"
                  >
                    <span>Open Recommended Remedial Practice Labs</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- STATE 5: BADGE NULLIFIED (MALPRACTICE ⚠️) ---------------- */}
        {journeyState === 'BADGE_NULLIFIED' && (
          <div className="rounded-2xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-900 border-2 border-rose-500/60 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-rose-600 text-white text-xs font-black uppercase tracking-wider px-5 py-1.5 rounded-bl-xl shadow-lg flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Academic Integrity Action
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Nullified Badge Visual with Watermark */}
              <div className="relative shrink-0">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-slate-900 border-2 border-rose-500/50 p-4 flex flex-col items-center justify-center text-center opacity-60 grayscale relative overflow-hidden">
                  <Award className="w-12 h-12 text-slate-500 mb-1" />
                  <span className="text-xs text-slate-500">AI Systems Master</span>
                  <span className="text-[10px] text-slate-600">Level 3</span>
                  
                  {/* Diagonal NULLIFIED Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="transform -rotate-45 bg-rose-600/90 text-white text-base font-black px-8 py-1 tracking-widest shadow-2xl border-y border-white">
                      NULLIFIED
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrity Finding Details */}
              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
                    Official Integrity Audit Determination
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    Notice of Badge Nullification & Miles Retraction
                  </h2>
                  <p className="text-slate-300 text-sm mt-1">
                    Following a scheduled post-issuance contest audit, our academic review committee confirmed an integrity policy violation on <strong className="text-white">{studentState.malpracticeDetails.contestFlagged}</strong>.
                  </p>
                </div>

                <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-4 text-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Audit Reference</span>
                      <span className="font-mono text-rose-400 font-semibold">{studentState.malpracticeDetails.auditRef}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Violation Type</span>
                      <span className="font-semibold text-rose-300">{studentState.malpracticeDetails.violationType}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-900 text-slate-400">
                    <strong className="text-slate-300">Audit Summary:</strong> {studentState.malpracticeDetails.evidenceSummary}
                  </div>
                  <div className="pt-2 text-rose-400 font-semibold flex items-center gap-1.5">
                    <span>⚡ Administrative Sanctions: -500 Miles deducted • 60-day interview booking freeze</span>
                  </div>
                </div>

                {/* Appeal CTA */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => alert(`Submitting formal appeal for Audit Ref: ${studentState.malpracticeDetails.auditRef}. Appeal deadline is ${studentState.malpracticeDetails.appealDeadline}.`)}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 transition text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Submit Formal 72-Hour Appeal</span>
                  </button>
                  <span className="text-xs text-slate-400">
                    Deadline: {studentState.malpracticeDetails.appealDeadline}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Track Prerequisites & Competency Checklist */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <span>Track Skill Contest Prerequisites</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Every skill required by this Track Badge must be completed before an interview can be scheduled.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Select Track:</span>
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-indigo-500"
            >
              {tracks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.level})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTrack.requiredSkills.map((skill, idx) => (
            <div 
              key={idx}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white block">{skill.name}</span>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Contest Score: <strong className="text-indigo-300">{skill.score}/100</strong></span>
                  <span>•</span>
                  <span>Benchmark: &gt;85%</span>
                </div>
              </div>

              {skill.status === 'CLEARED' ? (
                <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Cleared
                </span>
              ) : (
                <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full">
                  In Progress
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span>Schedule Track Defense Interview</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Track: <strong className="text-indigo-300">{activeTrack.name}</strong> • 30-Minute Live Video Session
                </p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Choose Interviewer */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. Select Verified Interviewer
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {interviewers.map(int => {
                  const isSelected = selectedInterviewerId === int.id;
                  return (
                    <div
                      key={int.id}
                      onClick={() => { setSelectedInterviewerId(int.id); setSelectedSlotId(null); }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500 shadow-md' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={int.avatar} alt={int.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-white">{int.name}</p>
                          <p className="text-[10px] text-slate-400">{int.company}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-amber-400 font-medium flex items-center gap-1">
                        <span>★ {int.rating}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{int.interviewsCompleted} cleared</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Date */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Select Date
              </label>
              <div className="flex gap-3">
                {['2026-10-24', '2026-10-25'].map(d => {
                  const isSelected = selectedDate === d;
                  const dateLabel = d === '2026-10-24' ? 'Thursday, Oct 24' : 'Friday, Oct 25';
                  return (
                    <button
                      key={d}
                      onClick={() => { setSelectedDate(d); setSelectedSlotId(null); }}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {dateLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Choose Slot */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  3. Select Available Slot (30 Mins)
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Timezone: Asia/Kolkata (IST)</span>
              </div>

              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableSlots.map(slot => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`py-2.5 px-3 rounded-lg border text-xs font-mono font-medium transition ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-300 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-white'
                        }`}
                      >
                        {slot.timeOnly}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  No slots currently available for this date & interviewer. Try switching date or interviewer.
                </div>
              )}
            </div>

            {/* Concurrency & Safety Notice */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Selecting a slot engages a <strong>5-minute optimistic lock</strong> to prevent double-booking.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                disabled={!selectedSlotId}
                onClick={handleConfirmBooking}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition flex items-center gap-2 ${
                  selectedSlotId
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>Confirm & Lock Slot</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
