import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { ClassItem, Department, DayOfWeek } from '../../types';
import { ClassModal } from './ClassModal';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Users,
  Clock,
  MapPin,
  Calendar,
  LayoutGrid,
  List,
} from 'lucide-react';

export const ClassManagement: React.FC = () => {
  const { classes, rooms, instructors, deleteClass } = useTimetable();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const roomMap = new Map(rooms.map((r) => [r.id, r]));
  const instructorMap = new Map(instructors.map((i) => [i.id, i]));

  const departments = ['All', 'Computer Science', 'Electronics', 'Mathematics', 'Information Tech'];
  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filtered = classes.filter((c) => {
    const matchesSearch =
      c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.section.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || c.department === selectedDept;
    const matchesDay = selectedDay === 'All' || c.day === selectedDay;
    return matchesSearch && matchesDept && matchesDay;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-darkbg-800 p-6 rounded-3xl border border-brand-100 dark:border-brand-900/50 shadow-soft">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
            Curriculum Registry
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Class Management ({classes.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure courses, class cohort sizes, faculty assignments, and physical room requirements.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingClass(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white/80 dark:bg-darkbg-800/80 backdrop-blur-md p-4 rounded-2xl border border-brand-100 dark:border-brand-900/40 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, course name, section..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-slate-800 dark:text-slate-200"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-slate-800 dark:text-slate-200"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-darkbg-700 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-white dark:bg-darkbg-600 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-slate-500'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-darkbg-600 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-slate-500'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-100 dark:border-brand-900/40 bg-brand-50/50 dark:bg-darkbg-900/50 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Department & Cohort</th>
                <th className="py-3 px-4">Faculty Instructor</th>
                <th className="py-3 px-4">Day & Timing</th>
                <th className="py-3 px-4">Allocated Room</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100/60 dark:divide-brand-900/30 text-xs">
              {filtered.map((cls) => {
                const room = roomMap.get(cls.roomId);
                const inst = instructorMap.get(cls.instructorId);

                return (
                  <tr
                    key={cls.id}
                    className="hover:bg-brand-50/30 dark:hover:bg-darkbg-700/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 dark:text-slate-100">
                        {cls.courseCode}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                        {cls.courseName}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {cls.department}
                      </div>
                      <div className="text-[11px] text-orange-600 dark:text-orange-400 font-bold">
                        {cls.section} • {cls.semester}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {inst ? `${inst.title} ${inst.name}` : 'Unassigned'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {cls.day}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {cls.startTime} - {cls.endTime}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                        <MapPin className="w-3 h-3 text-orange-500" />
                        {room ? room.roomNumber : 'Unassigned'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {cls.studentCount}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingClass(cls);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteClass(cls.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cls) => {
            const room = roomMap.get(cls.roomId);
            const inst = instructorMap.get(cls.instructorId);

            return (
              <div
                key={cls.id}
                className="p-5 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft hover:shadow-lg transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 font-black text-xs">
                    {cls.courseCode}
                  </span>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    {cls.section}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {cls.courseName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cls.department} • {cls.semester}
                  </p>
                </div>

                <div className="pt-2 border-t border-brand-100/60 dark:border-brand-900/40 space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-brand-500" />
                    <span>
                      {cls.day} ({cls.startTime} - {cls.endTime})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>{room ? room.roomNumber : 'Unassigned Room'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{inst ? `${inst.title} ${inst.name}` : 'Unassigned'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-100/60 dark:border-brand-900/40 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingClass(cls);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteClass(cls.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ClassModal
          initialData={editingClass}
          onClose={() => {
            setIsModalOpen(false);
            setEditingClass(null);
          }}
        />
      )}
    </div>
  );
};
