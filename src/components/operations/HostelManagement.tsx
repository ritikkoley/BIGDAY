import React, { useState } from 'react';
import { Home, Plus, X } from 'lucide-react';

interface Allocation {
  id: string;
  roomNumber: string;
  studentName: string;
  rollNumber: string;
  allocationDate: string;
  status: 'active' | 'checkout' | 'on_leave';
}

export const HostelManagement: React.FC = () => {
  const [view, setView] = useState<'allocations' | 'occupancy' | 'checkouts'>('allocations');
  const [showForm, setShowForm] = useState(false);

  const [allocations, setAllocations] = useState<Allocation[]>([
    { id: '1', roomNumber: 'B-101', studentName: 'Ritik Koley', rollNumber: '10A-001', allocationDate: '2024-01-10', status: 'active' },
    { id: '2', roomNumber: 'B-102', studentName: 'Aditya Singh', rollNumber: '10B-015', allocationDate: '2024-01-10', status: 'active' }
  ]);

  const [form, setForm] = useState({
    roomNumber: '',
    studentName: '',
    rollNumber: ''
  });

  const handleAllocateRoom = () => {
    if (form.roomNumber && form.studentName && form.rollNumber) {
      const newAllocation: Allocation = {
        id: String(allocations.length + 1),
        roomNumber: form.roomNumber,
        studentName: form.studentName,
        rollNumber: form.rollNumber,
        allocationDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setAllocations([...allocations, newAllocation]);
      setForm({ roomNumber: '', studentName: '', rollNumber: '' });
      setShowForm(false);
    }
  };

  const activeAllocations = allocations.filter(a => a.status === 'active').length;
  const checkoutCount = allocations.filter(a => a.status === 'checkout').length;
  const onLeaveCount = allocations.filter(a => a.status === 'on_leave').length;
  const occupancyRate = ((activeAllocations / 500) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <Home className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Hostel Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Room allocation, inventory & mess tracking
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Allocate Room</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Total Capacity</p>
          <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">500</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Occupied</p>
          <p className="text-2xl font-bold text-green-500">{activeAllocations}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Available</p>
          <p className="text-2xl font-bold text-blue-500">{500 - activeAllocations}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Occupancy Rate</p>
          <p className="text-2xl font-bold text-green-500">{occupancyRate}%</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          {['allocations', 'occupancy', 'checkouts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab as any)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                view === tab
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {view === 'allocations' && (
          <div className="space-y-3">
            {allocations.filter(a => a.status === 'active').map(allocation => (
              <div key={allocation.id} className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-apple-gray-600 dark:text-white">{allocation.studentName}</p>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{allocation.rollNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600 dark:text-blue-400">Room {allocation.roomNumber}</p>
                    <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">{allocation.allocationDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'occupancy' && (
          <div className="space-y-3">
            {allocations.map(allocation => (
              <div key={allocation.id} className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-apple-gray-600 dark:text-white">Room {allocation.roomNumber}</p>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{allocation.studentName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    allocation.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    allocation.status === 'checkout' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {allocation.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'checkouts' && (
          <div className="space-y-3">
            {allocations.filter(a => a.status === 'checkout' || a.status === 'on_leave').length > 0 ? (
              allocations.filter(a => a.status === 'checkout' || a.status === 'on_leave').map(allocation => (
                <div key={allocation.id} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                  <p className="font-medium text-apple-gray-600 dark:text-white">{allocation.studentName}</p>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">Room {allocation.roomNumber}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">{allocation.status.replace('_', ' ').toUpperCase()}</p>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-apple-gray-400">No checkouts or leaves</p>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="apple-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-apple-gray-600 dark:text-white">Allocate Room</h2>
              <button onClick={() => setShowForm(false)} className="text-apple-gray-400 hover:text-apple-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room Number"
                value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Student Name"
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={form.rollNumber}
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleAllocateRoom}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Allocate
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-apple-gray-200 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
