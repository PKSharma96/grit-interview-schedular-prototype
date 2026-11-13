import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_TRACKS, 
  INITIAL_INTERVIEWERS, 
  INITIAL_SLOTS, 
  INITIAL_STUDENT_STATE, 
  COHORT_STUDENTS 
} from './data/mockData';

import Navbar from './components/Navbar';
import StudentPortal from './components/StudentPortal';
import InterviewerHub from './components/InterviewerHub';
import AdminHub from './components/AdminHub';
import StudentMessagesTab from './components/StudentMessagesTab';
import ArchitectureDocTab from './components/ArchitectureDocTab';
import BeforeAfterShowcase from './components/BeforeAfterShowcase';

import { CheckCircle2, AlertTriangle, Bell, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('student');
  const [studentState, setStudentState] = useState(INITIAL_STUDENT_STATE);
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  const [interviewers, setInterviewers] = useState(INITIAL_INTERVIEWERS);
  const [slots, setSlots] = useState(INITIAL_SLOTS);
  const [cohortStudents, setCohortStudents] = useState(COHORT_STUDENTS);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Student books a slot
  const handleBookSlot = ({ slotId, date, time, interviewerId, interviewerName, meetingUrl }) => {
    // Update slot status
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'BOOKED', studentName: studentState.name } : s));

    // Update student state
    setStudentState(prev => ({
      ...prev,
      journeyState: 'BOOKED',
      currentBooking: {
        bookingId: `GRIT-BK-${Math.floor(1000 + Math.random() * 9000)}`,
        interviewerId,
        interviewerName,
        date,
        time,
        slotId,
        meetingUrl,
        bookedAt: 'Just now',
      }
    }));

    // Update cohort roster
    setCohortStudents(prev => prev.map(s => 
      s.rollNo === studentState.rollNo 
        ? { ...s, status: 'BOOKED', interviewer: interviewerName, scheduledFor: `${date}, ${time.split(' - ')[0]}` } 
        : s
    ));

    showToast(`Slot Confirmed! Interview scheduled with ${interviewerName} on ${date}.`, 'success');
  };

  // Student cancels or reschedules
  const handleCancelBooking = () => {
    if (studentState.currentBooking) {
      const slotId = studentState.currentBooking.slotId;
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'AVAILABLE', studentName: null } : s));
    }

    setStudentState(prev => ({
      ...prev,
      journeyState: 'ELIGIBLE_UNBOOKED',
      currentBooking: null
    }));

    setCohortStudents(prev => prev.map(s => 
      s.rollNo === studentState.rollNo 
        ? { ...s, status: 'NOT_BOOKED', interviewer: null, scheduledFor: null } 
        : s
    ));

    showToast('Interview slot released. Your 14-day booking window is still active.', 'info');
  };

  // Interviewer adds a slot
  const handleAddSlot = ({ interviewerId, date, time, timeOnly }) => {
    const newSlot = {
      id: `slot-custom-${Date.now()}`,
      interviewerId,
      date,
      time,
      timeOnly,
      status: 'AVAILABLE'
    };
    setSlots(prev => [...prev, newSlot]);
    showToast(`New slot added for ${date} at ${timeOnly}.`, 'success');
  };

  // Interviewer submits outcome evaluation
  const handleRecordOutcome = ({ 
    outcome, 
    conceptualScore, 
    codeDefenseScore, 
    problemSolvingScore, 
    studentFeedback, 
    internalNotes, 
    isMalpracticeFlagged,
    interviewerName 
  }) => {
    if (isMalpracticeFlagged) {
      setStudentState(prev => ({
        ...prev,
        journeyState: 'BADGE_NULLIFIED',
      }));
      showToast('⚠️ Candidate flagged for suspected malpractice. Case referred to Integrity Board.', 'error');
      return;
    }

    setStudentState(prev => ({
      ...prev,
      journeyState: outcome,
      evaluation: {
        outcome,
        conceptualScore,
        codeDefenseScore,
        problemSolvingScore,
        feedback: studentFeedback,
        evaluatedBy: interviewerName,
        evaluatedAt: 'Just now'
      }
    }));

    if (outcome === 'PASS') {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
      showToast('🎉 Result Recorded: PASS! AI Systems Master badge awarded and +500 Miles credited.', 'success');
    } else if (outcome === 'RETAKE_COOLDOWN') {
      showToast('Result Recorded: Retake Required. 14-day study cooldown initiated.', 'warning');
    } else {
      showToast('Result Recorded: FAIL. Student notified.', 'error');
    }
  };

  // Ops admin sends nudge
  const handleSendNudge = (studentName, rollNo) => {
    setCohortStudents(prev => prev.map(s => 
      s.rollNo === rollNo ? { ...s, nudgeCount: (s.nudgeCount || 0) + 1 } : s
    ));
    showToast(`WhatsApp & Email reminder dispatched to ${studentName}!`, 'info');
  };

  // Ops admin executes badge nullification
  const handleNullifyBadge = (rollNo, reason) => {
    if (rollNo === studentState.rollNo) {
      setStudentState(prev => ({
        ...prev,
        journeyState: 'BADGE_NULLIFIED',
        malpracticeDetails: {
          ...prev.malpracticeDetails,
          evidenceSummary: reason,
          detectionDate: 'Today'
        }
      }));
    }

    setCohortStudents(prev => prev.map(s => 
      s.rollNo === rollNo ? { ...s, status: 'MALPRACTICE_FLAGGED' } : s
    ));

    showToast(`⚠️ Badge Nullified and -500 Miles deducted for ${rollNo}. Official notice sent.`, 'error');
  };

  // Reset simulation
  const handleResetSimulation = () => {
    setStudentState(INITIAL_STUDENT_STATE);
    setSlots(INITIAL_SLOTS);
    setCohortStudents(COHORT_STUDENTS);
    showToast('Simulation state reset to default.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold max-w-md ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-950/50' 
              : toastMessage.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/50 shadow-rose-950/50'
              : toastMessage.type === 'warning'
              ? 'bg-orange-950/90 text-orange-200 border-orange-500/50 shadow-orange-950/50'
              : 'bg-indigo-950/90 text-indigo-200 border-indigo-500/50 shadow-indigo-950/50'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />}
            {toastMessage.type === 'info' && <Bell className="w-4 h-4 text-indigo-400 shrink-0" />}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentState={studentState}
        setStudentState={setStudentState}
        onResetSimulation={handleResetSimulation}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Nav Shortcut Pill Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Active View:</span>
            <span className="font-bold text-white capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('showcase')}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'showcase' 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>🔄 View Side-by-Side Before & After</span>
            </button>
          </div>
        </div>

        {/* Dynamic Views */}
        {activeTab === 'student' && (
          <StudentPortal
            studentState={studentState}
            setStudentState={setStudentState}
            tracks={tracks}
            interviewers={interviewers}
            slots={slots}
            onBookSlot={handleBookSlot}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {activeTab === 'interviewer' && (
          <InterviewerHub
            interviewers={interviewers}
            slots={slots}
            onAddSlot={handleAddSlot}
            onRecordOutcome={handleRecordOutcome}
            studentState={studentState}
          />
        )}

        {activeTab === 'admin' && (
          <AdminHub
            cohortStudents={cohortStudents}
            onSendNudge={handleSendNudge}
            onNullifyBadge={handleNullifyBadge}
            studentState={studentState}
          />
        )}

        {activeTab === 'messages' && (
          <StudentMessagesTab />
        )}

        {activeTab === 'specs' && (
          <ArchitectureDocTab />
        )}

        {activeTab === 'showcase' && (
          <BeforeAfterShowcase 
            studentState={studentState}
            setStudentState={setStudentState}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">GRIT</span>
            <span>•</span>
            <span>NIAT Skilling Competition</span>
            <span>•</span>
            <span className="font-mono text-indigo-400">Track Badge Interview Engine</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Concurrency-Safe Distributed Booking</span>
            <span>•</span>
            <span>Academic Integrity Protected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
