import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { ClassItem, DayOfWeek, Department, RoomType } from '../../types';
import { X, Check, BookOpen, Clock, Users, Building, Laptop } from 'lucide-react';

interface ClassModalProps {
  initialData?: ClassItem | null;
  onClose: () => void;
}

export const ClassModal: React.FC<ClassModalProps> = ({ initialData, onClose }) => {
  const { rooms, instructors, addClass, updateClass } = useTimetable();

  const [courseCode, setCourseCode] = useState(initialData?.courseCode || '');
  const [courseName, setCourseName] = useState(initialData?.courseName || '');
  const [department, setDepartment] = useState<Department>(
    initialData?.department || 'Computer Science'
  );
  const [semester, setSemester] = useState(initialData?.semester || 'Semester 3');
  const [section, setSection] = useState(initialData?.section || 'CSE-A');
  const [instructorId, setInstructorId] = useState(
    initialData?.instructorId || instructors[0]?.id || ''
  );
  const [studentCount, setStudentCount] = useState(initialData?.studentCount || 50);
  const [day, setDay] = useState<DayOfWeek>(initialData?.day || 'Monday');
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '10:00');
  const [roomId, setRoomId] = useState(initialData?.roomId || rooms[0]?.id || '');
  const [roomTypeNeeded, setRoomTypeNeeded] = useState<RoomType>(
    initialData?.roomTypeNeeded || 'Classroom'
  );
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>(
    initialData?.requiredEquipment || ['Projector']
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    initialData?.priority || 'medium'
  );

  const departments: Department[] = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Mathematics',
    'Information Tech',
    'Physics',
  ];

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const roomTypes: RoomType[] = [
    'Classroom',
    'Computer Lab',
    'Lecture Hall',
    'Seminar Room',
    'Science Lab',
  ];
  const equipmentOptions = ['Projector', 'Smart Board', 'Computer Lab', 'AC', 'Audio System'];

  const toggleEquipment = (eq: string) => {
    setRequiredEquipment((prev) =>
      prev.includes(eq) ? prev.filter((item) => item !== eq) : [...prev, eq]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) return;

    if (initialData) {
      updateClass(initialData.id, {
        courseCode,
        courseName,
        department,
        semester,
        section,
        instructorId,
        studentCount,
        day,
        startTime,
        endTime,
        roomId,
        roomTypeNeeded,
        requiredEquipment,
        priority,
      });
    } else {
      addClass({
        courseCode,
        courseName,
        department,
        semester,
        section,
        instructorId,
        studentCount,
        day,
        startTime,
        endTime,
        roomId,
        roomTypeNeeded,
        requiredEquipment,
        priority,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-darkbg-800 p-6 sm:p-8 shadow-2xl border border-brand-200/80 dark:border-brand-900/60 space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-100 dark:border-brand-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-700 dark:text-brand-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {initialData ? 'Edit Class Details' : 'Add New Class'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure timing, room constraints, and student cohort.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkbg-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Code, Title, Dept */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CSE301"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Data Structures & Algorithms"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Row 2: Department, Semester, Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="Semester 3"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Section / Cohort
              </label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="CSE-A"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Row 3: Instructor & Student Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Faculty Instructor
              </label>
              <select
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {instructors.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.title} {i.name} ({i.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student Count (Capacity Req)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Row 4: Day, Start Time, End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Day
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Row 5: Room Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Room Requirement Type
              </label>
              <select
                value={roomTypeNeeded}
                onChange={(e) => setRoomTypeNeeded(e.target.value as RoomType)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {roomTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Scheduling Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="high">High (Core Courses)</option>
                <option value="medium">Medium (Electives)</option>
                <option value="low">Low (Tutorials/Labs)</option>
              </select>
            </div>
          </div>

          {/* Row 6: Required Equipment Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Equipment Requirements
            </label>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((eq) => {
                const checked = requiredEquipment.includes(eq);
                return (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => toggleEquipment(eq)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      checked
                        ? 'bg-orange-500 border-orange-500 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-darkbg-700 border-slate-200 dark:border-brand-900/50 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {eq}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-100 dark:border-brand-900/40">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darkbg-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Save Changes' : 'Add Class'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
