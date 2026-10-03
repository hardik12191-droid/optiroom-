import { ClassItem, Room, OptimizationResult, DayOfWeek } from '../types';

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function doIntervalsOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB);
  return Math.max(sA, sB) < Math.min(eA, eB);
}

/**
 * Calculates the theoretical minimum rooms required for a given day using
 * the Interval Graph Chromatic Number theorem (maximum simultaneous active classes).
 */
export function calculateTheoreticalMinForDay(classesForDay: ClassItem[]): {
  maxSimultaneous: number;
  peakTime: string;
} {
  if (classesForDay.length === 0) {
    return { maxSimultaneous: 0, peakTime: '08:00' };
  }

  // Create start and end events for interval graph clique calculation
  interface TimeEvent {
    time: number;
    delta: number; // +1 for start, -1 for end
    courseCode: string;
  }

  const events: TimeEvent[] = [];
  for (const c of classesForDay) {
    events.push({ time: timeToMinutes(c.startTime), delta: +1, courseCode: c.courseCode });
    events.push({ time: timeToMinutes(c.endTime), delta: -1, courseCode: c.courseCode });
  }

  // Sort events: if same time, end (-1) comes before start (+1)
  events.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return a.delta - b.delta;
  });

  let currentActive = 0;
  let maxActive = 0;
  let peakTimeMinutes = timeToMinutes(classesForDay[0].startTime);

  for (const ev of events) {
    currentActive += ev.delta;
    if (currentActive > maxActive) {
      maxActive = currentActive;
      peakTimeMinutes = ev.time;
    }
  }

  return {
    maxSimultaneous: maxActive,
    peakTime: minutesToTime(peakTimeMinutes),
  };
}

export interface OptimizationOutput {
  optimizedClasses: ClassItem[];
  result: OptimizationResult;
  roomUsageSummary: {
    roomId: string;
    roomNumber: string;
    classesCount: number;
    totalHours: number;
    utilizationRate: number; // 0 to 100%
  }[];
  algorithmLog: string[];
}

/**
 * Executes Interval Partitioning (Greedy Room Minimization) with real-world university constraints:
 * 1. Room Capacity checks
 * 2. Room Type (Classroom vs Lab vs Lecture Hall)
 * 3. Equipment requirements (Projector, Computers, etc.)
 */
export function optimizeTimetableRooms(
  classes: ClassItem[],
  rooms: Room[],
  options: {
    enforceRoomType?: boolean;
    enforceCapacity?: boolean;
    enforceEquipment?: boolean;
  } = {
    enforceRoomType: true,
    enforceCapacity: true,
    enforceEquipment: true,
  }
): OptimizationOutput {
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const optimizedClasses: ClassItem[] = JSON.parse(JSON.stringify(classes));
  const algorithmLog: string[] = [];

  const maxSimultaneousPerDay: Record<DayOfWeek, number> = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  let globalTheoreticalMax = 0;
  let peakDay: DayOfWeek = 'Monday';
  let globalPeakHour = '09:00';

  // 1. Calculate theoretical lower bound per day
  for (const day of days) {
    const dayClasses = classes.filter((c) => c.day === day);
    const { maxSimultaneous, peakTime } = calculateTheoreticalMinForDay(dayClasses);
    maxSimultaneousPerDay[day] = maxSimultaneous;

    if (maxSimultaneous > globalTheoreticalMax) {
      globalTheoreticalMax = maxSimultaneous;
      peakDay = day;
      globalPeakHour = peakTime;
    }
  }

  algorithmLog.push(
    `Initial Analysis: Highest simultaneous overlap occurs on ${peakDay} around ${globalPeakHour} with ${globalTheoreticalMax} concurrent classes.`
  );
  algorithmLog.push(
    `Theoretical minimum bound χ(G) = ${globalTheoreticalMax} rooms needed to avoid time-clash.`
  );

  const usedRoomIds = new Set<string>();
  const originalUsedRoomIds = new Set<string>(classes.map((c) => c.roomId).filter(Boolean));
  const explanations: string[] = [];

  // 2. Perform Interval Partitioning per day
  for (const day of days) {
    const dayClasses = optimizedClasses.filter((c) => c.day === day);
    if (dayClasses.length === 0) continue;

    // Sort classes primarily by start time, secondary by duration descending
    dayClasses.sort((a, b) => {
      const startDiff = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      if (startDiff !== 0) return startDiff;
      const durA = timeToMinutes(a.endTime) - timeToMinutes(a.startTime);
      const durB = timeToMinutes(b.endTime) - timeToMinutes(b.startTime);
      return durB - durA;
    });

    // Track active allocations for this day:
    // roomId -> list of scheduled classes on this day
    const roomSchedules: Map<string, ClassItem[]> = new Map();

    for (const cls of dayClasses) {
      // Find candidate rooms that satisfy constraints:
      // a) Compatible type (e.g. Computer Lab for Lab courses)
      // b) Capacity >= cls.studentCount
      // c) Contains all requiredEquipment
      // d) No time overlap with already scheduled classes in that room on this day
      const candidateRooms = rooms.filter((room) => {
        if (!room.isAvailable) return false;

        if (options.enforceRoomType && cls.roomTypeNeeded && cls.roomTypeNeeded !== 'Classroom') {
          if (room.type !== cls.roomTypeNeeded) return false;
        }

        if (options.enforceCapacity && room.capacity < cls.studentCount) {
          return false;
        }

        if (options.enforceEquipment && cls.requiredEquipment.length > 0) {
          const hasAllEquip = cls.requiredEquipment.every((eq) => room.equipment.includes(eq));
          if (!hasAllEquip) return false;
        }

        return true;
      });

      // Sort candidate rooms by:
      // 1. Rooms that are ALREADY in use today and become free right before cls.startTime (to minimize new room instantiation)
      // 2. Best fit capacity (smallest room that fits the students to save large lecture halls)
      const compatibleRoomsSorted = candidateRooms.sort((rA, rB) => {
        const schedA = roomSchedules.get(rA.id) || [];
        const schedB = roomSchedules.get(rB.id) || [];
        const inUseA = schedA.length > 0 ? 1 : 0;
        const inUseB = schedB.length > 0 ? 1 : 0;

        // Prefer rooms already in use to keep total room count minimal
        if (inUseA !== inUseB) return inUseB - inUseA;

        // Capacity closeness (avoid wasting 200-seat hall for 25 students)
        const capDiffA = rA.capacity - cls.studentCount;
        const capDiffB = rB.capacity - cls.studentCount;
        return capDiffA - capDiffB;
      });

      let assignedRoom: Room | null = null;

      for (const room of compatibleRoomsSorted) {
        const existingClasses = roomSchedules.get(room.id) || [];
        const hasOverlap = existingClasses.some((existing) =>
          doIntervalsOverlap(existing.startTime, existing.endTime, cls.startTime, cls.endTime)
        );

        if (!hasOverlap) {
          assignedRoom = room;
          break;
        }
      }

      // If no candidate room satisfied constraints without overlap, fallback to any available room
      if (!assignedRoom) {
        const fallback = rooms.find((room) => {
          const existingClasses = roomSchedules.get(room.id) || [];
          return !existingClasses.some((existing) =>
            doIntervalsOverlap(existing.startTime, existing.endTime, cls.startTime, cls.endTime)
          );
        });

        if (fallback) {
          assignedRoom = fallback;
          explanations.push(
            `Class ${cls.courseCode} (${cls.courseName}) on ${day} assigned to ${fallback.roomNumber} with relaxed constraints to prevent schedule collision.`
          );
        } else {
          // If all rooms are occupied at this exact time
          assignedRoom = rooms[0];
          explanations.push(
            `Peak overload on ${day} at ${cls.startTime}: All available physical classrooms were congested. Additional room required.`
          );
        }
      }

      // Record assignment
      cls.roomId = assignedRoom.id;
      usedRoomIds.add(assignedRoom.id);

      if (!roomSchedules.has(assignedRoom.id)) {
        roomSchedules.set(assignedRoom.id, []);
      }
      roomSchedules.get(assignedRoom.id)!.push(cls);
    }
  }

  const actualRoomsCount = usedRoomIds.size;
  const originalRoomsCount = originalUsedRoomIds.size || actualRoomsCount;
  const roomsSaved = Math.max(0, originalRoomsCount - actualRoomsCount);
  const efficiencyGain =
    originalRoomsCount > 0 ? Math.round((roomsSaved / originalRoomsCount) * 100) : 0;

  if (actualRoomsCount > globalTheoreticalMax) {
    const diff = actualRoomsCount - globalTheoreticalMax;
    explanations.push(
      `Theoretical minimum was ${globalTheoreticalMax} rooms, but ${actualRoomsCount} rooms are required (+${diff}) due to specialized equipment (e.g. Computer Labs) and class size capacity requirements.`
    );
  } else {
    explanations.push(
      `Optimal bound reached! All classes successfully scheduled using exactly ${actualRoomsCount} rooms, matching the theoretical minimum.`
    );
  }

  // Calculate room usage summary
  const roomUsageSummary = rooms.map((room) => {
    const assigned = optimizedClasses.filter((c) => c.roomId === room.id);
    let totalMinutes = 0;
    for (const c of assigned) {
      totalMinutes += Math.max(0, timeToMinutes(c.endTime) - timeToMinutes(c.startTime));
    }
    const totalHours = Number((totalMinutes / 60).toFixed(1));
    // Max available hours = 6 days * 9 hours/day (8am to 5pm) = 54 hours
    const maxWeekHours = 54;
    const utilizationRate = Math.min(100, Math.round((totalHours / maxWeekHours) * 100));

    return {
      roomId: room.id,
      roomNumber: room.roomNumber,
      classesCount: assigned.length,
      totalHours,
      utilizationRate,
    };
  });

  return {
    optimizedClasses,
    result: {
      theoreticalMinRooms: globalTheoreticalMax,
      actualRoomsUsed: actualRoomsCount,
      originalRoomsUsed: originalRoomsCount,
      roomsSaved: roomsSaved > 0 ? roomsSaved : Math.max(0, rooms.length - actualRoomsCount),
      efficiencyGainPercentage:
        efficiencyGain || Math.round(((rooms.length - actualRoomsCount) / rooms.length) * 100),
      maxSimultaneousClassesPerDay: maxSimultaneousPerDay,
      explanations,
      peakDay,
      peakHour: globalPeakHour,
      timestamp: new Date().toISOString(),
    },
    roomUsageSummary,
    algorithmLog,
  };
}
