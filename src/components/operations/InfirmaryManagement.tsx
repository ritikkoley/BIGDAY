import React, { useState } from 'react';
import { Stethoscope, Plus, AlertTriangle, X } from 'lucide-react';

interface Visit {
  id: string;
  studentName: string;
  rollNumber: string;
  complaint: string;
  severity: 'mild' | 'moderate' | 'serious';
  visitDate: string;
  requiresAlert: boolean;
}

export const InfirmaryManagement: React.FC = () => {
  const [view, setView] = useState<'visits' | 'alerts' | 'followups'>('visits');
  const [showForm, setShowForm] = useState(false);

  const [visits, setVisits] = useState<Visit[]>([
    { id: '1', studentName: 'Ritik Koley', rollNumber: '10A-001', complaint: 'Fever', severity: 'moderate', visitDate: '2024-01-20', requiresAlert: false },
    { id: '2', studentName: 'Aditya Singh', rollNumber: '10B-015', complaint: 'Headache', severity: 'mild', visitDate: '2024-01-20', requiresAlert: false }
  ]);

  const [form, setForm] = useState({
    studentName: '',
    rollNumber: '',
    complaint: '',
    severity: 'mild' as const
  });

  const handleLogVisit = () => {
    if (form.studentName && form.rollNumber && form.complaint) {
      const newVisit: Visit = {
        id: String(visits.length + 1),
        studentName: form.studentName,
        rollNumber: form.rollNumber,
        complaint: form.complaint,
        severity: form.severity,
        visitDate: new Date().toISOString().split('T')[0],
        requiresAlert: form.severity === 'serious'
      };
      setVisits([...visits, newVisit]);
      setForm({ studentName: '', rollNumber: '', complaint: '', severity: 'mild' });
      setShowForm(false);
    }
  };

  const todayVisits = visits.length;
  const seriousCases = visits.filter(v => v.severity === 'serious').length;
  const pendingAlerts = visits.filter(v => v.requiresAlert).length;
  const followups = visits.filter(v => v.severity === 'serious' || v.severity === 'moderate').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'serious': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <Stethoscope className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Infirmary Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Health visits, medical records & parent alerts
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Log Visit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Visits Today</p>
          <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">{todayVisits}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Serious Cases</p>
          <p className="text-2xl font-bold text-red-500">{seriousCases}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Pending Alerts</p>
          <p className="text-2xl font-bold text-orange-500">{pendingAlerts}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Followups</p>
          <p className="text-2xl font-bold text-blue-500">{followups}</p>
        </div>
      </div>

      <div className="apple-card p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-600 dark:text-red-400 mb-1">Critical Alert System</h3>
            <p className="text-sm text-red-600/80 dark:text-red-400/80">
              Auto-notify parents for serious cases. All medical data is secured and accessible only to authorized staff.
            </p>
          </div>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          {['visits', 'alerts', 'followups'].map((tab) => (
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

        {view === 'visits' && (
          <div className="space-y-3">
            {visits.map(visit => (
              <div key={visit.id} className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-apple-gray-600 dark:text-white">{visit.studentName}</p>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{visit.rollNumber}</p>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">Complaint: {visit.complaint}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(visit.severity)}`}>
                    {visit.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'alerts' && (
          <div className="space-y-3">
            {visits.filter(v => v.requiresAlert).length > 0 ? (
              visits.filter(v => v.requiresAlert).map(visit => (
                <div key={visit.id} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                  <p className="font-medium text-red-700 dark:text-red-400">{visit.studentName}</p>
                  <p className="text-sm text-red-600 dark:text-red-300">{visit.complaint} - {visit.severity}</p>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-apple-gray-400">No pending alerts</p>
            )}
          </div>
        )}

        {view === 'followups' && (
          <div className="space-y-3">
            {visits.filter(v => v.severity === 'serious' || v.severity === 'moderate').map(visit => (
              <div key={visit.id} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                <p className="font-medium text-apple-gray-600 dark:text-white">{visit.studentName}</p>
                <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{visit.complaint}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">Follow-up needed for {visit.severity} case</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="apple-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-apple-gray-600 dark:text-white">Log Visit</h2>
              <button onClick={() => setShowForm(false)} className="text-apple-gray-400 hover:text-apple-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
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
              <input
                type="text"
                placeholder="Complaint/Symptoms"
                value={form.complaint}
                onChange={(e) => setForm({ ...form, complaint: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <select
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value as any })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="serious">Serious</option>
              </select>
              <div className="flex space-x-3">
                <button
                  onClick={handleLogVisit}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Log
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
