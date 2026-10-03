import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import {
  Settings,
  Clock,
  Coffee,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Building,
  Save,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { preferences, updatePreferences, resetToDefaultData, showToast } = useTimetable();

  const handleToggle = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-darkbg-800 p-6 sm:p-8 rounded-3xl border border-brand-100 dark:border-brand-900/50 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
            System Configuration
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Scheduling Preferences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure algorithmic rules, break periods, capacity tolerances, and institutional policies.
          </p>
        </div>

        <button
          onClick={resetToDefaultData}
          className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-darkbg-700 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Preferences Form Sections */}
      <div className="space-y-6">
        {/* Section 1: Timing & Breaks */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-100 dark:border-brand-900/40 pb-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Timetable Slots & Breaks
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lunch Break Start
              </label>
              <input
                type="time"
                value={preferences.lunchBreakStart}
                onChange={(e) => updatePreferences({ lunchBreakStart: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lunch Break End
              </label>
              <input
                type="time"
                value={preferences.lunchBreakEnd}
                onChange={(e) => updatePreferences({ lunchBreakEnd: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Maximum Classes Per Student Cohort / Day
              </label>
              <input
                type="number"
                min="4"
                max="9"
                value={preferences.maxClassesPerDay}
                onChange={(e) => updatePreferences({ maxClassesPerDay: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Maximum Faculty Daily Teaching Hours
              </label>
              <input
                type="number"
                min="3"
                max="8"
                value={preferences.maxDailyInstructorHours}
                onChange={(e) =>
                  updatePreferences({ maxDailyInstructorHours: Number(e.target.value) })
                }
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Constraint Switches */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-100 dark:border-brand-900/40 pb-3">
            <Sliders className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Algorithmic Enforcement Rules
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-darkbg-700/50 border border-slate-200/60 dark:border-brand-900/40">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Enforce Strict Equipment Compatibility
                </h4>
                <p className="text-[11px] text-slate-500">
                  Disallow assigning a class to a room lacking required projectors or lab computers.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.enforceEquipmentMatch}
                onChange={() => handleToggle('enforceEquipmentMatch')}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-darkbg-700/50 border border-slate-200/60 dark:border-brand-900/40">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Prioritize Morning Time Slots
                </h4>
                <p className="text-[11px] text-slate-500">
                  Schedule core theoretical subjects (Data Structures, Math) before 12:00 PM.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.prioritizeMorningSlots}
                onChange={() => handleToggle('prioritizeMorningSlots')}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-darkbg-700/50 border border-slate-200/60 dark:border-brand-900/40">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Avoid Consecutive 3-Hour Lectures
                </h4>
                <p className="text-[11px] text-slate-500">
                  Inserts 30-minute cognitive breaks between intensive lecture blocks.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.avoidConsecutiveClasses}
                onChange={() => handleToggle('avoidConsecutiveClasses')}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
