import React from 'react';
import { ClassItem, Room, Instructor, ScheduleConflict } from '../../types';
import {
  Clock,
  MapPin,
  User,
  AlertTriangle,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowRightLeft,
} from 'lucide-react';

interface ClassCardProps {
  classItem: ClassItem;
  room?: Room;
  instructor?: Instructor;
  conflicts: ScheduleConflict[];
  onEdit: (cls: ClassItem) => void;
  onDelete: (id: string) => void;
  onReschedule: (cls: ClassItem) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  classItem,
  room,
  instructor,
  conflicts,
  onEdit,
  onDelete,
  onReschedule,
}) => {
  const isConflicting = conflicts.some((c) => c.classIds.includes(classItem.id));
  const activeConflict = conflicts.find((c) => c.classIds.includes(classItem.id));

  // Department-specific light green, orange, sage, and amber styling
  const getDeptStyle = (dept: string) => {
    if (dept.includes('Computer')) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/80',
        border: 'border-emerald-300 dark:border-emerald-700/60',
        badge: 'bg-emerald-600 text-white',
        text: 'text-emerald-950 dark:text-emerald-100',
        sub: 'text-emerald-700 dark:text-emerald-300',
      };
    }
    if (dept.includes('Electronics')) {
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100/80',
        border: 'border-orange-300 dark:border-orange-700/60',
        badge: 'bg-orange-600 text-white',
        text: 'text-orange-950 dark:text-orange-100',
        sub: 'text-orange-700 dark:text-orange-300',
      };
    }
    if (dept.includes('Math')) {
      return {
        bg: 'bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100/80',
        border: 'border-teal-300 dark:border-teal-700/60',
        badge: 'bg-teal-600 text-white',
        text: 'text-teal-950 dark:text-teal-100',
        sub: 'text-teal-700 dark:text-teal-300',
      };
    }
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100/80',
      border: 'border-amber-300 dark:border-amber-700/60',
      badge: 'bg-amber-600 text-white',
      text: 'text-amber-950 dark:text-amber-100',
      sub: 'text-amber-700 dark:text-amber-300',
    };
  };

  const style = getDeptStyle(classItem.department);

  return (
    <div
      className={`group relative p-2.5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer ${
        isConflicting
          ? 'bg-red-50 dark:bg-red-950/50 border-red-400 dark:border-red-600 ring-2 ring-red-400/40 animate-pulse'
          : `${style.bg} ${style.border}`
      }`}
      onClick={() => onReschedule(classItem)}
    >
      {/* Conflict badge if clashing */}
      {isConflicting && (
        <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black flex items-center gap-1 shadow-sm">
          <AlertTriangle className="w-2.5 h-2.5" />
          <span>CLASH</span>
        </div>
      )}

      {/* Header: Course Code & Section */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-black tracking-tight ${
            isConflicting ? 'bg-red-600 text-white' : style.badge
          }`}
        >
          {classItem.courseCode}
        </span>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
          {classItem.section}
        </span>
      </div>

      {/* Course Title */}
      <h4
        className={`text-xs font-bold leading-snug line-clamp-1 ${
          isConflicting ? 'text-red-950 dark:text-red-100' : style.text
        }`}
        title={classItem.courseName}
      >
        {classItem.courseName}
      </h4>

      {/* Time & Room Details */}
      <div className="mt-2 space-y-1 text-[11px]">
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="font-semibold">{classItem.startTime} - {classItem.endTime}</span>
        </div>

        <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-100">
          <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
          <span className="truncate">{room ? room.roomNumber : 'Unassigned'}</span>
        </div>

        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <User className="w-3 h-3 text-brand-600 dark:text-brand-400 shrink-0" />
          <span className="truncate">
            {instructor ? `${instructor.title} ${instructor.name}` : 'Unassigned'}
          </span>
        </div>
      </div>

      {/* Hover Quick Actions */}
      <div
        className="mt-2 pt-1.5 border-t border-black/5 dark:border-white/10 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onReschedule(classItem)}
          className="p-1 rounded text-slate-500 hover:text-brand-700 hover:bg-black/5 transition-colors"
          title="Reschedule / Change Room"
        >
          <ArrowRightLeft className="w-3 h-3" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(classItem)}
            className="p-1 rounded text-slate-500 hover:text-brand-700 hover:bg-black/5 transition-colors"
            title="Edit Details"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(classItem.id)}
            className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-black/5 transition-colors"
            title="Delete Class"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
