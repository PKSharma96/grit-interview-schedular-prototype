import React from 'react';
import { 
  Award, 
  Calendar, 
  ShieldAlert, 
  Users, 
  FileText, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  studentState, 
  setStudentState,
  onResetSimulation
}) {
  const states = [
    { key: 'ELIGIBLE_UNBOOKED', label: '1. Eligible (Unbooked)', icon: Sparkles, color: 'text-amber-400' },
    { key: 'BOOKED', label: '2. Booked (Scheduled)', icon: Calendar, color: 'text-indigo-400' },
    { key: 'PASSED', label: '3. Result: Passed 🎉', icon: CheckCircle2, color: 'text-emerald-400' },
    { key: 'RETAKE_COOLDOWN', label: '4. Result: Retake Later', icon: Clock, color: 'text-orange-400' },
    { key: 'BADGE_NULLIFIED', label: '5. Nullified / Malpractice ⚠️', icon: AlertTriangle, color: 'text-rose-400' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner: State Simulator Quick Control */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border-b border-indigo-900/40 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono uppercase tracking-wider text-[10px]">
              Vibe Simulation Bar
            </span>
            <span className="hidden sm:inline text-slate-400">Quick-switch Student Journey State:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {states.map((s) => {
              const Icon = s.icon;
              const isActive = studentState.journeyState === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setStudentState(prev => ({ ...prev, journeyState: s.key }))}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium whitespace-nowrap ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400' 
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`Simulate state: ${s.label}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : s.color}`} />
                  <span>{s.label}</span>
                </button>
              );
            })}

            <button
              onClick={onResetSimulation}
              className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded transition"
              title="Reset all states to initial"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('student')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  GRIT
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  NIAT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Track Badge Interview Platform</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('interviewer')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'interviewer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Interviewer Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Operations & Admin</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'messages'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">3 Core</span>
              <span>Messages</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'specs'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-purple-300" />
              <span className="hidden lg:inline">2-Page</span>
              <span>Design Specs</span>
            </button>
          </nav>

          {/* User Profile Pill */}
          <div className="hidden xl:flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-200">{studentState.name}</p>
              <div className="flex items-center gap-1 justify-end text-[11px] text-amber-400 font-mono">
                <span>⚡ {studentState.journeyState === 'PASSED' ? studentState.baseMiles + studentState.badgeMiles : studentState.baseMiles} Miles</span>
              </div>
            </div>
            <img 
              src={studentState.avatar} 
              alt={studentState.name} 
              className="w-8 h-8 rounded-full ring-2 ring-indigo-500/40 object-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}

