import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import {
  Wand2,
  ArrowRight,
  ArrowLeft,
  Check,
  Building,
  Calendar,
  Layers,
  DoorOpen,
  Users,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const GenerateWizard: React.FC = () => {
  const {
    classes,
    rooms,
    instructors,
    preferences,
    updatePreferences,
    runOptimization,
    optimizationResult,
    setActiveTab,
  } = useTimetable();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState('Computer Science');
  const [selectedSem, setSelectedSem] = useState('Semester 3');
  const [activeRoomIds, setActiveRoomIds] = useState<string[]>(rooms.map((r) => r.id));
  const [lunchHour, setLunchHour] = useState('13:00');
  const [avoidBackToBack, setAvoidBackToBack] = useState(false);
  const [maxHours, setMaxHours] = useState(6);
  const [isProcessing, setIsProcessing] = useState(false);

  const stepTitles = [
    'Select Department',
    'Select Semester',
    'Review Classes',
    'Available Rooms',
    'Faculty Availability',
    'Scheduling Preferences',
    'Run Optimization',
    'Review & Finalize',
  ];

  const handleNext = async () => {
    if (currentStep === 6) {
      setCurrentStep(7);
      setIsProcessing(true);
      await runOptimization();
      setIsProcessing(false);
      setCurrentStep(8);
    } else if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const toggleRoom = (id: string) => {
    setActiveRoomIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const filteredStepClasses = classes.filter(
    (c) =>
      (selectedDept === 'All' || c.department === selectedDept) &&
      (selectedSem === 'All' || c.semester === selectedSem)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Wizard Card */}
      <div className="bg-white dark:bg-darkbg-800 p-6 sm:p-8 rounded-3xl border border-brand-100 dark:border-brand-900/50 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-100 dark:border-brand-900/40 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-orange-400 flex items-center justify-center text-white shadow-md">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Step {currentStep} of 8
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {stepTitles[currentStep - 1]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <span>Progress: {Math.round((currentStep / 8) * 100)}%</span>
          </div>
        </div>

        {/* 8-Step Visual Indicator */}
        <div className="pt-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[550px] px-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
              const isDone = s < currentStep;
              const isCurrent = s === currentStep;

              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isDone
                        ? 'bg-brand-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-orange-500 text-white ring-4 ring-orange-200 dark:ring-orange-950 shadow-md'
                        : 'bg-slate-100 dark:bg-darkbg-700 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 8 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                        isDone ? 'bg-brand-500' : 'bg-slate-200 dark:bg-darkbg-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Contents */}
        <div className="mt-8 pt-4">
          {/* Step 1: Department */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Select the academic department you wish to optimize, or choose "All" for an institution-wide schedule.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Computer Science',
                  'Electronics',
                  'Mechanical',
                  'Mathematics',
                  'Information Tech',
                  'All',
                ].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all ${
                      selectedDept === dept
                        ? 'bg-brand-50/80 dark:bg-brand-950/40 border-brand-500 text-brand-900 dark:text-brand-200 ring-2 ring-brand-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-darkbg-700/60 border-slate-200 dark:border-brand-900/40 text-slate-700 dark:text-slate-300 hover:border-brand-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{dept} Department</span>
                      {selectedDept === dept && <Check className="w-4 h-4 text-brand-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Semester */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Choose the target semester cohort for class scheduling.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Semester 3', 'Semester 5', 'Semester 7', 'All'].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSem(sem)}
                    className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all ${
                      selectedSem === sem
                        ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-500 text-orange-900 dark:text-orange-200 ring-2 ring-orange-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-darkbg-700/60 border-slate-200 dark:border-brand-900/40 text-slate-700 dark:text-slate-300 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{sem}</span>
                      {selectedSem === sem && <Check className="w-4 h-4 text-orange-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Review Classes */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {filteredStepClasses.length} courses identified for scheduling:
                </p>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  {selectedDept} • {selectedSem}
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {filteredStepClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200/60 dark:border-brand-900/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-brand-700 dark:text-brand-300 mr-2">
                        {cls.courseCode}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {cls.courseName}
                      </span>
                    </div>
                    <span className="font-mono text-slate-500">
                      {cls.day} ({cls.startTime} - {cls.endTime})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Available Rooms */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Select which physical lecture halls and computing labs should be available for the minimizer:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rooms.map((r) => {
                  const active = activeRoomIds.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      onClick={() => toggleRoom(r.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        active
                          ? 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-500 text-brand-950 dark:text-brand-200'
                          : 'bg-slate-50 dark:bg-darkbg-700/60 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{r.roomNumber}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          Cap: {r.capacity}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {r.type} • {r.equipment.join(', ')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Instructor Availability */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Faculty workload limits and scheduling constraints:
              </p>
              <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar">
                {instructors.map((i) => (
                  <div
                    key={i.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200/60 dark:border-brand-900/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">
                        {i.title} {i.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{i.department}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-darkbg-800 text-[11px] font-bold text-brand-700 dark:text-brand-300 border border-brand-200/50">
                      Max {i.maxWeeklyHours} hrs/wk
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Preferences */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Fine-tune algorithmic preferences for academic breaks and lecture density:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200/60 dark:border-brand-900/40">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Midday Dining / Lunch Period
                  </label>
                  <select
                    value={lunchHour}
                    onChange={(e) => setLunchHour(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-darkbg-800 border border-slate-200 text-xs font-semibold"
                  >
                    <option value="12:00">12:00 PM - 01:00 PM</option>
                    <option value="13:00">01:00 PM - 02:00 PM</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200/60 dark:border-brand-900/40">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Max Daily Faculty Hours
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="8"
                    value={maxHours}
                    onChange={(e) => setMaxHours(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-white dark:bg-darkbg-800 border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-darkbg-700 border border-emerald-200/60 dark:border-brand-900/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-brand-900 dark:text-brand-200">
                    Enforce Laboratory Equipment Matching
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Computer Lab courses strictly allocated to labs with PC workstations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.enforceEquipmentMatch}
                  onChange={(e) =>
                    updatePreferences({ enforceEquipmentMatch: e.target.checked })
                  }
                  className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Step 7: Optimizing */}
          {currentStep === 7 && (
            <div className="py-12 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Running Interval Partitioning Minimizer...
              </h3>
              <p className="text-xs text-slate-500">
                Resolving interval overlaps and assigning the theoretical minimum classrooms.
              </p>
            </div>
          )}

          {/* Step 8: Final Review */}
          {currentStep === 8 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  Timetable Generated Successfully!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  All classes have been allocated without time overlaps or instructor clashes.
                </p>
              </div>

              {optimizationResult && (
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center pt-2">
                  <div className="p-3 rounded-2xl bg-brand-50 dark:bg-darkbg-700 border border-brand-200/50">
                    <span className="text-[10px] uppercase font-bold text-brand-800 dark:text-brand-300 block">
                      Rooms Used
                    </span>
                    <span className="text-2xl font-black text-brand-700 dark:text-brand-400">
                      {optimizationResult.actualRoomsUsed}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-orange-50 dark:bg-darkbg-700 border border-orange-200/50">
                    <span className="text-[10px] uppercase font-bold text-orange-800 dark:text-orange-300 block">
                      Rooms Saved
                    </span>
                    <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                      +{optimizationResult.roomsSaved}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Conflicts
                    </span>
                    <span className="text-2xl font-black text-brand-600">0</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-5 border-t border-brand-100 dark:border-brand-900/40 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || currentStep === 7}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darkbg-700 rounded-xl transition-colors disabled:opacity-30 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isProcessing}
              className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md flex items-center gap-2"
            >
              <span>{currentStep === 6 ? 'Optimize & Generate' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('timetable')}
              className="px-6 py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md flex items-center gap-2"
            >
              <span>View In Weekly Timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
