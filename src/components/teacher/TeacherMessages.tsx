import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useDataStore } from '../../stores/dataStore';
import { TeacherProfile, MessageTemplate, StudentRecord } from '../../types/teacher';
import { MessageSquare, Clock, AlertTriangle, Send, Loader2, Check } from 'lucide-react';
import { useEffect } from 'react'; 

interface TeacherMessagesProps {
  profile: TeacherProfile;
  messageTemplates: MessageTemplate[];
  studentRecords: StudentRecord[];
}

export const TeacherMessages: React.FC<TeacherMessagesProps> = ({
  profile,
  messageTemplates,
  studentRecords
}) => {
  const { user } = useAuthStore();
  const { subscribeToMessages, unsubscribeAll } = useDataStore();
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Record<string, boolean>>({});
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTemplate) {
      setMessageSubject(selectedTemplate.title);
      setMessageContent(selectedTemplate.content);
      setPriority(selectedTemplate.priority); 
      
      if (user) {
        // Subscribe to real-time message updates
        subscribeToMessages(user.id);
      }
      
      // Cleanup subscription on unmount
      return () => {
        unsubscribeAll();
      };
    }
  }, [selectedTemplate, user, subscribeToMessages, unsubscribeAll]);

  const handleSelectAllStudents = () => {
    const newSelectedStudents: Record<string, boolean> = {};
    studentRecords.forEach(student => {
      newSelectedStudents[student.id] = true;
    });
    setSelectedStudents(newSelectedStudents);
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Validate inputs
      if (!messageSubject.trim()) {
        throw new Error('Subject is required');
      }
      if (!messageContent.trim()) {
        throw new Error('Message content is required');
      }
      const selectedStudentIds = Object.entries(selectedStudents)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);
      
      if (selectedStudentIds.length === 0) {
        throw new Error('Please select at least one recipient');
      }

      // Mock sending messages
      console.log('Sending messages to:', selectedStudentIds);
      console.log('Subject:', messageSubject);
      console.log('Content:', messageContent);
      console.log('Priority:', priority);

      setSuccess(`Message sent to ${selectedStudentIds.length} student(s)`);
      
      // Reset form
      setMessageSubject('');
      setMessageContent('');
      setSelectedStudents({});
      setSelectedTemplate(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    const colors = {
      low: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[priority];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="apple-card p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg">
            <MessageSquare className="w-6 h-6 text-apple-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-medium text-apple-gray-600 dark:text-white">
              Message Center
            </h1>
            <p className="text-apple-gray-400 dark:text-apple-gray-300 mt-1">
              Communicate with your students
            </p>
          </div>
        </div>
      </div>

      {/* Message Templates and Composer */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10 lg:col-span-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-apple-blue-500"></div>
          </div>
        )}
        
        {/* Templates List */}
        <div className="lg:col-span-1 space-y-4">
          {messageTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`w-full text-left apple-card p-4 transition-all ${
                selectedTemplate?.id === template.id
                  ? 'ring-2 ring-apple-blue-500'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-apple-gray-600 dark:text-white">
                  {template.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(template.priority)}`}>
                  {template.priority}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {template.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-apple-gray-100 dark:bg-apple-gray-700 rounded-full text-xs text-apple-gray-600 dark:text-apple-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Message Composer */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="apple-card p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-apple-gray-600 dark:text-white">
                  Compose Message
                </h2>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-apple-gray-400" />
                  <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                    Draft
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    className="w-full px-4 py-2 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg text-apple-gray-600 dark:text-white placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-4 py-2 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg text-apple-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Message Content
                  </label>
                  <textarea
                    rows={6}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="w-full px-4 py-2 bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg text-apple-gray-600 dark:text-white placeholder-apple-gray-400 focus:outline-none focus:ring-2 focus:ring-apple-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
                    Recipients
                  </label>
                  <div className="bg-apple-gray-50 dark:bg-apple-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                        Selected Students: {studentRecords.length}
                      </span>
                      <button 
                        onClick={handleSelectAllStudents}
                        className="text-apple-blue-500 text-sm font-medium"
                      >
                        Select All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {studentRecords.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-apple-gray-600 dark:text-white">
                              {student.name}
                            </p>
                            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
                              {student.rollNumber}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={!!selectedStudents[student.id]}
                            onChange={() => handleToggleStudent(student.id)}
                            className="w-4 h-4 text-apple-blue-500 border-apple-gray-300 rounded focus:ring-apple-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  {error && (
                    <div className="flex items-center space-x-2 text-red-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center space-x-2 text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">{success}</span>
                    </div>
                  )}
                  <button 
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-full hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="apple-card p-6 text-center">
              <MessageSquare className="w-12 h-12 text-apple-gray-300 dark:text-apple-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-2">
                No Template Selected
              </h3>
              <p className="text-apple-gray-400 dark:text-apple-gray-300">
                Select a message template from the list to start composing
              </p>
            </div>
          )}
        </div>
      </div>

      {error && !selectedTemplate && (
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