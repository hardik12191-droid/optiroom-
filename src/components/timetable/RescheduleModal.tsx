import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { ClassItem, DayOfWeek } from '../../types';
import { X, Calendar, Clock, DoorOpen, User, Check } from 'lucide-react';

interface RescheduleModalProps {
  classItem: ClassItem | null;
  onClose: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ classItem, onClose }) => {
  const { rooms, instructors, updateClass } = useTimetable();

  if (!classItem) return null;

  const [day, setDay] = useState<DayOfWeek>(classItem.day);
  const [startTime, setStartTime] = useState(classItem.startTime);
  const [endTime, setEndTime] = useState(classItem.endTime);
  const [roomId, setRoomId] = useState(classItem.roomId);
  const [instructorId, setInstructorId] = useState(classItem.instructorId);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateClass(classItem.id, {
      day,
      startTime,
      endTime,
      roomId,
      instructorId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-darkbg-800 p-6 sm:p-7 shadow-2xl border border-brand-200/80 dark:border-brand-900/60 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-100 dark:border-brand-900/40 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 text-xs font-black">
                {classItem.courseCode}
              </span>
              <span className="text-xs font-bold text-slate-500">{classItem.section}</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              Reschedule & Reassign
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkbg-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Day selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Scheduled Day
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {days.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDay(d)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                    day === d
                      ? 'bg-brand-500 border-brand-500 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-darkbg-700 border-slate-200 dark:border-brand-900/50 text-slate-700 dark:text-slate-300 hover:border-brand-300'
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {timeSlots.slice(0, -1).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {timeSlots.slice(1).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Room selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Classroom / Lecture Hall
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.roomNumber} ({r.type} • Cap: {r.capacity})
                </option>
              ))}
            </select>
          </div>

          {/* Instructor selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assigned Instructor
            </label>
            <select
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {instructors.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.title} {inst.name} ({inst.department})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-100 dark:border-brand-900/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darkbg-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Update Schedule Slot</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
