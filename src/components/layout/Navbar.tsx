import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import {
  Sparkles,
  Sun,
  Moon,
  Search,
  Bell,
  AlertTriangle,
  Building,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const {
    activeTab,
    setActiveTab,
    selectedUniversity,
    setSelectedUniversity,
    selectedSemester,
    setSelectedSemester,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    conflicts,
    runOptimization,
    isOptimizing,
  } = useTimetable();

  const universities = [
    'Apex Institute of Technology',
    'Emerald Valley Green University',
    'National Polytechnic Institute',
    'Turing School of Computing',
  ];

  const semesters = [
    'Fall 2026',
    'Spring 2026',
    'Summer Term 2026',
    'Winter Mini-Session',
  ];

  const criticalConflicts = conflicts.filter((c) => c.severity === 'critical');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-darkbg-900/85 border-b border-brand-100 dark:border-brand-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Logo & Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-darkbg-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </button>
          )}

          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-citrus-400 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">O</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-700 via-emerald-600 to-orange-500 bg-clip-text text-transparent dark:from-brand-300 dark:to-orange-400">
                  OptiRoom
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800/40">
                  DAA PRO
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                Timetable Room Minimizer
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search & Selectors */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, instructors, rooms, codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* University selector */}
          <div className="relative shrink-0">
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              aria-label="Select University"
              className="appearance-none pl-8 pr-7 py-2 text-xs font-semibold rounded-xl bg-emerald-50/80 dark:bg-darkbg-800 border border-emerald-200/60 dark:border-brand-900/60 text-brand-900 dark:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
            >
              {universities.map((u) => (
                <option key={u} value={u} className="text-slate-800 dark:text-slate-200">
                  {u}
                </option>
              ))}
            </select>
            <Building className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-600 dark:text-brand-400 pointer-events-none" />
          </div>

          {/* Semester selector */}
          <div className="relative shrink-0 hidden lg:block">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              aria-label="Select Semester"
              className="appearance-none pl-8 pr-7 py-2 text-xs font-semibold rounded-xl bg-orange-50/80 dark:bg-darkbg-800 border border-orange-200/60 dark:border-orange-900/40 text-orange-900 dark:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 cursor-pointer"
            >
              {semesters.map((s) => (
                <option key={s} value={s} className="text-slate-800 dark:text-slate-200">
                  {s}
                </option>
              ))}
            </select>
            <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-orange-600 dark:text-orange-400 pointer-events-none" />
          </div>
        </div>

        {/* Right Section: Quick Optimization CTA, Conflict Badge, Theme & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Optimizer Button */}
          <button
            onClick={() => runOptimization()}
            disabled={isOptimizing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 rounded-xl shadow-md shadow-brand-600/20 active:scale-95 transition-all disabled:opacity-50"
            title="Run Interval Partitioning Room Minimizer"
          >
            <Sparkles className={`w-4 h-4 text-citrus-300 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isOptimizing ? 'Minimizing...' : 'Optimize Rooms'}
            </span>
          </button>

          {/* Conflict Alert Icon */}
          <button
            onClick={() => setActiveTab('conflicts')}
            className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-darkbg-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Conflict Center"
          >
            {conflicts.length > 0 ? (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-600 text-[10px] font-black text-white rounded-full flex items-center justify-center ring-2 ring-white dark:ring-darkbg-900">
                  {conflicts.length}
                </span>
              </>
            ) : (
              <>
                <Bell className="w-5 h-5 text-slate-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full"></span>
              </>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-darkbg-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-citrus-400 hover:rotate-90 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-brand-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* User Profile avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-brand-900/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-citrus-500 to-brand-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
              DR
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                Dr. R. Sharma
              </p>
              <p className="text-[10px] text-brand-600 dark:text-brand-400 font-medium leading-none mt-1">
                Academic Dean
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
