import React, { useState } from 'react';
import { 
  Award, 
  User, 
  Calendar, 
  Settings, 
  FileText, 
  SlidersHorizontal, 
  Check, 
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function RoleHeader({ 
  currentRole, 
  setCurrentRole, 
  studentState, 
  setStudentState,
  onResetSimulation 
}) {
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

  const roles = [
    { id: 'candidate', label: 'Candidate Portal', icon: Award, user: 'Aarav Sharma (Student)' },
    { id: 'interviewer', label: 'Interviewer Hub', icon: Calendar, user: 'Sarah Chen (Interviewer)' },
    { id: 'admin', label: 'Operations & Admin', icon: Settings, user: 'NIAT Ops Team' },
    { id: 'specs', label: 'Specs & Messages', icon: FileText, user: 'Architecture Doc' },
  ];

  const journeyStates = [
    { key: 'ELIGIBLE_UNBOOKED', label: '1. Eligible (Unbooked)', icon: Sparkles, color: 'text-amber-400' },
    { key: 'BOOKED', label: '2. Booked (Awaiting Interview)', icon: Calendar, color: 'text-indigo-400' },
    { key: 'PASSED', label: '3. Result: Passed (Badge Minted)', icon: CheckCircle2, color: 'text-emerald-400' },
    { key: 'RETAKE_COOLDOWN', label: '4. Result: Retake Cooldown', icon: Clock, color: 'text-orange-400' },
    { key: 'BADGE_NULLIFIED', label: '5. Result: Badge Nullified', icon: AlertTriangle, color: 'text-rose-400' },
  ];

  const currentJourney = journeyStates.find(s => s.key === studentState.journeyState) || journeyStates[1];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setCurrentRole('candidate')}>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30 text-white font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">GRIT</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 uppercase font-mono">
                  NIAT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">Track Interview Engine</p>
            </div>
          </div>

          {/* Role Segregation Segmented Control (Center) */}
          <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            {roles.map(r => {
              const Icon = r.icon;
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setCurrentRole(r.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{r.label}</span>
                  <span className="md:hidden">{r.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Active User / Discrete State Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* If in Candidate Role: Show clean Journey State Pill with dropdown */}
            {currentRole === 'candidate' && (
              <div className="relative">
                <button
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition"
                  title="Simulate candidate lifecycle state"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="hidden lg:inline text-slate-400">State:</span>
                  <span className="font-semibold text-white">{currentJourney.label.split('. ')[1]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isStateDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 mb-1 flex items-center justify-between">
                      <span>Simulate Candidate State</span>
                      <button 
                        onClick={() => { onResetSimulation(); setIsStateDropdownOpen(false); }}
                        className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-0.5"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> Reset
                      </button>
                    </div>

                    {journeyStates.map(st => {
                      const Icon = st.icon;
                      const isSelected = studentState.journeyState === st.key;
                      return (
                        <button
                          key={st.key}
                          onClick={() => {
                            setStudentState(prev => ({ ...prev, journeyState: st.key }));
                            setIsStateDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition ${
                            isSelected 
                              ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/40' 
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-3.5 h-3.5 ${st.color}`} />
                            <span>{st.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800 text-xs text-slate-300">
              <div className="text-right hidden sm:block">
                <span className="font-semibold text-white block leading-tight">
                  {currentRole === 'candidate' ? studentState.name : 
                   currentRole === 'interviewer' ? 'Sarah Chen' : 
                   currentRole === 'admin' ? 'Operations Lead' : 'Documentation'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {currentRole === 'candidate' ? studentState.rollNo : 
                   currentRole === 'interviewer' ? 'Senior Architect' : 
                   currentRole === 'admin' ? 'Academic Ops' : 'Technical Spec'}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300">
                {currentRole === 'candidate' ? 'AS' : 
                 currentRole === 'interviewer' ? 'SC' : 
                 currentRole === 'admin' ? 'OP' : 'DOC'}
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}

