import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { InteractiveHeroDemo } from './InteractiveHeroDemo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  DoorOpen,
  Users,
  Calendar,
  BarChart,
  FileDown,
  Layers,
  CheckCircle,
  HelpCircle,
  Cpu,
  GraduationCap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, runOptimization, isOptimizing } = useTimetable();

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Room Allocation',
      desc: 'Dynamic greedy assignment maps classes into the optimal physical room based on size and equipment.',
      color: 'from-brand-500 to-emerald-600',
      tag: 'Interval Partitioning',
    },
    {
      icon: ShieldCheck,
      title: 'Conflict Detection',
      desc: 'Instant verification for room overlaps, instructor clashes, section overlaps, and timing anomalies.',
      color: 'from-orange-500 to-amber-600',
      tag: 'Zero-Collision',
    },
    {
      icon: Zap,
      title: 'Minimum Room Optimization',
      desc: 'DAA-grade algorithm computes the exact chromatic bound χ(G) to minimize physical classroom overhead.',
      color: 'from-emerald-500 to-teal-600',
      tag: '35% Saved',
    },
    {
      icon: Users,
      title: 'Instructor Conflict Prevention',
      desc: 'Guarantees no faculty member is booked in multiple locations or exceeds weekly teaching limits.',
      color: 'from-amber-500 to-citrus-600',
      tag: 'Faculty Shield',
    },
    {
      icon: Calendar,
      title: 'Interactive Timetable',
      desc: 'Explore weekly schedules with department color filters, zoom levels, and real-time slot rescheduling.',
      color: 'from-brand-600 to-emerald-700',
      tag: 'Weekly Grid',
    },
    {
      icon: BarChart,
      title: 'Room Utilization Analytics',
      desc: 'Visual heatmaps (Room vs Hour) and workload distribution charts expose vacant campus capacity.',
      color: 'from-orange-600 to-coral-600',
      tag: 'Heatmaps',
    },
    {
      icon: Layers,
      title: 'Drag & Drop Scheduling',
      desc: 'Seamlessly shift courses across periods and halls with automated collision warnings.',
      color: 'from-teal-500 to-brand-600',
      tag: 'Intuitive UX',
    },
    {
      icon: FileDown,
      title: 'Multi-Format Export',
      desc: 'Download publication-grade PDFs, formatted Excel workbooks (.xlsx), and CSV files in one click.',
      color: 'from-coral-500 to-amber-600',
      tag: 'PDF & Excel',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Add Classes',
      desc: 'Enter courses, instructors, sections, and classroom equipment requirements into inventory.',
      icon: Layers,
      highlight: 'Batch or CSV input',
    },
    {
      number: '02',
      title: 'Detect Conflicts',
      desc: 'The conflict engine scans all time intervals to identify overlapping classes and instructor collisions.',
      icon: ShieldCheck,
      highlight: 'Real-time validation',
    },
    {
      number: '03',
      title: 'Optimize Rooms',
      desc: 'Greedy interval partitioning algorithm groups overlapping intervals into the minimum practical classrooms.',
      icon: Cpu,
      highlight: 'Greedy O(N log N)',
    },
    {
      number: '04',
      title: 'Generate Timetable',
      desc: 'A conflict-free, publication-ready university schedule is generated and ready for faculty export.',
      icon: GraduationCap,
      highlight: 'Instant PDF export',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-darkbg-900 text-slate-800 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Soft background ambient radial glows (Green & Citrus Orange) */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-brand-300/25 via-emerald-200/20 to-orange-300/20 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/90 dark:bg-brand-950/70 border border-brand-300/70 dark:border-brand-800 text-brand-900 dark:text-brand-300 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-spin" />
                <span>DAA Algorithmic Timetable Minimizer</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                <span className="text-orange-600 dark:text-orange-400">Interval Partitioning</span>
              </div>

              {/* Large Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Build Smarter Timetables.{' '}
                <span className="bg-gradient-to-r from-brand-600 via-emerald-600 to-orange-500 bg-clip-text text-transparent dark:from-brand-300 dark:to-orange-400">
                  Use Fewer Rooms.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Automatically generate conflict-free university timetables while minimizing classroom
                usage through intelligent interval graph partitioning.
              </p>

              {/* Prominent Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('wizard')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-emerald-600 to-brand-700 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-600/25 active:scale-95 transition-all flex items-center gap-2.5 group"
                >
                  <Sparkles className="w-4 h-4 text-citrus-300 group-hover:rotate-12 transition-transform" />
                  <span>Generate Timetable</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-3.5 rounded-2xl bg-white dark:bg-darkbg-800 hover:bg-slate-50 dark:hover:bg-darkbg-700 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base border border-slate-200 dark:border-brand-900/60 shadow-md active:scale-95 transition-all flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-orange-500" />
                  <span>Explore Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('timetable')}
                  className="px-5 py-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60 font-bold text-xs sm:text-sm border border-orange-200 dark:border-orange-800/40 transition-colors"
                >
                  View Master Grid →
                </button>
              </div>

              {/* Trust & Academic Metrics row */}
              <div className="pt-6 border-t border-brand-100 dark:border-brand-900/40 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-brand-700 dark:text-brand-400">
                    100%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Collision Free
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                    35%+
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Classrooms Saved
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    O(N log N)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Optimal Bound
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Simulation Widget */}
            <div className="lg:col-span-5">
              <InteractiveHeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (4-Step Visual Process) */}
      <section className="py-20 bg-white/70 dark:bg-darkbg-850/60 border-y border-brand-100 dark:border-brand-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
              Process Workflow
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-slate-50">
              How the Room Minimizer Operates
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Transform chaotic class schedules into an organized, mathematically optimal classroom allocation in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.number}
                  className="relative p-6 rounded-3xl bg-[#F8FAF8] dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 hover:border-brand-300 dark:hover:border-brand-700 shadow-sm hover:shadow-lg transition-all group"
                >
                  {/* Step number badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                      {st.number}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-700 dark:text-brand-300 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {st.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-brand-100 dark:border-brand-900/40">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                      {st.highlight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section (8 Feature Cards) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Production Capabilities
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-slate-50">
              Engineered for Real Academic Institutions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Combining theoretical interval graph algorithms with practical university management workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-darkbg-800 border border-slate-200/80 dark:border-brand-900/40 hover:border-brand-400 dark:hover:border-brand-600 shadow-soft hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-darkbg-700 text-slate-700 dark:text-slate-300">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-brand-900/30 flex items-center justify-between text-xs font-semibold text-brand-700 dark:text-brand-400">
                    <span>Explore Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DAA Algorithm Spotlight Box */}
      <section className="py-16 bg-gradient-to-br from-brand-900 via-emerald-950 to-darkbg-900 text-white rounded-3xl mx-4 sm:mx-8 lg:mx-auto max-w-7xl px-6 sm:px-12 my-12 shadow-2xl relative overflow-hidden">
        {/* Orange Accent Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Design and Analysis of Algorithms (DAA)
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Mathematical Foundation: Interval Partitioning
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Every class is an open interval <code className="bg-emerald-800/60 px-1.5 py-0.5 rounded text-orange-300 font-mono">[s_i, f_i)</code>.
              The problem of scheduling overlapping classes into the minimum number of rooms corresponds to finding the
              chromatic number <code className="bg-emerald-800/60 px-1.5 py-0.5 rounded text-orange-300 font-mono">χ(G)</code> of an interval graph.
              Because interval graphs are chordal and perfect, <code className="bg-emerald-800/60 px-1.5 py-0.5 rounded text-orange-300 font-mono">χ(G) = ω(G)</code> (the clique number).
              Our greedy solver sorts intervals by start time and achieves the absolute theoretical minimum in <code className="bg-emerald-800/60 px-1.5 py-0.5 rounded text-orange-300 font-mono">O(N log N)</code> time.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setActiveTab('optimization')}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Optimization Studio</span>
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
              >
                Load Pre-Built Benchmark Templates
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3 font-mono text-xs">
            <div className="text-orange-300 font-bold text-xs border-b border-white/10 pb-2">
              # Interval Partitioning Pseudocode
            </div>
            <p className="text-emerald-200">1. Sort intervals by start time</p>
            <p className="text-emerald-200">2. ActiveRooms = MinHeap(by finishTime)</p>
            <p className="text-emerald-200">3. For each class c in Classes:</p>
            <p className="text-emerald-300 pl-4">if c.start ≥ ActiveRooms.top():</p>
            <p className="text-orange-200 pl-8">ReuseRoom(ActiveRooms.pop())</p>
            <p className="text-emerald-300 pl-4">else:</p>
            <p className="text-orange-200 pl-8">AllocateNewRoom()</p>
            <p className="text-emerald-100 pt-2 border-t border-white/10 font-sans text-xs">
              Guaranteed optimal room usage without backtracking!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Ready to Optimize Your University's Classrooms?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            Say goodbye to room clashes, empty lecture halls, and double-booked professors.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-brand-600/25 active:scale-95 transition-all"
            >
              Enter Main Dashboard Now
            </button>
            <button
              onClick={() => setActiveTab('wizard')}
              className="px-7 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-500/25 active:scale-95 transition-all"
            >
              Launch Timetable Wizard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
