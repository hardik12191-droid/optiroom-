import React from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { ActiveTab } from '../../types';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  DoorOpen,
  Users,
  AlertTriangle,
  Sparkles,
  BarChart3,
  BookmarkCheck,
  Wand2,
  Settings,
  Home,
  CheckCircle2,
  Layers,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, conflicts, rooms, classes, optimizationResult } = useTimetable();

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timetable', label: 'Master Timetable', icon: CalendarDays },
    { id: 'classes', label: 'Classes & Courses', icon: BookOpen, badge: classes.length },
    { id: 'rooms', label: 'Rooms & Halls', icon: DoorOpen, badge: rooms.length },
    { id: 'instructors', label: 'Faculty & Instructors', icon: Users },
    {
      id: 'conflicts',
      label: 'Conflict Center',
      icon: AlertTriangle,
      badge: conflicts.length > 0 ? conflicts.length : undefined,
      badgeColor: 'bg-amber-500 text-white animate-pulse',
    },
    {
      id: 'optimization',
      label: 'Room Minimizer',
      icon: Sparkles,
      badge: 'DAA',
      badgeColor: 'bg-brand-500 text-white',
    },
    { id: 'analytics', label: 'Analytics & Heatmap', icon: BarChart3 },
    { id: 'templates', label: 'Templates', icon: BookmarkCheck, badge: '6' },
    { id: 'wizard', label: 'Generate Wizard', icon: Wand2, badge: 'New', badgeColor: 'bg-orange-500 text-white' },
    { id: 'settings', label: 'Preferences', icon: Settings },
  ];

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-screen lg:h-[calc(100vh-4rem)] w-64 shrink-0 bg-white/95 dark:bg-darkbg-900/95 backdrop-blur-md border-r border-brand-100 dark:border-brand-900/40 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
          {/* Landing page link */}
          <button
            onClick={() => handleSelect('landing')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'landing'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-darkbg-800 hover:text-orange-600'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4" />
              <span>Landing Page</span>
            </div>
            <span className="text-[10px] font-semibold opacity-80">Home</span>
          </button>

          {/* Navigation group */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Academic Operations
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-brand-50/80 dark:hover:bg-darkbg-800 hover:text-brand-700 dark:hover:text-brand-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        item.badgeColor
                          ? item.badgeColor
                          : isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-slate-100 dark:bg-darkbg-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Widget: DAA Optimization Efficiency */}
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-brand-50 via-emerald-50/50 to-orange-50/40 dark:from-darkbg-800 dark:to-darkbg-700 border border-brand-200/60 dark:border-brand-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                Algorithm Stats
              </span>
            </div>
            <span className="px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300">
              O(N log N)
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-snug">
            {optimizationResult ? (
              <>
                Using <span className="font-bold text-brand-700 dark:text-brand-400">{optimizationResult.actualRoomsUsed}</span> / {rooms.length} rooms ({optimizationResult.roomsSaved} saved).
              </>
            ) : (
              'Interval partitioning ready to calculate minimum chromatic bound.'
            )}
          </p>

          <div className="mt-2.5 w-full bg-slate-200 dark:bg-darkbg-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-orange-500 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: optimizationResult
                  ? `${Math.max(25, 100 - (optimizationResult.actualRoomsUsed / rooms.length) * 100)}%`
                  : '40%',
              }}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
