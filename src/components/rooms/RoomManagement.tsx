import React, { useState } from 'react';
import { useTimetable } from '../../context/TimetableContext';
import { Room, RoomType } from '../../types';
import {
  DoorOpen,
  Plus,
  Building,
  Users,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  Search,
  X,
  Check,
} from 'lucide-react';

export const RoomManagement: React.FC = () => {
  const { rooms, classes, addRoom, updateRoom, deleteRoom } = useTimetable();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form states
  const [roomNumber, setRoomNumber] = useState('');
  const [building, setBuilding] = useState('Aryabhata Academic Block');
  const [floor, setFloor] = useState(1);
  const [capacity, setCapacity] = useState(60);
  const [type, setType] = useState<RoomType>('Classroom');
  const [equipment, setEquipment] = useState<string[]>(['Projector', 'AC']);
  const [isAvailable, setIsAvailable] = useState(true);

  const roomTypes: RoomType[] = [
    'Classroom',
    'Computer Lab',
    'Lecture Hall',
    'Seminar Room',
    'Science Lab',
  ];
  const equipmentList = ['Projector', 'Smart Board', 'Computer Lab', 'AC', 'Audio System'];

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setRoomNumber(room.roomNumber);
      setBuilding(room.building);
      setFloor(room.floor);
      setCapacity(room.capacity);
      setType(room.type);
      setEquipment(room.equipment);
      setIsAvailable(room.isAvailable);
    } else {
      setEditingRoom(null);
      setRoomNumber('');
      setBuilding('Aryabhata Academic Block');
      setFloor(1);
      setCapacity(60);
      setType('Classroom');
      setEquipment(['Projector', 'AC']);
      setIsAvailable(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) return;

    if (editingRoom) {
      updateRoom(editingRoom.id, {
        roomNumber,
        building,
        floor,
        capacity,
        type,
        equipment,
        isAvailable,
      });
    } else {
      addRoom({
        roomNumber,
        building,
        floor,
        capacity,
        type,
        equipment,
        isAvailable,
      });
    }
    setIsModalOpen(false);
  };

  const toggleEquipment = (eq: string) => {
    setEquipment((prev) => (prev.includes(eq) ? prev.filter((i) => i !== eq) : [...prev, eq]));
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.building.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'All' || r.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-darkbg-800 p-6 rounded-3xl border border-brand-100 dark:border-brand-900/50 shadow-soft">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
            Physical Campus Infrastructure
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Classrooms & Lecture Halls ({rooms.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage academic halls, computer laboratories, seating capacities, and multimedia facilities.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 dark:bg-darkbg-800/80 backdrop-blur-md p-4 rounded-2xl border border-brand-100 dark:border-brand-900/40 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search room number or building..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Room Types</option>
            {roomTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Showing {filteredRooms.length} of {rooms.length} facilities
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRooms.map((room) => {
          const assignedClasses = classes.filter((c) => c.roomId === room.id);
          const totalHours = Number((assignedClasses.length * 1.5).toFixed(1));
          const maxWeeklyHours = 45;
          const utilization = Math.min(100, Math.round((totalHours / maxWeeklyHours) * 100));

          return (
            <div
              key={room.id}
              className="p-5 rounded-3xl bg-white dark:bg-darkbg-800 border border-brand-100 dark:border-brand-900/50 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Top header badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {room.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        room.isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-[11px] font-bold text-slate-500">
                      {room.isAvailable ? 'Available' : 'Reserved'}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
                  {room.roomNumber}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {room.building} • Floor {room.floor}
                </p>

                {/* Seating Capacity & Classes */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-darkbg-700/60 border border-slate-100 dark:border-brand-900/40">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Capacity
                    </span>
                    <span className="text-base font-black text-slate-900 dark:text-slate-100 font-mono">
                      {room.capacity}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-darkbg-700/60 border border-slate-100 dark:border-brand-900/40">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Classes
                    </span>
                    <span className="text-base font-black text-brand-700 dark:text-brand-400 font-mono">
                      {assignedClasses.length}
                    </span>
                  </div>
                </div>

                {/* Utilization Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Weekly Utilization</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                      {utilization}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-darkbg-900 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        utilization > 80
                          ? 'bg-gradient-to-r from-orange-500 to-red-500'
                          : 'bg-gradient-to-r from-brand-500 to-emerald-500'
                      }`}
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                </div>

                {/* Equipment Pills */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Equipment Installed
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {room.equipment.map((eq) => (
                      <span
                        key={eq}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200/60 dark:border-orange-900/40"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-brand-100 dark:border-brand-900/40 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {totalHours} hrs / week
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(room)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteRoom(room.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-darkbg-800 p-6 sm:p-7 shadow-2xl border border-brand-200/80 dark:border-brand-900/60 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-100 dark:border-brand-900/40 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {editingRoom ? 'Edit Room' : 'Add New Classroom'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 204"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Seating Capacity *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Building
                  </label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Floor Level
                  </label>
                  <input
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Room Facility Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as RoomType)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-darkbg-700 border border-slate-200 dark:border-brand-900/50 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {roomTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Installed Equipment
                </label>
                <div className="flex flex-wrap gap-2">
                  {equipmentList.map((eq) => {
                    const active = equipment.includes(eq);
                    return (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => toggleEquipment(eq)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          active
                            ? 'bg-brand-500 border-brand-500 text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-darkbg-700 border-slate-200 dark:border-brand-900/50 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {eq}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-100 dark:border-brand-900/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingRoom ? 'Save Changes' : 'Create Room'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
