import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
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
  const { user } = useAuthStore();
  const { fetchResources } = useDataStore();
  const [selectedSubject, setSelectedSubject] = useState(profile.subjects[0]?.id);
  const [activeTab, setActiveTab] = useState<'all' | 'documents' | 'assignments'>('all');
  const [realResources, setRealResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    name: '',
    type: 'document' as Resource['type'],
    visibility: 'visible' as 'visible' | 'hidden'
  });

  useEffect(() => {
    if (selectedSubject) {
      if (user) fetchResources(selectedSubject);
    }
  }, [selectedSubject]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadData(prev => ({ ...prev, name: file.name }));
    }
  };

  const handleUpload = async () => {
    try {
      if (!uploadFile) {
        setError('Please select a file to upload');
        return;
      }

      setIsLoading(true);
      // Mock uploading a file
      console.log('Uploading file:', uploadFile.name);
      
      // Mock creating a resource
      const mockResource: Resource = {
        id: `resource-${Date.now()}`,
        title: uploadData.name,
        type: uploadData.type,
        subject: profile.subjects.find(s => s.id === selectedSubject)?.name || '',
        uploadDate: new Date().toISOString(),
        visibility: uploadData.visibility,
        downloads: 0
      };
      
      // Add to real resources
      setRealResources(prev => [mockResource, ...prev]);

      // Reset form and refresh resources
      setUploadFile(null);
      setUploadData({
        name: '',
        type: 'document',
        visibility: 'visible'
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload resource');
      console.error('Error uploading resource:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getResourceTypeColor = (type: Resource['type']) => {
    const colors = {
      document: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      video: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      link: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      assignment: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    };
    return colors[type];
  };

  // Use real resources if available, otherwise fall back to sample data
  const displayResources = realResources.length > 0 ? realResources : resources;

  const filteredResources = displayResources.filter(resource => {
    if (activeTab === 'all') return true;
    if (activeTab === 'documents') return resource.type === 'document' || resource.type === 'video';
    return resource.type === 'assignment';
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apple-blue-500"></div>
      </div>
    );
  }

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
      <div className="apple-card relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue-500"></div>
          </div>
        )}
        
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

        {/* Upload Form */}
        <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
            Upload New Resource
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Resource Name
              </label>
              <input
                type="text"
                value={uploadData.name}
                onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
                placeholder="Enter resource name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Resource Type
              </label>
              <select
                value={uploadData.type}
                onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value as Resource['type'] }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
              >
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Visibility
              </label>
              <select
                value={uploadData.visibility}
                onChange={(e) => setUploadData(prev => ({ ...prev, visibility: e.target.value as 'visible' | 'hidden' }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg"
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              File
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="resource-file"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="resource-file"
                className="px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg cursor-pointer hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors"
              >
                Choose File
              </label>
              <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                {uploadFile ? uploadFile.name : 'No file selected'}
              </span>
              <button
                onClick={handleUpload}
                disabled={!uploadFile || isLoading}
                className="ml-auto px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Resource
              </button>
            </div>
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

      {error && (
        <div className="apple-card p-6 mt-6">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  );
};