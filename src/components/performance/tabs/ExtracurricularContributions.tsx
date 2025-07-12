import React from 'react';
import { TeacherPerformanceMetrics, PerformanceAnalytics } from '../../../types/performance';
import { Award, Users, Calendar, Star } from 'lucide-react';

interface ExtracurricularContributionsProps {
  metrics: TeacherPerformanceMetrics;
  analytics: PerformanceAnalytics;
}

export const ExtracurricularContributions: React.FC<ExtracurricularContributionsProps> = ({
  metrics,
  analytics
}) => {
  return (
    <div className="space-y-6">
      {/* Initiatives Overview */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-5 h-5 text-apple-blue-500" />
          <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Initiatives & Programs
          </h2>
        </div>
        <div className="grid gap-6">
          {metrics.extracurricular.initiatives.map((initiative, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-apple-gray-600 dark:text-white">
                    {initiative.name}
                  </h3>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                    Role: {initiative.role}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      Impact Score
                    </div>
                    <div className="text-lg font-medium text-apple-blue-500">
                      {initiative.impact}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      Students
                    </div>
                    <div className="text-lg font-medium text-green-500">
                      {initiative.students}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-5 h-5 text-apple-blue-500" />
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Event Participation
          </h3>
        </div>
        <div className="space-y-4">
          {metrics.extracurricular.events.map((event, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-apple-gray-600 dark:text-white">
                    {event.name}
                  </h4>
                  <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                    {event.contribution}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    Impact
                  </div>
                  <div className="text-lg font-medium text-apple-blue-500">
                    {event.impact}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentorship Overview */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-5 h-5 text-apple-blue-500" />
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
            Mentorship Impact
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-apple-blue-500">
              {metrics.extracurricular.mentorship.programs}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Programs Led
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">
              {metrics.extracurricular.mentorship.studentsReached}
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Students Reached
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500">
              {(metrics.extracurricular.mentorship.successRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Success Rate
            </div>
          </div>
        </div>
      </div>

      {/* Overall Contribution Score */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Overall Contribution Score
            </h3>
          </div>
          <div className="text-3xl font-bold text-yellow-500">
            {metrics.extracurricular.contributionScore}
          </div>
        </div>
      </div>
    </div>
  );
};