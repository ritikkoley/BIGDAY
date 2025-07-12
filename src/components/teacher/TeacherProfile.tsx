import React from 'react';
import { TeacherProfile as TeacherProfileType } from '../../types/teacher';
import { 
  User,
  Mail,
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  Clock
} from 'lucide-react';

interface TeacherProfileProps {
  profile: TeacherProfileType;
}

export const TeacherProfile: React.FC<TeacherProfileProps> = ({
  profile
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <User className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Profile
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              View and manage your information
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="apple-card p-6">
        <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
              <User className="w-4 h-4" />
              <span>Name</span>
            </div>
            <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
              {profile.name}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </div>
            <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
              {profile.email}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
              <Building2 className="w-4 h-4" />
              <span>Department</span>
            </div>
            <p className="text-lg font-medium text-apple-gray-600 dark:text-white">
              {profile.department}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
              <GraduationCap className="w-4 h-4" />
              <span>Role</span>
            </div>
            <p className="text-lg font-medium text-apple-gray-600 dark:text-white capitalize">
              {profile.role.replace('-', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Teaching Schedule */}
      <div className="apple-card p-6">
        <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          Teaching Schedule
        </h2>
        <div className="space-y-4">
          {profile.subjects.map((subject) => (
            <div 
              key={subject.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-apple-blue-500" />
                  <div>
                    <h3 className="font-medium text-apple-gray-600 dark:text-white">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      {subject.code} • Semester {subject.semester}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-apple-gray-400" />
                    <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      {subject.students} students
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subject.type === 'theory'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {subject.type.charAt(0).toUpperCase() + subject.type.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subject.schedule.map((schedule, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 bg-apple-gray-50 dark:bg-apple-gray-700/50 rounded-lg p-3"
                  >
                    <Clock className="w-4 h-4 text-apple-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-apple-gray-600 dark:text-white capitalize">
                        {schedule.day}
                      </p>
                      <p className="text-xs text-apple-gray-400 dark:text-apple-gray-300">
                        {schedule.startTime} - {schedule.endTime} • Room {schedule.room}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};