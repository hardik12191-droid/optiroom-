import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  ClassItem,
  Room,
  Instructor,
  ScheduleConflict,
  OptimizationResult,
  SchedulingPreferences,
  ActiveTab,
  DayOfWeek,
} from '../types';
import { initialClasses, initialRooms, initialInstructors, defaultPreferences } from '../data/sampleData';
import { scheduleTemplates } from '../data/templatesData';
import { detectAllConflicts } from '../algorithms/conflictDetector';
import { optimizeTimetableRooms } from '../algorithms/intervalPartitioning';

interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface TimetableContextType {
  classes: ClassItem[];
  rooms: Room[];
  instructors: Instructor[];
  conflicts: ScheduleConflict[];
  optimizationResult: OptimizationResult | null;
  preferences: SchedulingPreferences;
  activeTab: ActiveTab;
  selectedUniversity: string;
  selectedSemester: string;
  isDarkMode: boolean;
  searchQuery: string;
  isOptimizing: boolean;
  optimizationStepText: string;
  toasts: ToastInfo[];
  
  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedUniversity: (uni: string) => void;
  setSelectedSemester: (sem: string) => void;
  setSearchQuery: (query: string) => void;
  toggleDarkMode: () => void;
  
  // Entity management
  addClass: (newClass: Omit<ClassItem, 'id'>) => void;
  updateClass: (id: string, updates: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;
  
  addRoom: (newRoom: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  
  addInstructor: (newInstructor: Omit<Instructor, 'id'>) => void;
  updateInstructor: (id: string, updates: Partial<Instructor>) => void;
  deleteInstructor: (id: string) => void;
  
  // Optimization & Conflicts
  runOptimization: () => Promise<void>;
  fixConflict: (conflictId: string) => void;
  fixAllConflicts: () => void;
  
  // Preferences & Templates
  updatePreferences: (updates: Partial<SchedulingPreferences>) => void;
  applyTemplate: (templateId: string) => void;
  resetToDefaultData: () => void;
  
  // Toast & Feedback
  showToast: (title: string, message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  triggerConfetti: () => void;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const TimetableProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Local storage initialization or fallback to sample data
  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const saved = localStorage.getItem('opti_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('opti_rooms');
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    const saved = localStorage.getItem('opti_instructors');
    return saved ? JSON.parse(saved) : initialInstructors;
  });

  const [preferences, setPreferences] = useState<SchedulingPreferences>(() => {
    const saved = localStorage.getItem('opti_prefs');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>('landing');
  const [selectedUniversity, setSelectedUniversity] = useState('Apex Institute of Technology');
  const [selectedSemester, setSelectedSemester] = useState('Fall 2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('opti_theme') === 'dark';
  });

  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStepText, setOptimizationStepText] = useState('');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Dark mode class toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('opti_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('opti_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist state to local storage
  useEffect(() => {
    localStorage.setItem('opti_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('opti_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('opti_instructors', JSON.stringify(instructors));
  }, [instructors]);

  useEffect(() => {
    localStorage.setItem('opti_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // Recalculate conflicts automatically whenever schedule changes
  useEffect(() => {
    const detected = detectAllConflicts(classes, rooms, instructors);
    setConflicts(detected);
  }, [classes, rooms, instructors]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (
    title: string,
    message: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'info'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#16a34a', '#f97316', '#f59e0b', '#10b981'],
      });
    } catch (e) {
      // ignore
    }
  };

  // Class Actions
  const addClass = (newClass: Omit<ClassItem, 'id'>) => {
    const id = `cls-${Date.now()}`;
    const item: ClassItem = { ...newClass, id };
    setClasses((prev) => [...prev, item]);
    showToast('Class Added', `"${item.courseCode}" has been added to the schedule.`, 'success');
  };

  const updateClass = (id: string, updates: Partial<ClassItem>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Class Updated', 'Timetable slot updated successfully.', 'success');
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    showToast('Class Removed', 'The class was removed from schedule.', 'info');
  };

  // Room Actions
  const addRoom = (newRoom: Omit<Room, 'id'>) => {
    const id = `room-${Date.now()}`;
    const room: Room = { ...newRoom, id };
    setRooms((prev) => [...prev, room]);
    showToast('Room Added', `${room.roomNumber} is now available in inventory.`, 'success');
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    showToast('Room Updated', 'Classroom details saved.', 'success');
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    showToast('Room Removed', 'Classroom removed from system.', 'info');
  };

  // Instructor Actions
  const addInstructor = (newInstructor: Omit<Instructor, 'id'>) => {
    const id = `inst-${Date.now()}`;
    const inst: Instructor = { ...newInstructor, id };
    setInstructors((prev) => [...prev, inst]);
    showToast('Instructor Added', `${inst.title} ${inst.name} registered.`, 'success');
  };

  const updateInstructor = (id: string, updates: Partial<Instructor>) => {
    setInstructors((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    showToast('Faculty Profile Updated', 'Saved changes successfully.', 'success');
  };

  const deleteInstructor = (id: string) => {
    setInstructors((prev) => prev.filter((i) => i.id !== id));
    showToast('Instructor Removed', 'Instructor removed from faculty roster.', 'info');
  };

  // Optimization Studio Execution
  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationStepText('Analyzing class intervals and overlap density...');
    await new Promise((r) => setTimeout(r, 600));

    setOptimizationStepText('Calculating maximum theoretical clique bound χ(G)...');
    await new Promise((r) => setTimeout(r, 700));

    setOptimizationStepText('Checking instructor schedules & preventing double-bookings...');
    await new Promise((r) => setTimeout(r, 600));

    setOptimizationStepText('Matching room capacity & laboratory equipment requirements...');
    await new Promise((r) => setTimeout(r, 700));

    setOptimizationStepText('Executing Greedy Interval Partitioning room minimization...');
    await new Promise((r) => setTimeout(r, 600));

    const { optimizedClasses, result } = optimizeTimetableRooms(classes, rooms, {
      enforceRoomType: preferences.enforceEquipmentMatch,
      enforceCapacity: true,
      enforceEquipment: preferences.enforceEquipmentMatch,
    });

    setClasses(optimizedClasses);
    setOptimizationResult(result);
    setOptimizationStepText('Optimization Complete! Conflict-free minimum rooms assigned.');
    setIsOptimizing(false);

    triggerConfetti();
    showToast(
      'Rooms Minimized!',
      `Scheduled all classes into ${result.actualRoomsUsed} classrooms (Saved ${result.roomsSaved} rooms)!`,
      'success'
    );
  };

  // Conflict Resolution
  const fixConflict = (conflictId: string) => {
    const conflict = conflicts.find((c) => c.id === conflictId);
    if (!conflict) return;

    if (conflict.fixAction) {
      const { type, targetClassId, newRoomId, newDay, newStartTime, newEndTime } =
        conflict.fixAction;

      if (type === 'reassign_room' && newRoomId) {
        updateClass(targetClassId, { roomId: newRoomId });
        showToast('Conflict Resolved', `Reassigned class to non-overlapping room.`, 'success');
      } else if (type === 'reschedule_time' && newStartTime && newEndTime) {
        updateClass(targetClassId, { startTime: newStartTime, endTime: newEndTime });
        showToast('Conflict Resolved', `Shifted class timing to valid interval.`, 'success');
      } else {
        // Fallback to optimization
        runOptimization();
      }
    } else {
      // Run algorithmic optimizer to repartition rooms
      runOptimization();
    }
  };

  const fixAllConflicts = () => {
    runOptimization();
    showToast(
      'Automated Solver',
      'Running global interval partitioning to resolve all schedule clashes...',
      'info'
    );
  };

  const updatePreferences = (updates: Partial<SchedulingPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
    showToast('Preferences Saved', 'Updated scheduling constraint weights.', 'success');
  };

  const applyTemplate = (templateId: string) => {
    const tpl = scheduleTemplates.find((t) => t.id === templateId);
    if (tpl) {
      setClasses(JSON.parse(JSON.stringify(tpl.classes)));
      setRooms(JSON.parse(JSON.stringify(tpl.rooms)));
      setInstructors(JSON.parse(JSON.stringify(tpl.instructors)));
      showToast('Template Loaded', `Applied "${tpl.name}" successfully!`, 'success');
    }
  };

  const resetToDefaultData = () => {
    setClasses(initialClasses);
    setRooms(initialRooms);
    setInstructors(initialInstructors);
    setPreferences(defaultPreferences);
    setOptimizationResult(null);
    showToast('Reset Complete', 'Loaded clean initial academic data.', 'info');
  };

  return (
    <TimetableContext.Provider
      value={{
        classes,
        rooms,
        instructors,
        conflicts,
        optimizationResult,
        preferences,
        activeTab,
        selectedUniversity,
        selectedSemester,
        isDarkMode,
        searchQuery,
        isOptimizing,
        optimizationStepText,
        toasts,
        setActiveTab,
        setSelectedUniversity,
        setSelectedSemester,
        setSearchQuery,
        toggleDarkMode,
        addClass,
        updateClass,
        deleteClass,
        addRoom,
        updateRoom,
        deleteRoom,
        addInstructor,
        updateInstructor,
        deleteInstructor,
        runOptimization,
        fixConflict,
        fixAllConflicts,
        updatePreferences,
        applyTemplate,
        resetToDefaultData,
        showToast,
        dismissToast,
        triggerConfetti,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};
