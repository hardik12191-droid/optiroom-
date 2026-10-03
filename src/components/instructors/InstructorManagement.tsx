import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { Instructor, Department } from '../../types';
import {
  Users,
  Plus,
  BookOpen,
  Clock,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Search,
  X,
  Check,
} from 'lucide-react';

export const InstructorManagement: React.FC = () => {
  const { instructors, classes, conflicts, addInstructor, updateInstructor, deleteInstructor } =
    useTimetable();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<Instructor | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Dr.');
  const [department, setDepartment] = useState<Department>('Computer Science');
  const [email, setEmail] = useState('');
  const [maxWeeklyHours, setMaxWeeklyHours] = useState(18);

  const departments: Department[] = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Mathematics',
    'Information Tech',
    'Physics',
  ];

  const handleOpenModal = (inst?: Instructor) => {
    if (inst) {
      setEditingInst(inst);
      setName(inst.name);
      setTitle(inst.title);
      setDepartment(inst.department);
      setEmail(inst.email);
      setMaxWeeklyHours(inst.maxWeeklyHours);
    } else {
      setEditingInst(null);
      setName('');
      setTitle('Dr.');
      setDepartment('Computer Science');
      setEmail('');
      setMaxWeeklyHours(18);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingInst) {
      updateInstructor(editingInst.id, {
        name,
        title,
        department,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@apexuniv.edu`,
        maxWeeklyHours,
      });
    } else {
      addInstructor({
        name,
        title,
        department,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@apexuniv.edu`,
        maxWeeklyHours,
        assignedClassIds: [],
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      });
    }
    setIsModalOpen(false);
  };

  const filtered = instructors.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || inst.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-darkbg-800 p-6 rounded-3xl border border-brand-100 dark:border-brand-900/50 shadow-soft">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
            Faculty Directory
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Faculty & Instructors ({instructors.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor teaching workloads, course allocations, and prevent double-booking faculty clashes.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 dark:bg-darkbg-800/80 backdrop-blur-md p-4 rounded-2xl border border-brand-100 dark:border-brand-900/40 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search faculty by name or email..."
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
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {filtered.length} active faculty profiles
        </div>
      </div>

      {/* Instructor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inst) => {
          const assigned = classes.filter((c) => c.instructorId === inst.id);
          const totalHours = Number((assigned.length * 1.5).toFixed(1));
          const hasClash = conflicts.some(
            (c) => c.type === 'instructor_clash' && c.instructorId === inst.id
          );

          return (
            <div
              key={inst.id}
              className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 group"
            >
              <div>
                {/* Header: Avatar, Name, Conflict Tag */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-orange-400 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                      {inst.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
                        {inst.title} {inst.name}
                      </h3>
                      <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                        {inst.department}
                      </p>
                    </div>
                  </div>

                  {hasClash ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Clash
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 dark:bg-darkbg-700 text-brand-700 dark:text-brand-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-brand-500" />
                      0 Clashes
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{inst.email}</span>
                </div>

                {/* Workload Stats */}
                <div className="mt-5 grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-darkbg-700/60 border border-slate-100 dark:border-brand-900/40">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Classes
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono">
                      {assigned.length}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-darkbg-700/60 border border-slate-100 dark:border-brand-900/40">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Weekly Hours
                    </span>
                    <span className="text-lg font-black text-orange-600 dark:text-orange-400 font-mono">
                      {totalHours} / {inst.maxWeeklyHours}
                    </span>
                  </div>
                </div>

                {/* Assigned Courses preview */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Teaching Schedule
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto custom-scrollbar">
                    {assigned.map((cls) => (
                      <span
                        key={cls.id}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-50 dark:bg-darkbg-700 text-brand-800 dark:text-brand-300 border border-brand-200/60 dark:border-brand-900/40"
                      >
                        {cls.courseCode} ({cls.day.slice(0, 3)})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-brand-100 dark:border-brand-900/40 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  {inst.availableDays ? inst.availableDays.join(', ').slice(0, 24) + '...' : 'Mon-Fri'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(inst)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteInstructor(inst.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-darkbg-800 p-6 sm:p-7 shadow-2xl border border-brand-200/80 dark:border-brand-900/60 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-100 dark:border-brand-900/40 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {editingInst ? 'Edit Faculty Details' : 'Add Faculty Member'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Assoc. Prof.">Assoc. Prof.</option>
                    <option value="Asst. Prof.">Asst. Prof.</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  placeholder="faculty@apexuniv.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Max Weekly Teaching Hours
                </label>
                <input
                  type="number"
                  min="6"
                  max="35"
                  value={maxWeeklyHours}
                  onChange={(e) => setMaxWeeklyHours(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-100 dark:border-brand-900/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingInst ? 'Save Changes' : 'Register Faculty'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
