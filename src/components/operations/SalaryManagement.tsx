import React, { useState } from 'react';
import { Wallet, Plus, Download, Users } from 'lucide-react';

export const SalaryManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <Wallet className="w-6 h-6 text-purple-500" />
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
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Total Employees</p>
          <p className="text-2xl font-bold text-apple-gray-600 dark:text-white">156</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Monthly Salary</p>
          <p className="text-2xl font-bold text-purple-500">₹58,50,000</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Processed</p>
          <p className="text-2xl font-bold text-green-500">142</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Pending</p>
          <p className="text-2xl font-bold text-orange-500">14</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="text-center py-12 text-apple-gray-400 dark:text-apple-gray-300">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Payroll Management System</p>
          <p className="text-sm mt-2">Calculate salaries, generate payslips, manage deductions & allowances</p>
        </div>
      </div>
    </div>
  );
};
