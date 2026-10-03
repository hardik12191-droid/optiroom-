export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type RoomType = 'Classroom' | 'Computer Lab' | 'Lecture Hall' | 'Seminar Room' | 'Science Lab';

export type Department = 'Computer Science' | 'Electronics' | 'Mechanical' | 'Mathematics' | 'Information Tech' | 'Physics';

export interface Room {
  id: string;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  type: RoomType;
  equipment: string[];
  isAvailable: boolean;
  color?: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string; // e.g. Dr., Prof.
  department: Department;
  email: string;
  maxWeeklyHours: number;
  assignedClassIds: string[];
  availableDays?: DayOfWeek[];
}

export interface ClassItem {
  id: string;
  courseCode: string;
  courseName: string;
  department: Department;
  semester: string; // e.g. "Sem 3", "Sem 5"
  section: string; // e.g. "CSE-A", "ECE-B"
  instructorId: string;
  studentCount: number;
  day: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  roomId: string;
  roomTypeNeeded: RoomType;
  requiredEquipment: string[];
  priority: 'low' | 'medium' | 'high';
  color?: string;
}

export type ConflictType = 
  | 'room_overlap' 
  | 'instructor_clash' 
  | 'section_clash' 
  | 'invalid_time' 
  | 'capacity_exceeded' 
  | 'equipment_missing';

export interface ScheduleConflict {
  id: string;
  type: ConflictType;
  title: string;
  description: string;
  severity: 'critical' | 'warning';
  classIds: string[];
  roomId?: string;
  instructorId?: string;
  suggestedSolution: string;
  fixAction?: {
    type: 'reassign_room' | 'reschedule_time' | 'reassign_instructor';
    targetClassId: string;
    newRoomId?: string;
    newDay?: DayOfWeek;
    newStartTime?: string;
    newEndTime?: string;
  };
}

export interface OptimizationResult {
  theoreticalMinRooms: number;
  actualRoomsUsed: number;
  originalRoomsUsed: number;
  roomsSaved: number;
  efficiencyGainPercentage: number;
  maxSimultaneousClassesPerDay: Record<DayOfWeek, number>;
  explanations: string[];
  peakDay: DayOfWeek;
  peakHour: string;
  timestamp: string;
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  daysCount: number;
  periodsPerDay: number;
  roomsCount: number;
  classesCount: number;
  iconName: string;
  badge: string;
  classes: ClassItem[];
  rooms: Room[];
  instructors: Instructor[];
}

export interface SchedulingPreferences {
  maxClassesPerDay: number;
  lunchBreakStart: string; // "12:00"
  lunchBreakEnd: string;   // "13:00"
  avoidConsecutiveClasses: boolean;
  maxDailyInstructorHours: number;
  enforceEquipmentMatch: boolean;
  enforceCapacityBuffer: number; // percentage buffer, e.g. 0% or 10%
  prioritizeMorningSlots: boolean;
}

export type ActiveTab = 
  | 'landing'
  | 'dashboard'
  | 'timetable'
  | 'classes'
  | 'rooms'
  | 'instructors'
  | 'conflicts'
  | 'optimization'
  | 'analytics'
  | 'templates'
  | 'wizard'
  | 'settings';
