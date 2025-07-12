import React, { useState } from 'react';
import { TeacherProfile, Resource } from '../../types/teacher';
import { BookOpen, Download, Upload, Clock, Users, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

interface TeacherResourcesProps {
  profile: TeacherProfile;
  resources: Resource[];
}

export const TeacherResources: React.FC<TeacherResourcesProps> = ({
  profile,
  resources
}) => {
  const [selectedSubject, setSelectedSubject] = useState(profile.subjects[0]?.id);
  const [activeTab, setActiveTab] = useState<'all' | 'documents' | 'assignments'>('all');

  const getResourceTypeColor = (type: Resource['type']) => {
    const colors = {
      document: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      video: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      link: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      assignment: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    };
    return colors[type];
  };

  const filteredResources = resources.filter(resource => {
    if (activeTab === 'all') return true;
    if (activeTab === 'documents') return resource.type === 'document' || resource.type === 'video';
    return resource.type === 'assignment';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <BookOpen className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Course Resources
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Manage and share learning materials
            </p>
          </div>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="apple-card p-6">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {profile.subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedSubject === subject.id
                  ? 'bg-apple-blue-500 text-white'
                  : 'bg-apple-gray-100 dark:bg-apple-gray-600/50 text-apple-gray-600 dark:text-apple-gray-300'
              }`}
            >
              {subject.name}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Tabs */}
      <div className="apple-card">
        <div className="border-b border-apple-gray-200/50 dark:border-apple-gray-500/20 px-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-apple-blue-500 text-apple-blue-500'
                  : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'documents'
                  ? 'border-apple-blue-500 text-apple-blue-500'
                  : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'assignments'
                  ? 'border-apple-blue-500 text-apple-blue-500'
                  : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
              }`}
            >
              Assignments
            </button>
          </div>
        </div>

        {/* Resource List */}
        <div className="p-6 space-y-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${getResourceTypeColor(resource.type)}`}>
                  {resource.type === 'document' && <BookOpen className="w-5 h-5" />}
                  {resource.type === 'video' && <Download className="w-5 h-5" />}
                  {resource.type === 'link' && <Upload className="w-5 h-5" />}
                  {resource.type === 'assignment' && <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-apple-gray-600 dark:text-white">
                    {resource.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                      Uploaded: {format(new Date(resource.uploadDate), 'MMM d, yyyy')}
                    </p>
                    {resource.deadline && (
                      <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        Due: {format(new Date(resource.deadline), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">{resource.downloads}</span>
                </div>
                {resource.submissions && (
                  <div className="flex items-center space-x-2 text-apple-gray-400 dark:text-apple-gray-300">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{resource.submissions}</span>
                  </div>
                )}
                <button className="text-apple-gray-400 dark:text-apple-gray-300 hover:text-apple-gray-600 dark:hover:text-apple-gray-100">
                  {resource.visibility === 'visible' ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};