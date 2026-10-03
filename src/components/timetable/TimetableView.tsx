import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { ClassItem, DayOfWeek, Room, Instructor } from '../../types';
import { ClassCard } from './ClassCard';
import { RescheduleModal } from './RescheduleModal';
import { exportTimetableToPDF, exportTimetableToExcel, exportTimetableToCSV } from '../../utils/exportUtils';
import {
  CalendarDays,
  Filter,
  FileDown,
  Printer,
  Sparkles,
  Plus,
  AlertTriangle,
  RotateCcw,
  Clock,
  DoorOpen,
  Users,
  Search,
} from 'lucide-react';

export const TimetableView: React.FC = () => {
  const {
    classes,
    rooms,
    instructors,
    conflicts,
    optimizationResult,
    runOptimization,
    isOptimizing,
    deleteClass,
    setActiveTab,
    selectedUniversity,
    selectedSemester,
  } = useTimetable();

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('All');
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('All');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('All');
  const [mobileDay, setMobileDay] = useState<DayOfWeek>('Monday');

  // Reschedule / Edit modals
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Time grid rows from 08:00 to 17:00
  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const roomMap = new Map<string, Room>(rooms.map((r) => [r.id, r]));
  const instructorMap = new Map<string, Instructor>(instructors.map((i) => [i.id, i]));

  // Unique departments for filter
  const departments = ['All', ...Array.from(new Set(classes.map((c) => c.department)))];
  const semestersList = ['All', 'Semester 3', 'Semester 5', 'Semester 7'];

  // Filtered classes
  const filteredClasses = classes.filter((c) => {
    if (selectedDept !== 'All' && c.department !== selectedDept) return false;
    if (selectedRoomId !== 'All' && c.roomId !== selectedRoomId) return false;
    if (selectedInstructorId !== 'All' && c.instructorId !== selectedInstructorId) return false;
    if (selectedSemesterFilter !== 'All' && c.semester !== selectedSemesterFilter) return false;
    return true;
  });

  // Check if a class starts in this hour slot
  const getClassesForSlot = (day: DayOfWeek, slotTime: string) => {
    const slotHour = parseInt(slotTime.split(':')[0], 10);
    return filteredClasses.filter((c) => {
      if (c.day !== day) return false;
      const classStartHour = parseInt(c.startTime.split(':')[0], 10);
      return classStartHour === slotHour;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-darkbg-800 p-6 rounded-3xl border border-brand-100 dark:border-brand-900/50 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
              Interactive Grid
            </span>
            {conflicts.length > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                {conflicts.length} Clashes
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Weekly Master Timetable
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click any lecture to reschedule timing, change room, or reassign faculty.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => runOptimization()}
            disabled={isOptimizing}
            className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 rounded-xl shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-citrus-300 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Minimizing...' : 'Minimize Rooms'}</span>
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className="px-3.5 py-2.5 text-xs font-bold text-brand-900 dark:text-brand-200 bg-brand-50 dark:bg-darkbg-700 hover:bg-brand-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Add Class</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-darkbg-700 p-1 rounded-xl">
            <button
              onClick={() =>
                exportTimetableToPDF(
                  classes,
                  rooms,
                  instructors,
                  optimizationResult,
                  selectedUniversity,
                  selectedSemester
                )
              }
              className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-darkbg-600 rounded-lg shadow-2xs transition-all flex items-center gap-1.5"
              title="Export as high-res PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-orange-500" />
              <span>PDF</span>
            </button>

            <button
              onClick={() => exportTimetableToExcel(classes, rooms, instructors, optimizationResult)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-darkbg-600 rounded-lg shadow-2xs transition-all flex items-center gap-1.5"
              title="Export as Excel .xlsx"
            >
              <FileDown className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Excel</span>
            </button>

            <button
              onClick={() => exportTimetableToCSV(classes, rooms, instructors)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-darkbg-600 rounded-lg shadow-2xs transition-all flex items-center gap-1.5"
              title="Export as CSV"
            >
              <span>CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg"
              title="Print Timetable"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 dark:bg-darkbg-800/80 backdrop-blur-md p-4 rounded-2xl border border-brand-100 dark:border-brand-900/40 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Filter className="w-4 h-4 text-orange-500" />
            <span>Filters:</span>
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                Dept: {dept}
              </option>
            ))}
          </select>

          {/* Room Filter */}
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Classrooms</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomNumber} ({r.type})
              </option>
            ))}
          </select>

          {/* Instructor Filter */}
          <select
            value={selectedInstructorId}
            onChange={(e) => setSelectedInstructorId(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Instructors</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.title} {i.name}
              </option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            value={selectedSemesterFilter}
            onChange={(e) => setSelectedSemesterFilter(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {semestersList.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Semesters' : s}
              </option>
            ))}
          </select>

          {(selectedDept !== 'All' ||
            selectedRoomId !== 'All' ||
            selectedInstructorId !== 'All' ||
            selectedSemesterFilter !== 'All') && (
            <button
              onClick={() => {
                setSelectedDept('All');
                setSelectedRoomId('All');
                setSelectedInstructorId('All');
                setSelectedSemesterFilter('All');
              }}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Comp Science</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-slate-600 dark:text-slate-400">Electronics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-teal-500" />
            <span className="text-slate-600 dark:text-slate-400">Math</span>
          </div>
        </div>
      </div>

      {/* Mobile Day Selector Tabs */}
      <div className="lg:hidden flex overflow-x-auto gap-2 pb-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setMobileDay(d)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              mobileDay === d
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white dark:bg-darkbg-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-brand-900/50'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Desktop Weekly Grid Table */}
      <div className="hidden lg:block overflow-x-auto rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-brand-100 dark:border-brand-900/50 bg-brand-50/60 dark:bg-darkbg-900/60">
              <th className="py-4 px-4 text-left text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24 border-r border-brand-100 dark:border-brand-900/40">
                Time
              </th>
              {days.map((d) => {
                const dayClasses = filteredClasses.filter((c) => c.day === d);
                return (
                  <th
                    key={d}
                    className="py-4 px-4 text-left text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight border-r border-brand-100 dark:border-brand-900/40 last:border-r-0"
                  >
                    <div className="flex items-center justify-between">
                      <span>{d}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-brand-100 dark:bg-darkbg-700 text-brand-800 dark:text-brand-300">
                        {dayClasses.length}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, idx) => {
              const isLunch = time === '13:00';
              return (
                <tr
                  key={time}
                  className={`border-b border-brand-100 dark:border-brand-900/40 last:border-b-0 ${
                    isLunch ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''
                  }`}
                >
                  {/* Time column */}
                  <td className="py-3 px-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 border-r border-brand-100 dark:border-brand-900/40 align-top bg-slate-50/40 dark:bg-darkbg-900/30">
                    <div>{time}</div>
                    {isLunch && (
                      <span className="text-[10px] font-bold text-amber-600 block mt-1">
                        Lunch Hr
                      </span>
                    )}
                  </td>

                  {/* Day cells */}
                  {days.map((day) => {
                    const slotClasses = getClassesForSlot(day, time);

                    return (
                      <td
                        key={day}
                        className="p-2 border-r border-brand-100 dark:border-brand-900/40 last:border-r-0 align-top min-w-[170px] h-28 hover:bg-brand-50/30 dark:hover:bg-darkbg-700/20 transition-colors"
                      >
                        {slotClasses.length > 0 ? (
                          <div className="space-y-2">
                            {slotClasses.map((cls) => (
                              <ClassCard
                                key={cls.id}
                                classItem={cls}
                                room={roomMap.get(cls.roomId)}
                                instructor={instructorMap.get(cls.instructorId)}
                                conflicts={conflicts}
                                onEdit={(c) => setEditingClass(c)}
                                onDelete={(id) => deleteClass(id)}
                                onReschedule={(c) => setEditingClass(c)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[11px] text-slate-300 dark:text-slate-600 font-medium">
                            Free
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Day Schedule Card List */}
      <div className="lg:hidden space-y-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/40">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-3">
            {mobileDay} Schedule
          </h3>

          <div className="space-y-3">
            {timeSlots.map((time) => {
              const slotClasses = getClassesForSlot(mobileDay, time);
              if (slotClasses.length === 0) return null;

              return (
                <div key={time} className="space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-400">{time}</div>
                  {slotClasses.map((cls) => (
                    <ClassCard
                      key={cls.id}
                      classItem={cls}
                      room={roomMap.get(cls.roomId)}
                      instructor={instructorMap.get(cls.instructorId)}
                      conflicts={conflicts}
                      onEdit={(c) => setEditingClass(c)}
                      onDelete={(id) => deleteClass(id)}
                      onReschedule={(c) => setEditingClass(c)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {editingClass && (
        <RescheduleModal
          classItem={editingClass}
          onClose={() => setEditingClass(null)}
        />
      )}
    </div>
  );
};
