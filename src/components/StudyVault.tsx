import React, { useState } from 'react';
import { StudyVaultData, CourseDocument } from '../types';
import { 
  Download, 
  Upload, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown,
  ChevronUp,
  File,
  Calendar
} from 'lucide-react';

interface StudyVaultProps {
  studentName: string;
  data: StudyVaultData;
  onUploadAssignment: (subject: string, file: File) => Promise<void>;
  onDownloadMaterial: (document: CourseDocument) => Promise<void>;
}

export const StudyVault: React.FC<StudyVaultProps> = ({
  studentName,
  data,
  onUploadAssignment,
  onDownloadMaterial
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(data.subjects[0]?.name || '');
  const [activeTab, setActiveTab] = useState<'uploads' | 'downloads'>('downloads');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleFileUpload = async (subject: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onUploadAssignment(subject, file);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-500 dark:text-yellow-400',
      submitted: 'text-green-500 dark:text-green-400',
      graded: 'text-blue-500 dark:text-blue-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-500 dark:text-gray-400';
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Expired';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  const currentSubject = data.subjects.find(s => s.name === selectedSubject);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4">
            <FileText className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Vault</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Access and submit course materials</p>
            </div>
          </div>
        </div>

        {/* Subject Tabs */}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg mb-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {data.subjects.map((subject) => (
              <button
                key={subject.name}
                onClick={() => setSelectedSubject(subject.name)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  selectedSubject === subject.name
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('downloads')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'downloads'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Course Materials</span>
            </button>
            <button
              onClick={() => setActiveTab('uploads')}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium ${
                activeTab === 'uploads'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Digital Assignments</span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'downloads' && currentSubject && (
              <div className="space-y-4">
                {currentSubject.materials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-white dark:bg-gray-700/50 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <File className="w-5 h-5 text-indigo-500" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {material.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Uploaded on {new Date(material.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDownloadMaterial(material)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'uploads' && currentSubject && (
              <div className="space-y-4">
                {currentSubject.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="bg-white dark:bg-gray-700/50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedItem(expandedItem === assignment.id ? null : assignment.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            {assignment.marks && (
                              <span className="absolute -top-2 -right-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-1.5 rounded-full">
                                {assignment.marks}m
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {assignment.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className={`text-sm ${
                                new Date(assignment.deadline!) < new Date()
                                  ? 'text-red-500'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {formatDeadline(assignment.deadline!)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`flex items-center space-x-1 text-sm font-medium ${getStatusColor(assignment.status!)}`}>
                            {assignment.status === 'pending' && <AlertTriangle className="w-4 h-4" />}
                            {assignment.status === 'submitted' && <CheckCircle2 className="w-4 h-4" />}
                            {assignment.status === 'graded' && <Calendar className="w-4 h-4" />}
                            <span>{assignment.status!.charAt(0).toUpperCase() + assignment.status!.slice(1)}</span>
                          </span>
                          {expandedItem === assignment.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedItem === assignment.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-600">
                        {assignment.status === 'pending' ? (
                          <div>
                            <input
                              type="file"
                              id={`file-${assignment.id}`}
                              className="hidden"
                              onChange={(e) => handleFileUpload(selectedSubject, e)}
                            />
                            <label
                              htmlFor={`file-${assignment.id}`}
                              className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Upload Assignment</span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <File className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {assignment.fileName}
                              </span>
                            </div>
                            {assignment.status === 'graded' && (
                              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                Grade: {assignment.grade}/{assignment.marks}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};