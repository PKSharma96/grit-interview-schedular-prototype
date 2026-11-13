import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Plus, 
  Sliders, 
  UserCheck, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  ShieldAlert,
  ChevronDown,
  Trash2,
  Lock
} from 'lucide-react';

export default function InterviewerHub({ 
  interviewers, 
  slots, 
  onAddSlot, 
  onRecordOutcome, 
  studentState 
}) {
  const [selectedInterviewer, setSelectedInterviewer] = useState(interviewers[0]);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [evalCandidate, setEvalCandidate] = useState(null);
  
  // Availability state
  const [activeDays, setActiveDays] = useState(['Monday', 'Tuesday', 'Thursday', 'Friday']);
  const [bufferTime, setBufferTime] = useState(15);
  const [isAwayMode, setIsAwayMode] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('06:00 PM');
  const [newSlotDate, setNewSlotDate] = useState('2026-10-24');

  // Evaluation Form State
  const [outcome, setOutcome] = useState('PASS');
  const [conceptualScore, setConceptualScore] = useState(5);
  const [codeDefenseScore, setCodeDefenseScore] = useState(5);
  const [problemSolvingScore, setProblemSolvingScore] = useState(4);
  const [studentFeedback, setStudentFeedback] = useState('Exceptional defense. Clear understanding of linearizability vs eventual consistency. Explained cache invalidation strategies and lock striping with great clarity.');
  const [internalNotes, setInternalNotes] = useState('Student showed strong mastery over memory layout and Redis internals. Strongly recommended for Level 3 verification.');
  const [isMalpracticeFlagged, setIsMalpracticeFlagged] = useState(false);

  // Filter slots for this interviewer on Oct 24, 2026
  const todaySlots = slots.filter(s => s.interviewerId === selectedInterviewer.id && s.date === '2026-10-24');

  const handleOpenEval = (candidate) => {
    setEvalCandidate(candidate);
    setIsEvalModalOpen(true);
  };

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    onRecordOutcome({
      outcome: isMalpracticeFlagged ? 'BADGE_NULLIFIED' : outcome,
      conceptualScore,
      codeDefenseScore,
      problemSolvingScore,
      studentFeedback,
      internalNotes,
      isMalpracticeFlagged,
      interviewerName: selectedInterviewer.name
    });
    setIsEvalModalOpen(false);
  };

  const handleCreateNewSlot = () => {
    onAddSlot({
      interviewerId: selectedInterviewer.id,
      date: newSlotDate,
      time: `${newSlotTime} - ${newSlotTime === '06:00 PM' ? '06:30 PM' : '07:30 PM'}`,
      timeOnly: newSlotTime,
    });
  };

  return (
    <div className="space-y-8">
      {/* Interviewer Identity Header */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img 
              src={selectedInterviewer.avatar} 
              alt={selectedInterviewer.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-2 ring-indigo-500/40 object-cover shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{selectedInterviewer.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {selectedInterviewer.title}
                </span>
                <span className="text-xs text-slate-400 font-mono">({selectedInterviewer.company})</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Domain Specialties: <span className="text-slate-200">{selectedInterviewer.tracks.join(' • ')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-xl p-3 px-5 text-center">
            <div className="pr-4 border-r border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Conducted</span>
              <span className="text-lg font-bold text-white">{selectedInterviewer.interviewsCompleted}</span>
            </div>
            <div className="pr-4 border-r border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Rating</span>
              <span className="text-lg font-bold text-amber-400">★ {selectedInterviewer.rating}</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Daily Quota</span>
              <span className="text-lg font-bold text-indigo-400">6 Slots</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Availability Management */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Manage Availability</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>

            {/* Recurring Days */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Recurring Active Days
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const fullDay = day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday';
                  const isSelected = activeDays.includes(fullDay);
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (isSelected) {
                          setActiveDays(activeDays.filter(d => d !== fullDay));
                        } else {
                          setActiveDays([...activeDays, fullDay]);
                        }
                      }}
                      className={`py-1.5 px-2 rounded-lg font-semibold transition ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-950 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buffer Time & Away Mode */}
            <div className="space-y-4 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Buffer Between Sessions</span>
                <select
                  value={bufferTime}
                  onChange={(e) => setBufferTime(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs"
                >
                  <option value={10}>10 Mins</option>
                  <option value={15}>15 Mins</option>
                  <option value={20}>20 Mins</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-300 font-medium block">Vacation / Away Mode</span>
                  <span className="text-[10px] text-slate-500">Temporarily hides slots from booking</span>
                </div>
                <button
                  onClick={() => setIsAwayMode(!isAwayMode)}
                  className={`w-11 h-6 rounded-full transition-colors p-1 ${
                    isAwayMode ? 'bg-rose-600' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isAwayMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Add Ad-hoc Slot */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Add Ad-Hoc Slot
              </span>
              <div className="space-y-2">
                <input
                  type="date"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    placeholder="e.g. 06:00 PM"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                  />
                  <button
                    onClick={handleCreateNewSlot}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Schedule & Candidate Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <span>Today's Interview Schedule</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Thursday, October 24, 2026 • Timezone: IST</p>
              </div>
              <span className="text-xs text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-medium">
                {todaySlots.length} Slots Configured
              </span>
            </div>

            {/* Slots List */}
            <div className="space-y-3.5">
              {todaySlots.map((slot) => {
                const isAaravSlot = slot.id === 'slot-3';
                const isBooked = slot.status === 'BOOKED';

                return (
                  <div
                    key={slot.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isBooked
                        ? 'bg-slate-950/80 border-indigo-500/40 shadow-md'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Time & Slot Status */}
                      <div className="flex items-center gap-4">
                        <div className="w-24 font-mono font-bold text-sm text-indigo-300">
                          {slot.timeOnly}
                        </div>

                        <div>
                          {isBooked ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-sm">
                                  {isAaravSlot ? studentState.name : slot.studentName || 'Candidate'}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  {isAaravSlot ? studentState.rollNo : 'NIAT-24-CS-0284'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">
                                Track: <strong className="text-slate-300">AI Systems Mastery</strong> • Prereqs: 4/4 Cleared (Avg: 93.5%)
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span className="w-2 h-2 rounded-full bg-slate-600" />
                              <span>Slot Available for Student Booking</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {isBooked ? (
                          <>
                            <a
                              href="https://meet.grit.niatindia.com/room/grit-aisys-8492"
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Launch Meet</span>
                            </a>

                            <button
                              onClick={() => handleOpenEval(slot)}
                              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Record Outcome</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 font-mono">Open</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* OUTCOME EVALUATION MODAL */}
      {isEvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>Interview Outcome & Rubric Submission</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Candidate: <strong className="text-white">{studentState.name}</strong> ({studentState.rollNo}) • Track: <strong className="text-indigo-300">AI Systems Mastery</strong>
                </p>
              </div>
              <button
                onClick={() => setIsEvalModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEvaluation} className="space-y-6">
              {/* Outcome Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  1. Final Recommendation Decision
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => { setOutcome('PASS'); setIsMalpracticeFlagged(false); }}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition ${
                      outcome === 'PASS' && !isMalpracticeFlagged
                        ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                    <span className="text-xs font-bold block">PASS</span>
                    <span className="text-[10px] text-slate-400">Award Badge & +500 Miles</span>
                  </div>

                  <div
                    onClick={() => { setOutcome('RETAKE_COOLDOWN'); setIsMalpracticeFlagged(false); }}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition ${
                      outcome === 'RETAKE_COOLDOWN' && !isMalpracticeFlagged
                        ? 'bg-orange-950/60 border-orange-500 text-white ring-1 ring-orange-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <RotateCcw className="w-5 h-5 mx-auto text-orange-400 mb-1" />
                    <span className="text-xs font-bold block">RETAKE LATER</span>
                    <span className="text-[10px] text-slate-400">14-Day Study Cooldown</span>
                  </div>

                  <div
                    onClick={() => { setOutcome('FAIL'); setIsMalpracticeFlagged(false); }}
                    className={`p-3.5 rounded-xl border cursor-pointer text-center transition ${
                      outcome === 'FAIL' && !isMalpracticeFlagged
                        ? 'bg-rose-950/60 border-rose-500 text-white ring-1 ring-rose-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <XCircle className="w-5 h-5 mx-auto text-rose-400 mb-1" />
                    <span className="text-xs font-bold block">FAIL</span>
                    <span className="text-[10px] text-slate-400">Re-attempt Contests</span>
                  </div>
                </div>
              </div>

              {/* Malpractice Override Toggle */}
              <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-rose-300 block">Flag for Suspected Malpractice</span>
                    <span className="text-[11px] text-slate-400">Observed proxy test-taking, lip-syncing, or unpermitted AI tools</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isMalpracticeFlagged}
                  onChange={(e) => setIsMalpracticeFlagged(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-700"
                />
              </div>

              {/* Rubric Scoring */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  2. Competency Rubric Scores (1–5)
                </label>

                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block">Conceptual Depth</span>
                      <span className="text-[10px] text-slate-400">Linearizability, CAP theorem, cache consistency</span>
                    </div>
                    <select
                      value={conceptualScore}
                      onChange={(e) => setConceptualScore(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                    >
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-900">
                    <div>
                      <span className="font-semibold text-white block">Code Authorship & Defense</span>
                      <span className="text-[10px] text-slate-400">Can explain line-by-line implementation & memory footprint</span>
                    </div>
                    <select
                      value={codeDefenseScore}
                      onChange={(e) => setCodeDefenseScore(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                    >
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-900">
                    <div>
                      <span className="font-semibold text-white block">Problem Solving & Architecture</span>
                      <span className="text-[10px] text-slate-400">Handles hypothetical scale bottlenecks & failures</span>
                    </div>
                    <select
                      value={problemSolvingScore}
                      onChange={(e) => setProblemSolvingScore(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                    >
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Feedback textareas */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  3. Student Feedback (Shown on Dashboard & Report)
                </label>
                <textarea
                  rows={3}
                  value={studentFeedback}
                  onChange={(e) => setStudentFeedback(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  4. Confidential Internal Notes (NIAT Review Board Only)
                </label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEvalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Submit Final Evaluation</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

