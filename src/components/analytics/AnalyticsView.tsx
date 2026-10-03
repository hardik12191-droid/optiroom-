import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { RoomHeatmap } from './RoomHeatmap';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  DoorOpen,
  Users,
  Sparkles,
  Calendar,
  Layers,
  Clock,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { classes, rooms, instructors, optimizationResult } = useTimetable();

  // Hourly density calculation
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  const hourlyDensity = hours.map((h) => {
    const hourVal = parseInt(h.split(':')[0], 10);
    const count = classes.filter((c) => {
      const startH = parseInt(c.startTime.split(':')[0], 10);
      const endH = parseInt(c.endTime.split(':')[0], 10);
      return hourVal >= startH && hourVal < endH;
    }).length;
    return { hour: h, count };
  });

  const maxDensity = Math.max(...hourlyDensity.map((d) => d.count), 1);

  // Department distribution
  const deptMap: Record<string, number> = {};
  for (const c of classes) {
    deptMap[c.department] = (deptMap[c.department] || 0) + 1;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-darkbg-800 p-6 rounded-3xl border border-brand-100 dark:border-brand-900/50 shadow-soft">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
            Academic Business Intelligence
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Campus Analytics & Utilization
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time space occupancy analytics, faculty workload curves, and hourly peak distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 text-xs font-extrabold border border-orange-200 dark:border-orange-800/40">
            {classes.length} Classes Analyzed
          </span>
        </div>
      </div>

      {/* Primary Heatmap Component */}
      <RoomHeatmap />

      {/* 2-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hourly Peak Usage Density Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-brand-100 dark:border-brand-900/40 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Temporal Congestion
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Hourly Peak Classroom Usage
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
              Peak: 09:00 - 11:00
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Concurrent lectures in progress at each time slot across Monday - Saturday.
          </p>

          <div className="pt-4 flex items-end gap-3 h-48 justify-between px-2">
            {hourlyDensity.map((d) => {
              const heightPct = Math.round((d.count / maxDensity) * 100);
              const isPeak = d.count === maxDensity;

              return (
                <div key={d.hour} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-darkbg-900 rounded-t-xl h-36 flex items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        isPeak
                          ? 'bg-gradient-to-t from-orange-600 to-amber-400 shadow-md shadow-orange-500/25'
                          : 'bg-gradient-to-t from-brand-600 to-emerald-400'
                      }`}
                      style={{ height: `${Math.max(15, heightPct)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                    {d.hour.slice(0, 2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Classroom Load Distribution Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-brand-100 dark:border-brand-900/40 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Room Load Factor
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Classes Scheduled per Room
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {rooms.length} Total Facilities
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {rooms.slice(0, 6).map((room) => {
              const assigned = classes.filter((c) => c.roomId === room.id);
              const maxPossible = 10;
              const pct = Math.min(100, Math.round((assigned.length / maxPossible) * 100));

              return (
                <div key={room.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                      {room.roomNumber} ({room.type})
                    </span>
                    <span className="font-mono text-slate-500">
                      {assigned.length} classes ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-darkbg-900 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-brand-500 to-orange-500 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Faculty Workload Table Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-brand-100 dark:border-brand-900/40 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Teaching Compliance
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Faculty Workload & Allocation
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {instructors.length} Instructors Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-brand-900/40 text-[10px] font-black uppercase text-slate-400">
                <th className="py-2.5 px-3">Faculty Member</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Classes</th>
                <th className="py-2.5 px-3">Weekly Hours</th>
                <th className="py-2.5 px-3">Capacity Utilization</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-brand-900/30">
              {instructors.map((inst) => {
                const assigned = classes.filter((c) => c.instructorId === inst.id);
                const hours = assigned.length * 1.5;
                const ratio = Math.min(100, Math.round((hours / inst.maxWeeklyHours) * 100));

                return (
                  <tr key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-darkbg-700/20">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">
                      {inst.title} {inst.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      {inst.department}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-brand-700 dark:text-brand-400">
                      {assigned.length}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-200">
                      {hours} / {inst.maxWeeklyHours} hrs
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="w-32 bg-slate-100 dark:bg-darkbg-900 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-brand-500"
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
                        Balanced
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
