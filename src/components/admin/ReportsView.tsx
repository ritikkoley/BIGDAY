import React from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const reports = [
    {
      title: 'Annual Performance Review',
      type: 'Performance',
      date: '2024-03-15',
      size: '2.4 MB'
    },
    {
      title: 'Department Evaluation Summary',
      type: 'Evaluation',
      date: '2024-03-10',
      size: '1.8 MB'
    },
    {
      title: 'Teacher Effectiveness Analysis',
      type: 'Analysis',
      date: '2024-03-05',
      size: '3.1 MB'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <FileText className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Reports
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Generated Reports and Analytics
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-apple-gray-400" />
            <span className="text-apple-gray-600 dark:text-white">Filter by:</span>
          </div>
          <button className="px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-full text-apple-gray-600 dark:text-apple-gray-300">
            All Reports
          </button>
          <button className="px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-full text-apple-gray-600 dark:text-apple-gray-300">
            Performance
          </button>
          <button className="px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-full text-apple-gray-600 dark:text-apple-gray-300">
            Evaluation
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report, index) => (
          <div key={index} className="apple-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-apple-blue-500" />
                <div>
                  <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                    {report.title}
                  </h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      Type: {report.type}
                    </span>
                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      Size: {report.size}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(report.date).toLocaleDateString()}</span>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};