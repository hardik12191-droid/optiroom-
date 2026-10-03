import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { DayOfWeek, Room, ClassItem } from '../../types';
import { timeToMinutes } from '../../algorithms/intervalPartitioning';
import { Calendar, Info } from 'lucide-react';

export const RoomHeatmap: React.FC = () => {
  const { rooms, classes } = useTimetable();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const hours = [
    { label: '08 AM', hour: 8 },
    { label: '09 AM', hour: 9 },
    { label: '10 AM', hour: 10 },
    { label: '11 AM', hour: 11 },
    { label: '12 PM', hour: 12 },
    { label: '01 PM', hour: 13 },
    { label: '02 PM', hour: 14 },
    { label: '03 PM', hour: 15 },
    { label: '04 PM', hour: 16 },
    { label: '05 PM', hour: 17 },
  ];

  // Helper to find class in room at day & hour
  const getClassInSlot = (roomId: string, day: DayOfWeek, hour: number): ClassItem | undefined => {
    return classes.find((c) => {
      if (c.roomId !== roomId || c.day !== day) return false;
      const startH = parseInt(c.startTime.split(':')[0], 10);
      const endH = parseInt(c.endTime.split(':')[0], 10);
      const endM = parseInt(c.endTime.split(':')[1], 10);
      // is slot between start and end?
      const slotStart = hour * 60;
      const slotEnd = (hour + 1) * 60;
      const classStart = timeToMinutes(c.startTime);
      const classEnd = timeToMinutes(c.endTime);
      return Math.max(slotStart, classStart) < Math.min(slotEnd, classEnd);
    });
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-100 dark:border-brand-900/40 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Spatial Density Matrix
          </span>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
            Room Utilization Heatmap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time occupancy matrix across hours and physical classrooms.
          </p>
        </div>

        {/* Day buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 dark:bg-darkbg-700/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-brand-900/40">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedDay === d
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-brand-600'
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="py-2.5 px-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-36">
                Room
              </th>
              {hours.map((h) => (
                <th
                  key={h.hour}
                  className="py-2.5 px-2 text-center text-xs font-mono font-bold text-slate-500 dark:text-slate-400"
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100/50 dark:divide-brand-900/30">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-slate-50/50 dark:hover:bg-darkbg-700/20">
                <td className="py-2.5 px-3">
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {room.roomNumber}
                  </div>
                  <div className="text-[10px] text-slate-400">Cap: {room.capacity}</div>
                </td>

                {hours.map((h) => {
                  const assigned = getClassInSlot(room.id, selectedDay, h.hour);
                  const isLunch = h.hour === 13;

                  let cellBg = 'bg-slate-100/80 dark:bg-darkbg-900/80 text-slate-400';
                  let cellTitle = 'Vacant';

                  if (isLunch && !assigned) {
                    cellBg = 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-500';
                    cellTitle = 'Lunch Break';
                  } else if (assigned) {
                    if (assigned.department.includes('Computer')) {
                      cellBg =
                        'bg-emerald-500 text-white shadow-xs font-bold ring-1 ring-emerald-600';
                    } else if (assigned.department.includes('Electronics')) {
                      cellBg =
                        'bg-orange-500 text-white shadow-xs font-bold ring-1 ring-orange-600';
                    } else {
                      cellBg = 'bg-teal-500 text-white shadow-xs font-bold ring-1 ring-teal-600';
                    }
                    cellTitle = `${assigned.courseCode}: ${assigned.courseName} (${assigned.startTime}-${assigned.endTime})`;
                  }

                  return (
                    <td key={h.hour} className="p-1 text-center">
                      <div
                        className={`h-10 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all duration-200 cursor-pointer hover:scale-105 ${cellBg}`}
                        title={cellTitle}
                      >
                        {assigned ? (
                          <span className="truncate px-1">{assigned.courseCode}</span>
                        ) : isLunch ? (
                          <span className="text-[9px] opacity-60">Lunch</span>
                        ) : (
                          <span className="opacity-20">•</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500" />
            <span>CSE Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-orange-500" />
            <span>ECE Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-teal-500" />
            <span>Math & Other</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-100 dark:bg-darkbg-900 border border-slate-200 dark:border-slate-700" />
            <span>Vacant Period</span>
          </div>
        </div>

        <span className="font-semibold text-brand-700 dark:text-brand-300">
          Showing occupancy for {selectedDay}
        </span>
      </div>
    </div>
  );
};
