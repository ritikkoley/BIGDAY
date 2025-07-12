import React from 'react';
import { TeacherPerformanceMetrics, PerformanceAnalytics } from '../../../types/performance';
import { AlertTriangle, CheckCircle2, Clock, Shield } from 'lucide-react';

interface DisciplinaryMarkersProps {
  metrics: TeacherPerformanceMetrics;
  analytics: PerformanceAnalytics;
}

export const DisciplinaryMarkers: React.FC<DisciplinaryMarkersProps> = ({
  metrics,
  analytics
}) => {
  return (
    <div className="space-y-6">
      {/* Complaints Overview */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-apple-blue-500" />
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Complaints Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-apple-gray-600 dark:text-white">
              {metrics.disciplinary.complaints.total}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Total Complaints
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">
              {metrics.disciplinary.complaints.resolved}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Resolved
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">
              {metrics.disciplinary.complaints.pending}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-5 h-5 text-apple-blue-500" />
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Compliance Metrics
          </h3>
        </div>
        <div className="space-y-4">
          {Object.entries(metrics.disciplinary.compliance).map(([key, value], index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-apple-gray-600 dark:text-white capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className={`text-lg font-medium ${
                  value >= 90 ? 'text-green-500' :
                  value >= 80 ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {value}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    value >= 90 ? 'bg-green-500' :
                    value >= 80 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident History */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="w-5 h-5 text-apple-blue-500" />
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Incident History
          </h3>
        </div>
        <div className="space-y-4">
          {metrics.disciplinary.incidents.map((incident, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                      incident.severity === 'high' ? 'bg-red-500' :
                      incident.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <h4 className="font-medium text-apple-gray-600 dark:text-white">
                      {incident.type}
                    </h4>
                  </div>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                    {new Date(incident.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mt-2">
                    {incident.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {incident.status === 'resolved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className={`text-sm font-medium capitalize ${
                    incident.status === 'resolved'
                      ? 'text-green-500'
                      : 'text-yellow-500'
                  }`}>
                    {incident.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};