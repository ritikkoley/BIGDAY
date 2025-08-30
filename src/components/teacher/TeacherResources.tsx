import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { TeacherProfile, Resource } from '../../types/teacher';
import { 
  BookOpen, 
  Download, 
  Upload, 
  Clock, 
  Users, 
  Eye, 
  EyeOff, 
  FileText,
  Video,
  Link,
  File,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface TeacherResourcesProps {
  profile: TeacherProfile;
  resources: Resource[];
}

interface StudentSubmission {
  id: string;
  studentName: string;
  studentId: string;
  fileName: string;
  fileUrl: string;
  submittedAt: string;
  assessmentName: string;
  status: 'submitted' | 'graded';
  grade?: number;
}

export const TeacherResources: React.FC<TeacherResourcesProps> = ({
  profile,
  resources
}) => {
  const { user } = useAuthStore();
  const { fetchResources } = useDataStore();
  const [selectedSubject, setSelectedSubject] = useState(profile.subjects[0]?.id);
  const [activeTab, setActiveTab] = useState<'materials' | 'submissions'>('materials');
  const [realResources, setRealResources] = useState<Resource[]>([]);
  const [studentSubmissions, setStudentSubmissions] = useState<StudentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    name: '',
    description: '',
    type: 'material' as Resource['type'],
    visibility: 'visible' as 'visible' | 'hidden'
  });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedSubject) {
      fetchResourcesData();
      fetchStudentSubmissions();
    }
  }, [selectedSubject]);

  const fetchResourcesData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock resources data for the selected subject
      const mockResources: Resource[] = [
        {
          id: 'r-001',
          title: 'Neural Networks Lecture Notes',
          type: 'document',
          subject: profile.subjects.find(s => s.id === selectedSubject)?.name || 'Computer Science',
          uploadDate: '2024-03-15',
          visibility: 'visible',
          downloads: 98
        },
        {
          id: 'r-002',
          title: 'Programming Fundamentals Video',
          type: 'video',
          subject: profile.subjects.find(s => s.id === selectedSubject)?.name || 'Computer Science',
          uploadDate: '2024-03-12',
          visibility: 'visible',
          downloads: 156
        },
        {
          id: 'r-003',
          title: 'Data Structures Assignment Template',
          type: 'assignment',
          subject: profile.subjects.find(s => s.id === selectedSubject)?.name || 'Computer Science',
          uploadDate: '2024-03-18',
          deadline: '2024-03-25',
          visibility: 'visible',
          downloads: 112,
          submissions: 95
        },
        {
          id: 'r-004',
          title: 'Algorithm Complexity Reference',
          type: 'reference',
          subject: profile.subjects.find(s => s.id === selectedSubject)?.name || 'Computer Science',
          uploadDate: '2024-03-10',
          visibility: 'visible',
          downloads: 87
        }
      ];
      
      setRealResources(mockResources);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resources');
      console.error('Error fetching resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentSubmissions = async () => {
    try {
      // Mock student submissions data
      const mockSubmissions: StudentSubmission[] = [
        {
          id: 'sub-001',
          studentName: 'Ritik Koley',
          studentId: 'student-1',
          fileName: 'neural_networks_assignment.pdf',
          fileUrl: '/submissions/neural_networks_assignment.pdf',
          submittedAt: '2024-03-20T14:30:00',
          assessmentName: 'Neural Networks Implementation',
          status: 'submitted'
        },
        {
          id: 'sub-002',
          studentName: 'Alex Johnson',
          studentId: 'student-2',
          fileName: 'data_structures_project.zip',
          fileUrl: '/submissions/data_structures_project.zip',
          submittedAt: '2024-03-19T16:45:00',
          assessmentName: 'Binary Tree Implementation',
          status: 'graded',
          grade: 92
        },
        {
          id: 'sub-003',
          studentName: 'Sarah Williams',
          studentId: 'student-3',
          fileName: 'algorithm_analysis.docx',
          fileUrl: '/submissions/algorithm_analysis.docx',
          submittedAt: '2024-03-21T10:15:00',
          assessmentName: 'Algorithm Complexity Analysis',
          status: 'submitted'
        },
        {
          id: 'sub-004',
          studentName: 'David Chen',
          studentId: 'student-6',
          fileName: 'machine_learning_model.py',
          fileUrl: '/submissions/machine_learning_model.py',
          submittedAt: '2024-03-18T13:20:00',
          assessmentName: 'ML Model Implementation',
          status: 'graded',
          grade: 88
        }
      ];
      
      setStudentSubmissions(mockSubmissions);
    } catch (err) {
      console.error('Error fetching student submissions:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!uploadData.name) {
        setUploadData(prev => ({ ...prev, name: file.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  };

  const handleUpload = async () => {
    try {
      if (!uploadFile) {
        setError('Please select a file to upload');
        return;
      }

      if (!uploadData.name.trim()) {
        setError('Please enter a resource name');
        return;
      }

      setIsLoading(true);
      setError(null);
      
      // Mock uploading a file
      console.log('Uploading file:', uploadFile.name);
      
      // Create new resource
      const newResource: Resource = {
        id: `resource-${Date.now()}`,
        title: uploadData.name,
        type: uploadData.type,
        subject: profile.subjects.find(s => s.id === selectedSubject)?.name || '',
        uploadDate: new Date().toISOString(),
        visibility: uploadData.visibility,
        downloads: 0,
        ...(uploadData.type === 'assignment' && { submissions: 0 })
      };
      
      // Add to resources list
      setRealResources(prev => [newResource, ...prev]);

      // Reset form
      setUploadFile(null);
      setUploadData({
        name: '',
        description: '',
        type: 'material',
        visibility: 'visible'
      });
      setShowUploadForm(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload resource');
      console.error('Error uploading resource:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSubmission = async (submission: StudentSubmission) => {
    try {
      // In a real implementation, this would download the file
      console.log('Downloading submission:', submission.fileName);
      alert(`Downloading ${submission.fileName} from ${submission.studentName}`);
    } catch (err) {
      console.error('Error downloading submission:', err);
    }
  };

  const toggleResourceVisibility = async (resourceId: string) => {
    try {
      setRealResources(prev => 
        prev.map(resource => 
          resource.id === resourceId 
            ? { ...resource, visibility: resource.visibility === 'visible' ? 'hidden' : 'visible' }
            : resource
        )
      );
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const getResourceTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document':
      case 'material':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'link':
        return <Link className="w-5 h-5" />;
      case 'assignment':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getResourceTypeColor = (type: Resource['type']) => {
    const colors = {
      document: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      material: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      video: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      link: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      assignment: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      reference: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return colors[type] || colors.document;
  };

  const getStatusColor = (status: 'submitted' | 'graded') => {
    return status === 'graded'
      ? 'text-green-500 dark:text-green-400'
      : 'text-yellow-500 dark:text-yellow-400';
  };

  // Filter resources based on search term
  const filteredResources = realResources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter submissions based on search term
  const filteredSubmissions = studentSubmissions.filter(submission =>
    submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.assessmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
              <BookOpen className="w-6 h-6 text-apple-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
                Course Resources
              </h1>
              <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
                Manage learning materials and student submissions
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Resource</span>
          </button>
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

      {/* Upload Form */}
      {showUploadForm && (
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white">
              Upload New Resource
            </h3>
            <button
              onClick={() => setShowUploadForm(false)}
              className="text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                  Resource Name
                </label>
                <input
                  type="text"
                  value={uploadData.name}
                  onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
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
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                >
                  <option value="material">Study Material</option>
                  <option value="assignment">Assignment</option>
                  <option value="reference">Reference</option>
                  <option value="video">Video</option>
                  <option value="link">External Link</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                Description
              </label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500 resize-none"
                placeholder="Enter resource description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                File
              </label>
              <div className="border-2 border-dashed border-apple-gray-300 dark:border-apple-gray-600 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-apple-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  id="resource-file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="resource-file"
                  className="cursor-pointer text-apple-blue-500 hover:text-apple-blue-600"
                >
                  {uploadFile ? uploadFile.name : 'Click to upload file'}
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={uploadData.visibility === 'visible'}
                    onChange={(e) => setUploadData(prev => ({ 
                      ...prev, 
                      visibility: e.target.checked ? 'visible' : 'hidden' 
                    }))}
                    className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 rounded focus:ring-apple-blue-500"
                  />
                  <span className="text-sm text-apple-gray-600 dark:text-white">
                    Make visible to students
                  </span>
                </label>
              </div>
              
              <button
                onClick={handleUpload}
                disabled={!uploadFile || !uploadData.name.trim() || isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                <span>{isLoading ? 'Uploading...' : 'Upload Resource'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <div className="apple-card">
        <div className="border-b border-apple-gray-200/50 dark:border-apple-gray-500/20 px-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'materials'
                  ? 'border-apple-blue-500 text-apple-blue-500'
                  : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
              }`}
            >
              Course Materials ({filteredResources.length})
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'submissions'
                  ? 'border-apple-blue-500 text-apple-blue-500'
                  : 'border-transparent text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-300'
              }`}
            >
              Student Submissions ({filteredSubmissions.length})
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-apple-gray-200/50 dark:border-apple-gray-500/20">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-apple-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'materials' ? 'Search resources...' : 'Search submissions...'}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-600 dark:text-apple-gray-300 rounded-lg hover:bg-apple-gray-200 dark:hover:bg-apple-gray-600 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'materials' ? (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${getResourceTypeColor(resource.type)}`}>
                        {getResourceTypeIcon(resource.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-apple-gray-600 dark:text-white">
                          {resource.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span>Uploaded: {format(new Date(resource.uploadDate), 'MMM d, yyyy')}</span>
                          </div>
                          {resource.deadline && (
                            <div className="flex items-center space-x-1 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                              <Clock className="w-4 h-4" />
                              <span>Due: {format(new Date(resource.deadline), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-6 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{resource.downloads}</span>
                        </div>
                        {resource.submissions !== undefined && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{resource.submissions} submissions</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => toggleResourceVisibility(resource.id)}
                        className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
                      >
                        {resource.visibility === 'visible' ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                    No Resources Found
                  </h3>
                  <p className="text-apple-gray-400 dark:text-apple-gray-300">
                    {searchTerm ? 'Try adjusting your search terms' : 'Upload your first resource to get started'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-lg">
                        <File className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-apple-gray-600 dark:text-white">
                          {submission.studentName}
                        </h3>
                        <div className="space-y-1 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                            <FileText className="w-4 h-4" />
                            <span>{submission.fileName}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                            <BookOpen className="w-4 h-4" />
                            <span>{submission.assessmentName}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-apple-gray-400 dark:text-apple-gray-300">
                            <Clock className="w-4 h-4" />
                            <span>Submitted: {format(new Date(submission.submittedAt), 'MMM d, h:mm a')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`flex items-center space-x-1 text-sm font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status === 'graded' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                          <span className="capitalize">{submission.status}</span>
                        </div>
                        {submission.grade && (
                          <div className="text-lg font-medium text-apple-blue-500 mt-1">
                            {submission.grade}%
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleDownloadSubmission(submission)}
                        className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-50 text-apple-blue-700 dark:bg-apple-blue-900/30 dark:text-apple-blue-300 rounded-lg hover:bg-apple-blue-100 dark:hover:bg-apple-blue-900/50 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredSubmissions.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                    No Submissions Found
                  </h3>
                  <p className="text-apple-gray-400 dark:text-apple-gray-300">
                    {searchTerm ? 'Try adjusting your search terms' : 'Student submissions will appear here'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="apple-card p-6">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  );
};