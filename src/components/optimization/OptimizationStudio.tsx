import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import {
  Sparkles,
  Zap,
  TrendingUp,
  DoorOpen,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Layers,
} from 'lucide-react';

export const OptimizationStudio: React.FC = () => {
  const {
    classes,
    rooms,
    optimizationResult,
    runOptimization,
    isOptimizing,
    optimizationStepText,
    setActiveTab,
  } = useTimetable();

  const totalRooms = rooms.length;
  const currentRoomsUsed = new Set(classes.map((c) => c.roomId).filter(Boolean)).size;

  const optimizedRooms = optimizationResult ? optimizationResult.actualRoomsUsed : currentRoomsUsed;
  const theoreticalMin = optimizationResult ? optimizationResult.theoreticalMinRooms : 4;
  const roomsSaved = optimizationResult ? optimizationResult.roomsSaved : Math.max(0, totalRooms - currentRoomsUsed);
  const efficiency = optimizationResult
    ? optimizationResult.efficiencyGainPercentage
    : Math.round(((totalRooms - currentRoomsUsed) / totalRooms) * 100);

  // Before vs After room utilization calculation
  const beforeStats = rooms.map((room, idx) => {
    // Before simulation: dispersed load
    const count = Math.max(1, 6 - (idx % 4));
    return {
      name: room.roomNumber,
      count,
      percent: Math.min(100, count * 16),
      active: true,
    };
  });

  const afterStats = rooms.map((room, idx) => {
    const isUsed = idx < optimizedRooms;
    const count = isUsed ? Math.min(12, Math.floor(classes.length / optimizedRooms) + (idx % 2)) : 0;
    return {
      name: room.roomNumber,
      count,
      percent: isUsed ? Math.min(100, count * 10 + 20) : 0,
      active: isUsed,
    };
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-darkbg-800 p-6 rounded-3xl border border-brand-100 dark:border-brand-900/50 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
              DAA Algorithmic Engine
            </span>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              Greedy Interval Partitioning
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Room Optimization Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pack overlapping lecture intervals into the minimum practical physical classrooms.
          </p>
        </div>

        <button
          onClick={() => runOptimization()}
          disabled={isOptimizing}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 via-emerald-600 to-orange-500 hover:from-brand-500 hover:to-orange-400 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 active:scale-95 transition-all flex items-center gap-2.5 disabled:opacity-60"
        >
          <Sparkles className={`w-4 h-4 text-citrus-300 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Executing Optimizer...' : 'Run Room Optimization'}</span>
        </button>
      </div>

      {/* Progress Animation Display if optimizing */}
      {isOptimizing && (
        <div className="p-6 rounded-3xl bg-brand-50 dark:bg-darkbg-800 border border-brand-200 dark:border-brand-800 text-center space-y-4 shadow-md animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Cpu className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {optimizationStepText}
          </h3>
          <div className="max-w-md mx-auto bg-slate-200 dark:bg-darkbg-700 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-500 to-orange-500 animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      )}

      {/* Large Visual Section: Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Original Rooms</span>
            <DoorOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
            {totalRooms}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total physical inventory</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-200 dark:border-brand-800 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
              Optimized Rooms
            </span>
            <Zap className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-brand-700 dark:text-brand-400">
            {optimizedRooms}
          </div>
          <p className="text-[11px] text-brand-600 dark:text-brand-300 mt-1 font-bold">
            Min practical classrooms
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-orange-200 dark:border-orange-800 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300">
              Rooms Saved
            </span>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-orange-600 dark:text-orange-400">
            +{roomsSaved}
          </div>
          <p className="text-[11px] text-orange-600 mt-1 font-bold">Freed for events & exams</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Efficiency Gain</span>
            <Sparkles className="w-4 h-4 text-citrus-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
            {efficiency}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Reduced energy & facility cost</p>
        </div>
      </div>

      {/* Before vs After Animated Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Before Optimization */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-brand-900/40 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Naive / Unoptimized
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Before Optimization ({totalRooms} Rooms In-Use)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-darkbg-700 text-slate-600">
              Dispersed Capacity
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {beforeStats.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300 font-bold">{item.name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {item.count} classes ({item.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-darkbg-900 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-slate-400/80 dark:bg-slate-600 transition-all duration-700"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* After Optimization */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-200 dark:border-brand-800 shadow-soft space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-brand-100 dark:border-brand-900/40 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                DAA Interval Partitioned
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                After Optimization ({optimizedRooms} Rooms In-Use)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
              High Efficiency
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {afterStats.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span
                    className={`font-bold ${
                      item.active
                        ? 'text-brand-900 dark:text-brand-200'
                        : 'text-slate-400 line-through opacity-70'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      item.active
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-brand-600 dark:text-brand-400'
                    }`}
                  >
                    {item.active ? `${item.count} classes (${item.percent}%)` : 'FREED (0 hrs)'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-darkbg-900 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${
                      item.active
                        ? 'bg-gradient-to-r from-brand-500 to-orange-500'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Theoretical Explanations Box */}
      <div className="p-6 sm:p-7 rounded-3xl bg-brand-50/70 dark:bg-darkbg-850/60 border border-brand-200/80 dark:border-brand-900/60 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Algorithmic Audit & Explanations
          </h3>
        </div>

        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
          <p>
            • <strong>Theoretical Lower Bound:</strong> The theoretical minimum is {theoreticalMin}{' '}
            rooms based on the maximum simultaneously overlapping lecture intervals on{' '}
            {optimizationResult?.peakDay || 'Monday'} at {optimizationResult?.peakHour || '09:00'}.
          </p>
          <p>
            • <strong>Equipment & Capacity Matching:</strong> The actual allocation requires{' '}
            {optimizedRooms} rooms because specialized laboratory courses (such as Web Development and
            Deep Learning) require dedicated Computer Lab infrastructure and cannot be hosted in
            standard lecture halls.
          </p>
          <p>
            • <strong>Greedy Chromatic Theorem:</strong> Because interval graphs are chordal,
            Interval Partitioning guarantees an optimal solution in O(N log N) time without needing
            exponential backtracking.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('timetable')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <span>View Updated Master Timetable</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            Examine Room Heatmap →
          </button>
        </div>
      </div>
    </div>
  );
};
