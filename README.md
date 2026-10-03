# 🎓 OptiRoom — University Timetable Room Minimizer
> **Intelligent University Timetable Management System with Greedy Interval Partitioning**
> Built for College Projects, Hackathons, and Real-World Academic Scheduling.

---

## 🌟 Key Highlights & Design Direction

* **Vibrant Academic Aesthetic (No Cold Blues)**: Designed with a color palette of **Lush Emerald Green**, **Fresh Mint**, **Citrus Tangerine / Amber Orange**, warm ivory/sage tinted backgrounds (`#F8FAF8`), and rich dark-mode forest graphite (`#0E1712`).
* **DAA Algorithmic Engine**: Implements the **Interval Graph Chromatic Number Theorem $\chi(G) = \omega(G)$** via **Greedy Interval Partitioning** in $\mathcal{O}(N \log N)$ time to find the absolute minimum practical classrooms.
* **100% Conflict-Free Guarantee**: Audits Room double-bookings, Instructor overlapping lectures, Student cohort clashes, Room seating capacities, and Multimedia laboratory equipment.
* **Production-Grade Micro-Interactions**: Glassmorphism cards, animated slot transitions, live interval simulation scrubber, dynamic utilization heatmaps, celebration confetti, and multi-format export (**PDF**, **Excel .xlsx**, **CSV**, and print).

---

## 🚀 Getting Started

### 1. Requirements
* Node.js 18+ (tested on Node v22)
* npm 9+

### 2. Development Server
The application is pre-configured and running locally:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🧩 Architectural Breakdown

### 1. Landing Page
* **Hero Section**: *"Build Smarter Timetables. Use Fewer Rooms."*
* **Interactive Live Simulation Widget**: Demonstrates classes (`CSE-A -> Room 101`, `CSE-B -> Room 102`, `ECE-A -> Room 103`) moving into non-overlapping rooms, then reusing vacant rooms to minimize total facility count.
* **4-Step Workflow**: Add Classes $\to$ Detect Conflicts $\to$ Optimize Rooms $\to$ Generate Timetable.
* **8 Core Feature Showcases**: Smart Allocation, Conflict Detector, Room Minimizer, Faculty Shield, Interactive Grid, Heatmap Analytics, Drag & Drop Rescheduling, Multi-Format Export.
* **DAA Algorithm Spotlight**: Comprehensive theoretical explanation of interval graph clique bounds.

### 2. Main Dashboard & Operations
* **Statistics Overview**: Animated counters for Total Classes, Rooms Needed, Rooms Saved, Conflicts, Faculty Clashes, and Campus Utilization %.
* **Master Weekly Timetable Grid**: 
  - Monday to Saturday, 08:00 to 18:00 with department badges (Emerald for CS, Orange for ECE, Teal for Math).
  - Reschedule modal for instant drag-and-drop or click-to-move slot reallocation.
  - Multi-criteria filtering by Department, Classroom, Faculty Instructor, and Semester.
* **Conflict Center**:
  - Automatically identifies Room collisions, Instructor double-bookings, Cohort clashes, Capacity overflow, and Missing equipment.
  - One-click **"Fix Automatically"** solver.
* **Optimization Studio**:
  - Before vs After utilization comparison chart.
  - Step-by-step solver visualizer (*Analyzing intervals $\to$ Computing clique bounds $\to$ Checking faculty $\to$ Matching lab equipment $\to$ Complete*).
  - Explanations of why real-world constraints (like Computer Labs) might exceed the raw theoretical minimum.
* **Analytics & Room Utilization Heatmap**:
  - 2D Matrix (Room vs Hour) with occupancy indicators.
  - Hourly peak usage curve and faculty teaching workload compliance tables.
* **Curriculum & Facility Registries**:
  - Complete CRUD for Courses/Classes, Classrooms & Labs, and Faculty Instructors.
* **6 Pre-Built Realistic Academic Templates**:
  - Engineering College Full Stack
  - Computer Science Department
  - University Standard Schedule
  - Mid-Term / Final Examination Timetable
  - Compact Ultra-Efficient Schedule
  - Multi-Campus Large University
* **8-Step Timetable Generator Wizard**:
  - Guided step-by-step assistant for end-to-end schedule synthesis.
* **Publication Exports**:
  - Direct download of styled university PDFs (via `jsPDF` & `jspdf-autotable`).
  - Excel `.xlsx` multi-sheet workbooks (via `xlsx`).
  - Standard CSV exports and browser print support.

---

## 📐 Algorithm Specification (Interval Partitioning)

1. Let $\mathcal{I} = \{[s_1, f_1), [s_2, f_2), \dots, [s_n, f_n)\}$ be class intervals for a given day.
2. Sort intervals in ascending order of start times: $s_1 \le s_2 \le \dots \le s_n$.
3. Maintain active classrooms tracked by earliest finish time.
4. For each class $i$:
   - If an existing classroom becomes available before $s_i$ (and satisfies capacity/equipment constraints), allocate class $i$ to that room.
   - Otherwise, instantiate a new classroom.
5. The maximum simultaneous overlap $\max_t |\{i : s_i \le t < f_i\}|$ equals the chromatic number $\chi(G) = \omega(G)$, proving room minimization optimality.
