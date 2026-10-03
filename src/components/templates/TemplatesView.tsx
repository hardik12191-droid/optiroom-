import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { scheduleTemplates } from '../../data/templatesData';
import { ScheduleTemplate } from '../../types';
import {
  BookmarkCheck,
  Cpu,
  Code,
  GraduationCap,
  FileCheck,
  Zap,
  Building2,
  DoorOpen,
  BookOpen,
  Calendar,
  Check,
  ArrowRight,
  Eye,
  X,
} from 'lucide-react';

export const TemplatesView: React.FC = () => {
  const { applyTemplate, setActiveTab } = useTimetable();
  const [previewTemplate, setPreviewTemplate] = useState<ScheduleTemplate | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return Cpu;
      case 'Code':
        return Code;
      case 'GraduationCap':
        return GraduationCap;
      case 'FileCheck':
        return FileCheck;
      case 'Zap':
        return Zap;
      case 'Building2':
        return Building2;
      default:
        return BookmarkCheck;
    }
  };

  const handleApply = (id: string) => {
    applyTemplate(id);
    setActiveTab('timetable');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-darkbg-800 p-6 rounded-3xl border border-brand-100 dark:border-brand-900/50 shadow-soft">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
            Pre-Configured Blueprints
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Academic Schedule Templates ({scheduleTemplates.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instantly load production-ready datasets tailored for engineering, computer science, general university, or exam periods.
          </p>
        </div>

        <div className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-darkbg-700 px-3.5 py-2 rounded-xl">
          1-Click Instant Activation
        </div>
      </div>

      {/* Templates Grid (6 Templates) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scheduleTemplates.map((tpl) => {
          const Icon = getIcon(tpl.iconName);

          return (
            <div
              key={tpl.id}
              className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 group"
            >
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-orange-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
                    {tpl.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
                  {tpl.subtitle}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Specs Box */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-darkbg-700/60 border border-slate-100 dark:border-brand-900/40">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Days</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                      {tpl.daysCount}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-darkbg-700/60 border border-slate-100 dark:border-brand-900/40">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">
                      Classes
                    </span>
                    <span className="text-sm font-black text-brand-700 dark:text-brand-400">
                      {tpl.classesCount}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-darkbg-700/60 border border-slate-100 dark:border-brand-900/40">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Rooms</span>
                    <span className="text-sm font-black text-orange-600 dark:text-orange-400">
                      {tpl.roomsCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-brand-100 dark:border-brand-900/40 flex items-center gap-2">
                <button
                  onClick={() => setPreviewTemplate(tpl)}
                  className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darkbg-700 transition-colors"
                  title="Quick Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleApply(tpl.id)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Use Template</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-darkbg-800 p-6 sm:p-7 shadow-2xl border border-brand-200 dark:border-brand-900/60 space-y-5">
            <div className="flex items-center justify-between border-b border-brand-100 dark:border-brand-900/40 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-orange-600 dark:text-orange-400">
                  {previewTemplate.category}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {previewTemplate.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {previewTemplate.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400">
                Sample Courses Included ({previewTemplate.classes.length}):
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {previewTemplate.classes.slice(0, 10).map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 text-xs border border-slate-200/60 dark:border-brand-900/40"
                  >
                    <span className="font-bold text-brand-700 dark:text-brand-300">
                      {c.courseCode}
                    </span>{' '}
                    - {c.courseName}
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {c.day} • {c.startTime} - {c.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-100 dark:border-brand-900/40">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close Preview
              </button>
              <button
                onClick={() => handleApply(previewTemplate.id)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Load This Template</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
