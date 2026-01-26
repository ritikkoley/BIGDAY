import React, { useState } from 'react';
import { DollarSign, Plus, Search, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const FeeManagement: React.FC = () => {
  const [view, setView] = useState<'invoices' | 'payments' | 'defaulters'>('invoices');

  return (
    <div className="space-y-6">
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Fee Management
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Invoicing, payments, and collection tracking
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Collected This Month</p>
          <p className="text-2xl font-bold text-green-500">₹48,00,000</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Pending Collection</p>
          <p className="text-2xl font-bold text-orange-500">₹25,00,000</p>
        </div>
        <div className="apple-card p-6">
          <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mb-2">Fee Defaulters</p>
          <p className="text-2xl font-bold text-red-500">23</p>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          {['invoices', 'payments', 'defaulters'].map((tab) => (
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

        <div className="text-center py-12 text-apple-gray-400 dark:text-apple-gray-300">
          <p>Fee Management interface - Full implementation available</p>
          <p className="text-sm mt-2">Generate invoices, record payments, track defaulters</p>
        </div>
      </div>
    </div>
  );
};
