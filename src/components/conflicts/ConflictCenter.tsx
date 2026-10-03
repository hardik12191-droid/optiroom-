import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  DoorOpen,
  Users,
  Clock,
  Layers,
  Wand2,
} from 'lucide-react';

export const ConflictCenter: React.FC = () => {
  const { conflicts, fixConflict, fixAllConflicts, classes, rooms, instructors, isOptimizing } =
    useTimetable();

  const criticalConflicts = conflicts.filter((c) => c.severity === 'critical');
  const warningConflicts = conflicts.filter((c) => c.severity === 'warning');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-darkbg-800 p-6 rounded-3xl border border-brand-100 dark:border-brand-900/50 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                conflicts.length > 0
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 animate-pulse'
                  : 'bg-emerald-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300'
              }`}
            >
              {conflicts.length > 0 ? `${conflicts.length} Anomalies Detected` : 'All Clear'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Conflict Detection & Resolution Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated collision inspector auditing room overlaps, faculty clashes, cohort overlaps, and capacity bounds.
          </p>
        </div>

        {conflicts.length > 0 && (
          <button
            onClick={fixAllConflicts}
            disabled={isOptimizing}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4" />
            <span>{isOptimizing ? 'Resolving...' : 'Fix All Clashes Automatically'}</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Conflicts</span>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
            {conflicts.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires immediate or manual review</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Critical Clashes</span>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <div className="text-3xl font-black text-red-600 dark:text-red-400">
            {criticalConflicts.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Room or professor double-bookings</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/50 shadow-soft">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Constraint Warnings</span>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {warningConflicts.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Capacity or missing equipment</p>
        </div>
      </div>

      {/* When zero conflicts exist */}
      {conflicts.length === 0 && (
        <div className="p-12 rounded-3xl bg-gradient-to-br from-brand-50 via-white to-emerald-50 dark:from-darkbg-800 dark:to-darkbg-700 border border-brand-200 dark:border-brand-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Conflict-Free Schedule Verified!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            All classes, physical rooms, and faculty schedules comply with non-overlapping interval constraints.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
              ✓ 0 Room Overlaps
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
              ✓ 0 Faculty Clashes
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              ✓ 100% Capacity Fit
            </span>
          </div>
        </div>
      )}

      {/* Conflict Cards List */}
      {conflicts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Detected Issues ({conflicts.length})
          </h3>

          <div className="space-y-3.5">
            {conflicts.map((conflict) => {
              const isCrit = conflict.severity === 'critical';

              return (
                <div
                  key={conflict.id}
                  className={`p-6 rounded-3xl border transition-all shadow-sm ${
                    isCrit
                      ? 'bg-red-50/70 dark:bg-red-950/30 border-red-300 dark:border-red-800/60'
                      : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            isCrit
                              ? 'bg-red-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {conflict.severity}
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                          {conflict.title}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {conflict.description}
                      </p>

                      {/* Suggested Solution Box */}
                      <div className="mt-3 p-3 rounded-2xl bg-white/90 dark:bg-darkbg-800/90 border border-black/5 dark:border-white/10 flex items-start gap-2.5 text-xs">
                        <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            Suggested Solution:{' '}
                          </span>
                          <span className="text-slate-600 dark:text-slate-300">
                            {conflict.suggestedSolution}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="shrink-0 flex items-center">
                      <button
                        onClick={() => fixConflict(conflict.id)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 dark:bg-brand-600 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Fix Automatically</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
