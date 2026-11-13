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
  BellRing, 
  TrendingUp, 
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  FileText
} from 'lucide-react';

export default function AdminHub({ 
  cohortStudents, 
  onSendNudge, 
  onNullifyBadge,
  studentState 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [trackFilter, setTrackFilter] = useState('ALL');
  const [selectedStudentForAudit, setSelectedStudentForAudit] = useState(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [nullifyReason, setNullifyReason] = useState('Code similarity 94% confirmed in post-contest AST comparison against external unpermitted repository.');

  // Calculate funnel metrics
  const totalEligible = 124;
  const bookedCount = cohortStudents.filter(s => s.status === 'BOOKED' || s.status === 'PASSED').length * 12 + 15;
  const unbookedCount = cohortStudents.filter(s => s.status === 'NOT_BOOKED').length * 8 + 3;
  const conversionRate = Math.round((bookedCount / (bookedCount + unbookedCount)) * 100);

  // Filter students
  const filteredStudents = cohortStudents.filter(student => {
    // Sync with Aarav's dynamic state
    const currentStatus = student.rollNo === 'NIAT-24-0419' ? (
      studentState.journeyState === 'ELIGIBLE_UNBOOKED' ? 'NOT_BOOKED' :
      studentState.journeyState === 'BOOKED' ? 'BOOKED' :
      studentState.journeyState === 'PASSED' ? 'PASSED' :
      studentState.journeyState === 'RETAKE_COOLDOWN' ? 'RETAKE_COOLDOWN' :
      studentState.journeyState === 'BADGE_NULLIFIED' ? 'MALPRACTICE_FLAGGED' : student.status
    ) : student.status;

    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'BOOKED' && currentStatus === 'BOOKED') ||
                          (statusFilter === 'NOT_BOOKED' && currentStatus === 'NOT_BOOKED') ||
                          (statusFilter === 'PASSED' && currentStatus === 'PASSED') ||
                          (statusFilter === 'FLAGGED' && currentStatus === 'MALPRACTICE_FLAGGED');

    const matchesTrack = trackFilter === 'ALL' || student.track.includes(trackFilter);

    return matchesSearch && matchesStatus && matchesTrack;
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
    <div className="space-y-8">
      {/* Funnel Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <span>Total Eligible Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">124</p>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">100%</span> cleared track contests
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-indigo-500/30 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <span>Interviews Booked</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">97</p>
            <span className="text-xs text-slate-400 font-medium">({conversionRate}%)</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Healthy velocity
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-amber-500/30 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <span>Not Yet Booked</span>
            <UserX className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">27</p>
            <span className="text-xs text-slate-400 font-medium">({100 - conversionRate}%)</span>
          </div>
          <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <BellRing className="w-3.5 h-3.5" /> Needs nudge sequence
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-rose-500/30 p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <span>Integrity / Flagged Desk</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">2 Active</p>
          <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
            <span>Automated code AST match &gt;90%</span>
          </p>
        </div>
      </div>

      {/* Main Roster & Booking Oversight Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Eligible Students: Booked vs. Unbooked Roster</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time oversight for the Interview Ops Team. Identify unbooked candidates and trigger instant nudge notifications.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                alert('Triggered automated batch nudge (WhatsApp + Email) to all 27 unbooked students!');
              }}
              className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Bulk Nudge All Unbooked (27)</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student by name or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {[
                { key: 'ALL', label: 'All Students' },
                { key: 'BOOKED', label: 'Booked' },
                { key: 'NOT_BOOKED', label: 'Not Booked' },
                { key: 'PASSED', label: 'Passed' },
                { key: 'FLAGGED', label: 'Flagged ⚠️' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                    statusFilter === f.key
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Student & Roll No</th>
                <th className="pb-3">Track Badge</th>
                <th className="pb-3">Contest Prereqs</th>
                <th className="pb-3">Booking Status</th>
                <th className="pb-3">Assigned Session</th>
                <th className="pb-3 pr-2 text-right">Ops Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((student) => {
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
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-1.5">
                            <span>{student.name}</span>
                            {isAarav && (
                              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                                YOU
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">{student.rollNo}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 font-medium text-slate-300">
                      {student.track}
                    </td>

                    <td className="py-3.5 font-mono text-emerald-400">
                      <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {student.contestsCleared} Cleared
                      </span>
                    </td>

                    <td className="py-3.5">
                      {effectiveStatus === 'BOOKED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          <Clock className="w-3 h-3" />
                          Booked
                        </span>
                      )}
                      {effectiveStatus === 'NOT_BOOKED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          Not Booked
                        </span>
                      )}
                      {effectiveStatus === 'PASSED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Passed (Badge Minted)
                        </span>
                      )}
                      {effectiveStatus === 'RETAKE_COOLDOWN' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                          Retake Cooldown (8d)
                        </span>
                      )}
                      {effectiveStatus === 'MALPRACTICE_FLAGGED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          <ShieldAlert className="w-3 h-3" />
                          Badge Nullified
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-slate-300">
                      {effectiveStatus === 'BOOKED' ? (
                        <div>
                          <p className="font-semibold text-white">{isAarav ? studentState.currentBooking?.interviewerName : student.interviewer}</p>
                          <p className="text-[10px] text-indigo-400 font-mono">{isAarav ? studentState.currentBooking?.time : student.scheduledFor}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">None scheduled</span>
                      )}
                    </td>

                    <td className="py-3.5 pr-2 text-right">
                      {effectiveStatus === 'NOT_BOOKED' && (
                        <button
                          onClick={() => onSendNudge(student.name, student.rollNo)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Nudge</span>
                        </button>
                      )}

                      {effectiveStatus === 'BOOKED' && (
                        <span className="text-[11px] text-emerald-400 font-mono">Confirmed</span>
                      )}

                      {(effectiveStatus === 'PASSED' || effectiveStatus === 'MALPRACTICE_FLAGGED') && (
                        <button
                          onClick={() => handleOpenAudit(student)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-950/50 text-rose-300 hover:bg-rose-900/50 border border-rose-900/40 transition flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <ShieldAlert className="w-3 h-3" />
                          <span>Integrity Audit</span>
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

      {/* MALPRACTICE AUDIT & NULLIFICATION MODAL */}
      {isAuditModalOpen && selectedStudentForAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-rose-900/60 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span>Academic Integrity Audit & Revocation Desk</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Candidate: <strong className="text-white">{selectedStudentForAudit.name}</strong> ({selectedStudentForAudit.rollNo})
                </p>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-4 space-y-2">
                <span className="font-bold text-rose-300 uppercase tracking-wider block">
                  Automated Evidence Discovery
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Post-issuance static analysis and AST parser flagged a <strong className="text-rose-400">94% similarity index</strong> on Contest #4 (Distributed Caching & In-Memory Storage) matching external unpermitted code.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Engine: MOSS-v4 & AST-TreeDiff</span>
                  <span>•</span>
                  <span>Confidence: 99.2%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Mandatory Audit Log Reason (Stored in PostgreSQL)
                </label>
                <textarea
                  rows={3}
                  value={nullifyReason}
                  onChange={(e) => setNullifyReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-400 space-y-1">
                <p className="font-semibold text-white">Consequences of Nullification:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li>Track Badge marked permanently NULLIFIED across student profile & recruiter portal.</li>
                  <li>500 GRIT Miles immediately retracted from national leaderboard.</li>
                  <li>60-day interview booking freeze initiated; formal 72-hour appeal ticket generated.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmNullification}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Execute Badge Nullification</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
