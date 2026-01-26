import React, { useState } from 'react';
import { UserCheck, Plus, X } from 'lucide-react';

interface Absence {
  id: string;
  teacherName: string;
  subject: string;
  absenceDate: string;
  classes: string;
  substitute: string;
  status: 'assigned' | 'pending' | 'completed';
}

export const SubstitutionManagement: React.FC = () => {
  const [view, setView] = useState<'today' | 'assigned' | 'pending'>('today');
  const [showForm, setShowForm] = useState(false);

  const [absences, setAbsences] = useState<Absence[]>([
    { id: '1', teacherName: 'Rajesh Kumar', subject: 'Mathematics', absenceDate: '2024-01-20', classes: '10-A, 10-B', substitute: 'Priya Sharma', status: 'assigned' },
    { id: '2', teacherName: 'Anil Patel', subject: 'English', absenceDate: '2024-01-20', classes: '9-A', substitute: 'Neha Singh', status: 'assigned' }
  ]);

  const [form, setForm] = useState({
    teacherName: '',
    subject: '',
    classes: '',
    substitute: ''
  });

  const handleMarkAbsence = () => {
    if (form.teacherName && form.subject && form.classes) {
      const newAbsence: Absence = {
        id: String(absences.length + 1),
        teacherName: form.teacherName,
        subject: form.subject,
        absenceDate: new Date().toISOString().split('T')[0],
        classes: form.classes,
        substitute: form.substitute,
        status: form.substitute ? 'assigned' : 'pending'
      };
      setAbsences([...absences, newAbsence]);
      setForm({ teacherName: '', subject: '', classes: '', substitute: '' });
      setShowForm(false);
    }
  };

  const todayAbsences = absences.filter(a => a.absenceDate === new Date().toISOString().split('T')[0]).length;
  const assignedCount = absences.filter(a => a.status === 'assigned').length;
  const pendingCount = absences.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Teacher Substitution
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Smart allocation for absent teachers
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Mark Absence</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Absences Today</p>
          <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">{absences.length}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Substitutes Assigned</p>
          <p className="text-2xl font-bold text-green-500">{assignedCount}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Pending Assignment</p>
          <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          {['today', 'assigned', 'pending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab as any)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                view === tab
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {view === 'today' && (
          <div className="space-y-3">
            {absences.map(absence => (
              <div key={absence.id} className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-apple-gray-600 dark:text-white">{absence.teacherName}</p>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{absence.subject}</p>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">Classes: {absence.classes}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    absence.status === 'assigned' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {absence.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'assigned' && (
          <div className="space-y-3">
            {absences.filter(a => a.status === 'assigned').map(absence => (
              <div key={absence.id} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-apple-gray-600 dark:text-white">{absence.teacherName}</p>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{absence.subject}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">Substitute: {absence.substitute}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'pending' && (
          <div className="space-y-3">
            {absences.filter(a => a.status === 'pending').length > 0 ? (
              absences.filter(a => a.status === 'pending').map(absence => (
                <div key={absence.id} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                  <p className="font-medium text-apple-gray-600 dark:text-white">{absence.teacherName}</p>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{absence.subject}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">SUBSTITUTE NEEDED FOR: {absence.classes}</p>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-apple-gray-400">No pending assignments</p>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="apple-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-apple-gray-600 dark:text-white">Mark Absence</h2>
              <button onClick={() => setShowForm(false)} className="text-apple-gray-400 hover:text-apple-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Teacher Name"
                value={form.teacherName}
                onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Classes (comma separated)"
                value={form.classes}
                onChange={(e) => setForm({ ...form, classes: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Substitute (optional)"
                value={form.substitute}
                onChange={(e) => setForm({ ...form, substitute: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleMarkAbsence}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Mark
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
