import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Pause, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';

interface DemoClass {
  id: string;
  name: string;
  code: string;
  time: string;
  room: string;
  instructor: string;
  color: string;
  badgeColor: string;
}

export const InteractiveHeroDemo: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      timeLabel: '09:00 - 10:00 (Peak Overlap #1)',
      description: '3 simultaneous lectures start. Interval Partitioning allocates 3 separate rooms.',
      classes: [
        {
          id: '1',
          code: 'CSE-A',
          name: 'Data Structures',
          time: '09:00 - 10:00',
          room: 'Room 101',
          instructor: 'Dr. Rao',
          color: 'bg-emerald-500/10 border-emerald-400 text-emerald-950 dark:text-emerald-100',
          badgeColor: 'bg-emerald-500 text-white',
        },
        {
          id: '2',
          code: 'CSE-B',
          name: 'Database Systems',
          time: '09:00 - 10:00',
          room: 'Room 102',
          instructor: 'Dr. Sharma',
          color: 'bg-orange-500/10 border-orange-400 text-orange-950 dark:text-orange-100',
          badgeColor: 'bg-orange-500 text-white',
        },
        {
          id: '3',
          code: 'ECE-A',
          name: 'Digital Circuits',
          time: '09:00 - 10:00',
          room: 'Room 103',
          instructor: 'Prof. Kumar',
          color: 'bg-amber-500/10 border-amber-400 text-amber-950 dark:text-amber-100',
          badgeColor: 'bg-amber-500 text-white',
        },
      ],
      activeRooms: ['Room 101', 'Room 102', 'Room 103'],
      savedRooms: 2,
    },
    {
      timeLabel: '10:00 - 11:00 (Smart Room Reuse)',
      description: 'Room 101 & 102 become vacant. Next classes immediately REUSE them!',
      classes: [
        {
          id: '4',
          code: 'CSE-A',
          name: 'Discrete Math',
          time: '10:00 - 11:00',
          room: 'Room 101',
          instructor: 'Dr. Verma',
          color: 'bg-emerald-500/10 border-emerald-400 text-emerald-950 dark:text-emerald-100',
          badgeColor: 'bg-emerald-500 text-white',
        },
        {
          id: '5',
          code: 'CSE-B',
          name: 'Operating Systems',
          time: '10:00 - 11:00',
          room: 'Room 102',
          instructor: 'Dr. Reddy',
          color: 'bg-orange-500/10 border-orange-400 text-orange-950 dark:text-orange-100',
          badgeColor: 'bg-orange-500 text-white',
        },
      ],
      activeRooms: ['Room 101', 'Room 102'],
      savedRooms: 3,
    },
    {
      timeLabel: '11:00 - 13:00 (Specialized Lab Allocation)',
      description: 'AI Lab course mapped directly to Computer Lab 1 without wasting lecture halls.',
      classes: [
        {
          id: '6',
          code: 'CSE-B',
          name: 'Web Dev Lab',
          time: '11:00 - 13:00',
          room: 'Lab 1',
          instructor: 'Prof. Patel',
          color: 'bg-orange-500/10 border-orange-400 text-orange-950 dark:text-orange-100',
          badgeColor: 'bg-orange-500 text-white',
        },
        {
          id: '7',
          code: 'CSE-A',
          name: 'Artificial Intelligence',
          time: '11:00 - 12:00',
          room: 'Room 101',
          instructor: 'Dr. Sharma',
          color: 'bg-emerald-500/10 border-emerald-400 text-emerald-950 dark:text-emerald-100',
          badgeColor: 'bg-emerald-500 text-white',
        },
      ],
      activeRooms: ['Room 101', 'Lab 1'],
      savedRooms: 4,
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const current = steps[activeStep];

  return (
    <div className="relative rounded-3xl p-6 sm:p-7 bg-white/80 dark:bg-darkbg-800/80 backdrop-blur-xl border border-brand-200/80 dark:border-brand-900/60 shadow-2xl shadow-brand-500/10">
      {/* Decorative gradient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-brand-400/20 to-orange-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header of Demo */}
      <div className="flex items-center justify-between border-b border-brand-100 dark:border-brand-900/40 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live Simulation
              </span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
                Monday Schedule
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              {current.timeLabel}
            </h4>
          </div>
        </div>

        {/* Play/Pause & Step indicators */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-brand-50 dark:bg-darkbg-700 text-brand-700 dark:text-brand-300 hover:bg-brand-100 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveStep(i);
                  setIsPlaying(false);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeStep === i
                    ? 'bg-orange-500 w-6'
                    : 'bg-slate-200 dark:bg-darkbg-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed bg-brand-50/50 dark:bg-darkbg-900/40 p-2.5 rounded-xl border border-brand-100/60 dark:border-brand-900/30">
        💡 <span className="font-semibold text-brand-800 dark:text-brand-300">{current.description}</span>
      </p>

      {/* Class allocation cards */}
      <div className="space-y-3">
        {current.classes.map((cls, idx) => (
          <div
            key={cls.id}
            className={`p-3.5 rounded-2xl border transition-all duration-500 flex items-center justify-between gap-3 shadow-sm ${cls.color}`}
            style={{
              animation: `fadeIn 0.4s ease-out ${idx * 0.1}s backwards`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-lg text-xs font-black ${cls.badgeColor}`}>
                {cls.code}
              </span>
              <div>
                <p className="text-xs font-bold leading-tight">{cls.name}</p>
                <p className="text-[11px] opacity-75 mt-0.5">
                  {cls.instructor} • {cls.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="px-2.5 py-1 rounded-xl bg-white dark:bg-darkbg-900 border border-slate-200 dark:border-brand-900/60 text-xs font-bold shadow-xs">
                {cls.room}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom stats banner */}
      <div className="mt-5 pt-4 border-t border-brand-100 dark:border-brand-900/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-brand-700 dark:text-brand-300 font-bold">
          <CheckCircle2 className="w-4 h-4 text-brand-500" />
          <span>No Conflicts</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-slate-400">
            Rooms in use:{' '}
            <strong className="text-slate-800 dark:text-slate-100 font-bold">
              {current.activeRooms.length}
            </strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-extrabold text-[11px]">
            +{current.savedRooms} Rooms Saved
          </span>
        </div>
      </div>
    </div>
  );
};
