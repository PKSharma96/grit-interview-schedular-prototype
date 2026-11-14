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
  FileText, 
  Sparkles, 
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function InterviewerPortal({ 
  interviewers, 
  slots, 
  onAddSlot, 
  onRecordOutcome, 
  studentState 
}) {
  const [interviewerSubTab, setInterviewerSubTab] = useState('schedule'); // 'schedule', 'availability'
  const [selectedInterviewer, setSelectedInterviewer] = useState(interviewers[0]);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [evalCandidate, setEvalCandidate] = useState(null);

  // Availability Settings State
  const [activeDays, setActiveDays] = useState(['Monday', 'Tuesday', 'Thursday', 'Friday']);
  const [bufferTime, setBufferTime] = useState(15);
  const [isAwayMode, setIsAwayMode] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('06:00 PM');
  const [newSlotDate, setNewSlotDate] = useState('2026-10-24');

  // Outcome Rubric Form
  const [outcome, setOutcome] = useState('PASS');
  const [conceptualScore, setConceptualScore] = useState(5);
  const [codeDefenseScore, setCodeDefenseScore] = useState(5);
  const [problemSolvingScore, setProblemSolvingScore] = useState(4);
  const [studentFeedback, setStudentFeedback] = useState('Exceptional defense. Clear understanding of linearizability vs eventual consistency. Explained cache invalidation strategies and lock striping with great clarity.');
  const [internalNotes, setInternalNotes] = useState('Student showed strong mastery over memory layout and Redis internals. Strongly recommended for Level 3 verification.');
  const [isMalpracticeFlagged, setIsMalpracticeFlagged] = useState(false);

  // Slots for this interviewer today
  const todaySlots = slots.filter(s => s.interviewerId === selectedInterviewer.id && s.date === '2026-10-24');

  const handleOpenEval = (slot) => {
    setEvalCandidate(slot);
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
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Interviewer Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={selectedInterviewer.avatar} 
            alt={selectedInterviewer.name} 
            className="w-14 h-14 rounded-xl ring-2 ring-indigo-500/30 object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{selectedInterviewer.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {selectedInterviewer.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Domain: <strong className="text-slate-300">{selectedInterviewer.tracks.join(' • ')}</strong> • {selectedInterviewer.company}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-2.5 px-4 text-xs">
          <div className="text-center pr-3 border-r border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Interviews Done</span>
            <span className="font-bold text-white font-mono">{selectedInterviewer.interviewsCompleted}</span>
          </div>
          <div className="text-center pr-3 border-r border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Rating</span>
            <span className="font-bold text-amber-400 font-mono">★ {selectedInterviewer.rating}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Daily Quota</span>
            <span className="font-bold text-indigo-400 font-mono">6 Max</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInterviewerSubTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              interviewerSubTab === 'schedule'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Today's Schedule & Candidate Queue
          </button>

          <button
            onClick={() => setInterviewerSubTab('availability')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              interviewerSubTab === 'availability'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Manage Working Hours & Slots
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Thursday, Oct 24, 2026 (IST)
        </span>
      </div>

      {/* SUB-VIEW 1: TODAY'S SCHEDULE */}
      {interviewerSubTab === 'schedule' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Today's Interview Schedule & Candidate Roster</span>
              </h3>
              <span className="text-xs text-indigo-300 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                {todaySlots.length} Slots Allocated
              </span>
            </div>

            <div className="space-y-3">
              {todaySlots.map(slot => {
                const isAarav = slot.id === 'slot-3';
                const isBooked = slot.status === 'BOOKED';

                return (
                  <div
                    key={slot.id}
                    className={`rounded-xl border p-4 transition ${
                      isBooked
                        ? 'bg-slate-950 border-indigo-500/40 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono font-bold text-indigo-300 w-20">
                          {slot.timeOnly}
                        </span>

                        <div>
                          {isBooked ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">
                                  {isAarav ? studentState.name : slot.studentName || 'Candidate'}
                                </span>
                                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-1.5 py-0.2 rounded border border-indigo-500/30">
                                  {isAarav ? studentState.rollNo : 'NIAT-24-CS-0284'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">
                                Track: <strong className="text-slate-300">AI Systems Mastery</strong> • Prereqs: 4/4 Cleared
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">Open Slot — Available for Student Booking</span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {isBooked ? (
                          <>
                            <a
                              href="https://meet.grit.niatindia.com/room/grit-aisys-8492"
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Launch Meet</span>
                            </a>

                            <button
                              onClick={() => handleOpenEval(slot)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Record Outcome</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500">Open</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: AVAILABILITY & WORKING HOURS */}
      {interviewerSubTab === 'availability' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Interviewer Working Hours & Availability Controls</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recurring Days */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Recurring Weekly Working Days
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const fullDay = day === 'Mon' ? 'Monday' : day === 'Tue' ? 'Tuesday' : day === 'Wed' ? 'Wednesday' : day === 'Thu' ? 'Thursday' : day === 'Fri' ? 'Friday' : day === 'Sat' ? 'Saturday' : 'Sunday';
                  const isSel = activeDays.includes(fullDay);
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (isSel) setActiveDays(activeDays.filter(d => d !== fullDay));
                        else setActiveDays([...activeDays, fullDay]);
                      }}
                      className={`py-2 px-3 rounded-lg font-semibold transition ${
                        isSel ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-500 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buffer & Vacation Mode */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-300 font-medium">Session Buffer Interval</span>
                <select
                  value={bufferTime}
                  onChange={(e) => setBufferTime(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                >
                  <option value={10}>10 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={20}>20 Minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-300 font-medium block">Vacation / Away Mode</span>
                  <span className="text-[10px] text-slate-500">Temporarily pauses slot discovery</span>
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
          </div>

          {/* Add custom slot */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Add Ad-Hoc 30-Min Slot
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={newSlotDate}
                onChange={(e) => setNewSlotDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                placeholder="e.g. 06:00 PM"
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono flex-1"
              />
              <button
                onClick={handleCreateNewSlot}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slot to Pool</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OUTCOME EVALUATION MODAL */}
      {isEvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Record Technical Defense Outcome</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Candidate: <strong className="text-white">{studentState.name}</strong> ({studentState.rollNo})
                </p>
              </div>
              <button
                onClick={() => setIsEvalModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEvaluation} className="space-y-5 text-xs">
              {/* Decision */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  1. Final Recommendation Decision
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    onClick={() => { setOutcome('PASS'); setIsMalpracticeFlagged(false); }}
                    className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                      outcome === 'PASS' && !isMalpracticeFlagged
                        ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                    <span className="font-bold block">PASS</span>
                    <span className="text-[10px] text-slate-400">+500 Miles</span>
                  </div>

                  <div
                    onClick={() => { setOutcome('RETAKE_COOLDOWN'); setIsMalpracticeFlagged(false); }}
                    className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                      outcome === 'RETAKE_COOLDOWN' && !isMalpracticeFlagged
                        ? 'bg-orange-950/60 border-orange-500 text-white ring-1 ring-orange-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4 mx-auto text-orange-400 mb-1" />
                    <span className="font-bold block">RETAKE LATER</span>
                    <span className="text-[10px] text-slate-400">14-Day Cooldown</span>
                  </div>

                  <div
                    onClick={() => { setOutcome('FAIL'); setIsMalpracticeFlagged(false); }}
                    className={`p-3 rounded-xl border cursor-pointer text-center transition ${
                      outcome === 'FAIL' && !isMalpracticeFlagged
                        ? 'bg-rose-950/60 border-rose-500 text-white ring-1 ring-rose-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <XCircle className="w-4 h-4 mx-auto text-rose-400 mb-1" />
                    <span className="font-bold block">FAIL</span>
                    <span className="text-[10px] text-slate-400">Exhausted</span>
                  </div>
                </div>
              </div>

              {/* Malpractice Check */}
              <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold text-rose-300 block">Flag for Suspected Malpractice</span>
                    <span className="text-[10px] text-slate-400">Proxy or unpermitted secondary screen usage detected</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isMalpracticeFlagged}
                  onChange={(e) => setIsMalpracticeFlagged(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
              </div>

              {/* Rubric */}
              <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Conceptual Depth</span>
                  <select
                    value={conceptualScore}
                    onChange={(e) => setConceptualScore(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-white font-medium">Code Authorship & Defense</span>
                  <select
                    value={codeDefenseScore}
                    onChange={(e) => setCodeDefenseScore(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-white font-medium">Problem Solving & Architecture</span>
                  <select
                    value={problemSolvingScore}
                    onChange={(e) => setProblemSolvingScore(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                  >
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Student Feedback (Displayed on Dashboard)
                </label>
                <textarea
                  rows={2}
                  value={studentFeedback}
                  onChange={(e) => setStudentFeedback(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEvalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer"
                >
                  Submit Rubric Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

