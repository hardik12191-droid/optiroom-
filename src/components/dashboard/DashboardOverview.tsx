import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { exportTimetableToPDF, exportTimetableToExcel } from '../../utils/exportUtils';
import {
  BookOpen,
  DoorOpen,
  Sparkles,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  Percent,
  Plus,
  FileDown,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Layers,
  Wand2,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    classes,
    rooms,
    instructors,
    conflicts,
    optimizationResult,
    runOptimization,
    fixAllConflicts,
    isOptimizing,
    setActiveTab,
    selectedUniversity,
    selectedSemester,
  } = useTimetable();

  // Dynamic calculations
  const totalClasses = classes.length;
  const totalRooms = rooms.length;
  const roomsInUse = new Set(classes.map((c) => c.roomId).filter(Boolean)).size;
  const roomsSaved = optimizationResult ? optimizationResult.roomsSaved : Math.max(0, totalRooms - roomsInUse);

  const instructorConflictsCount = conflicts.filter((c) => c.type === 'instructor_clash').length;
  const roomConflictsCount = conflicts.filter((c) => c.type === 'room_overlap').length;

  // Approximate utilization percentage: (total class hours / (rooms * 50 available hours)) * 100
  const totalClassHours = classes.length * 1.2;
  const theoreticalCapacityHours = Math.max(1, roomsInUse * 45);
  const utilizationPercentage = Math.min(96, Math.max(45, Math.round((totalClassHours / theoreticalCapacityHours) * 100)));

  // Department counts
  const departmentCounts: Record<string, number> = {};
  for (const c of classes) {
    departmentCounts[c.department] = (departmentCounts[c.department] || 0) + 1;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-700 via-emerald-600 to-orange-500 text-white shadow-xl shadow-brand-700/15">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-citrus-300" />
              <span>DAA Algorithmic Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {selectedUniversity}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Academic Timetable Optimization & Classroom Minimizer • {selectedSemester}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => runOptimization()}
              disabled={isOptimizing}
              className="px-4 py-2.5 rounded-2xl bg-white text-brand-900 hover:bg-emerald-50 font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <Sparkles className={`w-4 h-4 text-orange-500 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Minimizing Rooms...' : 'Run Room Minimizer'}</span>
            </button>

            <button
              onClick={() => exportTimetableToPDF(classes, rooms, instructors, optimizationResult, selectedUniversity, selectedSemester)}
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm border border-white/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Conflict Alert Bar if conflicts exist */}
      {conflicts.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 animate-bounce">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-amber-950 dark:text-amber-100">
                {conflicts.length} Scheduling Conflicts Detected
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                {roomConflictsCount} room collisions and {instructorConflictsCount} faculty overlaps found.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={fixAllConflicts}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
            >
              Fix Automatically
            </button>
            <button
              onClick={() => setActiveTab('conflicts')}
              className="px-4 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 rounded-xl transition-colors"
            >
              Review Clashes →
            </button>
          </div>
        </div>
      )}

      {/* 6 Key Statistic Cards with animated counters & trend badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {/* Card 1: Total Classes */}
        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Classes</span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-darkbg-700 text-brand-600 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {totalClasses}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-brand-400 mt-2">
            <TrendingUp className="w-3 h-3" />
            <span>Active courses</span>
          </div>
        </div>

        {/* Card 2: Rooms Required */}
        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rooms Needed</span>
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-darkbg-700 text-orange-600 group-hover:scale-110 transition-transform">
              <DoorOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {optimizationResult ? optimizationResult.actualRoomsUsed : roomsInUse}
          </div>
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2">
            of {totalRooms} total halls
          </div>
        </div>

        {/* Card 3: Rooms Saved */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-brand-50/80 via-white to-emerald-50/50 dark:from-darkbg-800 dark:to-darkbg-750 border border-brand-200 dark:border-brand-800 shadow-soft hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300">
              Rooms Saved
            </span>
            <div className="p-2 rounded-xl bg-brand-500 text-white shadow-xs group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-700 dark:text-brand-400">
            +{roomsSaved}
          </div>
          <div className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400 mt-2">
            Minimizer efficiency
          </div>
        </div>

        {/* Card 4: Total Conflicts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Conflicts</span>
            <div
              className={`p-2 rounded-xl ${
                conflicts.length > 0
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                  : 'bg-emerald-100 dark:bg-brand-950 text-brand-600'
              } group-hover:scale-110 transition-transform`}
            >
              {conflicts.length > 0 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
          </div>
          <div
            className={`text-2xl sm:text-3xl font-black ${
              conflicts.length > 0
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-brand-700 dark:text-brand-400'
            }`}
          >
            {conflicts.length}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
            {conflicts.length === 0 ? 'Zero collisions' : 'Action needed'}
          </div>
        </div>

        {/* Card 5: Instructor Conflicts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Faculty Clashes</span>
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-darkbg-700 text-orange-600 group-hover:scale-110 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {instructorConflictsCount}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
            {instructors.length} active faculty
          </div>
        </div>

        {/* Card 6: Room Utilization */}
        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Utilization</span>
            <div className="p-2 rounded-xl bg-citrus-50 dark:bg-darkbg-700 text-citrus-600 group-hover:scale-110 transition-transform">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {utilizationPercentage}%
          </div>
          <div className="text-[11px] font-bold text-brand-600 dark:text-brand-400 mt-2">
            Optimized slots
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Room Minimizer Showcase & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interval Partitioning Algorithm Status */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-brand-900/40 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Algorithm Engine Status
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                  Interval Partitioning Allocation
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('optimization')}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-50 dark:bg-darkbg-700 text-brand-700 dark:text-brand-300 hover:bg-brand-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Optimization Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-darkbg-900/50 border border-brand-100 dark:border-brand-900/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {optimizationResult ? (
                <div>
                  <p className="font-bold text-brand-900 dark:text-brand-200">
                    Optimal partition achieved! Peak simultaneous classes: {optimizationResult.theoreticalMinRooms} on {optimizationResult.peakDay} ({optimizationResult.peakHour}).
                  </p>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    {optimizationResult.explanations.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">
                      Greedy Room Minimization is ready to execute.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Click the "Run Room Minimizer" button to sort classes by start times, calculate the maximum simultaneous overlap, and assign the absolute fewest classrooms required.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Department Distribution Progress Bars */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Department Class Distribution
              </h4>
              <div className="space-y-2">
                {Object.entries(departmentCounts).map(([dept, count]) => {
                  const pct = Math.round((count / totalClasses) * 100);
                  const isCS = dept.includes('Computer');
                  const isEC = dept.includes('Electronics');
                  const isMath = dept.includes('Math');

                  const barColor = isCS
                    ? 'from-brand-500 to-emerald-600'
                    : isEC
                    ? 'from-orange-500 to-amber-600'
                    : isMath
                    ? 'from-teal-500 to-brand-600'
                    : 'from-amber-400 to-citrus-600';

                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-800 dark:text-slate-200">{dept}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono">
                          {count} classes ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-darkbg-900 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Action Cards & Campus Room Inventory Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Quick Actions
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => setActiveTab('timetable')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-brand-50/70 hover:bg-brand-100 dark:bg-darkbg-700/60 dark:hover:bg-darkbg-700 text-brand-900 dark:text-brand-200 font-bold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Open Weekly Master Timetable</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('classes')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-orange-50/70 hover:bg-orange-100 dark:bg-darkbg-700/60 dark:hover:bg-darkbg-700 text-orange-900 dark:text-orange-200 font-bold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>Add New Course or Class</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('wizard')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100 dark:bg-darkbg-700/60 dark:hover:bg-darkbg-700 text-emerald-900 dark:text-emerald-200 font-bold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Wand2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Launch 8-Step Wizard</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('templates')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-darkbg-700/60 dark:hover:bg-darkbg-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>Apply Schedule Template</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Classroom Inventory Peek */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Active Classrooms
              </h3>
              <button
                onClick={() => setActiveTab('rooms')}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Manage All ({rooms.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {rooms.slice(0, 5).map((room) => {
                const isAssigned = classes.some((c) => c.roomId === room.id);
                return (
                  <div
                    key={room.id}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-brand-900/40 bg-slate-50/50 dark:bg-darkbg-900/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {room.roomNumber}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {room.type} • Cap: {room.capacity}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isAssigned
                          ? 'bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300'
                          : 'bg-slate-100 dark:bg-darkbg-700 text-slate-500'
                      }`}
                    >
                      {isAssigned ? 'Occupied' : 'Vacant'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
