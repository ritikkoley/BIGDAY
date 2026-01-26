import React, { useState } from 'react';
import { Wallet, Plus, X } from 'lucide-react';

interface Payroll {
  id: string;
  employeeName: string;
  designation: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  status: 'processed' | 'pending' | 'rejected';
  processedDate: string;
}

export const SalaryManagement: React.FC = () => {
  const [view, setView] = useState<'payroll' | 'pending' | 'history'>('payroll');
  const [showForm, setShowForm] = useState(false);

  const [payrolls, setPayrolls] = useState<Payroll[]>([
    { id: '1', employeeName: 'Rajesh Kumar', designation: 'Principal', baseSalary: 120000, allowances: 15000, deductions: 5000, status: 'processed', processedDate: '2024-01-20' },
    { id: '2', employeeName: 'Priya Sharma', designation: 'Mathematics Teacher', baseSalary: 50000, allowances: 8000, deductions: 2000, status: 'processed', processedDate: '2024-01-20' }
  ]);

  const [form, setForm] = useState({
    employeeName: '',
    designation: '',
    baseSalary: '',
    allowances: '',
    deductions: ''
  });

  const handleProcessPayroll = () => {
    if (form.employeeName && form.designation && form.baseSalary) {
      const newPayroll: Payroll = {
        id: String(payrolls.length + 1),
        employeeName: form.employeeName,
        designation: form.designation,
        baseSalary: parseFloat(form.baseSalary),
        allowances: parseFloat(form.allowances) || 0,
        deductions: parseFloat(form.deductions) || 0,
        status: 'processed',
        processedDate: new Date().toISOString().split('T')[0]
      };
      setPayrolls([...payrolls, newPayroll]);
      setForm({ employeeName: '', designation: '', baseSalary: '', allowances: '', deductions: '' });
      setShowForm(false);
    }
  };

  const processedCount = payrolls.filter(p => p.status === 'processed').length;
  const pendingCount = payrolls.filter(p => p.status === 'pending').length;
  const totalMonthly = payrolls.reduce((sum, p) => sum + (p.baseSalary + p.allowances - p.deductions), 0);

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <Wallet className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Payroll Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Employee salaries, allowances, deductions & payslips
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Total Employees</p>
          <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">{payrolls.length}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Monthly Salary</p>
          <p className="text-2xl font-bold text-green-500">₹{(totalMonthly / 100000).toFixed(1)}L</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Processed</p>
          <p className="text-2xl font-bold text-green-500">{processedCount}</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Pending</p>
          <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          {['payroll', 'pending', 'history'].map((tab) => (
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

        {view === 'payroll' && (
          <div className="space-y-3">
            {payrolls.map(payroll => (
              <div key={payroll.id} className="p-4 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-apple-gray-600 dark:text-white">{payroll.employeeName}</p>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{payroll.designation}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600 dark:text-green-400">₹{payroll.baseSalary + payroll.allowances - payroll.deductions}</p>
                    <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">{payroll.processedDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'pending' && (
          <div className="space-y-3">
            {payrolls.filter(p => p.status === 'pending').length > 0 ? (
              payrolls.filter(p => p.status === 'pending').map(payroll => (
                <div key={payroll.id} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                  <p className="font-medium text-apple-gray-600 dark:text-white">{payroll.employeeName}</p>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{payroll.designation}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">PENDING PROCESSING</p>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-apple-gray-400">No pending payroll</p>
            )}
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-3">
            {payrolls.filter(p => p.status === 'processed').map(payroll => (
              <div key={payroll.id} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-apple-gray-600 dark:text-white">{payroll.employeeName}</p>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">{payroll.designation}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600 dark:text-green-400">₹{payroll.baseSalary + payroll.allowances - payroll.deductions}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{payroll.processedDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="apple-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-apple-gray-600 dark:text-white">Process Payroll</h2>
              <button onClick={() => setShowForm(false)} className="text-apple-gray-400 hover:text-apple-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Employee Name"
                value={form.employeeName}
                onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="text"
                placeholder="Designation"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="Base Salary"
                value={form.baseSalary}
                onChange={(e) => setForm({ ...form, baseSalary: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="Allowances"
                value={form.allowances}
                onChange={(e) => setForm({ ...form, allowances: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="Deductions"
                value={form.deductions}
                onChange={(e) => setForm({ ...form, deductions: e.target.value })}
                className="w-full px-4 py-2 border border-apple-gray-200 dark:border-apple-gray-700 rounded-lg dark:bg-apple-gray-800 dark:text-white"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleProcessPayroll}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Process
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
