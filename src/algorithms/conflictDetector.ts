import { ClassItem, Room, Instructor, ScheduleConflict } from '../types';
import { doIntervalsOverlap, timeToMinutes } from './intervalPartitioning';

export function detectAllConflicts(
  classes: ClassItem[],
  rooms: Room[],
  instructors: Instructor[]
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  const roomMap = new Map<string, Room>(rooms.map((r) => [r.id, r]));
  const instructorMap = new Map<string, Instructor>(instructors.map((i) => [i.id, i]));

  // 1. Check for Invalid Schedules (end <= start)
  for (const c of classes) {
    const startM = timeToMinutes(c.startTime);
    const endM = timeToMinutes(c.endTime);
    if (endM <= startM) {
      conflicts.push({
        id: `invalid_time_${c.id}`,
        type: 'invalid_time',
        title: 'Invalid Class Timing',
        description: `Class "${c.courseCode}: ${c.courseName}" has end time (${c.endTime}) earlier than or equal to start time (${c.startTime}).`,
        severity: 'critical',
        classIds: [c.id],
        suggestedSolution: `Adjust ${c.courseCode} end time to at least 1 hour after start time.`,
        fixAction: {
          type: 'reschedule_time',
          targetClassId: c.id,
          newStartTime: c.startTime,
          newEndTime: `${(parseInt(c.startTime.split(':')[0], 10) + 1).toString().padStart(2, '0')}:${c.startTime.split(':')[1]}`,
        },
      });
    }
  }

  // 2. Check for Room Overlaps, Instructor Clashes, Section Clashes
  for (let i = 0; i < classes.length; i++) {
    const classA = classes[i];

    // Check Capacity
    if (classA.roomId) {
      const room = roomMap.get(classA.roomId);
      if (room && room.capacity < classA.studentCount) {
        // Find alternative room with enough capacity
        const alternativeRoom = rooms.find(
          (r) => r.isAvailable && r.capacity >= classA.studentCount && r.id !== room.id
        );
        conflicts.push({
          id: `capacity_${classA.id}_${room.id}`,
          type: 'capacity_exceeded',
          title: 'Room Capacity Exceeded',
          description: `Room ${room.roomNumber} (capacity: ${room.capacity}) cannot accommodate ${classA.studentCount} students for "${classA.courseCode}".`,
          severity: 'warning',
          classIds: [classA.id],
          roomId: room.id,
          suggestedSolution: alternativeRoom
            ? `Move ${classA.courseCode} to ${alternativeRoom.roomNumber} (Capacity: ${alternativeRoom.capacity})`
            : `Increase capacity or split section into smaller cohorts.`,
          fixAction: alternativeRoom
            ? {
                type: 'reassign_room',
                targetClassId: classA.id,
                newRoomId: alternativeRoom.id,
              }
            : undefined,
        });
      }

      // Check Equipment
      if (room && classA.requiredEquipment.length > 0) {
        const missing = classA.requiredEquipment.filter((eq) => !room.equipment.includes(eq));
        if (missing.length > 0) {
          const betterRoom = rooms.find(
            (r) =>
              r.isAvailable &&
              classA.requiredEquipment.every((eq) => r.equipment.includes(eq)) &&
              r.capacity >= classA.studentCount
          );
          conflicts.push({
            id: `equipment_${classA.id}_${room.id}`,
            type: 'equipment_missing',
            title: 'Missing Required Equipment',
            description: `Room ${room.roomNumber} is missing equipment required for ${classA.courseCode}: ${missing.join(', ')}.`,
            severity: 'warning',
            classIds: [classA.id],
            roomId: room.id,
            suggestedSolution: betterRoom
              ? `Reallocate to ${betterRoom.roomNumber} which is equipped with ${missing.join(', ')}.`
              : `Equip Room ${room.roomNumber} or update class requirements.`,
            fixAction: betterRoom
              ? {
                  type: 'reassign_room',
                  targetClassId: classA.id,
                  newRoomId: betterRoom.id,
                }
              : undefined,
          });
        }
      }
    }

    // Pairwise overlap checks on same day
    for (let j = i + 1; j < classes.length; j++) {
      const classB = classes[j];

      if (classA.day !== classB.day) continue;

      const overlap = doIntervalsOverlap(
        classA.startTime,
        classA.endTime,
        classB.startTime,
        classB.endTime
      );

      if (!overlap) continue;

      // 2a. Room Conflict
      if (classA.roomId && classB.roomId && classA.roomId === classB.roomId) {
        const room = roomMap.get(classA.roomId);
        const roomName = room ? `Room ${room.roomNumber}` : 'Classroom';
        
        // Find an unoccupied room on that day/time
        const freeRoom = rooms.find((r) => {
          if (!r.isAvailable || r.id === classA.roomId) return false;
          // check if r is used by any class on this day at overlapping times
          return !classes.some(
            (c) =>
              c.day === classA.day &&
              c.roomId === r.id &&
              c.id !== classA.id &&
              c.id !== classB.id &&
              doIntervalsOverlap(c.startTime, c.endTime, classB.startTime, classB.endTime)
          );
        });

        conflicts.push({
          id: `room_overlap_${classA.id}_${classB.id}`,
          type: 'room_overlap',
          title: 'Room Double-Booking Conflict',
          description: `${roomName} is concurrently assigned to "${classA.courseCode} (${classA.courseName})" and "${classB.courseCode} (${classB.courseName})" on ${classA.day} between ${classA.startTime} - ${classB.endTime}.`,
          severity: 'critical',
          classIds: [classA.id, classB.id],
          roomId: classA.roomId,
          suggestedSolution: freeRoom
            ? `Move ${classB.courseCode} to ${freeRoom.roomNumber} (Capacity: ${freeRoom.capacity})`
            : `Reschedule one of the classes to an alternate available time slot.`,
          fixAction: freeRoom
            ? {
                type: 'reassign_room',
                targetClassId: classB.id,
                newRoomId: freeRoom.id,
              }
            : undefined,
        });
      }

      // 2b. Instructor Conflict
      if (
        classA.instructorId &&
        classB.instructorId &&
        classA.instructorId === classB.instructorId
      ) {
        const instructor = instructorMap.get(classA.instructorId);
        const instName = instructor ? `${instructor.title} ${instructor.name}` : 'Instructor';

        // Suggest alternate instructor from same department or shift slot
        const altInstructor = instructors.find(
          (inst) =>
            inst.department === classB.department &&
            inst.id !== classA.instructorId &&
            !classes.some(
              (c) =>
                c.day === classB.day &&
                c.instructorId === inst.id &&
                doIntervalsOverlap(c.startTime, c.endTime, classB.startTime, classB.endTime)
            )
        );

        conflicts.push({
          id: `instructor_clash_${classA.id}_${classB.id}`,
          type: 'instructor_clash',
          title: 'Instructor Scheduling Clash',
          description: `${instName} is scheduled to teach both "${classA.courseCode}" and "${classB.courseCode}" at overlapping times (${classA.startTime} - ${classB.endTime}) on ${classA.day}.`,
          severity: 'critical',
          classIds: [classA.id, classB.id],
          instructorId: classA.instructorId,
          suggestedSolution: altInstructor
            ? `Reassign ${classB.courseCode} to ${altInstructor.title} ${altInstructor.name} or reschedule slot.`
            : `Reschedule ${classB.courseCode} to an open time slot where ${instName} is free.`,
          fixAction: altInstructor
            ? {
                type: 'reassign_instructor',
                targetClassId: classB.id,
              }
            : undefined,
        });
      }

      // 2c. Student / Section Conflict
      if (
        classA.section &&
        classB.section &&
        classA.section === classB.section &&
        classA.department === classB.department
      ) {
        conflicts.push({
          id: `section_clash_${classA.id}_${classB.id}`,
          type: 'section_clash',
          title: 'Student Section Overlap',
          description: `Cohort / Section "${classA.section}" (${classA.department}) cannot attend both "${classA.courseCode}" and "${classB.courseCode}" simultaneously on ${classA.day}.`,
          severity: 'critical',
          classIds: [classA.id, classB.id],
          suggestedSolution: `Shift "${classB.courseCode}" to a non-conflicting period or swap days.`,
        });
      }
    }
  }

  return conflicts;
}
