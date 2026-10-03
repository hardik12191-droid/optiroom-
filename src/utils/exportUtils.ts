import { ClassItem, Room, Instructor, OptimizationResult } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function exportTimetableToPDF(
  classes: ClassItem[],
  rooms: Room[],
  instructors: Instructor[],
  optimizationResult: OptimizationResult | null,
  universityName = 'Apex Institute of Technology & Research',
  semester = 'Fall 2026 Academic Session'
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const roomMap = new Map(rooms.map((r) => [r.id, r.roomNumber]));
  const instructorMap = new Map(instructors.map((i) => [i.id, `${i.title} ${i.name}`]));

  // Brand Header (Green & Warm Orange theme)
  doc.setFillColor(22, 101, 52); // brand-800
  doc.rect(0, 0, 842, 65, 'F');

  // Accent bar
  doc.setFillColor(249, 115, 22); // orange-500
  doc.rect(0, 65, 842, 4, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('UNIVERSITY MASTER TIMETABLE', 40, 36);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${universityName}  |  ${semester}`, 40, 52);

  // Subheader badge on right
  doc.setFontSize(9);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 620, 36);
  if (optimizationResult) {
    doc.text(`Room Minimizer: ${optimizationResult.actualRoomsUsed} Rooms Used (${optimizationResult.roomsSaved} Rooms Saved)`, 620, 50);
  }

  // Table Data
  const sortedClasses = [...classes].sort((a, b) => {
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dDiff = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
    if (dDiff !== 0) return dDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  const tableRows = sortedClasses.map((cls) => [
    cls.day,
    `${cls.startTime} - ${cls.endTime}`,
    cls.courseCode,
    cls.courseName,
    cls.section,
    instructorMap.get(cls.instructorId) || 'Unassigned',
    roomMap.get(cls.roomId) || 'Unassigned',
    cls.studentCount.toString(),
    cls.department,
  ]);

  autoTable(doc, {
    startY: 85,
    head: [[
      'Day',
      'Time Slot',
      'Course',
      'Course Title',
      'Sec',
      'Instructor',
      'Room Assigned',
      'Students',
      'Department',
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [22, 163, 74], // emerald green
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 248], // sage tinted light
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 65 },
      1: { cellWidth: 75 },
      2: { fontStyle: 'bold', cellWidth: 55 },
      3: { cellWidth: 150 },
      4: { cellWidth: 45 },
      5: { cellWidth: 110 },
      6: { fontStyle: 'bold', cellWidth: 85 },
      7: { cellWidth: 45 },
      8: { cellWidth: 110 },
    },
    margin: { left: 40, right: 40 },
    didDrawPage: (data) => {
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `OptiRoom Timetable Room Minimizer • Conflict-Free Algorithmic Allocation • Page ${doc.getNumberOfPages()}`,
        40,
        575
      );
    },
  });

  doc.save(`University_Timetable_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportTimetableToExcel(
  classes: ClassItem[],
  rooms: Room[],
  instructors: Instructor[],
  optimizationResult: OptimizationResult | null
) {
  const roomMap = new Map(rooms.map((r) => [r.id, r.roomNumber]));
  const instructorMap = new Map(instructors.map((i) => [i.id, `${i.title} ${i.name}`]));

  // Sheet 1: Timetable
  const timetableData = classes.map((c) => ({
    Day: c.day,
    'Start Time': c.startTime,
    'End Time': c.endTime,
    'Course Code': c.courseCode,
    'Course Name': c.courseName,
    Department: c.department,
    Semester: c.semester,
    Section: c.section,
    Instructor: instructorMap.get(c.instructorId) || 'Unassigned',
    'Room Allocated': roomMap.get(c.roomId) || 'Unassigned',
    'Class Size': c.studentCount,
    'Room Type Required': c.roomTypeNeeded,
    'Priority': c.priority.toUpperCase(),
  }));

  // Sheet 2: Room Utilization
  const roomData = rooms.map((r) => {
    const assigned = classes.filter((c) => c.roomId === r.id);
    return {
      'Room Number': r.roomNumber,
      Building: r.building,
      Floor: r.floor,
      Capacity: r.capacity,
      Type: r.type,
      'Classes Assigned': assigned.length,
      'Equipment Present': r.equipment.join(', '),
      Status: r.isAvailable ? 'Active' : 'Maintenance',
    };
  });

  // Sheet 3: Instructor Workload
  const instructorData = instructors.map((inst) => {
    const assigned = classes.filter((c) => c.instructorId === inst.id);
    return {
      'Instructor Name': `${inst.title} ${inst.name}`,
      Department: inst.department,
      Email: inst.email,
      'Assigned Classes': assigned.length,
      'Max Hours/Week': inst.maxWeeklyHours,
    };
  });

  const wb = XLSX.utils.book_new();
  const wsTimetable = XLSX.utils.json_to_sheet(timetableData);
  const wsRooms = XLSX.utils.json_to_sheet(roomData);
  const wsInstructors = XLSX.utils.json_to_sheet(instructorData);

  XLSX.utils.book_append_sheet(wb, wsTimetable, 'Timetable Schedule');
  XLSX.utils.book_append_sheet(wb, wsRooms, 'Classrooms');
  XLSX.utils.book_append_sheet(wb, wsInstructors, 'Faculty Workload');

  XLSX.writeFile(wb, `University_Timetable_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportTimetableToCSV(classes: ClassItem[], rooms: Room[], instructors: Instructor[]) {
  const roomMap = new Map(rooms.map((r) => [r.id, r.roomNumber]));
  const instructorMap = new Map(instructors.map((i) => [i.id, `${i.title} ${i.name}`]));

  const headers = ['Day', 'Start Time', 'End Time', 'Course Code', 'Course Title', 'Section', 'Instructor', 'Room', 'Students', 'Department'];
  const rows = classes.map((c) => [
    `"${c.day}"`,
    `"${c.startTime}"`,
    `"${c.endTime}"`,
    `"${c.courseCode}"`,
    `"${c.courseName.replace(/"/g, '""')}"`,
    `"${c.section}"`,
    `"${(instructorMap.get(c.instructorId) || 'Unassigned').replace(/"/g, '""')}"`,
    `"${(roomMap.get(c.roomId) || 'Unassigned').replace(/"/g, '""')}"`,
    c.studentCount,
    `"${c.department}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `University_Timetable_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
