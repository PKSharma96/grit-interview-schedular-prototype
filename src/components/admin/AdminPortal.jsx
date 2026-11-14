import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Send, 
  Search, 
  Filter, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function AdminPortal({ 
  cohortStudents, 
  onSendNudge, 
  onNullifyBadge,
  studentState 
}) {
  const [adminSubTab, setAdminSubTab] = useState('roster'); // 'roster', 'integrity', 'funnel'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudentForAudit, setSelectedStudentForAudit] = useState(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [nullifyReason, setNullifyReason] = useState('Code similarity 94% confirmed in post-contest AST comparison against external unpermitted repository.');

  const totalEligible = 124;
  const bookedCount = 97;
  const unbookedCount = 27;
  const conversionRate = Math.round((bookedCount / totalEligible) * 100);

  // Filter students
  const filteredStudents = cohortStudents.filter(student => {
    const isAarav = student.rollNo === 'NIAT-24-0419';
    const effectiveStatus = isAarav ? (
      studentState.journeyState === 'ELIGIBLE_UNBOOKED' ? 'NOT_BOOKED' :
      studentState.journeyState === 'BOOKED' ? 'BOOKED' :
      studentState.journeyState === 'PASSED' ? 'PASSED' :
      studentState.journeyState === 'RETAKE_COOLDOWN' ? 'RETAKE_COOLDOWN' :
      studentState.journeyState === 'BADGE_NULLIFIED' ? 'MALPRACTICE_FLAGGED' : student.status
    ) : student.status;

    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'BOOKED' && effectiveStatus === 'BOOKED') ||
                          (statusFilter === 'NOT_BOOKED' && effectiveStatus === 'NOT_BOOKED') ||
                          (statusFilter === 'PASSED' && effectiveStatus === 'PASSED') ||
                          (statusFilter === 'FLAGGED' && effectiveStatus === 'MALPRACTICE_FLAGGED');

    return matchesSearch && matchesStatus;
  });

  const handleOpenAudit = (student) => {
    setSelectedStudentForAudit(student);
    setIsAuditModalOpen(true);
  };

  const handleConfirmNullification = () => {
    if (selectedStudentForAudit) {
      onNullifyBadge(selectedStudentForAudit.rollNo, nullifyReason);
      setIsAuditModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Admin Intelligence Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Interview Operations & Cohort Intelligence</h2>
            <span className="text-xs px-2 py-0.5 rounded font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              NIAT Central Desk
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time cohort tracking: monitor which eligible students have scheduled, trigger nudges, and enforce integrity.
          </p>
        </div>

        {/* Funnel Snapshot Pills */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <div className="px-2.5 py-1 text-center">
            <span className="text-[10px] text-slate-500 uppercase block">Eligible</span>
            <span className="font-bold text-white font-mono">{totalEligible}</span>
          </div>
          <div className="px-2.5 py-1 text-center border-l border-slate-800">
            <span className="text-[10px] text-emerald-400 uppercase block">Booked</span>
            <span className="font-bold text-emerald-400 font-mono">{bookedCount} ({conversionRate}%)</span>
          </div>
          <div className="px-2.5 py-1 text-center border-l border-slate-800">
            <span className="text-[10px] text-amber-400 uppercase block">Unbooked</span>
            <span className="font-bold text-amber-400 font-mono">{unbookedCount}</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminSubTab('roster')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              adminSubTab === 'roster'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Eligible Candidates: Booked vs. Unbooked Roster
          </button>

          <button
            onClick={() => setAdminSubTab('integrity')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              adminSubTab === 'integrity'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Academic Integrity & Malpractice Desk</span>
            <span className="bg-rose-500/20 text-rose-300 text-[10px] px-1.5 py-0.2 rounded font-mono">2 Active</span>
          </button>

          <button
            onClick={() => setAdminSubTab('funnel')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              adminSubTab === 'funnel'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Conversion Funnel Metrics
          </button>
        </div>

        <button
          onClick={() => alert('Triggered automated batch nudge (WhatsApp + Email) to all 27 unbooked candidates!')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
        >
          <Send className="w-3 h-3" />
          <span>Bulk Nudge Unbooked ({unbookedCount})</span>
        </button>
      </div>

      {/* SUB-VIEW 1: CANDIDATES ROSTER */}
      {adminSubTab === 'roster' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate name or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto overflow-x-auto">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'BOOKED', label: 'Booked' },
                { id: 'NOT_BOOKED', label: 'Not Booked' },
                { id: 'PASSED', label: 'Passed' },
                { id: 'FLAGGED', label: 'Flagged ⚠️' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    statusFilter === f.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <th className="pb-3 pl-2">Candidate</th>
                  <th className="pb-3">Track Badge</th>
                  <th className="pb-3">Contest Prereqs</th>
                  <th className="pb-3">Booking Status</th>
                  <th className="pb-3">Scheduled Slot</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map(student => {
                  const isAarav = student.rollNo === 'NIAT-24-0419';
                  const effectiveStatus = isAarav ? (
                    studentState.journeyState === 'ELIGIBLE_UNBOOKED' ? 'NOT_BOOKED' :
                    studentState.journeyState === 'BOOKED' ? 'BOOKED' :
                    studentState.journeyState === 'PASSED' ? 'PASSED' :
                    studentState.journeyState === 'RETAKE_COOLDOWN' ? 'RETAKE_COOLDOWN' :
                    studentState.journeyState === 'BADGE_NULLIFIED' ? 'MALPRACTICE_FLAGGED' : student.status
                  ) : student.status;

                  return (
                    <tr key={student.id} className="hover:bg-slate-950/40 transition">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-indigo-300 font-bold flex items-center justify-center text-[11px]">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white block">
                              {student.name} {isAarav && <span className="text-[9px] text-indigo-400 font-mono">(Aarav)</span>}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{student.rollNo}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 text-slate-300 font-medium">{student.track}</td>
                      <td className="py-3 text-emerald-400 font-mono">{student.contestsCleared} Cleared</td>

                      <td className="py-3">
                        {effectiveStatus === 'BOOKED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            Booked
                          </span>
                        )}
                        {effectiveStatus === 'NOT_BOOKED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            Not Booked
                          </span>
                        )}
                        {effectiveStatus === 'PASSED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Passed
                          </span>
                        )}
                        {effectiveStatus === 'RETAKE_COOLDOWN' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                            Cooldown (8d)
                          </span>
                        )}
                        {effectiveStatus === 'MALPRACTICE_FLAGGED' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            Nullified
                          </span>
                        )}
                      </td>

                      <td className="py-3 text-slate-300">
                        {effectiveStatus === 'BOOKED' ? (
                          <span className="text-xs font-mono text-indigo-300">
                            {isAarav ? studentState.currentBooking?.time.split(' - ')[0] : student.scheduledFor}
                          </span>
                        ) : (
                          <span className="text-slate-600 italic">None</span>
                        )}
                      </td>

                      <td className="py-3 pr-2 text-right">
                        {effectiveStatus === 'NOT_BOOKED' && (
                          <button
                            onClick={() => onSendNudge(student.name, student.rollNo)}
                            className="px-2.5 py-1 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Nudge</span>
                          </button>
                        )}

                        {(effectiveStatus === 'PASSED' || effectiveStatus === 'MALPRACTICE_FLAGGED') && (
                          <button
                            onClick={() => handleOpenAudit(student)}
                            className="px-2 py-1 rounded text-[11px] font-semibold bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-900 transition flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <ShieldAlert className="w-3 h-3" />
                            <span>Audit</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: MALPRACTICE & INTEGRITY DESK */}
      {adminSubTab === 'integrity' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Academic Integrity & Retrospective Malpractice Audit Desk</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Investigate automated code similarity flags. Nullify badges and retract Miles with immutable audit records.
              </p>
            </div>
            <span className="text-xs text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              MOSS & AST Engine
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950 border border-rose-900/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">Aarav Sharma</span>
                  <span className="text-[10px] text-slate-400 font-mono">NIAT-24-CS-0419</span>
                  <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 uppercase">
                    AST Similarity 94%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Track: <strong className="text-slate-300">AI Systems Mastery</strong> • Flagged Contest: <em>Contest #4 (Distributed Caching & In-Memory Storage)</em>
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  Evidence: Semantic AST subtree match against unpermitted external GitHub repository.
                </p>
              </div>

              <button
                onClick={() => handleOpenAudit({ name: 'Aarav Sharma', rollNo: 'NIAT-24-0419' })}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1.5 shrink-0"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Review & Nullify Badge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: FUNNEL METRICS */}
      {adminSubTab === 'funnel' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 text-center">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Eligible Candidates</span>
            <p className="text-3xl font-black text-white font-mono">{totalEligible}</p>
            <p className="text-[11px] text-slate-500">100% cleared all 4 contest prereqs</p>
          </div>

          <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl space-y-1 text-center">
            <span className="text-xs text-emerald-400 uppercase font-semibold">Scheduled / Booked</span>
            <p className="text-3xl font-black text-emerald-400 font-mono">{bookedCount}</p>
            <p className="text-[11px] text-emerald-400 font-medium">78% cohort scheduling rate</p>
          </div>

          <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl space-y-1 text-center">
            <span className="text-xs text-amber-400 uppercase font-semibold">Unscheduled / Pending</span>
            <p className="text-3xl font-black text-amber-400 font-mono">{unbookedCount}</p>
            <p className="text-[11px] text-amber-400 font-medium">Targeted by WhatsApp nudge loop</p>
          </div>
        </div>
      )}

      {/* NULLIFICATION MODAL */}
      {isAuditModalOpen && selectedStudentForAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-rose-900/60 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Confirm Badge Nullification</span>
              </h3>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-rose-950/30 p-3 rounded-xl border border-rose-900/40 space-y-1 text-slate-300">
                <p>Candidate: <strong className="text-white">{selectedStudentForAudit.name}</strong> ({selectedStudentForAudit.rollNo})</p>
                <p className="text-rose-300 font-semibold">Violation: Direct Plagiarism & AST Code Anomaly on Contest #4</p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Mandatory Audit Log Reason (Stored in Database)
                </label>
                <textarea
                  rows={2}
                  value={nullifyReason}
                  onChange={(e) => setNullifyReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                <li>Track Badge permanently marked NULLIFIED on profile.</li>
                <li>500 Miles deducted from national leaderboard.</li>
                <li>60-day interview booking freeze initiated.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmNullification}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md cursor-pointer"
              >
                Execute Nullification
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

